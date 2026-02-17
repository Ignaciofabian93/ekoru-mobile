import Colors from "@/constants/Colors";
import useAuthStore from "@/store/useAuthStore";
import { useRouter } from "expo-router";
import {
  ChevronRight,
  KeyRound,
  PackageSearch,
  Settings,
  UserPen,
  type LucideIcon,
} from "lucide-react-native";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

interface MenuRow {
  label: string;
  icon: LucideIcon;
  route: string;
}

const menuRows: MenuRow[] = [
  { label: "Edit Profile", icon: UserPen, route: "/(profile)/edit-profile" },
  {
    label: "Change Password",
    icon: KeyRound,
    route: "/(profile)/change-password",
  },
  {
    label: "Order History",
    icon: PackageSearch,
    route: "/(profile)/order-history",
  },
  { label: "Settings", icon: Settings, route: "/(profile)/settings" },
];

export default function ProfileScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const initials = user
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <View style={styles.avatarSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <Text style={styles.name}>{user?.name ?? "Guest"}</Text>
        <Text style={styles.email}>{user?.email ?? ""}</Text>
      </View>

      <View style={styles.menuCard}>
        {menuRows.map((row, index) => {
          const Icon = row.icon;
          return (
            <Pressable
              key={row.route}
              style={[
                styles.menuRow,
                index < menuRows.length - 1 && styles.menuRowBorder,
              ]}
              onPress={() => router.push(row.route as any)}
            >
              <View style={styles.menuRowLeft}>
                <Icon size={20} strokeWidth={1.5} color="#374151" />
                <Text style={styles.menuRowLabel}>{row.label}</Text>
              </View>
              <ChevronRight size={18} color="#9ca3af" />
            </Pressable>
          );
        })}
      </View>

      <Pressable
        style={styles.logoutButton}
        onPress={async () => {
          await logout();
          router.replace("/(tabs)");
        }}
      >
        <Text style={styles.logoutText}>Log Out</Text>
      </Pressable>
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
  avatarSection: {
    alignItems: "center",
    paddingVertical: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  name: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: "#6b7280",
  },
  menuCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 8,
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  menuRowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#e5e7eb",
  },
  menuRowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  menuRowLabel: {
    fontSize: 16,
    color: "#374151",
  },
  logoutButton: {
    marginTop: 24,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#fee2e2",
    alignItems: "center",
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#dc2626",
  },
});
