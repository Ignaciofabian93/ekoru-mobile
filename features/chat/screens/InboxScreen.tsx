import { Text } from "@/components/Primitives/Text/Text";
import { borderRadius, colors, fontFamily, fontSize } from "@/design/tokens";
import { resolveImageUrl } from "@/features/profile/utils/resolveImage";
import useAppRouter from "@/hooks/useAppRouter";
import { displaySellerName } from "@/utils/displaySellerName";
import { type Href } from "expo-router";
import { MessageCircle } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, FlatList, Image, Pressable, StyleSheet, View } from "react-native";
import { useConversations } from "../hooks/useChatQueries";
import type { ChatConversation } from "../types";
import { conversationItem, threadRoute } from "../utils";

/** "14:05" today, "12 oct" before. */
function shortTime(iso: string, language: string): string {
  const date = new Date(iso);
  const today = new Date().toDateString() === date.toDateString();
  return new Intl.DateTimeFormat(
    language,
    today ? { hour: "2-digit", minute: "2-digit" } : { day: "numeric", month: "short" },
  ).format(date);
}

function avatarOf(conversation: ChatConversation): string | undefined {
  const profile = conversation.counterpart.profile;
  if (!profile) return undefined;
  return resolveImageUrl(
    profile.__typename === "PersonProfile" ? profile.profileImage : profile.logo,
  );
}

/** The chat inbox (MOB-5), most recent first. */
export default function InboxScreen() {
  const { t, i18n } = useTranslation();
  const { navigate } = useAppRouter();
  const { conversations, loading, refetch } = useConversations();

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <FlatList
      data={conversations}
      keyExtractor={(c) => String(c.id)}
      onRefresh={() => void refetch()}
      refreshing={false}
      contentContainerStyle={conversations.length === 0 ? styles.emptyContainer : undefined}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      ListEmptyComponent={
        <View style={styles.empty}>
          <MessageCircle size={40} color={colors.primary} strokeWidth={1.5} />
          <Text weight="bold" align="center">
            {t("chat.emptyTitle")}
          </Text>
          <Text size="sm" color="secondary" align="center">
            {t("chat.emptyBody")}
          </Text>
        </View>
      }
      renderItem={({ item: conversation }) => {
        const item = conversationItem(conversation);
        const last = conversation.lastMessage;
        const unread = conversation.unreadCount;
        const avatar = avatarOf(conversation);
        return (
          <Pressable
            style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
            onPress={() => navigate(threadRoute(conversation.id) as Href)}
            accessibilityRole="button"
          >
            {avatar ? (
              <Image source={{ uri: avatar }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarFallback]}>
                <MessageCircle size={20} color={colors.primary} />
              </View>
            )}
            <View style={styles.rowBody}>
              <View style={styles.rowTop}>
                <Text weight={unread ? "bold" : "semibold"} numberOfLines={1} style={styles.flex}>
                  {displaySellerName(conversation.counterpart)}
                </Text>
                <Text size="xs" color="tertiary">
                  {shortTime(conversation.lastMessageAt, i18n.language)}
                </Text>
              </View>
              <Text size="xs" color="secondary" numberOfLines={1}>
                {t(`chat.roles.${conversation.myRole}`)} · {item?.name ?? t("chat.itemUnavailable")}
              </Text>
              <View style={styles.rowTop}>
                <Text
                  size="sm"
                  color={unread ? "primary" : "secondary"}
                  weight={unread ? "semibold" : "normal"}
                  numberOfLines={1}
                  style={styles.flex}
                >
                  {last ? `${last.mine ? `${t("chat.you")}: ` : ""}${last.body}` : ""}
                </Text>
                {unread > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{unread > 99 ? "99+" : unread}</Text>
                  </View>
                )}
              </View>
            </View>
          </Pressable>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  emptyContainer: { flexGrow: 1, justifyContent: "center" },
  empty: { alignItems: "center", gap: 8, padding: 32 },
  separator: { height: StyleSheet.hairlineWidth, backgroundColor: colors.borderLight },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.surface,
  },
  rowPressed: { backgroundColor: colors.surfaceHover },
  avatar: { width: 44, height: 44, borderRadius: 22 },
  avatarFallback: {
    backgroundColor: colors.primaryLightBg,
    alignItems: "center",
    justifyContent: "center",
  },
  rowBody: { flex: 1, gap: 2 },
  rowTop: { flexDirection: "row", alignItems: "center", gap: 8 },
  flex: { flex: 1 },
  badge: {
    minWidth: 20,
    height: 20,
    paddingHorizontal: 6,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: { color: colors.onPrimary, fontFamily: fontFamily.bold, fontSize: fontSize.xs },
});
