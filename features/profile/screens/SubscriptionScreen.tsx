import PaymentCard, {
  type CardData,
} from "@/components/PaymentCard/PaymentCard";
import Colors from "@/constants/Colors";
import { useSeller } from "@/store/useAuthStore";
import { BadgeCheck, ChevronDown, ChevronUp, CreditCard } from "lucide-react-native";
import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

// ── Plan definitions ────────────────────────────────────────────────────────

interface Plan {
  key: string;
  label: string;
  price: string;
  period: string;
  features: string[];
  highlighted?: boolean;
}

const PLANS: Plan[] = [
  {
    key: "FREEMIUM",
    label: "Freemium",
    price: "Free",
    period: "",
    features: ["Up to 5 listings", "Basic analytics", "Community support"],
  },
  {
    key: "BASIC",
    label: "Basic",
    price: "$9.99",
    period: "/mo",
    features: [
      "Up to 20 listings",
      "Standard analytics",
      "Email support",
      "Badge on profile",
    ],
  },
  {
    key: "ADVANCED",
    label: "Advanced",
    price: "$29.99",
    period: "/mo",
    highlighted: true,
    features: [
      "Unlimited listings",
      "Advanced analytics",
      "Priority support",
      "Featured placement",
      "Custom storefront",
    ],
  },
  {
    key: "STARTUP",
    label: "Startup",
    price: "$49.99",
    period: "/mo",
    features: [
      "Everything in Advanced",
      "Team accounts (up to 5)",
      "API access",
      "Dedicated account manager",
    ],
  },
  {
    key: "EXPERT",
    label: "Expert",
    price: "$99.99",
    period: "/mo",
    features: [
      "Everything in Startup",
      "Unlimited team members",
      "White-label options",
      "SLA guarantee",
      "24/7 phone support",
    ],
  },
];

// ── Helpers ─────────────────────────────────────────────────────────────────

function getCurrentPlan(sellerProfile: any): string {
  return (
    sellerProfile?.personSubscriptionPlan ??
    sellerProfile?.businessSubscriptionPlan ??
    "FREEMIUM"
  );
}

// ── Sub-components ───────────────────────────────────────────────────────────

function PlanCard({
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
          <BadgeCheck size={11} color={Colors.primaryDark} strokeWidth={2.5} />
          <Text style={[styles.popularBadgeText, styles.currentBadgeText]}>
            Current Plan
          </Text>
        </View>
      )}

      <View style={styles.planHeader}>
        <Text style={styles.planLabel}>{plan.label}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.planPrice}>{plan.price}</Text>
          {plan.period ? (
            <Text style={styles.planPeriod}>{plan.period}</Text>
          ) : null}
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
          <Text
            style={[
              styles.selectButtonText,
              plan.highlighted && styles.selectButtonTextHighlighted,
            ]}
          >
            {plan.key === "FREEMIUM" ? "Downgrade" : "Upgrade"}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

// ── Main screen ──────────────────────────────────────────────────────────────

export default function SubscriptionScreen() {
  const seller = useSeller();
  const profile = seller?.profile as any;
  const currentPlanKey = getCurrentPlan(profile);

  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [savedCard, setSavedCard] = useState<CardData | null>(null);

  const handleSaveCard = (data: CardData) => {
    setSavedCard(data);
    setShowPaymentForm(false);
  };

  const maskedCardNumber = savedCard
    ? `•••• •••• •••• ${savedCard.number.slice(-4)}`
    : null;

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.container}
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
              <BadgeCheck size={20} color={Colors.primary} strokeWidth={2} />
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
              <CreditCard size={20} color={Colors.primary} strokeWidth={1.8} />
            </View>
            <View style={styles.savedCardInfo}>
              <Text style={styles.savedCardNumber}>{maskedCardNumber}</Text>
              <Text style={styles.savedCardExpiry}>
                Expires {savedCard.expiry}
              </Text>
            </View>
            <Pressable
              style={styles.editCardButton}
              onPress={() => setShowPaymentForm(true)}
            >
              <Text style={styles.editCardText}>Edit</Text>
            </Pressable>
          </View>
        ) : null}

        <Pressable
          style={styles.toggleFormButton}
          onPress={() => setShowPaymentForm((v) => !v)}
        >
          {showPaymentForm ? (
            <ChevronUp size={16} color={Colors.primaryDark} strokeWidth={2} />
          ) : (
            <ChevronDown size={16} color={Colors.primaryDark} strokeWidth={2} />
          )}
          <Text style={styles.toggleFormText}>
            {showPaymentForm
              ? "Hide form"
              : savedCard
                ? "Update card details"
                : "Add payment card"}
          </Text>
        </Pressable>

        {showPaymentForm && (
          <View style={styles.cardFormWrapper}>
            <PaymentCard initialData={savedCard ?? undefined} onSave={handleSaveCard} />
          </View>
        )}
      </View>
    </ScrollView>
  );
}

// ── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
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
    backgroundColor: `${Colors.primary}18`,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  currentPlanBadgeText: {
    fontSize: 13,
    fontFamily: "Cabin_600SemiBold",
    color: Colors.primaryDark,
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
    borderColor: Colors.primary,
  },
  planCardCurrent: {
    borderColor: Colors.secondary,
  },
  popularBadge: {
    alignSelf: "flex-start",
    backgroundColor: `${Colors.primary}20`,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 12,
  },
  popularBadgeText: {
    fontSize: 11,
    fontFamily: "Cabin_600SemiBold",
    color: Colors.primaryDark,
  },
  currentBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: `${Colors.secondary}20`,
  },
  currentBadgeText: {
    color: Colors.secondaryDark,
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
    color: Colors.primaryDark,
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
    backgroundColor: Colors.primary,
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
    borderColor: Colors.primary,
  },
  selectButtonHighlighted: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  selectButtonPressed: {
    opacity: 0.75,
  },
  selectButtonText: {
    fontSize: 14,
    fontFamily: "Cabin_600SemiBold",
    color: Colors.primaryDark,
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
    backgroundColor: `${Colors.primary}18`,
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
    backgroundColor: `${Colors.primary}18`,
  },
  editCardText: {
    fontSize: 13,
    fontFamily: "Cabin_600SemiBold",
    color: Colors.primaryDark,
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
    color: Colors.primaryDark,
  },
  cardFormWrapper: {
    padding: 16,
    paddingTop: 0,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#e5e7eb",
  },
});
