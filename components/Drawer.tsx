import { useRouter } from "expo-router";
import {
  BookCheck,
  Package,
  PackagePlus,
  ScanBarcode,
  Settings,
  Store,
  User,
  X,
  type LucideIcon,
} from "lucide-react-native";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { useDrawer } from "./DrawerContext";

import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import useAuthStore, { useIsAuthenticated, useHasRole } from "@/store/useAuthStore";
import MainButton from "./shared/Button/MainButton";

const SCREEN_WIDTH = Dimensions.get("window").width;
const DRAWER_WIDTH = SCREEN_WIDTH * 0.8;

interface MenuItem {
  route: string;
  labelKey: string;
  icon: LucideIcon;
}

const profileMenuItems: MenuItem[] = [
  { route: "/(profile)", labelKey: "profile.profile", icon: User },
  { route: "/(profile)/settings", labelKey: "profile.settings", icon: Settings },
];

const menuItems: MenuItem[] = [
  { route: "/(tabs)", labelKey: "tabs.home", icon: Package },
  { route: "/(tabs)/marketplace", labelKey: "tabs.marketplace", icon: Package },
  { route: "/(tabs)/stores", labelKey: "tabs.stores", icon: Store },
  { route: "/(tabs)/upload", labelKey: "tabs.upload", icon: PackagePlus },
  { route: "/(tabs)/services", labelKey: "tabs.services", icon: ScanBarcode },
  { route: "/(tabs)/education", labelKey: "tabs.education", icon: BookCheck },
];

const supportMenuItems: MenuItem[] = [
  { route: "/(tabs)/help", labelKey: "tabs.help", icon: BookCheck },
  { route: "/(tabs)/contact", labelKey: "tabs.contact", icon: User },
];

export default function Drawer() {
  const { isOpen, closeDrawer } = useDrawer();
  const { t } = useTranslation();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const progress = useSharedValue(0);
  const isAuthenticated = useIsAuthenticated();
  const canUpload = useHasRole("store", "service", "admin");
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const isDark = colorScheme === "dark";

  const visibleMenuItems = menuItems.filter((item) => {
    if (item.route === "/(tabs)/upload") return canUpload;
    return true;
  });

  useEffect(() => {
    progress.value = withTiming(isOpen ? 1 : 0, {
      duration: 300,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
  }, [isOpen, progress]);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [0, 0.3]),
    pointerEvents: progress.value > 0 ? "auto" : "none",
  }));

  const drawerStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(progress.value, [0, 1], [DRAWER_WIDTH, 0]),
      },
    ],
  }));

  const handleNavigate = (route: string) => {
    closeDrawer();
    router.push(route as any);
  };

  return (
    <>
      <Animated.View style={[styles.backdrop, backdropStyle]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={closeDrawer} />
      </Animated.View>

      <Animated.View
        style={[
          styles.drawer,
          drawerStyle,
          { backgroundColor: isDark ? "#1a1a1a" : "#ffffff" },
        ]}
      >
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: Colors.primary }]}>
            EKORU
          </Text>
          <Pressable onPress={closeDrawer} hitSlop={8}>
            <X size={24} color={isDark ? "#fff" : "#333"} />
          </Pressable>
        </View>

        {isAuthenticated && user && (
          <View style={styles.userSection}>
            <View style={styles.userAvatar}>
              <Text style={styles.userInitials}>
                {user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
              </Text>
            </View>
            <View>
              <Text style={[styles.userName, { color: isDark ? "#fff" : "#1f2937" }]}>
                {user.name}
              </Text>
              <Text style={styles.userEmail}>{user.email}</Text>
            </View>
          </View>
        )}

        {isAuthenticated && (
          <View style={styles.menuList}>
            {profileMenuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Pressable
                  key={item.route}
                  style={styles.menuItem}
                  onPress={() => handleNavigate(item.route)}
                >
                  <Icon size={22} strokeWidth={1.5} color={isDark ? "#fff" : "#333"} />
                  <Text style={[styles.menuLabel, { color: isDark ? "#fff" : "#333" }]}>
                    {t(item.labelKey)}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        )}

        <View style={styles.menuList}>
          {visibleMenuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Pressable
                key={item.route}
                style={styles.menuItem}
                onPress={() => handleNavigate(item.route)}
              >
                <Icon size={22} strokeWidth={1.5} color={isDark ? "#fff" : "#333"} />
                <Text style={[styles.menuLabel, { color: isDark ? "#fff" : "#333" }]}>
                  {t(item.labelKey)}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.menuList}>
          {supportMenuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Pressable
                key={item.route}
                style={styles.menuItem}
                onPress={() => handleNavigate(item.route)}
              >
                <Icon size={22} strokeWidth={1.5} color={isDark ? "#fff" : "#333"} />
                <Text style={[styles.menuLabel, { color: isDark ? "#fff" : "#333" }]}>
                  {t(item.labelKey)}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={{ padding: 20 }}>
          {isAuthenticated ? (
            <MainButton
              text="Log Out"
              onPress={async () => {
                await logout();
                closeDrawer();
                router.replace("/(tabs)");
              }}
            />
          ) : (
            <MainButton text="Login" onPress={() => handleNavigate("/(auth)")} />
          )}
        </View>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#000",
    zIndex: 100,
  },
  drawer: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    zIndex: 101,
    shadowColor: "#000",
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
  },
  menuList: {
    paddingTop: 12,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    gap: 14,
  },
  menuLabel: {
    fontSize: 16,
  },
  userSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#e5e5e5",
  },
  userAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  userInitials: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
  },
  userEmail: {
    fontSize: 13,
    color: "#6b7280",
  },
});
