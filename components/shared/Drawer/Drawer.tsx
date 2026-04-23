import { useRouter } from "expo-router";
import {
  BookOpen,
  HelpCircle,
  House,
  Leaf,
  Mail,
  MessageSquare,
  Package,
  PackagePlus,
  ScanBarcode,
  Settings,
  Store,
  User,
  X,
} from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Image,
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
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors } from "@/design/tokens";
import { useDrawer } from "@/context/DrawerContext";
import useAuthStore, {
  useDisplayName,
  useInitials,
  useProfileImage,
} from "@/store/useAuthStore";
import { useDrawerMarketplace } from "./hooks/useDrawerMarketplace";

import MainButton from "../Button/MainButton";
import { Title } from "../Title/Title";
import { Accordion, type AccordionSectionDef } from "./Accordion";
import MenuRow from "./MenuRow";
import { DRAWER_WIDTH } from "./constants/data";
import { useDrawerBlogs } from "./hooks/useDrawerBlogs";
import { useDrawerCommunity } from "./hooks/useDrawerCommunity";
import { useDrawerServices } from "./hooks/useDrawerServices";
import { useDrawerStores } from "./hooks/useDrawerStores";
import { NAMESPACE } from "./i18n";

const profileMenuItems = [
  { route: "/(profile)", tKey: "profile", icon: User },
  { route: "/(profile)/settings", tKey: "settings", icon: Settings },
  { route: "/(profile)/orders", tKey: "orders", icon: Package },
  {
    route: "/(profile)/environmental-impact",
    tKey: "environmentalImpact",
    icon: Leaf,
  },
];

const supportMenuItems = [
  { route: "/(tabs)/help", tKey: "help", icon: HelpCircle },
  { route: "/(tabs)/contact", tKey: "contact", icon: Mail },
];

// ── SectionLabel ──────────────────────────────────────────────────────────────
function SectionLabel({ label }: { label: string }) {
  return (
    <Title level="h6" weight="semibold" style={styles.sectionLabel}>
      {label}
    </Title>
  );
}

// ── Main Drawer component ─────────────────────────────────────────────────────
export default function Drawer() {
  const { isOpen, closeDrawer } = useDrawer();
  const router = useRouter();
  const profileImage = useProfileImage();
  const seller = useAuthStore((s) => s.seller);
  const logout = useAuthStore((s) => s.logout);
  const { t } = useTranslation(NAMESPACE);
  const { top, bottom } = useSafeAreaInsets();
  const progress = useSharedValue(0);

  const MARKETPLACE_FALLBACK_MESSAGE = {
    label: "No marketplace categories available",
    route: "",
  };

  const STORES_FALLBACK_MESSAGE = {
    label: "No store categories available",
    route: "",
  };

  const SERVICES_FALLBACK_MESSAGE = {
    label: "No service categories available",
    route: "",
  };

  const COMMUNITY_FALLBACK_MESSAGE = {
    label: "No community sections available",
    route: "",
  };

  const BLOG_FALLBACK_MESSAGE = {
    label: "No blog sections available",
    route: "",
  };

  // Defer the catalog query until the drawer is opened for the first time.
  // The Drawer is always mounted in the layout tree (just hidden via transform),
  // so calling useQuery unconditionally would fire on every app startup.
  const [hasOpened, setHasOpened] = useState(false);
  useEffect(() => {
    if (isOpen && !hasOpened) setHasOpened(true);
  }, [isOpen, hasOpened]);

  const { items: marketplaceItems } = useDrawerMarketplace(hasOpened);
  const { items: storeItems } = useDrawerStores(hasOpened);
  const { items: serviceItems } = useDrawerServices(hasOpened);
  const { items: communityItems } = useDrawerCommunity(hasOpened);
  const { items: blogItems } = useDrawerBlogs(hasOpened);
  const displayName = useDisplayName();
  const initials = useInitials();

  const accordionSections = useMemo(
    (): AccordionSectionDef[] => [
      {
        key: "marketplace",
        tKey: "marketplace",
        icon: Package,
        baseRoute: "/(tabs)/marketplace",
        items:
          marketplaceItems.length > 0
            ? marketplaceItems
            : [MARKETPLACE_FALLBACK_MESSAGE],
      },
      {
        key: "stores",
        tKey: "stores",
        icon: Store,
        baseRoute: "/(tabs)/stores",
        items: storeItems.length > 0 ? storeItems : [STORES_FALLBACK_MESSAGE],
      },
      {
        key: "services",
        tKey: "services",
        icon: ScanBarcode,
        baseRoute: "/(tabs)/services",
        items:
          serviceItems.length > 0 ? serviceItems : [SERVICES_FALLBACK_MESSAGE],
      },
      {
        key: "community",
        tKey: "community",
        icon: MessageSquare,
        baseRoute: "/(tabs)/community",
        items:
          communityItems.length > 0
            ? communityItems
            : [COMMUNITY_FALLBACK_MESSAGE],
      },
      {
        key: "blog",
        tKey: "blog",
        icon: BookOpen,
        baseRoute: "/(tabs)/blog",
        items: blogItems.length > 0 ? blogItems : [BLOG_FALLBACK_MESSAGE],
      },
    ],
    [marketplaceItems, storeItems, serviceItems, communityItems, blogItems],
  );

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
          <Text style={styles.headerTitle}>{t("header")}</Text>
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
              {profileImage ? (
                <Image
                  source={{ uri: profileImage }}
                  style={styles.userAvatarImage}
                />
              ) : (
                <View style={styles.userAvatar}>
                  <Text style={styles.userInitials}>{initials || "?"}</Text>
                </View>
              )}
              <View style={styles.userInfo}>
                <Text style={styles.userName} numberOfLines={1}>
                  {displayName}
                </Text>
                <Text style={styles.userEmail} numberOfLines={1}>
                  {seller.email}
                </Text>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {t(`sellerType.${seller.sellerType}`)}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Account section */}
          <View style={styles.section}>
            <SectionLabel label={t("sections.account")} />
            <View style={styles.menuCard}>
              {profileMenuItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <MenuRow
                    key={item.route}
                    icon={Icon}
                    label={t(item.tKey)}
                    onPress={() => handleNavigate(item.route)}
                    hasBorder={index < profileMenuItems.length - 1}
                  />
                );
              })}
            </View>
          </View>

          {/* Explore section */}
          <View style={styles.section}>
            <SectionLabel label={t("sections.explore")} />
            <View style={styles.menuCard}>
              <MenuRow
                icon={House}
                label={t("home")}
                onPress={() => handleNavigate("/(tabs)")}
                hasBorder
              />
              {accordionSections.map((section) => (
                <Accordion
                  key={section.key}
                  section={section}
                  onNavigate={handleNavigate}
                />
              ))}
              <MenuRow
                icon={PackagePlus}
                label={t("upload")}
                onPress={() => handleNavigate("/(tabs)/publish")}
                hasBorder={false}
              />
            </View>
          </View>

          {/* Support section */}
          <View style={styles.section}>
            <SectionLabel label={t("sections.support")} />
            <View style={styles.menuCard}>
              {supportMenuItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <MenuRow
                    key={item.route}
                    icon={Icon}
                    label={t(item.tKey)}
                    onPress={() => handleNavigate(item.route)}
                    hasBorder={index < supportMenuItems.length - 1}
                  />
                );
              })}
            </View>
          </View>

          {/* Auth action */}
          <View style={styles.authSection}>
            {seller ? (
              <MainButton
                variant="error"
                text={t("logOut")}
                style={{ marginHorizontal: 16, marginTop: 12 }}
                onPress={async () => {
                  await logout();
                  closeDrawer();
                  router.replace("/(auth)");
                }}
              />
            ) : (
              <MainButton
                text={t("logIn")}
                style={{ marginHorizontal: 16, marginTop: 12 }}
                onPress={() => handleNavigate("/(auth)")}
              />
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
    color: colors.primary,
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
    paddingBottom: 32,
    gap: 4,
  },

  // User identity
  userSection: {
    flexDirection: "column",
    alignItems: "center",
    gap: 12,
    backgroundColor: `${colors.secondary}10`,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
  },
  userAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  userAvatarImage: {
    width: 130,
    height: 130,
    borderRadius: 65,
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
    backgroundColor: `${colors.primary}22`,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 11,
    fontFamily: "Cabin_600SemiBold",
    color: colors.primaryDark,
  },

  // Sections
  section: {
    gap: 6,
    marginBottom: 4,
    paddingHorizontal: 16,
  },
  sectionLabel: {
    marginLeft: 4,
    marginTop: 8,
  },
  menuCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
  },

  // Auth
  authSection: {
    marginTop: 12,
  },
});
