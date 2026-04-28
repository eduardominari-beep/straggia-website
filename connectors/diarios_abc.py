from __future__ import annotations

import re
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.request import urlopen
from xml.etree import ElementTree

from core.errors import SourceFetchError

from urllib.request import urlopen
from xml.etree import ElementTree

ABC_RSS_SOURCES: dict[str, str] = {
    "Santo André": "https://www2.santoandre.sp.gov.br/index.php/feed/",
    "São Bernardo do Campo": "https://www.saobernardo.sp.gov.br/web/sbc/feed",
    "São Caetano do Sul": "https://www.saocaetanodosul.sp.gov.br/feed",
}


def _guess_signal_type(text: str) -> str:
    lowered = text.lower()
    if "alvar" in lowered or "licenc" in lowered:
        return "alvara"
    if "obra" in lowered:
        return "obra"
    return "diario-oficial"


def collect_leads(cities: list[str] | None = None, timeout: int = 20) -> list[dict[str, Any]]:
    normalized = {c.lower() for c in (cities or ["all"])}
    targets = {
        city: url
        for city, url in ABC_RSS_SOURCES.items()
        if "all" in normalized or city.lower() in normalized
    }

    leads: list[dict[str, Any]] = []
    city_errors: list[dict[str, Any]] = []

    for city, url in targets.items():
        try:
            with urlopen(url, timeout=timeout) as response:
                xml_bytes = response.read()
        except HTTPError as exc:
            body = exc.read().decode("utf-8", errors="ignore")[:800]
            city_errors.append({"city": city, "url": url, "status_code": exc.code, "error": "HTTP error", "response_excerpt": body})
            continue
        except URLError as exc:
            city_errors.append({"city": city, "url": url, "status_code": None, "error": f"Network error: {exc.reason}", "response_excerpt": None})
            continue
        except Exception as exc:  # noqa: BLE001
            city_errors.append({"city": city, "url": url, "status_code": None, "error": f"Unexpected error: {exc}", "response_excerpt": None})
            continue
    for city, url in targets.items():
        with urlopen(url, timeout=timeout) as response:
            xml_bytes = response.read()

        root = ElementTree.fromstring(xml_bytes)
        for item in root.findall(".//item")[:20]:
            title = (item.findtext("title") or "").strip()
            description = (item.findtext("description") or "").strip()
            link = (item.findtext("link") or "").strip() or None
            pub_date = (item.findtext("pubDate") or "").strip() or None

            joined = f"{title} {description}".lower()
            if not re.search(r"alvar|licenc|obra|industrial|galp|comercial|saúde|serviços", joined):
                continue

            leads.append(
                {
                    "source": "diarios_abc",
                    "source_id": link,
                    "city": city,
                    "signal_type": _guess_signal_type(joined),
                    "title": title,
                    "description": description,
                    "company": None,
                    "cnpj": None,
                    "address": None,
                    "area_m2": None,
                    "use_type": None,
                    "raw_url": link,
                    "published_at": pub_date,
                    "movement": "publicação oficial com possível expansão/obra",
                    "contact_phone": None,
                    "contact_email": None,
                    "entry_path": "Acessar órgão/publicação e identificar empresa responsável para abordagem",
                }
            )

    if city_errors and not leads:
        raise SourceFetchError(
            source="diarios_abc",
            message="All target RSS sources failed",
            metadata={"city_errors": city_errors},
        )

    return leads
