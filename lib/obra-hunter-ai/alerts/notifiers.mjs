export async function notifyEmail({ enabled, logger, summary }) {
  if (!enabled) {
    logger.info("Email notifier disabled");
    return { sent: false, channel: "email" };
  }
  logger.warn("Email notifier configured as placeholder. Configure SMTP provider env vars for production delivery.", { summary });
  return { sent: false, channel: "email", reason: "smtp_not_configured" };
}

export async function notifyTelegram({ enabled, logger, summary }) {
  if (!enabled) {
    logger.info("Telegram notifier disabled");
    return { sent: false, channel: "telegram" };
  }
  logger.warn("Telegram notifier configured as placeholder. Configure bot token + chat id for production delivery.", { summary });
  return { sent: false, channel: "telegram", reason: "telegram_not_configured" };
}
