import MainButton from "@/components/shared/Button/MainButton";
import { SellerPreferences } from "@/types/user";
import React from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useSettings from "../hooks/useSettings";
import "../i18n";
import { NAMESPACE } from "../i18n";
import AboutSection from "../ui/AboutSection";
import CurrencySection from "../ui/CurrencySection";
import LanguagesSection from "../ui/LanguagesSection";
import NotificationsSection from "../ui/NotificationsSection";

export interface SettingsSectionProps {
  sellerPreferences: Partial<SellerPreferences>;
  handleSellerPreferences?: ({
    preference,
    value,
  }: {
    preference: keyof SellerPreferences;
    value: string | boolean;
  }) => void;
}

export default function SettingsScreen() {
  const { bottom } = useSafeAreaInsets();
  const { t } = useTranslation(NAMESPACE);
  const {
    sellerPreferences,
    handleSellerPreferences,
    submitSellerPreferences,
    loadingPreferences,
  } = useSettings();

  return (
    <View style={[styles.outerContainer, { paddingBottom: bottom }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.container]}
      >
        {/* Notifications */}
        <NotificationsSection
          sellerPreferences={sellerPreferences}
          handleSellerPreferences={handleSellerPreferences}
        />

        {/* Language */}
        <LanguagesSection
          sellerPreferences={sellerPreferences}
          handleSellerPreferences={handleSellerPreferences}
        />

        {/* Currency */}
        <CurrencySection sellerPreferences={sellerPreferences} />

        {/* About */}
        <AboutSection />

        {/* Save Configs */}
        <MainButton
          text={t("saveSettings")}
          onPress={submitSellerPreferences}
          loading={loadingPreferences}
          style={{ marginTop: 48 }}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  outerContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
