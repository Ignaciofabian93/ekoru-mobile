import { Text } from "@/components/shared/Text/Text";
import { colors } from "@/design/tokens";
import { BadgeCheck } from "lucide-react-native";
import { Pressable, StyleSheet, View } from "react-native";
import { type Plan } from "../../constants/subscriptions";

export default function PlanCard({
  plan,
  isCurrent,
  onSelect,
}: {
  plan: Plan;
  isCurrent: boolean;
  onSelect: () => void;
}) {
  return (
    <View
      style={[
        styles.planCard,
        plan.highlighted && styles.planCardHighlighted,
        isCurrent && styles.planCardCurrent,
      ]}
    >
      {plan.highlighted && !isCurrent && (
        <View style={styles.popularBadge}>
          <Text style={styles.popularBadgeText}>Most Popular</Text>
        </View>
      )}
      {isCurrent && (
        <View style={[styles.popularBadge, styles.currentBadge]}>
          <BadgeCheck size={11} color={colors.primaryDark} strokeWidth={2.5} />
          <Text style={[styles.popularBadgeText, styles.currentBadgeText]}>Current Plan</Text>
        </View>
      )}

      <View style={styles.planHeader}>
        <Text style={styles.planLabel}>{plan.label}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.planPrice}>{plan.price}</Text>
          {plan.period ? <Text style={styles.planPeriod}>{plan.period}</Text> : null}
        </View>
      </View>

      <View style={styles.featureList}>
        {plan.features.map((f) => (
          <View key={f} style={styles.featureRow}>
            <View style={styles.featureDot} />
            <Text style={styles.featureText}>{f}</Text>
          </View>
        ))}
      </View>

      {!isCurrent && (
        <Pressable
          style={({ pressed }) => [
            styles.selectButton,
            plan.highlighted && styles.selectButtonHighlighted,
            pressed && styles.selectButtonPressed,
          ]}
          onPress={onSelect}
        >
          <Text style={plan.highlighted ? [styles.selectButtonText, styles.selectButtonTextHighlighted] : styles.selectButtonText}>
            {plan.key === "FREEMIUM" ? "Downgrade" : "Upgrade"}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  container: {
    padding: 20,
    paddingBottom: 48,
    gap: 8,
  },

  // Section title
  sectionTitle: {
    fontSize: 12,
    fontFamily: "Cabin_600SemiBold",
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginTop: 16,
    marginBottom: 10,
    marginLeft: 2,
  },

  // ── Current summary ────────────────────────────────────────────────────────
  currentSummaryCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  currentSummaryLeft: {
    gap: 4,
  },
  currentPlanName: {
    fontSize: 20,
    fontFamily: "Cabin_700Bold",
    color: "#1f2937",
  },
  currentPlanPrice: {
    fontSize: 14,
    fontFamily: "Cabin_400Regular",
    color: "#6b7280",
  },
  currentPlanBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: `${colors.primary}18`,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  currentPlanBadgeText: {
    fontSize: 13,
    fontFamily: "Cabin_600SemiBold",
    color: colors.primaryDark,
  },

  // ── Plans ──────────────────────────────────────────────────────────────────
  plansContainer: {
    gap: 12,
  },
  planCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 18,
    borderWidth: 1.5,
    borderColor: "transparent",
    overflow: "hidden",
  },
  planCardHighlighted: {
    borderColor: colors.primary,
  },
  planCardCurrent: {
    borderColor: colors.secondary,
  },
  popularBadge: {
    alignSelf: "flex-start",
    backgroundColor: `${colors.primary}20`,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 12,
  },
  popularBadgeText: {
    fontSize: 11,
    fontFamily: "Cabin_600SemiBold",
    color: colors.primaryDark,
  },
  currentBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: `${colors.secondary}20`,
  },
  currentBadgeText: {
    color: colors.secondaryDark,
  },
  planHeader: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  planLabel: {
    fontSize: 17,
    fontFamily: "Cabin_700Bold",
    color: "#1f2937",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 2,
  },
  planPrice: {
    fontSize: 20,
    fontFamily: "Cabin_700Bold",
    color: colors.primaryDark,
  },
  planPeriod: {
    fontSize: 13,
    fontFamily: "Cabin_400Regular",
    color: "#6b7280",
  },
  featureList: {
    gap: 7,
    marginBottom: 16,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  featureDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  featureText: {
    fontSize: 13,
    fontFamily: "Cabin_400Regular",
    color: "#374151",
  },
  selectButton: {
    paddingVertical: 11,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  selectButtonHighlighted: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  selectButtonPressed: {
    opacity: 0.75,
  },
  selectButtonText: {
    fontSize: 14,
    fontFamily: "Cabin_600SemiBold",
    color: colors.primaryDark,
  },
  selectButtonTextHighlighted: {
    color: "#fff",
  },

  // ── Payment section ────────────────────────────────────────────────────────
  paymentSection: {
    backgroundColor: "#fff",
    borderRadius: 14,
    overflow: "hidden",
  },
  savedCardRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#e5e7eb",
    gap: 12,
  },
  savedCardIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: `${colors.primary}18`,
    alignItems: "center",
    justifyContent: "center",
  },
  savedCardInfo: {
    flex: 1,
    gap: 3,
  },
  savedCardNumber: {
    fontSize: 14,
    fontFamily: "Cabin_600SemiBold",
    color: "#1f2937",
    letterSpacing: 1,
  },
  savedCardExpiry: {
    fontSize: 12,
    fontFamily: "Cabin_400Regular",
    color: "#9ca3af",
  },
  editCardButton: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: `${colors.primary}18`,
  },
  editCardText: {
    fontSize: 13,
    fontFamily: "Cabin_600SemiBold",
    color: colors.primaryDark,
  },
  toggleFormButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 16,
  },
  toggleFormText: {
    fontSize: 14,
    fontFamily: "Cabin_600SemiBold",
    color: colors.primaryDark,
  },
  cardFormWrapper: {
    padding: 16,
    paddingTop: 0,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#e5e7eb",
  },
});
