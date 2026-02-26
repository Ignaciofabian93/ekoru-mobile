import { Text } from "@/components/shared/Text/Text";
import { Title } from "@/components/shared/Title/Title";
import Colors from "@/constants/Colors";
import { useTranslation } from "react-i18next";
import { StyleSheet, Switch, View } from "react-native";
import { NAMESPACE } from "../i18n";
import { SettingsSectionProps } from "../screens/SettingsScreen";

export default function NotificationsSection({
  sellerPreferences,
  handleSellerPreferences,
}: SettingsSectionProps) {
  const { t } = useTranslation(NAMESPACE);
  return (
    <View style={{ marginTop: 24 }}>
      <Title level="h6" style={{ color: "#2f2f2f" }}>
        {t("notifications")}
      </Title>
      <View style={styles.card}>
        <View style={[styles.row, styles.rowBorder]}>
          <Text>{t("pushNotifications")}</Text>
          <Switch
            value={sellerPreferences.pushNotifications}
            onValueChange={() =>
              handleSellerPreferences?.({
                preference: "pushNotifications",
                value: !sellerPreferences.pushNotifications,
              })
            }
            trackColor={{ true: Colors.primaryHover, false: "#ccc" }}
            thumbColor={Colors.primary}
          />
        </View>
        <View style={[styles.row, styles.rowBorder]}>
          <Text>{t("emailNotifications")}</Text>
          <Switch
            value={sellerPreferences.emailNotifications}
            onValueChange={() =>
              handleSellerPreferences?.({
                preference: "emailNotifications",
                value: !sellerPreferences.emailNotifications,
              })
            }
            trackColor={{ true: Colors.primaryHover, false: "#ccc" }}
            thumbColor={Colors.primary}
          />
        </View>
        <View style={styles.row}>
          <Text>{t("orderUpdates")}</Text>
          <Switch
            value={sellerPreferences.orderUpdates}
            onValueChange={() =>
              handleSellerPreferences?.({
                preference: "orderUpdates",
                value: !sellerPreferences.orderUpdates,
              })
            }
            trackColor={{ true: Colors.primaryHover, false: "#ccc" }}
            thumbColor={Colors.primary}
          />
        </View>
        <View style={styles.row}>
          <Text>{t("communityUpdates")}</Text>
          <Switch
            value={sellerPreferences.communityUpdates}
            onValueChange={() =>
              handleSellerPreferences?.({
                preference: "communityUpdates",
                value: !sellerPreferences.communityUpdates,
              })
            }
            trackColor={{ true: Colors.primaryHover, false: "#ccc" }}
            thumbColor={Colors.primary}
          />
        </View>
        <View style={styles.row}>
          <Text>{t("securityAlerts")}</Text>
          <Switch
            value={sellerPreferences.securityAlerts}
            onValueChange={() =>
              handleSellerPreferences?.({
                preference: "securityAlerts",
                value: !sellerPreferences.securityAlerts,
              })
            }
            trackColor={{ true: Colors.primaryHover, false: "#ccc" }}
            thumbColor={Colors.primary}
          />
        </View>
        <View style={styles.row}>
          <Text>{t("weeklySummary")}</Text>
          <Switch
            value={sellerPreferences.weeklySummary}
            onValueChange={() =>
              handleSellerPreferences?.({
                preference: "weeklySummary",
                value: !sellerPreferences.weeklySummary,
              })
            }
            trackColor={{ true: Colors.primaryHover, false: "#ccc" }}
            thumbColor={Colors.primary}
          />
        </View>
        <View style={styles.row}>
          <Text>{t("twoFactorAuth")}</Text>
          <Switch
            value={sellerPreferences.twoFactorAuth}
            onValueChange={() =>
              handleSellerPreferences?.({
                preference: "twoFactorAuth",
                value: !sellerPreferences.twoFactorAuth,
              })
            }
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
