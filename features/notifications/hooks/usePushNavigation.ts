import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import { useEffect } from "react";

import { notificationRoute } from "../lib/notificationRoute";

/**
 * Opens the screen a tapped push notification is about (MOB-5): a new chat
 * message opens its thread, a deal its list, and so on, by the same mapping
 * the notifications tab uses. Covers both a cold start from the notification
 * and a tap while the app is running. The push payload carries `type` and
 * `relatedId` (ekoru-users' notifications processor).
 */
export function usePushNavigation() {
  const response = Notifications.useLastNotificationResponse();

  useEffect(() => {
    const data = response?.notification.request.content.data as
      | { type?: string; relatedId?: string | null }
      | undefined;
    if (!data?.type) return;
    const route = notificationRoute({ type: data.type, relatedId: data.relatedId ?? null });
    if (route) router.push(route as never);
  }, [response]);
}
