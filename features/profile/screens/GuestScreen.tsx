import MainButton from "@/components/shared/Button/MainButton";
import { Text } from "@/components/shared/Text/Text";
import Colors from "@/constants/Colors";
import { useRouter } from "expo-router";
import {
  Leaf,
  ShieldCheck,
  Star,
  TreePine,
  UserRound,
  Zap,
} from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, View } from "react-native";
import "../i18n";
import { NAMESPACE } from "../i18n";

export default function GuestScreen() {
  const router = useRouter();
  const { t } = useTranslation(NAMESPACE);

  const PERKS = [
    { icon: Star, color: Colors.accent, titleKey: "perk_points_title", descKey: "perk_points_desc" },
    { icon: Leaf, color: Colors.primary, titleKey: "perk_impact_title", descKey: "perk_impact_desc" },
    { icon: ShieldCheck, color: Colors.secondary, titleKey: "perk_badge_title", descKey: "perk_badge_desc" },
    { icon: Zap, color: "#a855f7", titleKey: "perk_deals_title", descKey: "perk_deals_desc" },
    { icon: TreePine, color: "#10b981", titleKey: "perk_trees_title", descKey: "perk_trees_desc" },
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
          <UserRound size={40} color={Colors.primary} strokeWidth={1.25} />
        </View>
        <Text size="xl" weight="bold" align="center" style={styles.heroTitle}>
          {t("joinCommunity")}
        </Text>
        <Text
          size="sm"
          color="secondary"
          align="center"
          style={styles.heroSubtitle}
        >
          {t("guestSubtitle")}
        </Text>
      </View>

      {/* Perks list */}
      <View style={styles.perksList}>
        {PERKS.map((perk) => {
          const Icon = perk.icon;
          return (
            <View key={perk.titleKey} style={styles.perkItem}>
              <View
                style={[
                  styles.perkIconBox,
                  { backgroundColor: `${perk.color}18` },
                ]}
              >
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
          text={t("createAccount")}
          onPress={() => router.push("/(auth)/register")}
        />
        <MainButton
          text={t("signIn")}
          variant="outline"
          onPress={() => router.push("/(auth)")}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
    backgroundColor: Colors.backgroundPrimaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    borderWidth: 2,
    borderColor: Colors.borderFocus,
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
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.borderLight,
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
    backgroundColor: Colors.primary,
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
