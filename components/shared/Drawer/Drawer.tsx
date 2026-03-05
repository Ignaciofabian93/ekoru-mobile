import { useRouter } from "expo-router";
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
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
  type LucideIcon,
} from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dimensions,
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

import Colors from "@/constants/Colors";
import { useDrawer } from "@/context/DrawerContext";
import useAuthStore, {
  useDisplayName,
  useInitials,
  useProfileImage,
} from "@/store/useAuthStore";
import { useDrawerMarketplace } from "./hooks/useDrawerMarketplace";

import "./i18n";
import { NAMESPACE } from "./i18n";
import { Title } from "../Title/Title";
import MainButton from "../Button/MainButton";

const SCREEN_WIDTH = Dimensions.get("window").width;
const DRAWER_WIDTH = SCREEN_WIDTH * 0.82;

// ── Accordion data types ──────────────────────────────────────────────────────
// Mirrors types/product.ts and types/catalog.ts structures
type L3Item = { label: string; route: string };
type L2Item = { label: string; route: string; children?: L3Item[] };
type L1Item = { label: string; route: string; children?: L2Item[] };

type AccordionSectionDef = {
  key: string;
  tKey: string;
  icon: LucideIcon;
  baseRoute: string;
  items: L1Item[];
};

// ── Marketplace: populated from API — see useDrawerMarketplace.ts ─────────────
// Kept as fallback while the query is loading or returns empty
const MARKETPLACE_ITEMS_FALLBACK: L1Item[] = [
  {
    label: "Electronics",
    route: "/(tabs)/marketplace?dept=electronics",
    children: [
      {
        label: "Mobile & Tablets",
        route: "/(tabs)/marketplace?deptCat=mobile-tablets",
        children: [
          {
            label: "Smartphones",
            route: "/(tabs)/marketplace?cat=smartphones",
          },
          { label: "Tablets", route: "/(tabs)/marketplace?cat=tablets" },
          {
            label: "Accessories",
            route: "/(tabs)/marketplace?cat=mobile-accessories",
          },
        ],
      },
      {
        label: "Computers",
        route: "/(tabs)/marketplace?deptCat=computers",
        children: [
          { label: "Laptops", route: "/(tabs)/marketplace?cat=laptops" },
          { label: "Desktops", route: "/(tabs)/marketplace?cat=desktops" },
        ],
      },
    ],
  },
  {
    label: "Clothing",
    route: "/(tabs)/marketplace?dept=clothing",
    children: [
      {
        label: "Men",
        route: "/(tabs)/marketplace?deptCat=mens-clothing",
        children: [
          { label: "Shirts", route: "/(tabs)/marketplace?cat=shirts" },
          { label: "Pants", route: "/(tabs)/marketplace?cat=pants" },
          { label: "Shoes", route: "/(tabs)/marketplace?cat=mens-shoes" },
        ],
      },
      {
        label: "Women",
        route: "/(tabs)/marketplace?deptCat=womens-clothing",
        children: [
          { label: "Dresses", route: "/(tabs)/marketplace?cat=dresses" },
          { label: "Tops", route: "/(tabs)/marketplace?cat=tops" },
          { label: "Shoes", route: "/(tabs)/marketplace?cat=womens-shoes" },
        ],
      },
    ],
  },
  {
    label: "Home & Garden",
    route: "/(tabs)/marketplace?dept=home-garden",
    children: [
      {
        label: "Furniture",
        route: "/(tabs)/marketplace?deptCat=furniture",
        children: [
          { label: "Sofas", route: "/(tabs)/marketplace?cat=sofas" },
          { label: "Tables", route: "/(tabs)/marketplace?cat=tables" },
        ],
      },
      {
        label: "Decor",
        route: "/(tabs)/marketplace?deptCat=decor",
        children: [
          { label: "Lighting", route: "/(tabs)/marketplace?cat=lighting" },
          { label: "Art", route: "/(tabs)/marketplace?cat=art" },
        ],
      },
    ],
  },
];

// ── Stores: StoreCategory > StoreSubCategory ──────────────────────────────────
const STORES_ITEMS: L1Item[] = [
  {
    label: "Food & Beverages",
    route: "/(tabs)/stores?cat=food",
    children: [
      { label: "Organic", route: "/(tabs)/stores?sub=organic" },
      { label: "Bulk", route: "/(tabs)/stores?sub=bulk" },
      { label: "Local Produce", route: "/(tabs)/stores?sub=local-produce" },
    ],
  },
  {
    label: "Clothing",
    route: "/(tabs)/stores?cat=clothing",
    children: [
      { label: "Vintage", route: "/(tabs)/stores?sub=vintage" },
      { label: "Handmade", route: "/(tabs)/stores?sub=handmade" },
      { label: "Upcycled", route: "/(tabs)/stores?sub=upcycled" },
    ],
  },
  {
    label: "Home & Garden",
    route: "/(tabs)/stores?cat=home",
    children: [
      { label: "Furniture", route: "/(tabs)/stores?sub=furniture" },
      { label: "Plants", route: "/(tabs)/stores?sub=plants" },
    ],
  },
];

// ── Services: ServiceCategory > ServiceSubCategory ────────────────────────────
const SERVICES_ITEMS: L1Item[] = [
  {
    label: "Repair",
    route: "/(tabs)/services?cat=repair",
    children: [
      {
        label: "Electronics",
        route: "/(tabs)/services?sub=electronics-repair",
      },
      { label: "Clothing", route: "/(tabs)/services?sub=clothing-repair" },
      { label: "Furniture", route: "/(tabs)/services?sub=furniture-repair" },
    ],
  },
  {
    label: "Education",
    route: "/(tabs)/services?cat=education",
    children: [
      { label: "Tutoring", route: "/(tabs)/services?sub=tutoring" },
      { label: "Workshops", route: "/(tabs)/services?sub=workshops" },
    ],
  },
  {
    label: "Logistics",
    route: "/(tabs)/services?cat=logistics",
    children: [
      { label: "Delivery", route: "/(tabs)/services?sub=delivery" },
      { label: "Moving", route: "/(tabs)/services?sub=moving" },
    ],
  },
];

// ── Community: CommunityCategory > CommunitySubCategory (2 levels) ────────────
const COMMUNITY_ITEMS: L1Item[] = [
  {
    label: "Events",
    route: "/(tabs)/community?cat=events",
    children: [
      { label: "Workshops", route: "/(tabs)/community?sub=workshops" },
      { label: "Fairs", route: "/(tabs)/community?sub=fairs" },
      { label: "Talks", route: "/(tabs)/community?sub=talks" },
    ],
  },
  {
    label: "Forums",
    route: "/(tabs)/community?cat=forums",
    children: [
      { label: "General", route: "/(tabs)/community?sub=general" },
      {
        label: "Sustainability",
        route: "/(tabs)/community?sub=sustainability",
      },
    ],
  },
];

// ── Blog: BlogCategories flat list (1 level) ──────────────────────────────────
const BLOG_ITEMS: L1Item[] = [
  { label: "Recycling", route: "/(tabs)/blog?topic=recycling" },
  { label: "Sustainability", route: "/(tabs)/blog?topic=sustainability" },
  { label: "Circular Economy", route: "/(tabs)/blog?topic=circular-economy" },
  { label: "Eco Tips", route: "/(tabs)/blog?topic=eco-tips" },
  { label: "Environment", route: "/(tabs)/blog?topic=environment" },
  { label: "Upcycling", route: "/(tabs)/blog?topic=upcycling" },
  {
    label: "Responsible Consumption",
    route: "/(tabs)/blog?topic=responsible-consumption",
  },
];

// Built inside the component so marketplace items come from the API.
// Other sections keep static data until their DB is populated.
const STATIC_SECTIONS: Omit<AccordionSectionDef, "items">[] = [
  { key: "stores", tKey: "stores", icon: Store, baseRoute: "/(tabs)/stores" },
  {
    key: "services",
    tKey: "services",
    icon: ScanBarcode,
    baseRoute: "/(tabs)/services",
  },
  {
    key: "community",
    tKey: "community",
    icon: MessageSquare,
    baseRoute: "/(tabs)/community",
  },
  { key: "blog", tKey: "blog", icon: BookOpen, baseRoute: "/(tabs)/blog" },
];

const STATIC_ITEMS: Record<string, L1Item[]> = {
  stores: STORES_ITEMS,
  services: SERVICES_ITEMS,
  community: COMMUNITY_ITEMS,
  blog: BLOG_ITEMS,
};

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

// ── AccordionContent ──────────────────────────────────────────────────────────
// Children are NOT mounted until the accordion is opened for the first time.
// This avoids rendering all nested rows (each with their own Reanimated shared
// values) while the section is still collapsed, which was the main render cost.
// After first open, children stay mounted so re-open is instant.
function AccordionContent({
  isOpen,
  children,
}: {
  isOpen: boolean;
  children: React.ReactNode;
}) {
  const [hasEverOpened, setHasEverOpened] = useState(false);
  const height = useSharedValue(0);

  useEffect(() => {
    if (isOpen) setHasEverOpened(true);
    height.value = withTiming(isOpen ? 800 : 0, {
      duration: 220,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
  }, [isOpen, height]);

  const animStyle = useAnimatedStyle(() => ({
    maxHeight: height.value,
    overflow: "hidden",
  }));

  if (!hasEverOpened) return null;

  return <Animated.View style={animStyle}>{children}</Animated.View>;
}

// ── AccordionSection (top-level with icon) ────────────────────────────────────
function AccordionSection({
  section,
  onNavigate,
}: {
  section: AccordionSectionDef;
  onNavigate: (route: string) => void;
}) {
  const { t } = useTranslation(NAMESPACE);
  const [isOpen, setIsOpen] = useState(false);
  const Icon = section.icon;
  const chevron = useSharedValue(0);

  useEffect(() => {
    chevron.value = withTiming(isOpen ? 1 : 0, { duration: 200 });
  }, [isOpen, chevron]);

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${interpolate(chevron.value, [0, 1], [0, 180])}deg` },
    ],
  }));

  return (
    <View>
      <View style={[styles.menuItem, styles.menuItemBorder]}>
        <Pressable
          style={styles.rowMain}
          onPress={() => onNavigate(section.baseRoute)}
        >
          <View style={styles.iconWrap}>
            <Icon size={18} strokeWidth={1.5} color={Colors.primary} />
          </View>
          <Text style={styles.menuLabel}>{t(section.tKey)}</Text>
        </Pressable>
        <Pressable
          onPress={() => setIsOpen((v) => !v)}
          hitSlop={8}
          style={styles.chevronBtn}
        >
          <Animated.View style={chevronStyle}>
            <ChevronDown size={16} color="#9ca3af" strokeWidth={2} />
          </Animated.View>
        </Pressable>
      </View>

      <AccordionContent isOpen={isOpen}>
        {section.items.map((item, i) => (
          <AccordionL1Row
            key={item.route}
            item={item}
            isLast={i === section.items.length - 1}
            onNavigate={onNavigate}
          />
        ))}
      </AccordionContent>
    </View>
  );
}

// ── AccordionL1Row (Department / StoreCategory / etc.) ───────────────────────
function AccordionL1Row({
  item,
  isLast,
  onNavigate,
}: {
  item: L1Item;
  isLast: boolean;
  onNavigate: (route: string) => void;
}) {
  const hasChildren = !!item.children?.length;
  const [isOpen, setIsOpen] = useState(false);
  const chevron = useSharedValue(0);

  useEffect(() => {
    chevron.value = withTiming(isOpen ? 1 : 0, { duration: 200 });
  }, [isOpen, chevron]);

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${interpolate(chevron.value, [0, 1], [0, 90])}deg` },
    ],
  }));

  return (
    <View>
      <View
        style={[styles.l1Row, (!isLast || isOpen) && styles.menuItemBorder]}
      >
        <Pressable
          style={styles.rowMain}
          onPress={() => onNavigate(item.route)}
        >
          <Text style={styles.l1Label}>{item.label}</Text>
        </Pressable>
        {hasChildren && (
          <Pressable
            onPress={() => setIsOpen((v) => !v)}
            hitSlop={8}
            style={styles.chevronBtn}
          >
            <Animated.View style={chevronStyle}>
              <ChevronRight size={14} color="#9ca3af" strokeWidth={2} />
            </Animated.View>
          </Pressable>
        )}
      </View>

      {hasChildren && (
        <AccordionContent isOpen={isOpen}>
          {item.children!.map((l2, i) => (
            <AccordionL2Row
              key={l2.route}
              item={l2}
              isLast={i === item.children!.length - 1}
              onNavigate={onNavigate}
            />
          ))}
        </AccordionContent>
      )}
    </View>
  );
}

// ── AccordionL2Row (DepartmentCategory / StoreSubCategory / etc.) ─────────────
function AccordionL2Row({
  item,
  isLast,
  onNavigate,
}: {
  item: L2Item;
  isLast: boolean;
  onNavigate: (route: string) => void;
}) {
  const hasChildren = !!item.children?.length;
  const [isOpen, setIsOpen] = useState(false);
  const chevron = useSharedValue(0);

  useEffect(() => {
    chevron.value = withTiming(isOpen ? 1 : 0, { duration: 200 });
  }, [isOpen, chevron]);

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${interpolate(chevron.value, [0, 1], [0, 90])}deg` },
    ],
  }));

  return (
    <View>
      <View
        style={[styles.l2Row, (!isLast || isOpen) && styles.menuItemBorder]}
      >
        <Pressable
          style={styles.rowMain}
          onPress={() => onNavigate(item.route)}
        >
          <Text style={styles.l2Label}>{item.label}</Text>
        </Pressable>
        {hasChildren && (
          <Pressable
            onPress={() => setIsOpen((v) => !v)}
            hitSlop={8}
            style={styles.chevronBtn}
          >
            <Animated.View style={chevronStyle}>
              <ChevronRight size={13} color="#b0b8c4" strokeWidth={2} />
            </Animated.View>
          </Pressable>
        )}
      </View>

      {hasChildren && (
        <AccordionContent isOpen={isOpen}>
          {item.children!.map((l3, i) => (
            <Pressable
              key={l3.route}
              style={[
                styles.l3Row,
                i < item.children!.length - 1 && styles.menuItemBorder,
              ]}
              onPress={() => onNavigate(l3.route)}
            >
              <Text style={styles.l3Label}>{l3.label}</Text>
            </Pressable>
          ))}
        </AccordionContent>
      )}
    </View>
  );
}

// ── SectionLabel ──────────────────────────────────────────────────────────────
function SectionLabel({ label }: { label: string }) {
  return (
    <Title level="h6" weight="semibold" style={styles.sectionLabel}>
      {label}
    </Title>
  );
}

// ── MenuRow ───────────────────────────────────────────────────────────────────
function MenuRow({
  icon: Icon,
  label,
  onPress,
  hasBorder,
}: {
  icon: LucideIcon;
  label: string;
  onPress: () => void;
  hasBorder: boolean;
}) {
  return (
    <Pressable
      style={[styles.menuItem, hasBorder && styles.menuItemBorder]}
      onPress={onPress}
    >
      <View style={styles.iconWrap}>
        <Icon size={18} strokeWidth={1.5} color={Colors.primary} />
      </View>
      <Text style={styles.menuLabel}>{label}</Text>
    </Pressable>
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

  // Defer the catalog query until the drawer is opened for the first time.
  // The Drawer is always mounted in the layout tree (just hidden via transform),
  // so calling useQuery unconditionally would fire on every app startup.
  const [hasOpened, setHasOpened] = useState(false);
  useEffect(() => {
    if (isOpen && !hasOpened) setHasOpened(true);
  }, [isOpen, hasOpened]);

  const { items: marketplaceItems } = useDrawerMarketplace(hasOpened);
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
            : MARKETPLACE_ITEMS_FALLBACK,
      },
      ...STATIC_SECTIONS.map((s) => ({ ...s, items: STATIC_ITEMS[s.key] })),
    ],
    [marketplaceItems],
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
                <AccordionSection
                  key={section.key}
                  section={section}
                  onNavigate={handleNavigate}
                />
              ))}
              <MenuRow
                icon={PackagePlus}
                label={t("upload")}
                onPress={() => handleNavigate("/(tabs)/upload")}
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
    paddingBottom: 32,
    gap: 4,
  },

  // User identity
  userSection: {
    flexDirection: "column",
    alignItems: "center",
    gap: 12,
    backgroundColor: `${Colors.secondary}10`,
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

  // Standard menu row
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

  // Accordion shared
  rowMain: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  chevronBtn: {
    paddingHorizontal: 6,
    paddingVertical: 10,
  },

  // L1 row — Department / StoreCategory / ServiceCategory / CommunityCategory / BlogTopic
  l1Row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 11,
    paddingLeft: 18,
    paddingRight: 14,
    backgroundColor: "#f9fafb",
  },
  l1Label: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Cabin_500Medium",
    color: "#374151",
  },

  // L2 row — DepartmentCategory / StoreSubCategory / ServiceSubCategory / CommunitySubCategory
  l2Row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingLeft: 32,
    paddingRight: 14,
    backgroundColor: "#f3f4f6",
  },
  l2Label: {
    flex: 1,
    fontSize: 12,
    fontFamily: "Cabin_400Regular",
    color: "#4b5563",
  },

  // L3 row — ProductCategory
  l3Row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 9,
    paddingLeft: 46,
    paddingRight: 14,
    backgroundColor: "#eef0f3",
  },
  l3Label: {
    flex: 1,
    fontSize: 11,
    fontFamily: "Cabin_400Regular",
    color: "#6b7280",
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
