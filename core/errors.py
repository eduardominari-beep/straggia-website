from __future__ import annotations

from dataclasses import dataclass, field


@dataclass
class SourceFetchError(Exception):
    source: str
    message: str
    url: str | None = None
    status_code: int | None = None
    response_excerpt: str | None = None
    metadata: dict | None = field(default_factory=dict)

    def __str__(self) -> str:
        parts = [f"source={self.source}", self.message]
        if self.url:
            parts.append(f"url={self.url}")
        if self.status_code is not None:
            parts.append(f"status_code={self.status_code}")
        return " | ".join(parts)
