export function createLogger(scope) {
  return {
    info(message, meta = {}) {
      console.log(JSON.stringify({ level: "info", scope, message, meta, ts: new Date().toISOString() }));
    },
    warn(message, meta = {}) {
      console.warn(JSON.stringify({ level: "warn", scope, message, meta, ts: new Date().toISOString() }));
    },
    error(message, meta = {}) {
      console.error(JSON.stringify({ level: "error", scope, message, meta, ts: new Date().toISOString() }));
    },
  };
}
