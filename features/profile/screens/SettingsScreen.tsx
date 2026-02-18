import Colors from "@/constants/Colors";
import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";

type Language = "en" | "es" | "fr";

const LANGUAGES: { code: Language; label: string }[] = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
];

export default function SettingsScreen() {
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [language, setLanguage] = useState<Language>("en");

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      {/* Notifications */}
      <Text style={styles.sectionTitle}>Notifications</Text>
      <View style={styles.card}>
        <View style={[styles.row, styles.rowBorder]}>
          <Text style={styles.rowLabel}>Push Notifications</Text>
          <Switch
            value={pushNotifications}
            onValueChange={setPushNotifications}
            trackColor={{ true: Colors.primary }}
          />
        </View>
        <View style={[styles.row, styles.rowBorder]}>
          <Text style={styles.rowLabel}>Email Notifications</Text>
          <Switch
            value={emailNotifications}
            onValueChange={setEmailNotifications}
            trackColor={{ true: Colors.primary }}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Order Updates</Text>
          <Switch
            value={orderUpdates}
            onValueChange={setOrderUpdates}
            trackColor={{ true: Colors.primary }}
          />
        </View>
      </View>

      {/* Language */}
      <Text style={styles.sectionTitle}>Language</Text>
      <View style={styles.card}>
        {LANGUAGES.map((lang, index) => (
          <Pressable
            key={lang.code}
            style={[
              styles.row,
              index < LANGUAGES.length - 1 && styles.rowBorder,
            ]}
            onPress={() => setLanguage(lang.code)}
          >
            <Text style={styles.rowLabel}>{lang.label}</Text>
            {language === lang.code && <Text style={styles.check}>✓</Text>}
          </Pressable>
        ))}
      </View>

      {/* About */}
      <Text style={styles.sectionTitle}>About</Text>
      <View style={styles.card}>
        <View style={[styles.row, styles.rowBorder]}>
          <Text style={styles.rowLabel}>Version</Text>
          <Text style={styles.rowValue}>1.0.0</Text>
        </View>
        <Pressable style={[styles.row, styles.rowBorder]}>
          <Text style={styles.rowLabel}>Terms of Service</Text>
        </Pressable>
        <Pressable style={styles.row}>
          <Text style={styles.rowLabel}>Privacy Policy</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: "Cabin_600SemiBold",
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 8,
    marginTop: 16,
    marginLeft: 4,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  rowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#e5e7eb",
  },
  rowLabel: {
    fontSize: 15,
    fontFamily: "Cabin_500Medium",
    color: "#1f2937",
  },
  rowValue: {
    fontSize: 15,
    fontFamily: "Cabin_400Regular",
    color: "#9ca3af",
  },
  check: {
    fontSize: 16,
    fontFamily: "Cabin_700Bold",
    color: Colors.primary,
  },
});
