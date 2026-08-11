import PaymentCard, { type CardData } from "@/components/Patterns/PaymentCard/PaymentCard";
import { Text } from "@/components/Primitives/Text/Text";
import { borderRadius, colors, fontFamily, fontSize, shadows } from "@/design/tokens";
import { ChevronDown, ChevronUp, CreditCard, X } from "lucide-react-native";
import type { Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import type { Plan } from "../../constants/subscriptions";
import type { BillingCycle } from "../../hooks/useSubscription";
import { NAMESPACE } from "./i18n";

interface ConfirmModalProps {
  pendingPlan: Plan;
  billingCycle: BillingCycle;
  savedCard: CardData | null;
  showPaymentForm: boolean;
  setShowPaymentForm: Dispatch<SetStateAction<boolean>>;
  subscribing: boolean;
  onSaveCard: (card: CardData) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  pendingPlan,
  billingCycle,
  savedCard,
  showPaymentForm,
  setShowPaymentForm,
  subscribing,
  onSaveCard,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const { t } = useTranslation(NAMESPACE);

  const maskedCard = savedCard ? `•••• •••• •••• ${savedCard.number.slice(-4)}` : null;
  const billingLabel =
    billingCycle === "monthly" ? t("confirmModal.billedMonthly") : t("confirmModal.billedYearly");

  return (
    <Modal visible transparent animationType="slide" statusBarTranslucent onRequestClose={onCancel}>
      <KeyboardAvoidingView style={styles.overlay} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <Pressable style={styles.backdrop} onPress={onCancel} />

        <View style={styles.sheet}>
          <View style={styles.handle} />

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>{t("confirmModal.title")}</Text>
            <Pressable onPress={onCancel} hitSlop={12}>
              <X size={20} color={colors.foregroundSecondary} strokeWidth={2} />
            </Pressable>
          </View>

          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Plan summary */}
            <View style={styles.planSummary}>
              <View style={styles.planSummaryLeft}>
                <Text style={styles.upgradingLabel}>{t("confirmModal.upgradingTo")}</Text>
                <Text style={styles.planName}>{pendingPlan.label}</Text>
                <Text style={styles.planPrice}>
                  {pendingPlan.price}
                  {pendingPlan.period} · {billingLabel}
                </Text>
              </View>
            </View>

            {/* Payment method label */}
            <Text style={styles.sectionLabel}>{t("confirmModal.paymentMethod")}</Text>

            {/* Saved card row */}
            {savedCard && !showPaymentForm && (
              <View style={styles.savedCardRow}>
                <View style={styles.savedCardIcon}>
                  <CreditCard size={20} color={colors.primary} strokeWidth={1.8} />
                </View>
                <View style={styles.savedCardInfo}>
                  <Text style={styles.savedCardNumber}>{maskedCard}</Text>
                  <Text style={styles.savedCardExpiry}>
                    {t("confirmModal.expires")} {savedCard.expiry}
                  </Text>
                </View>
                <Pressable style={styles.editCardButton} onPress={() => setShowPaymentForm(true)}>
                  <Text style={styles.editCardText}>{t("confirmModal.editCard")}</Text>
                </Pressable>
              </View>
            )}

            {/* Card form toggle */}
            <View style={styles.formToggleSection}>
              <Pressable style={styles.toggleButton} onPress={() => setShowPaymentForm((v) => !v)}>
                {showPaymentForm ? (
                  <ChevronUp size={16} color={colors.primaryDark} strokeWidth={2} />
                ) : (
                  <ChevronDown size={16} color={colors.primaryDark} strokeWidth={2} />
                )}
                <Text style={styles.toggleText}>
                  {showPaymentForm
                    ? t("confirmModal.hideForm")
                    : savedCard
                      ? t("confirmModal.updateCard")
                      : t("confirmModal.addCard")}
                </Text>
              </Pressable>

              {showPaymentForm && (
                <View style={styles.cardFormWrapper}>
                  <PaymentCard initialData={savedCard ?? undefined} onSave={onSaveCard} />
                </View>
              )}
            </View>

            {/* Subscribe button */}
            <Pressable
              style={({ pressed }) => [
                styles.subscribeButton,
                pressed && !!savedCard && styles.subscribeButtonPressed,
                (!savedCard || subscribing) && styles.subscribeButtonDisabled,
              ]}
              onPress={onConfirm}
              disabled={!savedCard || subscribing}
            >
              {subscribing ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.subscribeButtonText}>
                  {t("confirmModal.subscribe", { plan: pendingPlan.label })}
                </Text>
              )}
            </Pressable>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
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
    maxHeight: "90%",
    flex: 1,
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
  scroll: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 36,
  },

  // ── Plan summary ───────────────────────────────────────────────────────────
  planSummary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: `${colors.primaryDark}30`,
    ...shadows.md,
  },
  planSummaryLeft: {
    gap: 3,
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
  planBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
    backgroundColor: `${colors.primary}18`,
  },
  planBadgeText: {
    fontSize: fontSize.xs,
    fontFamily: fontFamily.semibold,
    color: colors.primaryDark,
    letterSpacing: 0.5,
  },

  // ── Section label ──────────────────────────────────────────────────────────
  sectionLabel: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.semibold,
    color: colors.foregroundSecondary,
    marginBottom: 10,
    marginLeft: 2,
  },

  // ── Saved card ─────────────────────────────────────────────────────────────
  savedCardRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: 14,
    gap: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  savedCardIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: `${colors.primary}18`,
    alignItems: "center",
    justifyContent: "center",
  },
  savedCardInfo: {
    flex: 1,
    gap: 3,
  },
  savedCardNumber: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.semibold,
    color: colors.foreground,
    letterSpacing: 1,
  },
  savedCardExpiry: {
    fontSize: fontSize.xs,
    fontFamily: fontFamily.regular,
    color: colors.foregroundTertiary,
  },
  editCardButton: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: borderRadius.sm,
    backgroundColor: `${colors.primary}18`,
  },
  editCardText: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.semibold,
    color: colors.primaryDark,
  },

  // ── Card form toggle ───────────────────────────────────────────────────────
  formToggleSection: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    overflow: "hidden",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  toggleButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 16,
  },
  toggleText: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.semibold,
    color: colors.primaryDark,
  },
  cardFormWrapper: {
    padding: 16,
    paddingTop: 0,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.borderLight,
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
