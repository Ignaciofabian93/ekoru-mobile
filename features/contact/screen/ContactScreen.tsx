import { borderRadius, colors, fontFamily, fontSize, shadows, spacing } from "@/design/tokens";
import { LinearGradient } from "expo-linear-gradient";
import { Clock, Leaf, Mail } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import {
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
// Side-effect import so i18n bundles are registered before useTranslation runs.
import { Text } from "@/components/shared/Text/Text";
import { Title } from "@/components/shared/Title/Title";
import "../i18n";
import ContactForm from "../ui/ContactForm";

const SUPPORT_EMAIL = "contacto@ekoru.cl";

export default function ContactScreen() {
  const { t } = useTranslation("contact");

  const openEmail = () => {
    Linking.openURL(`mailto:${SUPPORT_EMAIL}`);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Hero banner ─────────────────────────────────────── */}
        <LinearGradient
          colors={[colors.primaryDark, colors.primary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          {/* Decorative circles */}
          <View style={[styles.circle, styles.circleTR]} />
          <View style={[styles.circle, styles.circleBL]} />

          <View style={styles.heroContent}>
            <View style={styles.heroIcon}>
              <Leaf size={28} color={colors.onPrimary} strokeWidth={1.5} />
            </View>
            <Title level="h1" style={styles.heroTitle}>
              {t("title")}
            </Title>
            <Title level="h3" style={styles.heroSubtitle}>
              {t("subtitle")}
            </Title>
          </View>
        </LinearGradient>

        {/* ── Info card ───────────────────────────────────────── */}
        <View style={styles.infoCard}>
          <Title level="h2" style={styles.infoTitle}>
            {t("info.title")}
          </Title>

          <Pressable style={styles.infoRow} onPress={openEmail}>
            <View style={styles.infoIconWrap}>
              <Mail size={16} color={colors.primary} strokeWidth={2} />
            </View>
            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>{t("form.email")}</Text>
              <Text style={styles.infoValue}>{SUPPORT_EMAIL}</Text>
            </View>
          </Pressable>

          <View style={styles.infoRow}>
            <View style={styles.infoIconWrap}>
              <Clock size={16} color={colors.primary} strokeWidth={2} />
            </View>
            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>{t("info.responseTime")}</Text>
            </View>
          </View>
        </View>

        {/* ── Contact form ────────────────────────────────────── */}
        <View style={styles.formWrapper}>
          <ContactForm />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  scroll: {
    gap: spacing[4],
    paddingBottom: spacing[8],
  },

  // ── Hero ──────────────────────────────────────────────────
  hero: {
    paddingTop: spacing[8],
    paddingBottom: spacing[10],
    paddingHorizontal: spacing[5],
    overflow: "hidden",
  },
  circle: {
    position: "absolute",
    borderRadius: borderRadius.full,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  circleTR: {
    width: 240,
    height: 240,
    top: -80,
    right: -60,
  },
  circleBL: {
    width: 160,
    height: 160,
    bottom: -60,
    left: -40,
  },
  heroContent: {
    alignItems: "center",
    gap: spacing[3],
  },
  heroIcon: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.full,
    backgroundColor: "rgba(255,255,255,0.18)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroTitle: {
    fontSize: fontSize["2xl"],
    fontFamily: fontFamily.bold,
    color: colors.onPrimary,
    textAlign: "center",
    letterSpacing: -0.3,
  },
  heroSubtitle: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.regular,
    color: "rgba(255,255,255,0.82)",
    textAlign: "center",
    lineHeight: 20,
    maxWidth: 280,
  },

  // ── Info card ─────────────────────────────────────────────
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing[5],
    marginHorizontal: spacing[4],
    gap: spacing[4],
    ...shadows.sm,
  },
  infoTitle: {
    fontSize: fontSize.lg,
    fontFamily: fontFamily.semibold,
    color: colors.foregroundSecondary,
    letterSpacing: 0.6,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[3],
  },
  infoIconWrap: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.sm,
    backgroundColor: `${colors.primary}18`,
    alignItems: "center",
    justifyContent: "center",
  },
  infoText: {
    flex: 1,
    gap: 1,
  },
  infoLabel: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.regular,
    color: colors.foregroundSecondary,
  },
  infoValue: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.semibold,
    color: colors.primary,
  },

  // ── Form wrapper ──────────────────────────────────────────
  formWrapper: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[9],
  },
});
