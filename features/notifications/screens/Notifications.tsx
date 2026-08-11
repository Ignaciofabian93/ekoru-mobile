import { useState } from "react";
import { useRouter } from "expo-router";
import { BellOff } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

import { Text } from "@/components/Primitives/Text/Text";
import { colors } from "@/design/tokens";
import useAuthStore from "@/store/useAuthStore";

import useNotifications from "../hooks/useNotifications";
import { NAMESPACE } from "../i18n";
import { notificationRoute } from "../lib/notificationRoute";
import type { AppNotification } from "../types";
import NotificationItem from "../ui/NotificationItem";

const PAGE_SIZE = 20;

type Filter = "all" | "unread";

/**
 * The notifications tab.
 *
 * Mirrors the web `NotificationsScreen`: same filters, same "load more" that
 * grows the page rather than paging, so every loaded row stays in one cached
 * result and marking one read refetches a single query.
 */
export default function Notifications() {
  const router = useRouter();
  const { t, i18n } = useTranslation(NAMESPACE);
  const seller = useAuthStore((s) => s.seller);

  const [filter, setFilter] = useState<Filter>("all");
  const [pageSize, setPageSize] = useState(PAGE_SIZE);

  const {
    notifications,
    pageInfo,
    loading,
    markingAll,
    markRead,
    markAllRead,
    refetch,
  } = useNotifications({ pageSize, onlyUnread: filter === "unread" });

  const [refreshing, setRefreshing] = useState(false);

  if (!seller) {
    return (
      <View style={styles.centered}>
        <Text size="sm" color="tertiary">
          {t("empty.description")}
        </Text>
      </View>
    );
  }

  const hasUnread = notifications.some((n) => !n.isRead);
  const isEmpty = !loading && notifications.length === 0;

  const changeFilter = (next: Filter) => {
    setFilter(next);
    setPageSize(PAGE_SIZE);
  };

  const handlePress = (notification: AppNotification) => {
    if (!notification.isRead) void markRead(notification.id);

    // Routing is by type, not the stored actionUrl — mobile's route table is
    // its own. Unknown types simply stay here.
    const route = notificationRoute(notification);
    if (route) router.push(route as never);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.toolbar}>
        <View style={styles.tabs}>
          {(["all", "unread"] as const).map((value) => (
            <Pressable
              key={value}
              onPress={() => changeFilter(value)}
              accessibilityRole="tab"
              accessibilityState={{ selected: filter === value }}
              style={[styles.tab, filter === value && styles.tabActive]}
            >
              <Text
                size="sm"
                weight={filter === value ? "semibold" : "normal"}
                color={filter === value ? "primary" : "secondary"}
              >
                {t(`filters.${value}`)}
              </Text>
            </Pressable>
          ))}
        </View>

        {hasUnread && (
          <Pressable
            onPress={() => void markAllRead()}
            disabled={markingAll}
            accessibilityRole="button"
            style={styles.markAll}
          >
            <Text size="xs" weight="semibold" color="primary">
              {t("markAllRead")}
            </Text>
          </Pressable>
        )}
      </View>

      {loading && (
        <View style={styles.centered}>
          <ActivityIndicator color={colors.primary} />
        </View>
      )}

      {isEmpty && (
        <View style={styles.centered}>
          <BellOff size={28} color={colors.foregroundTertiary} strokeWidth={1.6} />
          <Text size="base" weight="bold" style={styles.emptyTitle}>
            {t(filter === "unread" ? "emptyUnread.title" : "empty.title")}
          </Text>
          <Text size="sm" color="secondary" align="center">
            {t(
              filter === "unread"
                ? "emptyUnread.description"
                : "empty.description",
            )}
          </Text>
        </View>
      )}

      {!loading && notifications.length > 0 && (
        <ScrollView
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {notifications.map((notification, index) => (
            <View key={notification.id}>
              {index > 0 && <View style={styles.separator} />}
              <NotificationItem
                notification={notification}
                language={i18n.language}
                t={t}
                onPress={handlePress}
              />
            </View>
          ))}

          {pageInfo?.hasNextPage && (
            <Pressable
              onPress={() => setPageSize((size) => size + PAGE_SIZE)}
              accessibilityRole="button"
              style={styles.loadMore}
            >
              <Text size="sm" weight="semibold" color="secondary">
                {t("loadMore")}
              </Text>
            </Pressable>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  toolbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  tabs: {
    flexDirection: "row",
    gap: 4,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 10,
    padding: 3,
  },
  tab: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  tabActive: { backgroundColor: colors.surface },
  markAll: { paddingHorizontal: 8, paddingVertical: 6 },
  list: { paddingBottom: 24 },
  separator: { height: StyleSheet.hairlineWidth, backgroundColor: colors.borderLight },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingHorizontal: 32,
  },
  emptyTitle: { marginTop: 4 },
  loadMore: { alignItems: "center", paddingVertical: 16 },
});
