import { Text } from "@/components/shared/Text/Text";
import { Title } from "@/components/shared/Title/Title";
import Colors from "@/constants/Colors";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Switch, View } from "react-native";
import { NAMESPACE } from "../i18n";

export default function NotificationsScreen() {
  const { t } = useTranslation(NAMESPACE);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [orderUpdates, setOrderUpdates] = useState(true);
  return (
    <View style={{ marginTop: 24 }}>
      <Title level="h6" style={{ color: "#2f2f2f" }}>
        {t("notifications")}
      </Title>
      <View style={styles.card}>
        <View style={[styles.row, styles.rowBorder]}>
          <Text>{t("pushNotifications")}</Text>
          <Switch
            value={pushNotifications}
            onValueChange={setPushNotifications}
            trackColor={{ true: Colors.primaryHover, false: "#ccc" }}
            thumbColor={Colors.primary}
          />
        </View>
        <View style={[styles.row, styles.rowBorder]}>
          <Text>{t("emailNotifications")}</Text>
          <Switch
            value={emailNotifications}
            onValueChange={setEmailNotifications}
            trackColor={{ true: Colors.primaryHover, false: "#ccc" }}
            thumbColor={Colors.primary}
          />
        </View>
        <View style={styles.row}>
          <Text>{t("orderUpdates")}</Text>
          <Switch
            value={orderUpdates}
            onValueChange={setOrderUpdates}
            trackColor={{ true: Colors.primaryHover, false: "#ccc" }}
            thumbColor={Colors.primary}
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
