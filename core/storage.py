from __future__ import annotations

import json
import sqlite3
from pathlib import Path
from typing import Iterable

DB_PATH = Path("data") / "obra_hunter.db"


def init_db(db_path: Path = DB_PATH) -> Path:
    db_path.parent.mkdir(parents=True, exist_ok=True)
    with sqlite3.connect(db_path) as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS leads (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                run_id TEXT NOT NULL,
                score INTEGER NOT NULL,
                commercial_fit TEXT NOT NULL,
                estimated_ticket_band TEXT NOT NULL,
                source TEXT,
                source_id TEXT,
                city TEXT,
                signal_type TEXT,
                company TEXT,
                cnpj TEXT,
                address TEXT,
                area_m2 REAL,
                use_type TEXT,
                rationale TEXT,
                recommended_approach TEXT,
                exclusion_reason TEXT,
                payload_json TEXT NOT NULL,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
            """
        )
        conn.execute("CREATE INDEX IF NOT EXISTS idx_leads_run_id ON leads(run_id)")
    return db_path


def save_leads(run_id: str, leads: Iterable[dict], db_path: Path = DB_PATH) -> int:
    init_db(db_path)
    rows = list(leads)
    if not rows:
        return 0

    with sqlite3.connect(db_path) as conn:
        conn.executemany(
            """
            INSERT INTO leads (
                run_id, score, commercial_fit, estimated_ticket_band,
                source, source_id, city, signal_type, company, cnpj, address,
                area_m2, use_type, rationale, recommended_approach,
                exclusion_reason, payload_json
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            [
                (
                    run_id,
                    int(lead.get("score", 0)),
                    lead.get("commercial_fit", "low"),
                    lead.get("estimated_ticket_band", "low"),
                    lead.get("source"),
                    lead.get("source_id"),
                    lead.get("city"),
                    lead.get("signal_type"),
                    lead.get("company"),
                    lead.get("cnpj"),
                    lead.get("address"),
                    lead.get("area_m2"),
                    lead.get("use_type"),
                    lead.get("rationale"),
                    lead.get("recommended_approach"),
                    lead.get("exclusion_reason"),
                    json.dumps(lead, ensure_ascii=False),
                )
                for lead in rows
            ],
        )
    return len(rows)
