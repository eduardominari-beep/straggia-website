from __future__ import annotations

import csv
import json
from pathlib import Path
from typing import Any

REPORT_COLUMNS = [
    "score",
    "commercial_fit",
    "estimated_ticket_band",
    "chance_supplier_not_chosen",
    "supplier_open_probability",
    "stage",
    "window",
    "city",
    "source",
    "signal_type",
    "company",
    "contact_phone",
    "contact_email",
    "entry_path",
    "address",
    "area_m2",
    "use_type",
    "rationale",
    "recommended_approach",
]


def _safe_value(lead: dict[str, Any], key: str) -> Any:
    value = lead.get(key)
    return "" if value is None else value


def generate_reports(run_id: str, leads: list[dict], diagnostics: dict) -> Path:
    out_dir = Path("data") / "runs" / run_id
    out_dir.mkdir(parents=True, exist_ok=True)

    csv_path = out_dir / "ranking-semanal.csv"
    json_path = out_dir / "ranking-semanal.json"
    md_path = out_dir / "ranking-semanal.md"
    diag_path = out_dir / "diagnostics.json"

    with csv_path.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=REPORT_COLUMNS)
        writer.writeheader()
        for lead in leads:
            writer.writerow({k: _safe_value(lead, k) for k in REPORT_COLUMNS})

    with json_path.open("w", encoding="utf-8") as f:
        json.dump(leads, f, ensure_ascii=False, indent=2)

    with diag_path.open("w", encoding="utf-8") as f:
        json.dump(diagnostics, f, ensure_ascii=False, indent=2)

    top_10 = leads[:10]
    sources_ok = diagnostics.get("sources_ok", [])
    sources_fail = diagnostics.get("sources_fail", [])
    observations = diagnostics.get("observations") or "Pipeline MVP executado com resiliência por fonte."

    md_lines = [
        f"# Ranking Semanal — Run {run_id}",
        "",
        "## Status operacional",
        f"- Status: **{diagnostics.get('status', 'UNKNOWN')}**",
        f"- Fontes OK: {', '.join(sources_ok) if sources_ok else 'nenhuma'}",
        f"- Fontes com falha: {', '.join(sources_fail) if sources_fail else 'nenhuma'}",
        f"- Total de leads: {len(leads)}",
        f"- Filtro: chance do fornecedor NÃO escolhido = SIM",
        "",
        "## Top 10 oportunidades",
        "",
        "| # | Score | Fit | Fornecedor em aberto? | Cidade | Empresa | Contato | Janela |",
        "|---|---:|---|---|---|---|---|---|",
    ]

    for idx, lead in enumerate(top_10, start=1):
        contact = lead.get("contact_email") or lead.get("contact_phone") or "sem contato"
        md_lines.append(
            "| {idx} | {score} | {fit} | {supplier} | {city} | {company} | {contact} | {window} |".format(
                idx=idx,
                score=lead.get("score", 0),
                fit=lead.get("commercial_fit", "-"),
                supplier=lead.get("chance_supplier_not_chosen", "-"),
                city=lead.get("city", "-"),
                company=lead.get("company", "-"),
                contact=str(contact).replace("|", "/"),
                window=lead.get("window", "-"),
            )
        )

    md_lines.extend(
        [
            "",
            "## Observações",
            f"- {observations}",
            "",
            "## Próximos passos comerciais",
            "1. Ligar/contatar os 3 primeiros leads em até 24h.",
            "2. Executar reunião de descoberta com foco em prazo de decisão e orçamento.",
            "3. Atualizar CRM com estágio e próximo follow-up para o ciclo semanal.",
        ]
    )

    md_path.write_text("\n".join(md_lines), encoding="utf-8")
    return out_dir
