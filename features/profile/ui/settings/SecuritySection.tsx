import { Text } from "@/components/shared/Text/Text";
import { Title } from "@/components/shared/Title/Title";
import { TWO_FACTOR_AUTH_STORAGE_KEY } from "@/constants/settings";
import { colors } from "@/design/tokens";
import useBiometricAuth from "@/hooks/useBiometricAuth";
import useUserSettings from "@/hooks/useUserSettings";
import { storageDelete, storageSet } from "@/lib/storage";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Switch, View } from "react-native";
import { NAMESPACE } from "../../i18n";

export default function SecuritySection() {
  const { t } = useTranslation(NAMESPACE);
  const { storedTwoFactorAuth } = useUserSettings();
  const [isTwoAuthEnabled, setIsTwoAuthEnabled] = useState<boolean>(storedTwoFactorAuth ?? false);
  const { isAvailable, authenticate } = useBiometricAuth();

  const handleChange = async () => {
    if (isTwoAuthEnabled) {
      storageDelete(TWO_FACTOR_AUTH_STORAGE_KEY);
      setIsTwoAuthEnabled(false);
      return;
    }

    if (!isAvailable) return;

    const success = await authenticate();
    if (!success) return;

    storageSet(TWO_FACTOR_AUTH_STORAGE_KEY, true);
    setIsTwoAuthEnabled(true);
  };

  return (
    <View style={{ marginTop: 24 }}>
      <Title level="h6" style={{ color: "#2f2f2f" }}>
        {t("security.title")}
      </Title>
      <View style={styles.card}>
        <View style={styles.row}>
          <Text>{t("security.twoFactorAuth")}</Text>
          <Switch
            value={isTwoAuthEnabled}
            onValueChange={handleChange}
            disabled={!isAvailable}
            trackColor={{ true: colors.primaryHover, false: "#ccc" }}
            thumbColor={isAvailable ? colors.primary : "#aaa"}
          />
        </View>
        {!isAvailable && (
          <Text style={{ fontSize: 12, color: "#999", paddingHorizontal: 16, paddingBottom: 8 }}>
            {t("security.twoFaNotAvailable")}
          </Text>
        )}
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
