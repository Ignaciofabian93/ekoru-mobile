import { Text } from "@/components/Primitives/Text/Text";
import { Title } from "@/components/Primitives/Title/Title";
import { colors } from "@/design/tokens";
import { UPDATE_SELLER_PREFERENCES } from "@/graphql/auth/profile";
import usePushRegistration from "@/features/notifications/hooks/usePushRegistration";
import { showError } from "@/lib/toast";
import useAuthStore from "@/store/useAuthStore";
import { useMutation } from "@apollo/client/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, StyleSheet, Switch, View } from "react-native";
import { NAMESPACE } from "./i18n";

/**
 * Push and email notification preferences.
 *
 * Both switches persist to `SellerPreferences` server-side — that is the gate
 * the backend actually reads when deciding whether to deliver. This previously
 * wrote only to device storage, so the switch looked like it worked while the
 * server-side preference stayed false and nothing was ever delivered.
 *
 * Turning push ON also registers this device: the backend picks recipients from
 * `SellerDevice`, so the preference alone reaches nobody without a token.
 */
export default function NotificationsSection() {
  const { t } = useTranslation(NAMESPACE);
  const seller = useAuthStore((s) => s.seller);
  const { register, unregister } = usePushRegistration();

  const preferences = seller?.preferences;
  const [push, setPush] = useState<boolean>(
    preferences?.enablePushNotifications ?? false,
  );
  const [email, setEmail] = useState<boolean>(
    preferences?.enableEmailNotifications ?? false,
  );
  const [busy, setBusy] = useState<"push" | "email" | null>(null);

  const [updatePreferences] = useMutation(UPDATE_SELLER_PREFERENCES, {
    fetchPolicy: "no-cache",
  });

  const savePush = async (next: boolean) => {
    setBusy("push");
    // Optimistic: the switch should feel immediate; it is reverted below if the
    // round trip fails.
    setPush(next);

    try {
      if (next) {
        // Register BEFORE persisting: without a device token the preference
        // would be on while nothing could actually be delivered.
        const token = await register();
        if (!token) {
          setPush(false);
          showError({
            title: t("notifications.title"),
            message: t("notifications.permissionDenied"),
          });
          return;
        }
      } else {
        await unregister();
      }

      await updatePreferences({
        variables: { input: { enablePushNotifications: next } },
      });
    } catch {
      setPush(!next);
      showError({
        title: t("notifications.title"),
        message: t("notifications.saveFailed"),
      });
    } finally {
      setBusy(null);
    }
  };

  const saveEmail = async (next: boolean) => {
    setBusy("email");
    setEmail(next);
    try {
      await updatePreferences({
        variables: { input: { enableEmailNotifications: next } },
      });
    } catch {
      setEmail(!next);
      showError({
        title: t("notifications.title"),
        message: t("notifications.saveFailed"),
      });
    } finally {
      setBusy(null);
    }
  };

  if (!seller) return null;

  return (
    <View style={styles.section}>
      <Title level="h6" style={styles.heading}>
        {t("notifications.title")}
      </Title>

      <View style={styles.card}>
        <Row
          label={t("notifications.push")}
          value={push}
          busy={busy === "push"}
          onChange={(next) => void savePush(next)}
        />
        <View style={styles.divider} />
        <Row
          label={t("notifications.email")}
          value={email}
          busy={busy === "email"}
          onChange={(next) => void saveEmail(next)}
        />
      </View>

      <Text size="xs" color="tertiary" style={styles.hint}>
        {t("notifications.hint")}
      </Text>
    </View>
  );
}

function Row({
  label,
  value,
  busy,
  onChange,
}: {
  label: string;
  value: boolean;
  busy: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <View style={styles.row}>
      <Text>{label}</Text>
      {busy ? (
        <ActivityIndicator color={colors.primary} />
      ) : (
        <Switch
          value={value}
          onValueChange={onChange}
          trackColor={{ true: colors.primaryHover, false: "#ccc" }}
          thumbColor={colors.primary}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginTop: 24 },
  heading: { color: "#2f2f2f" },
  card: { backgroundColor: "#fff", borderRadius: 12, overflow: "hidden" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 16,
    minHeight: 52,
  },
  divider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#e5e7eb",
  },
  hint: { marginTop: 8, paddingHorizontal: 4 },
});
