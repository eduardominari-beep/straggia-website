# OBRA HUNTER AI — Deploy leve para execução 100% live

## Diagnóstico técnico do bloqueio no ambiente atual (sandbox)

- `HTTPS_PROXY` está definido para `http://proxy:8080`.
- DNS do proxy resolve, mas o túnel HTTPS para fontes externas retorna bloqueio (`CONNECT tunnel failed, 403`).
- `node fetch` também falha com `TypeError: fetch failed` para fontes externas.

Conclusão: o ambiente atual é restrito para coleta live de internet pública.

## Objetivo de produção

### Estrutura adotada (sem ambiguidade)
- `package.json` **na raiz** é o controlador oficial do projeto.
- `package-lock.json` **na raiz** é obrigatório para `npm ci`.
- Workflow executa tudo pela raiz e chama scripts que apontam para `lib/obra-hunter-ai`.

Rodar coleta **100% live fora do sandbox** com:
- fallback desligado por padrão
- persistência de bruto da coleta
- ranking semanal não vazio quando as fontes responderem

## Opção 1 (recomendada): GitHub Actions

Workflow: `.github/workflows/obra-hunter-live.yml`

### Secrets necessários
- `ALERT_EMAIL_ENABLED` (opcional)
- `ALERT_TELEGRAM_ENABLED` (opcional)
- credenciais futuras de email/telegram quando ativadas

### Execução
- Agendada: segunda-feira 11:00 UTC (08:00 BRT)
- Manual: `workflow_dispatch`

### Comportamento
1. Roda diagnóstico de rede
2. Executa pipeline live (`OBRA_HUNTER_ENABLE_FIXTURE_FALLBACK=0`)
3. Executa comparação live vs fallback
4. Publica artefatos (`data/runs/*`)


## Disparo manual imediato (GitHub Actions)

Com GitHub CLI autenticado:

```bash
gh workflow run obra-hunter-live.yml -f cities=all-gsp -f min_score=35
gh run list --workflow obra-hunter-live.yml --limit 1
gh run watch
```

Sem `gh`, use a aba **Actions > obra-hunter-live > Run workflow**.

## Opção 2: VPS (systemd + cron)

1. Instalar Node 20+
2. Clonar repo
3. Configurar envs em `/etc/obra-hunter.env`
4. Cron semanal:

```bash
0 11 * * 1 cd /opt/straggia-website && /usr/bin/env -i bash -lc 'source /etc/obra-hunter.env && npm ci && node lib/obra-hunter-ai/cli.mjs weekly --cities=all-gsp'
```

## Checklist da primeira execução 100% live

- [ ] `network-diagnose` sem erro de conectividade externa
- [ ] `npm run obra-hunter:run` com fallback desligado
- [ ] `diagnostics.json` com `allowFixtureFallback: false`
- [ ] `sourceHealth` com pelo menos 1 conector `ok: true` em modo live
- [ ] ranking semanal não vazio

## Comparação live vs fallback

Use:

```bash
node lib/obra-hunter-ai/scripts/compare-live-vs-fallback.mjs
```

Saída esperada: JSON com `live.leads`, `fallback.leads` e `deltaLeads`.
