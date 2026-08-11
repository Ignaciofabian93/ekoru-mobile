import { useCallback } from "react";
import { Platform } from "react-native";
import { useMutation } from "@apollo/client/react";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";

import {
  REGISTER_DEVICE,
  UNREGISTER_DEVICE,
} from "@/graphql/notifications/mutations";

/** Maps the RN platform onto the backend's `DevicePlatform`. */
function devicePlatform(): "IOS" | "ANDROID" | "WEB" {
  if (Platform.OS === "ios") return "IOS";
  if (Platform.OS === "android") return "ANDROID";
  return "WEB";
}

/**
 * `getExpoPushTokenAsync` needs the EAS project id explicitly in SDK 49+; it is
 * not inferred outside a managed build.
 */
function easProjectId(): string | undefined {
  const extra = Constants.expoConfig?.extra as
    | { eas?: { projectId?: string } }
    | undefined;
  return extra?.eas?.projectId ?? Constants.easConfig?.projectId;
}

/**
 * Registers this device for push, and drops it on sign-out.
 *
 * Without this the whole push channel is dead: the backend picks recipients
 * from `SellerDevice`, so a seller with `enablePushNotifications` on but no
 * registered token receives nothing. That was the state before this hook —
 * the settings toggle looked like it worked and could not.
 *
 * Every failure is swallowed. Push is an enhancement; a permission prompt the
 * user dismissed, a simulator with no push support, or a backend hiccup must
 * never break sign-in or the settings screen.
 */
export default function usePushRegistration() {
  const [registerDevice] = useMutation(REGISTER_DEVICE);
  const [unregisterDevice] = useMutation(UNREGISTER_DEVICE);

  /**
   * Asks for permission if needed, resolves the Expo token and registers it.
   * Returns the token on success, null otherwise (denied, unsupported, failed).
   */
  const register = useCallback(async (): Promise<string | null> => {
    try {
      const existing = await Notifications.getPermissionsAsync();
      let status = existing.status;

      // Only prompt when we have not been answered yet; re-asking after a
      // denial does nothing on iOS and annoys on Android.
      if (status !== "granted" && existing.canAskAgain) {
        const requested = await Notifications.requestPermissionsAsync();
        status = requested.status;
      }
      if (status !== "granted") return null;

      // Android needs a channel before anything is delivered.
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "Ekoru",
          importance: Notifications.AndroidImportance.DEFAULT,
        });
      }

      const projectId = easProjectId();
      const { data: token } = await Notifications.getExpoPushTokenAsync(
        projectId ? { projectId } : undefined,
      );
      if (!token) return null;

      await registerDevice({
        variables: {
          input: {
            pushToken: token,
            platform: devicePlatform(),
            deviceName: Constants.deviceName ?? undefined,
          },
        },
      });

      return token;
    } catch {
      return null;
    }
  }, [registerDevice]);

  /**
   * Drops this device so the next person to sign in on it does not receive the
   * previous user's notifications. The backend keys tokens globally for exactly
   * this reason, so unregistering on sign-out matters.
   */
  const unregister = useCallback(async (): Promise<void> => {
    try {
      const projectId = easProjectId();
      const { data: token } = await Notifications.getExpoPushTokenAsync(
        projectId ? { projectId } : undefined,
      );
      if (!token) return;
      await unregisterDevice({ variables: { pushToken: token } });
    } catch {
      // Nothing to do — the token is either unobtainable or already gone.
    }
  }, [unregisterDevice]);

  return { register, unregister };
}
