from __future__ import annotations

import json
from typing import Any
from urllib.parse import urlencode
from urllib.request import urlopen

GEOSAMPA_DATASET_URL = "https://dadosabertos.prefeitura.sp.gov.br/api/3/action/package_search"


def collect_leads(cities: list[str] | None = None, timeout: int = 20) -> list[dict[str, Any]]:
    normalized_cities = {c.lower() for c in (cities or ["são paulo", "sao paulo", "all"])}
    if "all" not in normalized_cities and "são paulo" not in normalized_cities and "sao paulo" not in normalized_cities:
        return []

    query = urlencode({"q": "alvará licenciamento obra comercial industrial", "rows": 25})
    with urlopen(f"{GEOSAMPA_DATASET_URL}?{query}", timeout=timeout) as response:
        payload = json.loads(response.read().decode("utf-8"))

    results = payload.get("result", {}).get("results", [])

    leads: list[dict[str, Any]] = []
    for item in results:
        text = " ".join(
            [
                str(item.get("title", "")),
                str(item.get("notes", "")),
                str(item.get("name", "")),
            ]
        ).lower()

        if not any(term in text for term in ("alvar", "licenc", "obra", "industrial", "comercial", "galp")):
            continue

        leads.append(
            {
                "source": "geosampa",
                "source_id": item.get("id") or item.get("name"),
                "city": "São Paulo",
                "signal_type": "licenciamento",
                "title": item.get("title"),
                "description": item.get("notes"),
                "company": None,
                "cnpj": None,
                "address": None,
                "area_m2": None,
                "use_type": "comercial/industrial",
                "raw_url": f"https://dadosabertos.prefeitura.sp.gov.br/dataset/{item.get('name')}" if item.get("name") else None,
                "published_at": item.get("metadata_created"),
                "movement": "sinal público de licenciamento/expansão",
                "contact_phone": None,
                "contact_email": None,
                "entry_path": f"Mapear empresa e abordar via área de expansão usando {item.get('name', 'fonte')}" if item.get("name") else None,
            }
        )

    return leads
