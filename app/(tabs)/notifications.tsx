import Colors from "@/constants/Colors";
import { useIsAuthenticated } from "@/store/useAuthStore";
import { Text } from "@/components/shared/Text/Text";
import { useRouter } from "expo-router";
import {
  Bell,
  Heart,
  MessageCircle,
  PackageCheck,
  ShoppingBag,
  Star,
} from "lucide-react-native";
import React from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";

const PREVIEW_ITEMS = [
  {
    icon: PackageCheck,
    color: Colors.primary,
    title: "Order updates",
    desc: "Track every step of your purchases in real time.",
  },
  {
    icon: Heart,
    color: "#ef4444",
    title: "Wishlist alerts",
    desc: "Get notified when a saved item drops in price.",
  },
  {
    icon: MessageCircle,
    color: Colors.secondary,
    title: "Messages",
    desc: "Replies from sellers and community members.",
  },
  {
    icon: ShoppingBag,
    color: Colors.accent,
    title: "New listings",
    desc: "Items matching your interests posted nearby.",
  },
  {
    icon: Star,
    color: "#a855f7",
    title: "Events & actions",
    desc: "Beach cleanups, workshops, and local initiatives.",
  },
];

function GuestNotificationsScreen() {
  const router = useRouter();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.heroBox}>
        <View style={styles.heroIconRing}>
          <Bell size={36} color={Colors.primary} strokeWidth={1.5} />
        </View>
        <Text size="xl" weight="bold" align="center" style={styles.heroTitle}>
          Stay in the loop
        </Text>
        <Text size="sm" color="secondary" align="center" style={styles.heroSubtitle}>
          Create a free account to receive personalised alerts for everything
          that matters to you.
        </Text>
      </View>

      <View style={styles.previewList}>
        {PREVIEW_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <View key={item.title} style={styles.previewItem}>
              <View
                style={[
                  styles.previewIconBox,
                  { backgroundColor: `${item.color}18` },
                ]}
              >
                <Icon size={20} color={item.color} strokeWidth={1.75} />
              </View>
              <View style={styles.previewText}>
                <Text size="sm" weight="semibold">
                  {item.title}
                </Text>
                <Text size="xs" color="secondary">
                  {item.desc}
                </Text>
              </View>
            </View>
          );
        })}
      </View>

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
            I already have an account
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

export default function NotificationsScreen() {
  const isAuthenticated = useIsAuthenticated();

  if (!isAuthenticated) {
    return <GuestNotificationsScreen />;
  }

  // TODO: Replace with real notifications list
  return (
    <View style={styles.emptyContainer}>
      <Bell size={40} color={Colors.foregroundMuted} strokeWidth={1.25} />
      <Text size="base" weight="semibold" color="secondary" style={{ marginTop: 12 }}>
        No notifications yet
      </Text>
      <Text size="sm" color="tertiary" align="center" style={{ marginTop: 4 }}>
        We'll let you know when something happens.
      </Text>
    </View>
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
  heroIconRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.backgroundPrimaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.borderFocus,
  },
  heroTitle: {
    marginBottom: 10,
  },
  heroSubtitle: {
    lineHeight: 20,
  },
  previewList: {
    paddingHorizontal: 20,
    gap: 12,
  },
  previewItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  previewIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  previewText: {
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
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    backgroundColor: Colors.background,
  },
});
