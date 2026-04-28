from __future__ import annotations

from typing import Any

REJECT_TERMS = {
    "recapeamento": "Obra de recapeamento/pavimentação fora do ICP comercial do MVP.",
    "pavimentação": "Pavimentação urbana genérica fora do ICP.",
    "playground": "Playground não é target comercial da operação.",
    "manutenção de praça": "Manutenção de praça é serviço público urbano não aderente.",
    "iluminação pública": "Iluminação pública é infraestrutura urbana não aderente.",
    "limpeza urbana": "Limpeza urbana não representa lead de obra comercial.",
    "serviço público urbano": "Serviço público urbano genérico fora de escopo.",
    "residencial unifamiliar": "Residencial unifamiliar não é perfil-alvo.",
    "construtora": "Empresa construtora não está no foco comercial do bot.",
    "incorporadora": "Incorporadora não está no foco comercial do bot.",
    "condomínio": "Condomínio não faz parte do ICP prioritário.",
    "vgv": "Projeto pautado por VGV alto não é foco do playbook atual.",
    "epc definido": "Projeto com EPC definido já tende a ter fornecedor escolhido.",
}

NEGATIVE_STAGE_TERMS = {
    "obra iniciada": "Obra já iniciada",
    "em construção": "Projeto já em construção",
    "inaugurado": "Unidade já inaugurada",
    "entregue": "Projeto já entregue",
    "fornecedor contratado": "Fornecedor já contratado",
}

FOCUS_TERMS = {
    "expansão de escritório": 30,
    "nova sede": 30,
    "mudança de sede": 30,
    "locação corporativa": 30,
    "retrofit corporativo": 30,
    "abertura de unidade": 30,
}

STRATEGIC_CITIES = {
    "são paulo",
    "sao paulo",
    "barueri",
    "osasco",
    "são bernardo",
    "são bernardo do campo",
    "santo andré",
    "santo andre",
    "são caetano",
    "são caetano do sul",
    "guarulhos",
    "campinas",
    "jundiaí",
    "jundiai",
    "sorocaba",
}


def _as_float(value: Any) -> float | None:
    if value is None:
        return None
    try:
        return float(value)
    except (TypeError, ValueError):
        return None


def _contains_any(haystack: str, terms: tuple[str, ...] | list[str] | set[str]) -> bool:
    return any(term in haystack for term in terms)


def score_lead(lead: dict) -> dict:
    enriched = dict(lead)
    area = _as_float(enriched.get("area_m2"))

    searchable = " ".join(
        str(enriched.get(k, ""))
        for k in ("title", "description", "signal_type", "use_type", "address", "movement")
    ).lower()

    for term, reason in REJECT_TERMS.items():
        if term in searchable:
            enriched.update(
                {
                    "score": 0,
                    "commercial_fit": "reject",
                    "estimated_ticket_band": "low",
                    "rationale": f"Rejeitado por termo crítico: {term}.",
                    "exclusion_reason": reason,
                    "recommended_approach": "Descartar automaticamente do funil comercial.",
                    "supplier_open_probability": "low",
                    "chance_supplier_not_chosen": "NÃO",
                }
            )
            return enriched

    for term, reason in NEGATIVE_STAGE_TERMS.items():
        if term in searchable:
            enriched.update(
                {
                    "score": 0,
                    "commercial_fit": "reject",
                    "estimated_ticket_band": "low",
                    "rationale": f"Descartado por estágio avançado: {term}.",
                    "exclusion_reason": reason,
                    "recommended_approach": "Descartar e monitorar apenas para inteligência de mercado.",
                    "supplier_open_probability": "low",
                    "chance_supplier_not_chosen": "NÃO",
                }
            )
            return enriched

    score = 0
    reasons: list[str] = []

    for term, points in FOCUS_TERMS.items():
        if term in searchable:
            score += points
            reasons.append(f"Sinal foco prioritário: {term}")

    if _contains_any(searchable, ("alvar", "aprova", "licenc")):
        score += 35
        reasons.append("Sinal forte de alvará/aprovação/licenciamento")

    if _contains_any(searchable, ("industrial", "galp", "logíst", "logist")):
        score += 30
        reasons.append("Vocação industrial/galpão/logística")

    if _contains_any(searchable, ("comercial", "corporativo", "saúde", "saude", "serviços", "servicos", "escritório", "sede")):
        score += 25
        reasons.append("Uso comercial/corporativo/serviços")

    if area is not None and area > 2000:
        score += 30
        reasons.append("Área acima de 2.000m²")
    elif area is not None and area > 500:
        score += 20
        reasons.append("Área acima de 500m²")

    city = str(enriched.get("city", "")).lower()
    if city in STRATEGIC_CITIES:
        score += 15
        reasons.append("Cidade estratégica")

    if enriched.get("company") or enriched.get("cnpj"):
        score += 10
        reasons.append("Empresa/CNPJ identificado")

    if _contains_any(searchable, ("crescimento", "contrata", "nova unidade", "expansão", "locação", "adquiriu imóvel")):
        score += 15
        reasons.append("Sinal de expansão corporativa")

    # Penalização para sinais de obra já com baixa abertura comercial.
    if _contains_any(searchable, ("licitação encerrada", "contrato assinado", "ordem de serviço emitida")):
        score -= 40
        reasons.append("Sinal de contratação avançada reduz chance de entrada")

    score = max(0, min(score, 100))

    if score >= 75:
        fit = "high"
    elif score >= 50:
        fit = "medium"
    elif score >= 25:
        fit = "low"
    else:
        fit = "reject"

    if score >= 90 or ((area or 0) > 5000):
        ticket = "strategic"
    elif score >= 75 or ((area or 0) > 2000):
        ticket = "high"
    elif score >= 50:
        ticket = "medium"
    else:
        ticket = "low"

    if score >= 75:
        supplier_open = "high"
        chance_supplier = "SIM"
        stage = "early-discovery"
        window = "3-12 meses"
    elif score >= 50:
        supplier_open = "medium"
        chance_supplier = "SIM"
        stage = "qualification"
        window = "2-6 meses"
    elif score >= 25:
        supplier_open = "low"
        chance_supplier = "INCERTO"
        stage = "monitoring"
        window = "reavaliar em 30 dias"
    else:
        supplier_open = "low"
        chance_supplier = "NÃO"
        stage = "discard"
        window = "sem janela"

    enriched.update(
        {
            "score": score,
            "commercial_fit": fit,
            "estimated_ticket_band": ticket,
            "rationale": "; ".join(reasons) if reasons else "Sinal fraco com baixa aderência comercial.",
            "exclusion_reason": None if fit != "reject" else "Score abaixo do mínimo comercial.",
            "recommended_approach": {
                "high": "Contato consultivo imediato com decisor e proposta de pré-obra.",
                "medium": "Nutrição curta + reunião de descoberta com time de expansão.",
                "low": "Monitorar sinais novos antes de abordagem ativa.",
                "reject": "Descartar do pipeline comercial.",
            }[fit],
            "supplier_open_probability": supplier_open,
            "chance_supplier_not_chosen": chance_supplier,
            "stage": stage,
            "window": window,
        }
    )
    return enriched
