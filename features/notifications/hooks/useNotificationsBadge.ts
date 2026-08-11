import { useQuery } from "@apollo/client/react";

import { UNREAD_NOTIFICATION_COUNT } from "@/graphql/notifications/queries";
import useAuthStore from "@/store/useAuthStore";

/**
 * Unread count for the notifications tab badge. Polls a single integer so a new
 * deal request or booking update surfaces without opening the tab.
 *
 * Mirrors the web hook of the same name.
 */
export default function useNotificationsBadge(): number {
  const seller = useAuthStore((s) => s.seller);

  const { data } = useQuery<{ unreadNotificationCount: number }>(
    UNREAD_NOTIFICATION_COUNT,
    {
      skip: !seller,
      fetchPolicy: "cache-and-network",
      pollInterval: 30000,
    },
  );

  return data?.unreadNotificationCount ?? 0;
}
