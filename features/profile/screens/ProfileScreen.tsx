import Colors from "@/constants/Colors";
import useAuthStore, { useSeller } from "@/store/useAuthStore";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  BadgeCheck,
  ChevronRight,
  Flag,
  Globe,
  Heart,
  KeyRound,
  Leaf,
  MapPin,
  MapPinCheck,
  PackageSearch,
  Phone,
  Pin,
  Settings,
  Star,
  UserPen,
  Gem,
  type LucideIcon,
} from "lucide-react-native";
import React, { useEffect } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import "../i18n";
import { NAMESPACE } from "../i18n";

interface MenuRow {
  label: string;
  icon: LucideIcon;
  route: string;
}

const AVATAR_SIZE = 120;
const COVER_HEIGHT = 200;
const AVATAR_PROTRUDE = AVATAR_SIZE / 2;

function DetailRow({
  icon: Icon,
  label,
  value,
  last = false,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <View style={[styles.detailRow, !last && styles.detailRowBorder]}>
      <View style={styles.detailIconWrap}>
        <Icon size={16} strokeWidth={1.5} color={Colors.primary} />
      </View>
      <View style={styles.detailContent}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value}</Text>
      </View>
    </View>
  );
}

export default function ProfileScreen() {
  const router = useRouter();
  const seller = useSeller();
  const logout = useAuthStore((s) => s.logout);
  const { bottom } = useSafeAreaInsets();
  const { t } = useTranslation(NAMESPACE);

  const menuRows: MenuRow[] = [
    { label: t("editProfile"), icon: UserPen, route: "/(profile)/edit-profile" },
    { label: t("changePassword"), icon: KeyRound, route: "/(profile)/change-password" },
    { label: t("orderHistory"), icon: PackageSearch, route: "/(profile)/order-history" },
    { label: t("favorites"), icon: Heart, route: "/(profile)/favorites" },
    { label: t("environmentalImpact"), icon: Leaf, route: "/(profile)/environmental-impact" },
    { label: t("subscription"), icon: Gem, route: "/(profile)/subscription" },
    { label: t("settings"), icon: Settings, route: "/(profile)/settings" },
  ];

  const SELLER_TYPE_LABEL: Record<string, string> = {
    PERSON: t("sellerType_PERSON"),
    STARTUP: t("sellerType_STARTUP"),
    COMPANY: t("sellerType_COMPANY"),
  };

  const SUBSCRIPTION_LABEL: Record<string, string> = {
    FREEMIUM: t("plan_FREEMIUM"),
    BASIC: t("plan_BASIC"),
    ADVANCED: t("plan_ADVANCED"),
    STARTUP: t("plan_STARTUP"),
    EXPERT: t("plan_EXPERT"),
  };

  useEffect(() => {
    if (!seller) {
      router.replace("/(auth)");
    }
  }, [seller]);

  if (!seller) {
    return null;
  }

  const profile = seller.profile;
  const isPersonProfile = profile?.__typename === "PersonProfile";

  const displayName = profile
    ? isPersonProfile
      ? (profile.displayName ??
        `${profile.firstName}${profile.lastName ? ` ${profile.lastName}` : ""}`)
      : profile.businessName
    : seller.email;

  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const profileImage = isPersonProfile
    ? profile?.profileImage
    : (profile as any)?.logo;
  const coverImage = profile?.coverImage;

  const subscriptionPlan = isPersonProfile
    ? (profile as any)?.personSubscriptionPlan
    : (profile as any)?.businessSubscriptionPlan;

  const countyLine = [seller.county?.county];
  const cityLine = [seller.city?.city];
  const regionLine = [seller.region?.region];
  const countryLine = [seller.country?.country];

  const detailItems = [
    subscriptionPlan && {
      icon: BadgeCheck,
      label: t("subscription"),
      value: SUBSCRIPTION_LABEL[subscriptionPlan] ?? subscriptionPlan,
    },
    seller.phone && { icon: Phone, label: t("phone"), value: seller.phone },
    seller.address && { icon: Pin, label: t("address"), value: seller.address },
    countyLine && { icon: MapPin, label: t("county"), value: countyLine },
    cityLine && { icon: MapPinCheck, label: t("city"), value: cityLine },
    regionLine && { icon: Flag, label: t("region"), value: regionLine },
    countryLine && { icon: Globe, label: t("country"), value: countryLine },
  ].filter(Boolean) as { icon: LucideIcon; label: string; value: string }[];

  return (
    <View style={[styles.outerContainer, { paddingBottom: bottom }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.container}
      >
        {/* Cover + overlapping avatar */}
        <View style={styles.headerContainer}>
          {coverImage ? (
            <Image
              source={{ uri: coverImage }}
              style={styles.cover}
              resizeMode="cover"
            />
          ) : (
            <LinearGradient
              colors={["#0c4a6e", "#0369a1", "#0891b2", "#67e8f9"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.coverFallback}
            >
              <Image
                source={require("@/assets/images/logo.png")}
                style={styles.coverLogo}
                resizeMode="contain"
              />
            </LinearGradient>
          )}
          <View style={styles.avatarAbsolute}>
            {profileImage ? (
              <Image
                source={{ uri: profileImage }}
                style={styles.avatarImage}
              />
            ) : (
              <View style={styles.avatarFallback}>
                <Text style={styles.avatarText}>{initials}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Identity */}
        <View style={styles.identitySection}>
          <Text style={styles.name}>{displayName}</Text>
          <Text style={styles.email}>{seller.email}</Text>

          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {SELLER_TYPE_LABEL[seller.sellerType]}
              </Text>
            </View>
            {seller.sellerLevel && (
              <View style={[styles.badge, styles.badgeLevel]}>
                <Star size={11} color="#a16207" strokeWidth={2} />
                <Text style={[styles.badgeText, styles.badgeLevelText]}>
                  {seller.sellerLevel.levelName}
                </Text>
              </View>
            )}
          </View>

          {seller.points > 0 && (
            <Text style={styles.points}>{seller.points} pts</Text>
          )}
        </View>

        {/* Profile Details */}
        {detailItems.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>{t("details")}</Text>
            <View style={styles.detailsCard}>
              {detailItems.map((item, index) => (
                <DetailRow
                  key={item.label}
                  icon={item.icon}
                  label={item.label}
                  value={item.value}
                  last={index === detailItems.length - 1}
                />
              ))}
            </View>
          </>
        )}

        {/* Navigation menu */}
        <Text style={styles.sectionTitle}>{t("account")}</Text>
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
                  <View style={styles.iconWrap}>
                    <Icon size={18} strokeWidth={1.5} color={Colors.primary} />
                  </View>
                  <Text style={styles.menuRowLabel}>{row.label}</Text>
                </View>
                <ChevronRight size={18} color="#9ca3af" strokeWidth={1.5} />
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
          <Text style={styles.logoutText}>{t("logOut")}</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scroll: {
    flex: 1,
  },
  container: {},
  // ── Cover + Avatar ──────────────────────────────────────────────────────────
  headerContainer: {
    height: COVER_HEIGHT,
    marginBottom: AVATAR_PROTRUDE + 16,
  },
  cover: {
    width: "100%",
    height: COVER_HEIGHT,
  },
  coverFallback: {
    height: COVER_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  coverLogo: {
    width: 120,
    height: 60,
    opacity: 0.25,
  },
  avatarAbsolute: {
    position: "absolute",
    bottom: -AVATAR_PROTRUDE,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  avatarImage: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    borderWidth: 3,
    borderColor: "#fff",
  },
  avatarFallback: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: Colors.primary,
    borderWidth: 3,
    borderColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 28,
    fontFamily: "Cabin_700Bold",
    color: "#fff",
  },
  // ── Identity ────────────────────────────────────────────────────────────────
  identitySection: {
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  name: {
    fontSize: 22,
    fontFamily: "Cabin_700Bold",
    color: "#1f2937",
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    fontFamily: "Cabin_400Regular",
    color: "#6b7280",
    marginBottom: 12,
  },
  badgeRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 8,
  },
  badge: {
    backgroundColor: `${Colors.primary}22`,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 12,
    fontFamily: "Cabin_600SemiBold",
    color: Colors.primaryDark,
  },
  badgeLevel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#fef9c3",
  },
  badgeLevelText: {
    color: "#a16207",
  },
  points: {
    fontSize: 13,
    fontFamily: "Cabin_500Medium",
    color: "#9ca3af",
  },
  // ── Section title ───────────────────────────────────────────────────────────
  sectionTitle: {
    fontSize: 12,
    fontFamily: "Cabin_600SemiBold",
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 8,
    marginHorizontal: 20,
  },
  // ── Details card ────────────────────────────────────────────────────────────
  detailsCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    marginHorizontal: 20,
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 13,
    paddingHorizontal: 16,
    gap: 12,
  },
  detailRowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#e5e7eb",
  },
  detailIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: `${Colors.primary}18`,
    alignItems: "center",
    justifyContent: "center",
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 11,
    fontFamily: "Cabin_500Medium",
    color: "#9ca3af",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 1,
  },
  detailValue: {
    fontSize: 14,
    fontFamily: "Cabin_500Medium",
    color: "#1f2937",
  },
  // ── Menu card ───────────────────────────────────────────────────────────────
  menuCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    marginHorizontal: 20,
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
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
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: `${Colors.primary}18`,
    alignItems: "center",
    justifyContent: "center",
  },
  menuRowLabel: {
    fontSize: 15,
    fontFamily: "Cabin_500Medium",
    color: "#1f2937",
  },
  // ── Logout ──────────────────────────────────────────────────────────────────
  logoutButton: {
    marginTop: 24,
    marginHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#fee2e2",
    alignItems: "center",
    marginBottom: 20,
  },
  logoutText: {
    fontSize: 15,
    fontFamily: "Cabin_600SemiBold",
    color: "#dc2626",
  },
});
