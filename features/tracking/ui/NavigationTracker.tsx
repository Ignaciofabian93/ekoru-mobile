import { usePathname, useSegments } from "expo-router";
import { useEffect } from "react";
import { recordScreen } from "../navigation";

/** Remembers the previous screen, for the source of an item view. Renders nothing. */
export default function NavigationTracker() {
  const path = usePathname();
  const segments = useSegments();
  const key = segments.join("/");

  useEffect(() => {
    recordScreen({ path, segments: key ? key.split("/") : [] });
  }, [path, key]);

  return null;
}
