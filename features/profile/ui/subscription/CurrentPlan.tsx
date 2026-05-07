import { Text } from "@/components/shared/Text/Text";
import { Title } from "@/components/shared/Title/Title";
import { borderRadius, shadows, spacing } from "@/design/tokens";
import { LinearGradient } from "expo-linear-gradient";
import { BadgeCheck } from "lucide-react-native";
import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { type Plan } from "../../constants/subscriptions";
import { NAMESPACE } from "./i18n";

type GradientTriple = [string, string, string];

const PLAN_GRADIENTS: Record<string, GradientTriple> = {
  FREEMIUM: ["#4b5563", "#6b7280", "#4b5563"],
  BASIC: ["#0e7490", "#0891b2", "#0e7490"],
  ADVANCED: ["#365314", "#4d7c0f", "#365314"],
  STARTUP: ["#5b21b6", "#6d28d9", "#5b21b6"],
  EXPERT: ["#92400e", "#b45309", "#92400e"],
};

const DEFAULT_GRADIENT: GradientTriple = ["#374151", "#6b7280", "#374151"];

interface CurrentPlanProps {
  currentPlan: Plan | null;
  isLoading?: boolean;
}

export default function CurrentPlan({ currentPlan, isLoading = false }: CurrentPlanProps) {
  const { t } = useTranslation(NAMESPACE);

  const gradient = currentPlan ? (PLAN_GRADIENTS[currentPlan.key] ?? DEFAULT_GRADIENT) : DEFAULT_GRADIENT;

  return (
    <Fragment>
      <Title level="h6" style={styles.spacing}>
        {t("currentPlan.title")}
      </Title>
      <LinearGradient colors={gradient} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }} style={styles.card}>
        <View style={styles.decorCircle1} />
        <View style={styles.decorCircle2} />
        {isLoading ? (
          <View style={styles.loading}>
            <ActivityIndicator size="small" color="#fff" />
          </View>
        ) : (
          <>
            <View style={styles.details}>
              <Text variant="label" size="xl" weight="bold" style={styles.planName}>
                {currentPlan?.label}
              </Text>
              <Text variant="span" size="sm" style={styles.planPrice}>
                {currentPlan?.price} {currentPlan?.currency}
                {currentPlan?.period}
              </Text>
            </View>

            <View style={styles.statusBadge}>
              <BadgeCheck size={16} color="#fff" strokeWidth={2} />
              <Text variant="label" size="sm" weight="bold" style={styles.statusText}>
                {t("currentPlan.status")}
              </Text>
            </View>
          </>
        )}
      </LinearGradient>
    </Fragment>
  );
}

const styles = StyleSheet.create({
  spacing: {
    marginTop: spacing[10],
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "100%",
    height: 90,
    padding: 20,
    borderRadius: borderRadius.xl,
    marginTop: 12,
    marginBottom: 32,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    overflow: "hidden",
    ...shadows.lg,
  },

  // ── Decorative background circles ──────────────────────────────────────────
  decorCircle1: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(255,255,255,0.07)",
    top: -60,
    right: -40,
  },
  decorCircle2: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255,255,255,0.05)",
    bottom: -50,
    left: -20,
  },

  // ── Content ────────────────────────────────────────────────────────────────
  details: {
    gap: 4,
  },
  planName: {
    color: "#fff",
  },
  planPrice: {
    color: "rgba(255,255,255,0.75)",
  },

  // ── Status badge ───────────────────────────────────────────────────────────
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: borderRadius.full,
  },
  statusText: {
    color: "#fff",
  },
});
