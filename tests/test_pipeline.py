from pathlib import Path

from core import pipeline


def test_pipeline_resilient_and_success(monkeypatch) -> None:
    def good_connector(_cities):
        return [
            {
                "source": "mock_ok",
                "city": "São Paulo",
                "title": "Alvará comercial para galpão industrial",
                "area_m2": 2500,
                "company": "ACME",
                "signal_type": "alvara",
                "movement": "expansão de escritório e nova sede",
                "contact_email": "expansao@acme.com",
                "entry_path": "Falar com head de expansão",
            }
        ]

    def bad_connector(_cities):
        raise RuntimeError("timeout")

    monkeypatch.setattr(pipeline, "CONNECTORS", [("ok", good_connector), ("bad", bad_connector)])

    result = pipeline.run_pipeline(run_id="test-run-001", cities=["all"], min_score=35)

    assert result["status"] == "SUCCESS"
    assert result["total_saved"] >= 1
    assert "ok" in result["sources_ok"]
    assert "bad" in result["sources_fail"]

    out_dir = Path(result["output_dir"])
    assert (out_dir / "ranking-semanal.csv").exists()
    assert (out_dir / "ranking-semanal.json").exists()
    assert (out_dir / "ranking-semanal.md").exists()
    assert (out_dir / "diagnostics.json").exists()


def test_pipeline_discards_without_contact_path(monkeypatch) -> None:
    def no_contact_connector(_cities):
        return [
            {
                "source": "mock_ok",
                "city": "São Paulo",
                "title": "Alvará comercial para galpão industrial",
                "area_m2": 2500,
                "company": "ACME",
                "signal_type": "alvara",
                "movement": "expansão de escritório e nova sede",
            }
        ]

    monkeypatch.setattr(pipeline, "CONNECTORS", [("ok", no_contact_connector)])

    result = pipeline.run_pipeline(run_id="test-run-002", cities=["all"], min_score=35, require_contact_path=True)

    assert result["status"] == "WARNING"
    assert result["total_saved"] == 0
