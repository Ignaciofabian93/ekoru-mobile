import { Text } from "@/components/Primitives/Text/Text";
import { borderRadius, colors, fontFamily, fontSize, spacing } from "@/design/tokens";
import { LinearGradient } from "expo-linear-gradient";
import { ShieldCheck } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { NAMESPACE } from "./i18n";

export default function Header() {
  const { t } = useTranslation(NAMESPACE);

  return (
    <LinearGradient
      colors={[colors.natureSageDark, colors.natureSageDark, colors.natureSageLight]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.hero}
    >
      <View style={[styles.heroBubble, styles.heroBubbleTR]} />
      <View style={[styles.heroBubble, styles.heroBubbleBL]} />

      <View style={styles.heroRow}>
        <View style={styles.heroIconWrap}>
          <ShieldCheck size={18} color="#fff" strokeWidth={1.5} />
        </View>
        <View>
          <Text variant="label" weight="semibold" size="base" style={styles.heroEyebrow}>
            {t("header.title")}
          </Text>
        </View>
      </View>

      <Text style={styles.heroHeadline}>{t("header.subtitle")}</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  hero: {
    paddingTop: spacing[6],
    paddingBottom: 44,
    paddingHorizontal: spacing[5],
    overflow: "hidden",
    gap: spacing[2],
  },
  heroBubble: {
    position: "absolute",
    borderRadius: borderRadius.full,
    backgroundColor: "rgba(255,255,255,0.07)",
  },
  heroBubbleTR: {
    width: 220,
    height: 220,
    top: -60,
    right: -50,
  },
  heroBubbleBL: {
    width: 120,
    height: 120,
    bottom: -30,
    left: -30,
  },
  heroRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[2],
    marginBottom: spacing[1],
  },
  heroIconWrap: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroEyebrow: {
    color: "rgba(255,255,255,0.75)",
  },
  heroSince: {
    fontSize: 11,
    fontFamily: fontFamily.regular,
    color: "rgba(255,255,255,0.55)",
  },
  heroHeadline: {
    fontSize: fontSize.lg,
    fontFamily: fontFamily.bold,
    color: "#fff",
    letterSpacing: -0.5,
    lineHeight: 32,
  },
  heroBody: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.regular,
    color: "rgba(255,255,255,0.8)",
    lineHeight: 20,
  },
  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    marginTop: spacing[1],
    backgroundColor: "rgba(255,255,255,0.18)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: borderRadius.full,
  },
  heroBadgeText: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.bold,
    color: "#fff",
  },
});
