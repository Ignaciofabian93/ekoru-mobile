import { Text } from "@/components/Primitives/Text/Text";
import { borderRadius, colors, fontFamily, fontSize } from "@/design/tokens";
import useAppRouter from "@/hooks/useAppRouter";
import { displaySellerName } from "@/utils/displaySellerName";
import { type Href } from "expo-router";
import { Ban, Lock, Send, ShieldCheck } from "lucide-react-native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useConversationThread } from "../hooks/useConversationThread";
import type { ChatMessage } from "../types";
import { conversationItem } from "../utils";

const MAX_LENGTH = 2000;

/** One conversation (MOB-5). */
export default function ThreadScreen({ conversationId }: { conversationId: number }) {
  const { t, i18n } = useTranslation();
  const insets = useSafeAreaInsets();
  const { navigate } = useAppRouter();
  const thread = useConversationThread(conversationId);
  const { conversation, messages } = thread;
  const [draft, setDraft] = useState("");

  if (!conversation) {
    return (
      <View style={styles.center}>
        {thread.error ? (
          <Text color="secondary">{t("chat.loadFailed")}</Text>
        ) : (
          <ActivityIndicator color={colors.primary} />
        )}
      </View>
    );
  }

  const item = conversationItem(conversation);
  const blocked = conversation.status === "BLOCKED";

  const submit = async () => {
    const body = draft.trim();
    if (!body || thread.sending) return;
    if (await thread.send(body)) setDraft("");
  };

  const confirmReport = (message: ChatMessage) => {
    if (message.mine || message.kind === "SYSTEM") return;
    Alert.alert(t("chat.report"), t("chat.reportConfirm"), [
      { text: t("chat.cancel"), style: "cancel" },
      { text: t("chat.report"), style: "destructive", onPress: () => void thread.report(message.id) },
    ]);
  };

  const toggleBlock = () => {
    if (blocked) {
      void thread.setBlocked(false);
      return;
    }
    Alert.alert(t("chat.block"), t("chat.blockConfirm"), [
      { text: t("chat.cancel"), style: "cancel" },
      { text: t("chat.block"), style: "destructive", onPress: () => void thread.setBlocked(true) },
    ]);
  };

  const time = (iso: string) =>
    new Intl.DateTimeFormat(i18n.language, { hour: "2-digit", minute: "2-digit" }).format(
      new Date(iso),
    );

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      {/* Who and what about, and the block switch. */}
      <View style={styles.header}>
        <View style={styles.flex}>
          <Text weight="bold" numberOfLines={1}>
            {displaySellerName(conversation.counterpart)}
          </Text>
          <Pressable
            disabled={!item?.route}
            onPress={() => item?.route && navigate(item.route as Href)}
          >
            <Text size="xs" color={item?.route ? "primary" : "secondary"} numberOfLines={1}>
              {item?.name ?? t("chat.itemUnavailable")}
            </Text>
          </Pressable>
        </View>
        {(!blocked || conversation.blockedByMe) && (
          <Pressable onPress={toggleBlock} style={styles.headerAction} hitSlop={8}>
            <Ban size={16} color={colors.foregroundSecondary} />
            <Text size="sm" color="secondary">
              {blocked ? t("chat.unblock") : t("chat.block")}
            </Text>
          </Pressable>
        )}
      </View>

      {!conversation.contactAllowed && !blocked && (
        <View style={styles.notice}>
          <ShieldCheck size={14} color={colors.primary} />
          <Text size="xs" color="secondary" style={styles.flex}>
            {t("chat.contactLocked")}
          </Text>
        </View>
      )}

      {/* Newest at the bottom: an inverted list over the reversed messages. */}
      <FlatList
        inverted
        data={[...messages].reverse()}
        keyExtractor={(m) => String(m.id)}
        contentContainerStyle={styles.messages}
        onEndReached={() => thread.hasMore && void thread.loadOlder()}
        onEndReachedThreshold={0.2}
        ListEmptyComponent={
          thread.loaded ? null : <ActivityIndicator color={colors.primary} style={styles.loading} />
        }
        renderItem={({ item: message }) =>
          message.kind === "SYSTEM" ? (
            <Text size="xs" color="secondary" align="center" style={styles.system}>
              {message.body}
            </Text>
          ) : (
            <Pressable
              onLongPress={() => confirmReport(message)}
              style={[styles.bubbleWrap, message.mine ? styles.mineWrap : styles.theirsWrap]}
            >
              <View style={[styles.bubble, message.mine ? styles.mine : styles.theirs]}>
                <Text style={message.mine ? styles.mineText : styles.theirsText}>{message.body}</Text>
              </View>
              <View style={styles.meta}>
                <Text size="xs" color="tertiary">
                  {time(message.createdAt)}
                </Text>
                {message.masked && (
                  <View style={styles.maskedRow}>
                    <Lock size={10} color={colors.foregroundTertiary} />
                    <Text size="xs" color="tertiary">
                      {t("chat.masked")}
                    </Text>
                  </View>
                )}
              </View>
            </Pressable>
          )
        }
      />

      {blocked ? (
        <View style={[styles.blocked, { paddingBottom: insets.bottom + 12 }]}>
          <Lock size={14} color={colors.foregroundSecondary} />
          <Text size="sm" color="secondary" style={styles.flex}>
            {conversation.blockedByMe ? t("chat.blockedByYou") : t("chat.blockedByThem")}
          </Text>
        </View>
      ) : (
        <View style={[styles.composer, { paddingBottom: insets.bottom + 8 }]}>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder={t("chat.placeholder")}
            placeholderTextColor={colors.foregroundMuted}
            multiline
            maxLength={MAX_LENGTH}
            style={styles.input}
            accessibilityLabel={t("chat.messageLabel")}
          />
          <Pressable
            onPress={() => void submit()}
            disabled={!draft.trim() || thread.sending}
            style={[styles.send, (!draft.trim() || thread.sending) && styles.sendDisabled]}
            accessibilityRole="button"
            accessibilityLabel={t("chat.send")}
          >
            {thread.sending ? (
              <ActivityIndicator size="small" color={colors.onPrimary} />
            ) : (
              <Send size={18} color={colors.onPrimary} />
            )}
          </Pressable>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colors.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.borderLight,
  },
  headerAction: { flexDirection: "row", alignItems: "center", gap: 4 },
  notice: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.primaryLightBg,
  },
  messages: { paddingHorizontal: 12, paddingVertical: 12, gap: 6 },
  loading: { marginTop: 24 },
  system: { paddingHorizontal: 24, paddingVertical: 4 },
  bubbleWrap: { maxWidth: "82%", gap: 2 },
  mineWrap: { alignSelf: "flex-end", alignItems: "flex-end" },
  theirsWrap: { alignSelf: "flex-start", alignItems: "flex-start" },
  bubble: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: borderRadius.xl },
  mine: { backgroundColor: colors.primary, borderBottomRightRadius: 4 },
  theirs: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderBottomLeftRadius: 4,
  },
  mineText: { color: colors.onPrimary, fontFamily: fontFamily.regular, fontSize: fontSize.base },
  theirsText: { color: colors.foreground, fontFamily: fontFamily.regular, fontSize: fontSize.base },
  meta: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 4 },
  maskedRow: { flexDirection: "row", alignItems: "center", gap: 3 },
  blocked: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.borderLight,
    backgroundColor: colors.surface,
  },
  composer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    paddingHorizontal: 12,
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.borderLight,
    backgroundColor: colors.surface,
  },
  input: {
    flex: 1,
    maxHeight: 120,
    minHeight: 40,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    fontFamily: fontFamily.regular,
    fontSize: fontSize.base,
    color: colors.foreground,
    backgroundColor: colors.background,
  },
  send: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
  },
  sendDisabled: { opacity: 0.5 },
});
