import PaymentCard, { type CardData } from "@/components/PaymentCard/PaymentCard";
import { colors } from "@/design/tokens";
import { useSeller } from "@/store/useAuthStore";
import { type BusinessProfile, type PersonProfile } from "@/types/user";
import { BadgeCheck, ChevronDown, ChevronUp, CreditCard } from "lucide-react-native";
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useKeyboardPadding from "@/hooks/useKeyboardPadding";
import { PLANS } from "../constants/subscriptions";
import PlanCard from "../ui/subscription/PlanCard";

// ── Helpers ─────────────────────────────────────────────────────────────────

function getCurrentPlan(sellerProfile: PersonProfile | BusinessProfile | null): string {
  return (
    (sellerProfile as PersonProfile)?.personSubscriptionPlan ??
    (sellerProfile as BusinessProfile)?.businessSubscriptionPlan ??
    "FREEMIUM"
  );
}

// ── Main screen ──────────────────────────────────────────────────────────────

export default function SubscriptionScreen() {
  const { bottom } = useSafeAreaInsets();
  const keyboardPadding = useKeyboardPadding();

  const seller = useSeller();
  const profile = seller && seller.profile;
  const currentPlanKey = getCurrentPlan(profile || null);

  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [savedCard, setSavedCard] = useState<CardData | null>(null);

  const handleSaveCard = (data: CardData) => {
    setSavedCard(data);
    setShowPaymentForm(false);
  };

  const maskedCardNumber = savedCard ? `•••• •••• •••• ${savedCard.number.slice(-4)}` : null;

  return (
    <KeyboardAvoidingView
      style={styles.outerContainer}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.container, { paddingBottom: bottom + 40 + keyboardPadding }]}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Current plan summary ─────────────────────────────────── */}
        <Text style={styles.sectionTitle}>Current Plan</Text>
        {(() => {
          const current = PLANS.find((p) => p.key === currentPlanKey) ?? PLANS[0];
          return (
            <View style={styles.currentSummaryCard}>
              <View style={styles.currentSummaryLeft}>
                <Text style={styles.currentPlanName}>{current.label}</Text>
                <Text style={styles.currentPlanPrice}>
                  {current.price}
                  {current.period}
                </Text>
              </View>
              <View style={styles.currentPlanBadge}>
                <BadgeCheck size={20} color={colors.primary} strokeWidth={2} />
                <Text style={styles.currentPlanBadgeText}>Active</Text>
              </View>
            </View>
          );
        })()}

        {/* ── Available plans ──────────────────────────────────────── */}
        <Text style={styles.sectionTitle}>Available Plans</Text>
        <View style={styles.plansContainer}>
          {PLANS.map((plan) => (
            <PlanCard
              key={plan.key}
              plan={plan}
              isCurrent={plan.key === currentPlanKey}
              onSelect={() => setShowPaymentForm(true)}
            />
          ))}
        </View>

        {/* ── Payment method ───────────────────────────────────────── */}
        <Text style={styles.sectionTitle}>Payment Method</Text>
        <View style={styles.paymentSection}>
          {savedCard && !showPaymentForm ? (
            <View style={styles.savedCardRow}>
              <View style={styles.savedCardIcon}>
                <CreditCard size={20} color={colors.primary} strokeWidth={1.8} />
              </View>
              <View style={styles.savedCardInfo}>
                <Text style={styles.savedCardNumber}>{maskedCardNumber}</Text>
                <Text style={styles.savedCardExpiry}>Expires {savedCard.expiry}</Text>
              </View>
              <Pressable style={styles.editCardButton} onPress={() => setShowPaymentForm(true)}>
                <Text style={styles.editCardText}>Edit</Text>
              </Pressable>
            </View>
          ) : null}

          <Pressable style={styles.toggleFormButton} onPress={() => setShowPaymentForm((v) => !v)}>
            {showPaymentForm ? (
              <ChevronUp size={16} color={colors.primaryDark} strokeWidth={2} />
            ) : (
              <ChevronDown size={16} color={colors.primaryDark} strokeWidth={2} />
            )}
            <Text style={styles.toggleFormText}>
              {showPaymentForm ? "Hide form" : savedCard ? "Update card details" : "Add payment card"}
            </Text>
          </Pressable>

          {showPaymentForm && (
            <View style={styles.cardFormWrapper}>
              <PaymentCard initialData={savedCard ?? undefined} onSave={handleSaveCard} />
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scroll: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    padding: 20,
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
