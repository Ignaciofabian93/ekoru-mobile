import { useCallback } from "react";
import { useMutation, useQuery } from "@apollo/client/react";

import {
  MARK_ALL_NOTIFICATIONS_READ,
  MARK_NOTIFICATION_READ,
} from "@/graphql/notifications/mutations";
import {
  MY_NOTIFICATIONS,
  UNREAD_NOTIFICATION_COUNT,
} from "@/graphql/notifications/queries";
import useAuthStore from "@/store/useAuthStore";

import type { NotificationConnection } from "../types";

interface UseNotificationsOptions {
  pageSize?: number;
  onlyUnread?: boolean;
}

/**
 * A page of the current seller's notifications, plus the read actions.
 *
 * Mirrors the web hook of the same name. Marking read refetches the badge count
 * as well as the list: they are separate queries (the badge is deliberately
 * cheap so the tab can poll it), so nothing else would tell the badge its
 * number just changed.
 */
export default function useNotifications({
  pageSize = 20,
  onlyUnread = false,
}: UseNotificationsOptions = {}) {
  const seller = useAuthStore((s) => s.seller);
  const skip = !seller;

  const { data, loading, refetch } = useQuery<{
    myNotifications: NotificationConnection;
  }>(MY_NOTIFICATIONS, {
    variables: { page: 1, pageSize, onlyUnread },
    skip,
    fetchPolicy: "cache-and-network",
  });

  const refetchQueries = [
    { query: UNREAD_NOTIFICATION_COUNT },
    { query: MY_NOTIFICATIONS, variables: { page: 1, pageSize, onlyUnread } },
  ];

  const [markReadMutation] = useMutation(MARK_NOTIFICATION_READ, {
    refetchQueries,
  });
  const [markAllReadMutation, { loading: markingAll }] = useMutation(
    MARK_ALL_NOTIFICATIONS_READ,
    { refetchQueries },
  );

  /**
   * Reading is a convenience, never the point of the tap — a failure here must
   * not stop the user opening what the notification is about.
   */
  const markRead = useCallback(
    async (id: number) => {
      try {
        await markReadMutation({ variables: { id } });
      } catch {
        // Stays unread; the next visit will show it again.
      }
    },
    [markReadMutation],
  );

  const markAllRead = useCallback(async () => {
    try {
      await markAllReadMutation();
    } catch {
      // Same reasoning as markRead.
    }
  }, [markAllReadMutation]);

  const connection = data?.myNotifications;

  return {
    notifications: connection?.nodes ?? [],
    pageInfo: connection?.pageInfo ?? null,
    // `cache-and-network` re-reports loading on every refetch; only show the
    // spinner when there is nothing to display yet.
    loading: loading && !connection,
    markingAll,
    markRead,
    markAllRead,
    refetch,
  };
}
