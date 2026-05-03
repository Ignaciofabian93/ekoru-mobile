import { Text } from "@/components/shared/Text/Text";
import { Title } from "@/components/shared/Title/Title";
import { PUSH_NOTIFICATIONS_STORAGE_KEY } from "@/constants/settings";
import { colors } from "@/design/tokens";
import useUserSettings from "@/hooks/useUserSettings";
import { storageSet } from "@/lib/storage";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Switch, View } from "react-native";
import { NAMESPACE } from "../../i18n";

export default function NotificationsSection() {
  const { t } = useTranslation(NAMESPACE);
  const { storedPushNotifications } = useUserSettings();
  const [enablePushNotifications, setEnablePushNotifications] = useState<boolean>(
    storedPushNotifications ?? false,
  );

  const handleChange = (e: boolean) => {
    setEnablePushNotifications(e);
    storageSet(PUSH_NOTIFICATIONS_STORAGE_KEY, e);
  };

  return (
    <View style={{ marginTop: 24 }}>
      <Title level="h6" style={{ color: "#2f2f2f" }}>
        {t("notifications.title")}
      </Title>
      <View style={styles.card}>
        <View style={[styles.row, styles.rowBorder]}>
          <Text>{t("notifications.push")}</Text>
          <Switch
            value={enablePushNotifications}
            onValueChange={handleChange}
            trackColor={{ true: colors.primaryHover, false: "#ccc" }}
            thumbColor={colors.primary}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  rowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#e5e7eb",
  },
});
