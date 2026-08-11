type Translate = (key: string, params?: Record<string, unknown>) => string;

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;

/**
 * Compact "how long ago" label for a notification timestamp.
 *
 * Deliberately not `Intl.RelativeTimeFormat`: the feed shows these in a dense
 * list where "2h ago" reads better than "2 hours ago", and the wording is
 * already translated alongside the rest of the feature's copy.
 *
 * Anything older than four weeks falls back to a plain localised date — at that
 * age the exact day is more useful than the elapsed time.
 */
export function relativeTime(iso: string, t: Translate, lang: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";

  // Clock skew between server and browser can make a fresh row look future-dated.
  const elapsed = Math.max(0, Date.now() - then);

  if (elapsed < MINUTE) return t("time.now");
  if (elapsed < HOUR) {
    return t("time.minutes", { count: Math.floor(elapsed / MINUTE) });
  }
  if (elapsed < DAY) {
    return t("time.hours", { count: Math.floor(elapsed / HOUR) });
  }
  if (elapsed < WEEK) {
    return t("time.days", { count: Math.floor(elapsed / DAY) });
  }
  if (elapsed < 4 * WEEK) {
    return t("time.weeks", { count: Math.floor(elapsed / WEEK) });
  }

  try {
    return new Intl.DateTimeFormat(lang, {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(then));
  } catch {
    return new Date(then).toLocaleDateString();
  }
}
