import { Text } from "@/components/Primitives/Text/Text";
import { colors } from "@/design/tokens";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { type Plan } from "../../constants/subscriptions";
import PlanCard from "./PlanCard";
import { NAMESPACE } from "./i18n";

interface PlanListProps {
  displayPlans: Plan[];
  currentPlanKey: string;
  isLoading: boolean;
  handleSelectPlan: (planKey: string) => void;
}

export default function PlanList({
  displayPlans,
  currentPlanKey,
  isLoading,
  handleSelectPlan,
}: PlanListProps): ReactNode {
  const { t } = useTranslation(NAMESPACE);

  if (isLoading) {
    return (
      <View style={styles.loadingRow}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  }

  if (displayPlans.length === 0) {
    return (
      <View style={styles.loadingRow}>
        <Text>{t("noPlansAvailable")}</Text>
      </View>
    );
  }

  return (
    <View style={styles.plansContainer}>
      {displayPlans.map((plan) => (
        <PlanCard
          key={plan.key}
          plan={plan}
          isCurrent={plan.key === currentPlanKey}
          disabled={isLoading}
          onSelect={() => handleSelectPlan(plan.key)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 20,
    justifyContent: "center",
  },
  plansContainer: {
    gap: 12,
  },
});
