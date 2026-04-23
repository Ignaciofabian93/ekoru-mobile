import {
  BadgeCheck,
  Flag,
  Globe,
  MapPin,
  MapPinCheck,
  Phone,
  Pin,
  type LucideIcon,
} from "lucide-react-native";
import { NAMESPACE } from "./i18n";
import { useTranslation } from "react-i18next";
import {
  useIsPersonProfile,
  useSeller,
  useSellerProfile,
} from "@/store/useAuthStore";
import { Text } from "@/components/shared/Text/Text";
import { StyleSheet, View } from "react-native";
import { colors } from "@/design/tokens";
import { Title } from "@/components/shared/Title/Title";

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
        <Icon size={16} strokeWidth={1.5} color={colors.primary} />
      </View>
      <View style={styles.detailContent}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value}</Text>
      </View>
    </View>
  );
}

export default function ProfileDetails() {
  const { t } = useTranslation(NAMESPACE);
  const seller = useSeller();
  const profile = useSellerProfile();
  const isPersonProfile = useIsPersonProfile();

  if (!seller || !profile) return null;

  const SUBSCRIPTION_LABEL: Record<string, string> = {
    FREEMIUM: t("plan_FREEMIUM"),
    BASIC: t("plan_BASIC"),
    ADVANCED: t("plan_ADVANCED"),
    STARTUP: t("plan_STARTUP"),
    EXPERT: t("plan_EXPERT"),
  };
  const subscriptionPlan = isPersonProfile
    ? (profile as any)?.personSubscriptionPlan
    : (profile as any)?.businessSubscriptionPlan;

  const detailItems = [
    subscriptionPlan && {
      icon: BadgeCheck,
      label: t("subscription"),
      value: SUBSCRIPTION_LABEL[subscriptionPlan] ?? subscriptionPlan,
    },
    seller.phone && { icon: Phone, label: t("phone"), value: seller.phone },
    seller.address && { icon: Pin, label: t("address"), value: seller.address },
    seller.county?.county && {
      icon: MapPin,
      label: t("county"),
      value: seller.county.county,
    },
    seller.city?.city && {
      icon: MapPinCheck,
      label: t("city"),
      value: seller.city.city,
    },
    seller.region?.region && {
      icon: Flag,
      label: t("region"),
      value: seller.region.region,
    },
    seller.country?.country && {
      icon: Globe,
      label: t("country"),
      value: seller.country.country,
    },
  ].filter(Boolean) as { icon: LucideIcon; label: string; value: string }[];

  return (
    detailItems.length > 0 && (
      <>
        <Title level="h6" weight="semibold" style={styles.sectionTitle}>
          {t("details")}
        </Title>
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
    )
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    marginBottom: 8,
    marginHorizontal: 20,
  },
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
    backgroundColor: `${colors.primary}18`,
    alignItems: "center",
    justifyContent: "center",
  },
  detailContent: { flex: 1 },
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
});
