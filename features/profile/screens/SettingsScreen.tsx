import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AboutSection from "../ui/settings/AboutSection";
import CurrencySection from "../ui/settings/CurrencySection";
import LanguagesSection from "../ui/settings/LanguagesSection";
import NotificationsSection from "../ui/settings/NotificationsSection";
import SecuritySection from "../ui/settings/SecuritySection";

export default function SettingsScreen() {
  const { bottom } = useSafeAreaInsets();

  return (
    <View style={[styles.outerContainer, { paddingBottom: bottom }]}>
      <ScrollView style={styles.scroll} contentContainerStyle={[styles.container]}>
        {/* Notifications */}
        <NotificationsSection />

        {/* Security */}
        <SecuritySection />

        {/* Language */}
        <LanguagesSection />

        {/* Currency */}
        <CurrencySection />

        {/* About */}
        <AboutSection />
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
