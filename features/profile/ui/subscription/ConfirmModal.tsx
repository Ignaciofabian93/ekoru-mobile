import { Text } from "@/components/Primitives/Text/Text";
import { borderRadius, colors, fontFamily, fontSize, shadows } from "@/design/tokens";
import { ShieldCheck, X } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Modal, Pressable, StyleSheet, View } from "react-native";
import type { Plan } from "../../constants/subscriptions";
import type { BillingCycle } from "../../hooks/useSubscription";
import { NAMESPACE } from "./i18n";

interface ConfirmModalProps {
  pendingPlan: Plan;
  billingCycle: BillingCycle;
  subscribing: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Confirms a paid plan before handing off to Webpay (MOB-2). The app never
 * takes card details: the payment happens on Webpay, and the plan turns on
 * once the backend confirms it.
 */
export default function ConfirmModal({
  pendingPlan,
  billingCycle,
  subscribing,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const { t } = useTranslation(NAMESPACE);

  const billingLabel =
    billingCycle === "monthly" ? t("confirmModal.billedMonthly") : t("confirmModal.billedYearly");

  return (
    <Modal visible transparent animationType="slide" statusBarTranslucent onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onCancel} />

        <View style={styles.sheet}>
          <View style={styles.handle} />

          <View style={styles.header}>
            <Text style={styles.title}>{t("confirmModal.title")}</Text>
            <Pressable onPress={onCancel} hitSlop={12}>
              <X size={20} color={colors.foregroundSecondary} strokeWidth={2} />
            </Pressable>
          </View>

          <View style={styles.content}>
            <View style={styles.planSummary}>
              <Text style={styles.upgradingLabel}>{t("confirmModal.upgradingTo")}</Text>
              <Text style={styles.planName}>{pendingPlan.label}</Text>
              <Text style={styles.planPrice}>
                {pendingPlan.price}
                {pendingPlan.period} · {billingLabel}
              </Text>
            </View>

            <View style={styles.note}>
              <ShieldCheck size={18} color={colors.primaryDark} strokeWidth={1.8} />
              <Text style={styles.noteText}>{t("confirmModal.webpayNote")}</Text>
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.subscribeButton,
                pressed && styles.subscribeButtonPressed,
                subscribing && styles.subscribeButtonDisabled,
              ]}
              onPress={onConfirm}
              disabled={subscribing}
            >
              {subscribing ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.subscribeButtonText}>
                  {t("confirmModal.subscribe", { plan: pendingPlan.label })}
                </Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: borderRadius["2xl"],
    borderTopRightRadius: borderRadius["2xl"],
    ...shadows.xl,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.foregroundMuted,
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 4,
  },

  // ── Header ─────────────────────────────────────────────────────────────────
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.borderLight,
  },
  title: {
    fontSize: fontSize.lg,
    fontFamily: fontFamily.bold,
    color: colors.foreground,
  },

  // ── Content ────────────────────────────────────────────────────────────────
  content: {
    padding: 20,
    paddingBottom: 36,
    gap: 16,
  },
  planSummary: {
    gap: 3,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: `${colors.primaryDark}30`,
    ...shadows.md,
  },
  upgradingLabel: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.semibold,
    color: colors.primaryDark,
  },
  planName: {
    fontSize: fontSize.xl,
    fontFamily: fontFamily.bold,
    color: colors.foreground,
  },
  planPrice: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.regular,
    color: colors.foregroundSecondary,
  },
  note: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    padding: 14,
    borderRadius: borderRadius.lg,
    backgroundColor: `${colors.primary}12`,
  },
  noteText: {
    flex: 1,
    fontSize: fontSize.sm,
    fontFamily: fontFamily.regular,
    color: colors.foregroundSecondary,
  },

  // ── Subscribe button ───────────────────────────────────────────────────────
  subscribeButton: {
    paddingVertical: 15,
    borderRadius: borderRadius.lg,
    alignItems: "center",
    backgroundColor: colors.primary,
  },
  subscribeButtonPressed: {
    opacity: 0.85,
  },
  subscribeButtonDisabled: {
    opacity: 0.5,
  },
  subscribeButtonText: {
    fontSize: fontSize.base,
    fontFamily: fontFamily.bold,
    color: colors.onPrimary,
  },
});
