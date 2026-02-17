const API_BASE = "http://192.168.0.5:4000";

export function getImageUrl(path?: string): string | undefined {
  if (!path) return undefined;
  if (path.startsWith("http")) return path;
  return `${API_BASE}${path}`;
}
