import MainButton from "@/components/shared/Button/MainButton";
import React from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import "../i18n";
import { NAMESPACE } from "../i18n";
import AboutSection from "../ui/AboutSection";
import LanguagesSection from "../ui/LanguagesSection";
import NotificationsScreen from "../ui/NotificationsScreen";

export default function SettingsScreen() {
  const { bottom } = useSafeAreaInsets();
  const { t } = useTranslation(NAMESPACE);

  return (
    <View style={[styles.outerContainer, { paddingBottom: bottom }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.container]}
      >
        {/* Notifications */}
        <NotificationsScreen />

        {/* Language */}
        <LanguagesSection />

        {/* About */}
        <AboutSection />

        {/* Save Configs */}
        <MainButton
          text={t("saveSettings")}
          onPress={() => {}}
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
