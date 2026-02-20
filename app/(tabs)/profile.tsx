import Colors from "@/constants/Colors";
import { Text } from "@/components/shared/Text/Text";
import { useRouter } from "expo-router";
import {
  Leaf,
  ShieldCheck,
  Star,
  TreePine,
  UserRound,
  Zap,
} from "lucide-react-native";
import React from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";

const PERKS = [
  {
    icon: Star,
    color: Colors.accent,
    title: "Eco points & rewards",
    desc: "Earn points on every purchase and redeem them for discounts.",
  },
  {
    icon: Leaf,
    color: Colors.primary,
    title: "Environmental impact",
    desc: "Track the CO₂ you've saved and the trees planted through Ekoru.",
  },
  {
    icon: ShieldCheck,
    color: Colors.secondary,
    title: "Verified seller badge",
    desc: "Build trust and sell faster with a verified profile.",
  },
  {
    icon: Zap,
    color: "#a855f7",
    title: "Exclusive deals",
    desc: "Members get early access to flash sales and eco events.",
  },
  {
    icon: TreePine,
    color: "#10b981",
    title: "Plant trees for free",
    desc: "Every active month Ekoru plants a tree on your behalf.",
  },
];

function GuestProfileScreen() {
  const router = useRouter();

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
          Join the Ekoru community
        </Text>
        <Text size="sm" color="secondary" align="center" style={styles.heroSubtitle}>
          Free to join. Earn points, track your impact, and buy or sell
          eco-friendly goods.
        </Text>
      </View>

      {/* Perks list */}
      <View style={styles.perksList}>
        {PERKS.map((perk) => {
          const Icon = perk.icon;
          return (
            <View key={perk.title} style={styles.perkItem}>
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
                  {perk.title}
                </Text>
                <Text size="xs" color="secondary">
                  {perk.desc}
                </Text>
              </View>
            </View>
          );
        })}
      </View>

      {/* CTAs */}
      <View style={styles.actions}>
        <Pressable
          style={styles.primaryBtn}
          onPress={() => router.push("/(auth)/register")}
        >
          <Text weight="bold" style={styles.primaryBtnLabel}>
            Create free account
          </Text>
        </Pressable>
        <Pressable
          style={styles.secondaryBtn}
          onPress={() => router.push("/(auth)")}
        >
          <Text size="sm" weight="semibold" color="primary">
            Sign in to my account
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

export default function ProfileTab() {
  return <GuestProfileScreen />;
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
