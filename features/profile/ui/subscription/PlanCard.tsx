import { Text } from "@/components/Primitives/Text/Text";
import { colors, shadows } from "@/design/tokens";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View } from "react-native";
import { type Plan } from "../../constants/subscriptions";
import { NAMESPACE } from "./i18n";

export default function PlanCard({
  plan,
  isCurrent,
  disabled,
  onSelect,
}: {
  plan: Plan;
  isCurrent: boolean;
  disabled?: boolean;
  onSelect: () => void;
}) {
  const { t } = useTranslation(NAMESPACE);

  const currency = plan.currency ?? "";
  return (
    <View style={[styles.planCard, isCurrent && styles.planCardCurrent]}>
      <View style={styles.planHeader}>
        <Text variant="label" weight="semibold" size="lg">
          {plan.label}
        </Text>
        <View style={styles.priceRow}>
          <Text variant="span" weight="semibold">
            {plan.price} {currency}
          </Text>
          {plan.period ? <Text weight="semibold">{plan.period}</Text> : null}
        </View>
      </View>

      <View style={styles.featureList}>
        {plan.features.map((f) => (
          <View key={f} style={styles.featureRow}>
            <View style={styles.featureDot} />
            <Text variant="p" weight="normal">
              {f}
            </Text>
          </View>
        ))}
      </View>

      {!isCurrent && (
        <Pressable
          style={({ pressed }) => [
            styles.selectButton,
            plan.highlighted && styles.selectButtonHighlighted,
            pressed && styles.selectButtonPressed,
            disabled && styles.selectButtonDisabled,
          ]}
          onPress={onSelect}
          disabled={disabled}
        >
          <Text variant="span" weight="bold" size="sm" color="primary">
            {t("selectPlan")}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  planCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 18,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    overflow: "hidden",
    ...shadows.sm,
  },
  planCardCurrent: {
    borderColor: colors.secondary,
  },
  planHeader: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 2,
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
  selectButtonDisabled: {
    opacity: 0.4,
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
