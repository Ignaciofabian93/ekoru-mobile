import { Pressable, StyleSheet, View } from "react-native";

import { Text } from "@/components/Primitives/Text/Text";
import { colors } from "@/design/tokens";

import { notificationIcon } from "../lib/notificationIcon";
import { relativeTime } from "../lib/relativeTime";
import type { AppNotification } from "../types";

interface NotificationItemProps {
  notification: AppNotification;
  language: string;
  t: (key: string, params?: Record<string, unknown>) => string;
  /** Marks read; navigation happens regardless of whether it succeeds. */
  onPress: (notification: AppNotification) => void;
}

/**
 * One row of the feed. The whole row is the tap target — the title and message
 * already describe where it goes, so there is no separate affordance.
 *
 * Mirrors the web `NotificationItem`.
 */
export default function NotificationItem({
  notification,
  language,
  t,
  onPress,
}: NotificationItemProps) {
  const { icon: Icon, accent } = notificationIcon(notification.type);

  return (
    <Pressable
      onPress={() => onPress(notification)}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.row,
        !notification.isRead && styles.unread,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.iconWrap}>
        <Icon size={17} color={accent} strokeWidth={2} />
      </View>

      <View style={styles.body}>
        <Text
          size="sm"
          weight={notification.isRead ? "semibold" : "bold"}
          numberOfLines={1}
        >
          {notification.title}
        </Text>
        <Text size="xs" color="secondary" numberOfLines={2}>
          {notification.message}
        </Text>
        <Text size="xs" color="tertiary" style={styles.time}>
          {relativeTime(notification.createdAt, t, language)}
        </Text>
      </View>

      {!notification.isRead && <View style={styles.dot} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: colors.surface,
  },
  // A wash rather than a border: the unread dot carries the signal, this only
  // reinforces it.
  unread: { backgroundColor: colors.primaryLightBg },
  pressed: { backgroundColor: colors.surfaceActive },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.backgroundSecondary,
    marginTop: 2,
  },
  body: { flex: 1, minWidth: 0, gap: 2 },
  time: { marginTop: 2 },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginTop: 8,
  },
});
