import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from "react-native";

import Colors from "@/constants/Colors";

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState<"en" | "es">("en");

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <Text style={styles.sectionTitle}>Preferences</Text>
      <View style={styles.card}>
        <View style={[styles.row, styles.rowBorder]}>
          <Text style={styles.rowLabel}>Notifications</Text>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ true: Colors.primary }}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Dark Mode</Text>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={{ true: Colors.primary }}
          />
        </View>
      </View>

      <Text style={styles.sectionTitle}>Language</Text>
      <View style={styles.card}>
        <Pressable
          style={[styles.row, styles.rowBorder]}
          onPress={() => setLanguage("en")}
        >
          <Text style={styles.rowLabel}>English</Text>
          {language === "en" && <Text style={styles.check}>✓</Text>}
        </Pressable>
        <Pressable style={styles.row} onPress={() => setLanguage("es")}>
          <Text style={styles.rowLabel}>Español</Text>
          {language === "es" && <Text style={styles.check}>✓</Text>}
        </Pressable>
      </View>

      <Text style={styles.sectionTitle}>About</Text>
      <View style={styles.card}>
        <View style={[styles.row, styles.rowBorder]}>
          <Text style={styles.rowLabel}>Version</Text>
          <Text style={styles.rowValue}>1.0.0</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Terms & Privacy</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },
  container: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6b7280",
    textTransform: "uppercase",
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
    fontSize: 16,
    color: "#374151",
  },
  rowValue: {
    fontSize: 16,
    color: "#9ca3af",
  },
  check: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.primary,
  },
});
