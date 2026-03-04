// DB stores relative paths (/images/...). Convert to full URL so React Native

import { GATEWAY_BASE_URL } from "@/config/endpoints";

// Image can load them. Already-absolute URLs are returned unchanged.
export function resolveImageUrl(
  url: string | null | undefined,
): string | undefined {
  if (!url) return undefined;
  return url.startsWith("http") ? url : `${GATEWAY_BASE_URL}${url}`;
}
