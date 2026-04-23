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

function latestRunId() {
  if (!fs.existsSync(RUNS_DIR)) return null;
  return fs
    .readdirSync(RUNS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort()
    .at(-1) || null;
}

const args = parseArgs(process.argv);
const runId = args['run-id'] || process.argv[2] || latestRunId();

if (!runId) {
  console.log('No run directory available to summarize.');
  process.exit(0);
}

const runDir = path.join(RUNS_DIR, runId);
const summaryPath = path.join(runDir, 'summary.md');
const lines = [
  '# Run Summary',
  '',
  `- run_id: ${runId}`,
  `- generated_at: ${new Date().toISOString()}`,
];

fs.mkdirSync(runDir, { recursive: true });
fs.writeFileSync(summaryPath, `${lines.join('\n')}\n`);
console.log(`summary written: ${summaryPath}`);
