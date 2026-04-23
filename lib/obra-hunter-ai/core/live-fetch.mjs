import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

export async function fetchWithRetry(url, { attempts = 3, timeoutMs = 15000, headers = {} } = {}) {
  let lastError;
  for (let i = 1; i <= attempts; i++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, { headers, signal: controller.signal });
      clearTimeout(timeout);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res;
    } catch (err) {
      clearTimeout(timeout);
      lastError = err;
      if (i === attempts) break;
      await new Promise((r) => setTimeout(r, 400 * i));
    }
  }
  throw lastError;
}

export async function persistRawCollection({ runId, connector, extension, body }) {
  const dir = path.resolve(`lib/obra-hunter-ai/data/raw/live/${runId}`);
  await mkdir(dir, { recursive: true });
  const filePath = path.join(dir, `${connector}.${extension}`);
  await writeFile(filePath, body);
  return filePath;
}
