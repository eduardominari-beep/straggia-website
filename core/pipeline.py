from __future__ import annotations

import json
import traceback
from datetime import datetime, timezone
from pathlib import Path
from typing import Callable

from connectors import diarios_abc, geosampa, web_news
from core.errors import SourceFetchError
from core.report import generate_reports
from core.scoring import score_lead
from core.storage import init_db, save_leads

CONNECTORS: list[tuple[str, Callable[[list[str] | None], list[dict]]]] = [
    ("geosampa", geosampa.collect_leads),
    ("diarios_abc", diarios_abc.collect_leads),
    ("web_news", web_news.collect_leads),
]


def _normalize_cities(cities: list[str] | None) -> list[str] | None:
    if not cities:
        return None
    if len(cities) == 1 and cities[0].lower() == "all":
        return None
    return cities


def _lead_key(lead: dict) -> str:
    return "|".join(
        str(lead.get(field, "")).strip().lower()
        for field in ("company", "city", "title", "source")
    )


def _dedupe_leads(leads: list[dict]) -> list[dict]:
    seen: set[str] = set()
    unique: list[dict] = []
    for lead in leads:
        key = _lead_key(lead)
        if key in seen:
            continue
        seen.add(key)
        unique.append(lead)
    return unique


def _has_contact_path(lead: dict) -> bool:
    return bool(lead.get("contact_phone") or lead.get("contact_email") or lead.get("entry_path"))


def _write_debug_file(debug_dir: Path, source_name: str, payload: dict) -> None:
    debug_dir.mkdir(parents=True, exist_ok=True)
    (debug_dir / f"{source_name}.json").write_text(
        json.dumps(payload, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )


def run_pipeline(
    run_id: str | None = None,
    cities: list[str] | None = None,
    min_score: int = 35,
    max_leads: int = 10,
    require_contact_path: bool = True,
) -> dict:
    resolved_run_id = run_id or datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    resolved_cities = _normalize_cities(cities)

    init_db()

    run_dir = Path("data") / "runs" / resolved_run_id
    debug_dir = run_dir / "debug"
    debug_dir.mkdir(parents=True, exist_ok=True)

    sources_ok: list[str] = []
    sources_fail: list[str] = []
    raw_leads: list[dict] = []
    errors: dict[str, dict] = {}

    for source_name, connector in CONNECTORS:
        try:
            leads = connector(resolved_cities)
            raw_leads.extend(leads)
            sources_ok.append(source_name)
            _write_debug_file(
                debug_dir,
                source_name,
                {
                    "source": source_name,
                    "status": "ok",
                    "collected": len(leads),
                },
            )
        except Exception as exc:  # noqa: BLE001 - pipeline resilience by source
            sources_fail.append(source_name)
            tb = traceback.format_exc()
            error_payload: dict = {
                "source": source_name,
                "status": "fail",
                "exception_class": exc.__class__.__name__,
                "exception": str(exc),
                "traceback": tb,
                "url": None,
                "status_code": None,
                "response_excerpt": None,
                "metadata": {},
            }

            if isinstance(exc, SourceFetchError):
                error_payload.update(
                    {
                        "url": exc.url,
                        "status_code": exc.status_code,
                        "response_excerpt": exc.response_excerpt,
                        "metadata": exc.metadata or {},
                    }
                )

            errors[source_name] = error_payload
            _write_debug_file(debug_dir, source_name, error_payload)

    unique_raw = _dedupe_leads(raw_leads)
    scored = [score_lead(lead) for lead in unique_raw]

    filtered = [
        lead
        for lead in scored
        if lead.get("commercial_fit") != "reject"
        and int(lead.get("score", 0)) >= min_score
        and lead.get("chance_supplier_not_chosen") == "SIM"
        and (not require_contact_path or _has_contact_path(lead))
    ]

    ranked = sorted(filtered, key=lambda x: int(x.get("score", 0)), reverse=True)[:max_leads]

    total_saved = save_leads(resolved_run_id, ranked)

    if sources_ok and total_saved > 0:
        status = "SUCCESS"
    elif sources_ok:
        status = "WARNING"
    else:
        status = "FAIL"

    diagnostics = {
        "run_id": resolved_run_id,
        "status": status,
        "min_score": min_score,
        "max_leads": max_leads,
        "require_contact_path": require_contact_path,
        "total_raw": len(raw_leads),
        "total_unique_raw": len(unique_raw),
        "total_scored": len(scored),
        "total_saved": total_saved,
        "sources_ok": sources_ok,
        "sources_fail": sources_fail,
        "errors": errors,
        "debug_dir": str(debug_dir),
        "observations": "Sem fontes operacionais." if not sources_ok else "Execução semanal concluída com filtro preditivo comercial.",
    }

    output_dir = generate_reports(resolved_run_id, ranked, diagnostics)

    _write_debug_file(
        debug_dir,
        "pipeline-summary",
        {
            "run_id": resolved_run_id,
            "status": status,
            "sources_ok": sources_ok,
            "sources_fail": sources_fail,
            "total_raw": len(raw_leads),
            "total_saved": total_saved,
        },
    )

    return {
        "run_id": resolved_run_id,
        "status": status,
        "total_raw": len(raw_leads),
        "total_unique_raw": len(unique_raw),
        "total_scored": len(scored),
        "total_saved": total_saved,
        "sources_ok": sources_ok,
        "sources_fail": sources_fail,
        "output_dir": str(output_dir),
        "debug_dir": str(debug_dir),
    }
