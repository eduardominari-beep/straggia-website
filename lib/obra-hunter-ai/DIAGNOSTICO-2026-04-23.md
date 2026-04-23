# Diagnóstico operacional (2026-04-23)

## Confirmação solicitada

1. **O conector Barueri PCA usava snapshot como principal?**
   - Antes: sim.
   - Agora: não. O fluxo tenta **coleta live** primeiro e só usa fixture com opt-in explícito (`OBRA_HUNTER_ENABLE_FIXTURE_FALLBACK=1`).

2. **Origem exata da fonte Barueri PCA**
   - `https://www.barueri.sp.gov.br/Transparencia/downloads/Planejamento/PCA_2026_-_Cronograma_de_Contratações_OBRAS.pdf?ent=1&np=1`

3. **Resultado do modo live neste ambiente**
   - Falha de coleta externa (rede/proxy), impedindo parse do PDF ao vivo.
   - Conector registra erro e modo de operação em `connectors.json`.

4. **Separação aplicada**
   - Produção: `data/raw/live/<run-id>/...`
   - Fixture: `data/fixtures/*.fixture.json`
   - Fallback: somente com flag explícita.

5. **Por que ranking não ficou vazio nesta execução?**
   - Fallback explícito habilitado para manter operação comercial enquanto conectividade live não estabiliza.
