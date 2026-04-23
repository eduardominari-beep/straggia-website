import fs from 'node:fs';
import path from 'node:path';

const RUNS_DIR = path.resolve('lib/obra-hunter-ai/data/runs');

function parseArgs(argv) {
  const args = {};
  for (const token of argv.slice(2)) {
    const [key, value] = token.split('=');
    if (key.startsWith('--')) args[key.slice(2)] = value ?? true;
  }
  return args;
}

function listRunIds() {
  if (!fs.existsSync(RUNS_DIR)) return [];
  return fs
    .readdirSync(RUNS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

function safeReadRankingCount(runId) {
  const rankingPath = path.join(RUNS_DIR, runId, 'ranking-semanal.json');
  if (!fs.existsSync(rankingPath)) return 0;
  try {
    const content = JSON.parse(fs.readFileSync(rankingPath, 'utf8'));
    return Array.isArray(content) ? content.length : 0;
  } catch {
    return 0;
  }
}

const args = parseArgs(process.argv);
const outPath = path.resolve(args.out || '.tmp-compare.json');
const runIds = listRunIds();
const liveRunId = args['live-run-id'] || runIds.at(-2) || null;
const fallbackRunId = args['fallback-run-id'] || runIds.at(-1) || null;

const payload = {
  generatedAt: new Date().toISOString(),
  live: {
    runId: liveRunId,
    leads: liveRunId ? safeReadRankingCount(liveRunId) : 0,
    available: Boolean(liveRunId),
  },
  fallback: {
    runId: fallbackRunId,
    leads: fallbackRunId ? safeReadRankingCount(fallbackRunId) : 0,
    available: Boolean(fallbackRunId),
  },
};

fs.writeFileSync(outPath, JSON.stringify(payload, null, 2));
console.log(`compare output written: ${outPath}`);
