export function shouldRunWeeklyTop(now = new Date()) {
  const day = now.getUTCDay();
  const hour = now.getUTCHours();
  const minute = now.getUTCMinutes();
  // 08:00 America/Sao_Paulo ~= 11:00 UTC (sem horário de verão)
  return day === 1 && hour === 11 && minute === 0;
}
