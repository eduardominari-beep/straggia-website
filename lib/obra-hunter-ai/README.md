# OBRA HUNTER AI — Operação (produção x fixture x fallback)

## Separação obrigatória

- **Produção (fonte viva):** conectores tentam coleta HTTP direta na origem e persistem bruto da execução em `data/raw/live/<run-id>/`.
- **Fixture de teste:** arquivos em `data/fixtures/` são apenas para teste/reprodutibilidade.
- **Fallback:** fixture só é usada se `OBRA_HUNTER_ENABLE_FIXTURE_FALLBACK=1` (opt-in explícito).

## Fontes nesta iteração

1. **Barueri PCA 2026 (origem oficial):**
   - URL: `https://www.barueri.sp.gov.br/Transparencia/downloads/Planejamento/PCA_2026_-_Cronograma_de_Contratações_OBRAS.pdf?ent=1&np=1`
   - Conector tenta coleta viva do PDF; fallback opcional via fixture.
2. **Monitor de Licitações (Barueri + Osasco):**
   - URLs: `https://alertalicitacao.com.br/!municipios/3505708` e `https://alertalicitacao.com.br/!municipios/3534401`
   - Conector tenta HTML vivo; fallback opcional via fixtures.

## Execução

> Projeto usa `package.json` e `package-lock.json` na **raiz** para instalação e CI (`npm ci`).

```bash
npm run obra-hunter:test
OBRA_HUNTER_ENABLE_FIXTURE_FALLBACK=1 npm run obra-hunter:run
```

## Diagnóstico da execução

- `diagnostics.json` mantém:
  - funil (bruto → normalizado → elegível)
  - corte de score
  - status por fonte (`sourceHealth`)
  - se fallback foi habilitado ou não

## Limitações honestas

- O runtime atual não conseguiu acessar fontes externas em modo live (falha de rede/proxy), então para manter ranking não vazio nesta máquina foi necessário fallback explícito.
- Snapshot/fixure **não** é usado silenciosamente como produção.

## Deploy externo (produção-live)

Plano objetivo em `DEPLOYMENT.md` com GitHub Actions e VPS, incluindo diagnóstico de rede e comparação live vs fallback.

Comandos úteis:

```bash
npm run obra-hunter:net
npm run obra-hunter:compare
```

## Status operacional (workflow)

- **SUCCESS (verde)**: pipeline executou, artefatos gerados, ranking existente e >=1 fonte útil respondeu.
- **WARNING (interno)**: falha de conectores individuais / live abaixo fallback / queda de volume (registrado em `operational-status.json`, sem quebrar o job).
- **FAIL (vermelho)**: crash total, ausência de artefatos, ranking inexistente ou nenhuma fonte útil.

Comando local:

```bash
npm run obra-hunter:status
```
