import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

import { colors } from "@/design/tokens";
import "../i18n";

export default function TermsAndPoliciesScreen() {
  const { t } = useTranslation("legal");
  const { bottom } = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingBottom: bottom + 32 }]}
      showsVerticalScrollIndicator={false}
    >
      {/* ── 1. Introduction ─────────────────────────────────────── */}
      <Section title={t("s1Title")} body={t("s1Body")} />

      {/* ── 2. Definitions (has bullet list) ────────────────────── */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t("s2Title")}</Text>
        <Text style={styles.body}>{t("s2Intro")}</Text>
        {(["s2Platform", "s2User", "s2Content", "s2Services", "s2Data"] as const).map(
          (key) => (
            <View key={key} style={styles.bulletRow}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>{t(key)}</Text>
            </View>
          ),
        )}
        <Text style={[styles.body, { marginTop: 8 }]}>{t("s2Footer")}</Text>
      </View>

      {/* ── 3. Platform Use ─────────────────────────────────────── */}
      <Section title={t("s3Title")} body={t("s3Body")} />

      {/* ── 4. User Content ─────────────────────────────────────── */}
      <Section title={t("s4Title")} body={t("s4Body")} />

      {/* ── 5. Data Use (has subsections) ───────────────────────── */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t("s5Title")}</Text>
        <Text style={styles.body}>{t("s5Intro")}</Text>
        <Subsection title={t("s51Title")} body={t("s51Body")} />
        <Subsection title={t("s52Title")} body={t("s52Body")} />
        <Subsection title={t("s53Title")} body={t("s53Body")} />
        <Subsection title={t("s54Title")} body={t("s54Body")} />
        <Subsection title={t("s55Title")} body={t("s55Body")} />
      </View>

      {/* ── 6–12. Remaining sections ────────────────────────────── */}
      <Section title={t("s6Title")} body={t("s6Body")} />
      <Section title={t("s7Title")} body={t("s7Body")} />
      <Section title={t("s8Title")} body={t("s8Body")} />
      <Section title={t("s9Title")} body={t("s9Body")} />
      <Section title={t("s10Title")} body={t("s10Body")} />
      <Section title={t("s11Title")} body={t("s11Body")} />
      <Section title={t("s12Title")} body={t("s12Body")} />
    </ScrollView>
  );
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

function Section({ title, body }: { title: string; body: string }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.body}>{body}</Text>
    </View>
  );
}

function Subsection({ title, body }: { title: string; body: string }) {
  return (
    <View style={styles.subsection}>
      <Text style={styles.subsectionTitle}>{title}</Text>
      <Text style={styles.body}>{body}</Text>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 20,
    gap: 4,
  },
  section: {
    marginBottom: 24,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: "Cabin_700Bold",
    color: colors.primary,
    marginBottom: 4,
  },
  subsection: {
    marginTop: 12,
    gap: 6,
  },
  subsectionTitle: {
    fontSize: 14,
    fontFamily: "Cabin_600SemiBold",
    color: "#2c2c2c",
  },
  body: {
    fontSize: 14,
    fontFamily: "Cabin_400Regular",
    color: "#3c3c3c",
    lineHeight: 22,
  },
  bulletRow: {
    flexDirection: "row",
    gap: 8,
    paddingLeft: 4,
  },
  bullet: {
    fontSize: 14,
    color: colors.primary,
    lineHeight: 22,
  },
  bulletText: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Cabin_400Regular",
    color: "#3c3c3c",
    lineHeight: 22,
  },
});
