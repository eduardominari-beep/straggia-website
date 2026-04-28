from __future__ import annotations

import argparse
import json

from core.pipeline import run_pipeline


def _parse_cities(raw: str) -> list[str] | None:
    value = raw.strip()
    if not value or value.lower() == "all":
        return ["all"]
    return [part.strip() for part in value.split(",") if part.strip()]


def main() -> int:
    parser = argparse.ArgumentParser(description="OBRA HUNTER AI - Bot semanal de leads preditivos")
    parser.add_argument("--cities", default="all", help="all ou lista separada por vírgula")
    parser.add_argument("--min-score", type=int, default=35, help="score mínimo para salvar lead")
    parser.add_argument("--max-leads", type=int, default=10, help="limite de leads no ranking semanal")
    parser.add_argument(
        "--allow-no-contact-path",
        action="store_true",
        help="permite salvar leads sem contato/caminho de entrada (padrão é bloquear)",
    )
    args = parser.parse_args()

    result = run_pipeline(
        cities=_parse_cities(args.cities),
        min_score=args.min_score,
        max_leads=args.max_leads,
        require_contact_path=not args.allow_no_contact_path,
    )

    print(json.dumps(result, ensure_ascii=False, indent=2))
    print(f"status: {result['status']}")
    print(f"total leads salvos: {result['total_saved']}")
    print(f"output: {result['output_dir']}")

    return 0 if result["status"] in {"SUCCESS", "WARNING"} else 1


if __name__ == "__main__":
    raise SystemExit(main())
