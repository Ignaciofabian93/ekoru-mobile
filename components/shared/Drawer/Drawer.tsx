import { useRouter } from "expo-router";
import {
  BookCheck,
  HelpCircle,
  House,
  Leaf,
  Mail,
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
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import Colors from "@/constants/Colors";
import { useDrawer } from "@/context/DrawerContext";
import useAuthStore, { useHasSellerType } from "@/store/useAuthStore";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SCREEN_WIDTH = Dimensions.get("window").width;
const DRAWER_WIDTH = SCREEN_WIDTH * 0.82;

const SELLER_TYPE_LABEL: Record<string, string> = {
  PERSON: "Personal Account",
  STARTUP: "Startup",
  COMPANY: "Company",
};

interface MenuItem {
  route: string;
  labelKey: string;
  icon: LucideIcon;
}

const profileMenuItems: MenuItem[] = [
  { route: "/(profile)", labelKey: "profile.profile", icon: User },
  {
    route: "/(profile)/settings",
    labelKey: "profile.settings",
    icon: Settings,
  },
  { route: "/(profile)/orders", labelKey: "profile.orders", icon: Package },
  {
    route: "/(profile)/environmental-impact",
    labelKey: "profile.environmentalImpact",
    icon: Leaf,
  },
];

const exploreMenuItems: MenuItem[] = [
  { route: "/(tabs)", labelKey: "tabs.home", icon: House },
  { route: "/(tabs)/marketplace", labelKey: "tabs.marketplace", icon: Package },
  { route: "/(tabs)/stores", labelKey: "tabs.stores", icon: Store },
  { route: "/(tabs)/upload", labelKey: "tabs.upload", icon: PackagePlus },
  { route: "/(tabs)/services", labelKey: "tabs.services", icon: ScanBarcode },
  { route: "/(tabs)/education", labelKey: "tabs.education", icon: BookCheck },
];

const supportMenuItems: MenuItem[] = [
  { route: "/(tabs)/help", labelKey: "tabs.help", icon: HelpCircle },
  { route: "/(tabs)/contact", labelKey: "tabs.contact", icon: Mail },
];

function SectionLabel({ label }: { label: string }) {
  return <Text style={styles.sectionLabel}>{label}</Text>;
}

export default function Drawer() {
  const { isOpen, closeDrawer } = useDrawer();
  const router = useRouter();
  const progress = useSharedValue(0);
  const canUpload = useHasSellerType("STARTUP", "COMPANY");
  const seller = useAuthStore((s) => s.seller);
  const logout = useAuthStore((s) => s.logout);
  const { t } = useTranslation();

  const { top, bottom } = useSafeAreaInsets();

  function MenuRow({
    item,
    onPress,
    isLast,
  }: {
    item: MenuItem;
    onPress: () => void;
    isLast: boolean;
  }) {
    const Icon = item.icon;
    return (
      <Pressable
        style={[styles.menuItem, !isLast && styles.menuItemBorder]}
        onPress={onPress}
      >
        <View style={styles.iconWrap}>
          <Icon size={18} strokeWidth={1.5} color={Colors.primary} />
        </View>
        <Text style={styles.menuLabel}>{t(item.labelKey)}</Text>
      </Pressable>
    );
  }

  const displayName = seller?.profile
    ? seller.profile.__typename === "PersonProfile"
      ? (seller.profile.displayName ??
        `${seller.profile.firstName}${seller.profile.lastName ? ` ${seller.profile.lastName}` : ""}`)
      : seller.profile.businessName
    : (seller?.email ?? "");

  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const visibleExploreItems = exploreMenuItems.filter((item) => {
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
    opacity: interpolate(progress.value, [0, 1], [0, 0.4]),
    pointerEvents: progress.value > 0 ? "auto" : "none",
  }));

  const drawerStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(progress.value, [0, 1], [DRAWER_WIDTH, 0]) },
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
          { paddingTop: top, paddingBottom: bottom },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t("profile.menu")}</Text>
          <Pressable
            onPress={closeDrawer}
            hitSlop={8}
            style={styles.closeButton}
          >
            <X size={20} color="#6b7280" strokeWidth={2} />
          </Pressable>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* User identity */}
          {seller && (
            <View style={styles.userSection}>
              <View style={styles.userAvatar}>
                <Text style={styles.userInitials}>{initials || "?"}</Text>
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.userName} numberOfLines={1}>
                  {displayName}
                </Text>
                <Text style={styles.userEmail} numberOfLines={1}>
                  {seller.email}
                </Text>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {SELLER_TYPE_LABEL[seller.sellerType]}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Account section */}
          {
            <View style={styles.section}>
              <SectionLabel label="Account" />
              <View style={styles.menuCard}>
                {profileMenuItems.map((item, index) => (
                  <MenuRow
                    key={item.route}
                    item={item}
                    onPress={() => handleNavigate(item.route)}
                    isLast={index === profileMenuItems.length - 1}
                  />
                ))}
              </View>
            </View>
          }

          {/* Explore section */}
          <View style={styles.section}>
            <SectionLabel label="Explore" />
            <View style={styles.menuCard}>
              {visibleExploreItems.map((item, index) => (
                <MenuRow
                  key={item.route}
                  item={item}
                  onPress={() => handleNavigate(item.route)}
                  isLast={index === visibleExploreItems.length - 1}
                />
              ))}
            </View>
          </View>

          {/* Support section */}
          <View style={styles.section}>
            <SectionLabel label="Support" />
            <View style={styles.menuCard}>
              {supportMenuItems.map((item, index) => (
                <MenuRow
                  key={item.route}
                  item={item}
                  onPress={() => handleNavigate(item.route)}
                  isLast={index === supportMenuItems.length - 1}
                />
              ))}
            </View>
          </View>

          {/* Auth action */}
          <View style={styles.authSection}>
            {1 == 1 ? (
              <Pressable
                style={styles.logoutButton}
                onPress={async () => {
                  await logout();
                  closeDrawer();
                  router.replace("/(auth)");
                }}
              >
                <Text style={styles.logoutText}>Log Out</Text>
              </Pressable>
            ) : (
              <Pressable
                style={styles.loginButton}
                onPress={() => handleNavigate("/(auth)")}
              >
                <Text style={styles.loginText}>Log In</Text>
              </Pressable>
            )}
          </View>
        </ScrollView>
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
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16,
    backgroundColor: "#fff",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#e5e7eb",
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: "Cabin_700Bold",
    color: Colors.primary,
    letterSpacing: 1,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
    gap: 4,
  },

  // User identity
  userSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
  },
  userAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  userInitials: {
    fontSize: 18,
    fontFamily: "Cabin_700Bold",
    color: "#fff",
  },
  userInfo: {
    flex: 1,
    gap: 2,
  },
  userName: {
    fontSize: 15,
    fontFamily: "Cabin_700Bold",
    color: "#1f2937",
  },
  userEmail: {
    fontSize: 12,
    fontFamily: "Cabin_400Regular",
    color: "#6b7280",
  },
  badge: {
    alignSelf: "flex-start",
    marginTop: 4,
    backgroundColor: `${Colors.primary}22`,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 11,
    fontFamily: "Cabin_600SemiBold",
    color: Colors.primaryDark,
  },

  // Sections
  section: {
    gap: 6,
    marginBottom: 4,
  },
  sectionLabel: {
    fontSize: 11,
    fontFamily: "Cabin_600SemiBold",
    color: "#9ca3af",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginLeft: 4,
    marginTop: 8,
  },
  menuCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 13,
    paddingHorizontal: 14,
    gap: 12,
  },
  menuItemBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#e5e7eb",
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: `${Colors.primary}18`,
    alignItems: "center",
    justifyContent: "center",
  },
  menuLabel: {
    fontSize: 14,
    fontFamily: "Cabin_500Medium",
    color: "#1f2937",
  },

  // Auth
  authSection: {
    marginTop: 12,
  },
  logoutButton: {
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: "#fee2e2",
    alignItems: "center",
  },
  logoutText: {
    fontSize: 14,
    fontFamily: "Cabin_600SemiBold",
    color: "#dc2626",
  },
  loginButton: {
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: "center",
  },
  loginText: {
    fontSize: 14,
    fontFamily: "Cabin_600SemiBold",
    color: "#fff",
  },
});
