import type { ViewSource } from "./track";

type Screen = { path: string; segments: readonly string[] };

/**
 * The last two screens shown, kept by NavigationTracker, so an item screen can
 * tell where the user came from. The path tells screens apart (two products);
 * the segments keep the route group, which says what kind of screen it was.
 * Only in memory: opening the app on an item (a link or a push) is EXTERNAL.
 */
const history: { current: Screen | null; previous: Screen | null } = {
  current: null,
  previous: null,
};

export function recordScreen(screen: Screen): void {
  if (screen.path === history.current?.path) return;
  history.previous = history.current;
  history.current = screen;
}

/**
 * Where the user was before `path`. The tracker may not have recorded `path`
 * yet when the item screen asks, in which case the screen before it is still
 * `current`.
 */
export function viewSourceFor(path: string): ViewSource {
  const before = history.current?.path === path ? history.previous : history.current;
  return sourceOf(before?.segments ?? null);
}

export function sourceOf(segments: readonly string[] | null): ViewSource {
  if (segments === null) return "EXTERNAL";
  const [first, second] = segments;
  if (first === "(tabs)" && (second === undefined || second === "index")) return "HOME";
  if (first === "(search)") return "SEARCH";
  if (first === "(marketplace)" || first === "(stores)" || first === "(services)") {
    return "CATALOG";
  }
  if (first === "seller") return "SELLER";
  if (first === "product" || first === "store-product" || first === "service") return "ITEM";
  return "OTHER";
}
