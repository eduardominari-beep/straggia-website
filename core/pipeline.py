from __future__ import annotations

from datetime import datetime, timezone
from typing import Callable

from connectors import diarios_abc, geosampa
from core.report import generate_reports
from core.scoring import score_lead
from core.storage import init_db, save_leads

CONNECTORS: list[tuple[str, Callable[[list[str] | None], list[dict]]]] = [
    ("geosampa", geosampa.collect_leads),
    ("diarios_abc", diarios_abc.collect_leads),
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

    sources_ok: list[str] = []
    sources_fail: list[str] = []
    raw_leads: list[dict] = []
    errors: dict[str, str] = {}

    for source_name, connector in CONNECTORS:
        try:
            leads = connector(resolved_cities)
            raw_leads.extend(leads)
            sources_ok.append(source_name)
        except Exception as exc:  # noqa: BLE001 - pipeline resilience by source
            sources_fail.append(source_name)
            errors[source_name] = str(exc)

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
        "observations": "Sem fontes operacionais." if not sources_ok else "Execução semanal concluída com filtro preditivo comercial.",
    }

    output_dir = generate_reports(resolved_run_id, ranked, diagnostics)

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
    }
