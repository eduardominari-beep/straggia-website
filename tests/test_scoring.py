from core.scoring import score_lead


def test_recapeamento_is_rejected() -> None:
    lead = {"title": "Obra de recapeamento asfáltico", "city": "São Paulo"}
    scored = score_lead(lead)
    assert scored["commercial_fit"] == "reject"
    assert scored["score"] == 0
    assert scored["exclusion_reason"]


def test_galpao_industrial_big_area_is_high_or_strategic() -> None:
    lead = {
        "title": "Licenciamento para galpão industrial logístico",
        "city": "Barueri",
        "area_m2": 6500,
        "company": "Empresa X",
        "movement": "expansão de escritório e nova sede",
    }
    scored = score_lead(lead)
    assert scored["commercial_fit"] == "high"
    assert scored["estimated_ticket_band"] == "strategic"
    assert scored["score"] >= 75
    assert scored["chance_supplier_not_chosen"] == "SIM"


def test_alvara_comercial_medium_is_at_least_medium() -> None:
    lead = {
        "title": "Alvará para empreendimento comercial",
        "city": "Campinas",
        "area_m2": 800,
        "movement": "locação corporativa",
    }
    scored = score_lead(lead)
    assert scored["commercial_fit"] in {"medium", "high"}
    assert scored["score"] >= 50


def test_inaugurado_is_rejected_by_stage() -> None:
    lead = {
        "title": "Nova unidade inaugurado ontem",
        "city": "São Paulo",
        "movement": "abertura de unidade",
    }
    scored = score_lead(lead)
    assert scored["commercial_fit"] == "reject"
    assert scored["chance_supplier_not_chosen"] == "NÃO"
