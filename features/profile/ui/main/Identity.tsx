import { Text } from "@/components/shared/Text/Text";
import { useDisplayName, useSeller } from "@/store/useAuthStore";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { NAMESPACE } from "./i18n";
import Colors from "@/constants/Colors";
import { Star } from "lucide-react-native";

export default function Identity() {
  const { t } = useTranslation(NAMESPACE);
  const seller = useSeller();
  const displayName = useDisplayName();

  if (!seller) return null;

  const SELLER_TYPE_LABEL: Record<string, string> = {
    PERSON: t("sellerType_PERSON"),
    STARTUP: t("sellerType_STARTUP"),
    COMPANY: t("sellerType_COMPANY"),
  };
  return (
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
  );
}

const styles = StyleSheet.create({
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
  badgeRow: { flexDirection: "row", gap: 8, marginBottom: 8 },
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
  badgeLevelText: { color: "#a16207" },
  points: {
    fontSize: 13,
    fontFamily: "Cabin_500Medium",
    color: "#9ca3af",
  },
});
