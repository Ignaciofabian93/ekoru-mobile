import MainButton from "@/components/shared/Button/MainButton";
import { Text } from "@/components/shared/Text/Text";
import { colors } from "@/design/tokens";
import { useRouter } from "expo-router";
import { ArrowLeftRight, BookOpen, Leaf, LogIn, Star, Store, UserRoundPlus } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import { NAMESPACE } from "../i18n";

export default function GuestScreen() {
  const router = useRouter();
  const { t } = useTranslation(NAMESPACE);

  const EKORU_LOGO = require("@/assets/images/favicon.png");

  const PERKS = [
    {
      icon: Star,
      color: colors.accent,
      titleKey: "community.perk_points_title",
      descKey: "community.perk_points_desc",
    },
    {
      icon: Leaf,
      color: colors.primary,
      titleKey: "community.perk_impact_title",
      descKey: "community.perk_impact_desc",
    },
    {
      icon: ArrowLeftRight,
      color: colors.secondary,
      titleKey: "community.perk_badge_title",
      descKey: "community.perk_badge_desc",
    },
    {
      icon: Store,
      color: "#a855f7",
      titleKey: "community.perk_deals_title",
      descKey: "community.perk_deals_desc",
    },
    {
      icon: BookOpen,
      color: "#10b981",
      titleKey: "community.perk_trees_title",
      descKey: "community.perk_trees_desc",
    },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Avatar placeholder */}
      <View style={styles.heroBox}>
        <View style={styles.avatarRing}>
          <Image source={EKORU_LOGO} resizeMode="cover" style={styles.avatarImage} />
        </View>
        <Text size="xl" weight="bold" align="center" style={styles.heroTitle}>
          {t("community.joinCommunity")}
        </Text>
        <Text size="sm" color="secondary" align="center" style={styles.heroSubtitle}>
          {t("community.subtitle")}
        </Text>
      </View>

      {/* Perks list */}
      <View style={styles.perksList}>
        {PERKS.map((perk) => {
          const Icon = perk.icon;
          return (
            <View key={perk.titleKey} style={styles.perkItem}>
              <View style={[styles.perkIconBox, { backgroundColor: `${perk.color}18` }]}>
                <Icon size={20} color={perk.color} strokeWidth={1.75} />
              </View>
              <View style={styles.perkText}>
                <Text size="sm" weight="semibold">
                  {t(perk.titleKey)}
                </Text>
                <Text size="xs" color="secondary">
                  {t(perk.descKey)}
                </Text>
              </View>
            </View>
          );
        })}
      </View>

      {/* CTAs */}
      <View style={styles.actions}>
        <MainButton
          text={t("community.createAccount")}
          onPress={() => router.push("/(auth)/register")}
          rightIcon={UserRoundPlus}
        />
        <MainButton
          text={t("community.signIn")}
          variant="outline"
          onPress={() => router.push("/(auth)")}
          rightIcon={LogIn}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingBottom: 40,
  },
  heroBox: {
    alignItems: "center",
    paddingHorizontal: 32,
    paddingTop: 40,
    paddingBottom: 24,
  },
  avatarRing: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    borderWidth: 2,
    borderColor: colors.borderFocus,
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 44,
  },
  heroTitle: {
    marginBottom: 10,
  },
  heroSubtitle: {
    lineHeight: 20,
  },
  perksList: {
    paddingHorizontal: 20,
    gap: 10,
  },
  perkItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  perkIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  perkText: {
    flex: 1,
    gap: 2,
  },
  actions: {
    paddingHorizontal: 20,
    paddingTop: 28,
    gap: 12,
  },
  primaryBtn: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: "center",
  },
  primaryBtnLabel: {
    color: "#fff",
    fontSize: 15,
  },
  secondaryBtn: {
    alignItems: "center",
    paddingVertical: 8,
  },
});
