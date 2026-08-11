import MainButton from "@/components/Primitives/Button/MainButton";
import { Text } from "@/components/Primitives/Text/Text";
import { borderRadius, colors, fontFamily, fontSize, spacing } from "@/design/tokens";
import { useRouter } from "expo-router";
import { Heart } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { NAMESPACE } from "./i18n";

export default function EmptyState() {
  const { t } = useTranslation(NAMESPACE);
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <Heart size={48} color={colors.naturePurpleDark} strokeWidth={1.5} />
      </View>
      <Text style={styles.title}>{t("empty.title")}</Text>
      <Text style={styles.subtitle}>{t("empty.subtitle")}</Text>
      <MainButton
        text={t("empty.browse")}
        style={styles.button}
        onPress={() => router.push("/(marketplace)")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingTop: spacing[10],
    paddingHorizontal: spacing[6],
    gap: spacing[3],
  },
  iconWrap: {
    width: spacing[20],
    height: spacing[20],
    borderRadius: borderRadius.full,
    backgroundColor: `${colors.naturePurpleDark}15`,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing[2],
  },
  title: {
    fontSize: fontSize.xl,
    fontFamily: fontFamily.bold,
    color: colors.foreground,
    textAlign: "center",
  },
  subtitle: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.regular,
    color: colors.foregroundSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
  button: {
    marginTop: spacing[2],
    alignSelf: "stretch",
  },
});
