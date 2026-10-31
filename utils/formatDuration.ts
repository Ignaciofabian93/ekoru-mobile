/**
 * A service's duration, stored in minutes, as "45 min", "4 h" or "1 h 30 min".
 * The units read the same in Spanish, English and French.
 */
export function formatDuration(minutes: number): string {
  const total = Math.round(minutes);
  if (total < 60) return `${total} min`;
  const hours = Math.floor(total / 60);
  const rest = total % 60;
  return rest ? `${hours} h ${rest} min` : `${hours} h`;
}
