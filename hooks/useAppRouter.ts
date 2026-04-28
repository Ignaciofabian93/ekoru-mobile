import { useRouter, type Href } from "expo-router";
import { useTransition } from "react";

/**
 * App-wide navigation hook.
 *
 * Wraps every Expo Router call in React's startTransition so that Fabric
 * batches the navigation tree swap with any concurrent state updates (e.g.
 * clearing a loading spinner) into a single deferred commit — preventing the
 * "addViewAt: View already has a parent" IllegalStateException on the New
 * Architecture.
 *
 * Also surfaces `isPending` so callers can show an in-flight indicator while
 * the transition is in progress.
 *
 * Usage:
 *   const { navigate, replace, back, isPending } = useAppRouter();
 *
 *   navigate("/(tabs)");
 *   replace("/(auth)");
 *   back();
 */
export default function useAppRouter() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  /**
   * Push a new route onto the stack.
   * Equivalent to router.push — adds an entry to the history stack.
   * `onTransition` runs inside the same startTransition batch, so any state
   * updates it triggers (e.g. clearing a loading flag) are committed together
   * with the navigation, preventing Fabric double-parent crashes.
   */
  const navigate = (href: Href, onTransition?: () => void) => {
    startTransition(() => {
      onTransition?.();
      router.push(href);
    });
  };

  /**
   * Replace the current route without adding to the history stack.
   * Use this after login/logout so the user can't navigate back to auth.
   */
  const replace = (href: Href, onTransition?: () => void) => {
    startTransition(() => {
      onTransition?.();
      router.replace(href);
    });
  };

  /**
   * Go back to the previous screen.
   * Falls back to replacing with `fallback` if there is no history to pop.
   */
  const back = (fallback: Href = "/(tabs)", onTransition?: () => void) => {
    startTransition(() => {
      onTransition?.();
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace(fallback);
      }
    });
  };

  /**
   * Dismiss the current modal or stack, going back to the nearest non-modal route.
   * Equivalent to router.dismiss().
   */
  const dismiss = (onTransition?: () => void) => {
    startTransition(() => {
      onTransition?.();
      router.dismiss();
    });
  };

  return {
    navigate,
    replace,
    back,
    dismiss,
    /** True while the transition is in-flight — use to drive loading indicators. */
    isPending,
  };
}
