/**
 * App-level logger
 * ─────────────────────────────────────────────────────────────────
 * Centralises error/event logging so the transport layer can be
 * swapped out (e.g. add Sentry) in one place without touching
 * call sites.
 *
 * Usage:
 *   import { logger } from "@/lib/logger";
 *   logger.error("ErrorBoundary", error);
 * ─────────────────────────────────────────────────────────────────
 */
import * as Sentry from "@sentry/react-native";

type LogLevel = "info" | "warn" | "error";

function log(
  level: LogLevel,
  context: string,
  error?: Error | unknown,
  extra?: Record<string, unknown>,
) {
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [${level.toUpperCase()}] [${context}]`;

  if (level === "error") {
    console.error(prefix, error, extra ?? "");
  } else if (level === "warn") {
    console.warn(prefix, error, extra ?? "");
  } else {
    console.log(prefix, error, extra ?? "");
  }

  if (level === "error" && error instanceof Error) {
    Sentry.captureException(error, { extra: { context, ...extra } });
  }
}

export const logger = {
  info: (context: string, message?: unknown, extra?: Record<string, unknown>) =>
    log("info", context, message, extra),
  warn: (context: string, message?: unknown, extra?: Record<string, unknown>) =>
    log("warn", context, message, extra),
  error: (context: string, error?: unknown, extra?: Record<string, unknown>) =>
    log("error", context, error, extra),
};
