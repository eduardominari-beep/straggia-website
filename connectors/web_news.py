from __future__ import annotations

from datetime import datetime
from email.utils import parsedate_to_datetime
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.request import urlopen
from xml.etree import ElementTree

from core.errors import SourceFetchError

NEWS_RSS_URL = (
    "https://news.google.com/rss/search?"
    "q=(nova+sede+OR+expans%C3%A3o+de+escrit%C3%B3rio+OR+loca%C3%A7%C3%A3o+corporativa+OR+retrofit+corporativo+OR+abertura+de+unidade)+"
    "(S%C3%A3o+Paulo+OR+Barueri+OR+Osasco+OR+Santo+Andr%C3%A9+OR+S%C3%A3o+Bernardo+do+Campo+OR+S%C3%A3o+Caetano+do+Sul+OR+Guarulhos)&"
    "hl=pt-BR&gl=BR&ceid=BR:pt-419"
)


def collect_leads(cities: list[str] | None = None, timeout: int = 20) -> list[dict[str, Any]]:
    try:
        with urlopen(NEWS_RSS_URL, timeout=timeout) as response:
            xml_bytes = response.read()
    except HTTPError as exc:
        body = exc.read().decode("utf-8", errors="ignore")[:800]
        raise SourceFetchError(
            source="web_news",
            message="HTTP error during source fetch",
            url=NEWS_RSS_URL,
            status_code=exc.code,
            response_excerpt=body,
        ) from exc
    except URLError as exc:
        raise SourceFetchError(
            source="web_news",
            message=f"Network error during source fetch: {exc.reason}",
            url=NEWS_RSS_URL,
        ) from exc
    except Exception as exc:  # noqa: BLE001
        raise SourceFetchError(
            source="web_news",
            message=f"Unexpected error during source fetch: {exc}",
            url=NEWS_RSS_URL,
        ) from exc

    root = ElementTree.fromstring(xml_bytes)
    leads: list[dict[str, Any]] = []

    for item in root.findall(".//item")[:40]:
        title = (item.findtext("title") or "").strip()
        link = (item.findtext("link") or "").strip() or None
        pub_date_raw = (item.findtext("pubDate") or "").strip() or None

        joined = title.lower()
        if not any(
            term in joined
            for term in (
                "nova sede",
                "expansão",
                "expansao",
                "escritório",
                "escritorio",
                "locação",
                "locacao",
                "retrofit",
                "abertura",
                "unidade",
            )
        ):
            continue

        city_guess = "São Paulo"
        for city in (
            "barueri",
            "osasco",
            "guarulhos",
            "santo andré",
            "são bernardo",
            "são caetano",
            "campinas",
            "jundiaí",
            "sorocaba",
        ):
            if city in joined:
                city_guess = city.title()
                break

        pub_date = pub_date_raw
        if pub_date_raw:
            try:
                pub_date = parsedate_to_datetime(pub_date_raw).isoformat()
            except Exception:  # noqa: BLE001
                pub_date = pub_date_raw

        leads.append(
            {
                "source": "web_news",
                "source_id": link,
                "city": city_guess,
                "signal_type": "news-expansao",
                "title": title,
                "description": title,
                "company": None,
                "cnpj": None,
                "address": None,
                "area_m2": None,
                "use_type": "corporativo",
                "raw_url": link,
                "published_at": pub_date or datetime.utcnow().isoformat(),
                "movement": "sinal de expansão em notícia de mercado",
                "contact_phone": None,
                "contact_email": None,
                "entry_path": "Mapear empresa na notícia e abordar time de expansão/facilities",
            }
        )

    return leads
