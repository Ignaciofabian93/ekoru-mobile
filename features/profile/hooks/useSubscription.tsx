import type { CardData } from "@/components/Patterns/PaymentCard/PaymentCard";
import {
  ASSIGN_BUSINESS_MEMBERSHIP,
  ASSIGN_PERSON_MEMBERSHIP,
  GET_BUSINESS_MEMBERSHIPS,
  GET_PERSON_MEMBERSHIPS,
} from "@/graphql/auth/profile";
import useUserSettings from "@/hooks/useUserSettings";
import { showError, showSuccess } from "@/lib/toast";
import useAuthStore, { useBusinessProfile, usePersonProfile } from "@/store/useAuthStore";
import type { BusinessMembership, PersonMembership, SellerMembershipSubscription } from "@/types/user";
import { useMutation, useQuery } from "@apollo/client/react";
import { useState } from "react";
import { type Plan } from "../constants/subscriptions";

type AnyMembership = PersonMembership | BusinessMembership;
export type BillingCycle = "monthly" | "yearly";

const PERSON_PLAN_KEYS = ["FREEMIUM", "BASIC", "ADVANCED"];
const BUSINESS_PLAN_KEYS = ["FREEMIUM", "STARTUP", "BASIC", "ADVANCED", "EXPERT"];

export default function useSubscription() {
  const seller = useAuthStore((s) => s.seller);
  const updateSubscriptionPlan = useAuthStore((s) => s.updateSubscriptionPlan);
  const personProfile = usePersonProfile();
  const bizProfile = useBusinessProfile();
  const { storedLanguage } = useUserSettings();

  const isPersonProfile = !!personProfile;
  const currentPlanKey =
    personProfile?.personSubscriptionPlan ?? bizProfile?.businessSubscriptionPlan ?? "FREEMIUM";
  const countryId = seller?.countryId ?? undefined;

  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
  const [pendingPlanKey, setPendingPlanKey] = useState<string | null>(null);
  const [pendingMembership, setPendingMembership] = useState<AnyMembership | null>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showDowngradeConfirm, setShowDowngradeConfirm] = useState(false);
  const [savedCard, setSavedCard] = useState<CardData | null>(null);

  const queryLanguage = storedLanguage?.toUpperCase();

  const { data: personData, loading: personLoading } = useQuery<{
    personMemberships: PersonMembership[];
  }>(GET_PERSON_MEMBERSHIPS, {
    variables: { language: queryLanguage, countryId },
    skip: !isPersonProfile,
    fetchPolicy: "cache-and-network",
  });

  const { data: bizData, loading: bizLoading } = useQuery<{
    businessMemberships: BusinessMembership[];
  }>(GET_BUSINESS_MEMBERSHIPS, {
    variables: { language: queryLanguage, countryId },
    skip: isPersonProfile,
    fetchPolicy: "cache-and-network",
  });

  const memberships: AnyMembership[] = isPersonProfile
    ? (personData?.personMemberships ?? [])
    : (bizData?.businessMemberships ?? []);

  const isLoading = isPersonProfile ? personLoading : bizLoading;

  // ── Build display plans ────────────────────────────────────────────────────
  // One card per plan type. Monthly = durationMonths 1, yearly = 12.
  // FREEMIUM is always included regardless of billing cycle.

  const allowedKeys = isPersonProfile ? PERSON_PLAN_KEYS : BUSINESS_PLAN_KEYS;
  const targetDuration = billingCycle === "monthly" ? 1 : 12;

  const displayPlans: Plan[] =
    memberships.length > 0
      ? (allowedKeys
          .map((planType) => {
            const match =
              planType === "FREEMIUM"
                ? memberships.find((m) => m.membershipType === "FREEMIUM")
                : memberships.find(
                    (m) => m.membershipType === planType && m.durationMonths === targetDuration,
                  );

            if (!match) return null;

            const price = match.pricing?.price ?? 0;
            const currency = match.pricing?.currency ?? "CLP";

            return {
              id: String(match.id),
              key: planType,
              label: match.translation?.name ?? planType,
              price,
              period: price === 0 ? "" : billingCycle === "monthly" ? "/m" : "/y",
              currency,
              durationMonths: match.durationMonths,
              features: Array.isArray(match.translation?.description) ? match.translation.description : [],
              highlighted: currentPlanKey === planType,
            };
          })
          .filter(Boolean) as Plan[])
      : [];

  // ── Completion / error callbacks ───────────────────────────────────────────

  const handleCompleted = async (membershipType: string) => {
    await updateSubscriptionPlan(membershipType);
    resetSelection();
    showSuccess({
      title: "Subscription Updated",
      message: `You are now on the ${membershipType} plan.`,
    });
  };

  const handleError = (error: Error) => {
    showError({ title: "Subscription Failed", message: error.message });
  };

  // ── Mutations ──────────────────────────────────────────────────────────────

  const [assignPersonMembership, { loading: personSubscribing }] = useMutation<{
    assignPersonMembership: SellerMembershipSubscription;
  }>(ASSIGN_PERSON_MEMBERSHIP, {
    fetchPolicy: "no-cache",
    onCompleted: async (data) => {
      const type = data.assignPersonMembership.personMembership?.membershipType ?? "";
      await handleCompleted(type);
    },
    onError: handleError,
  });

  const [assignBusinessMembership, { loading: bizSubscribing }] = useMutation<{
    assignBusinessMembership: SellerMembershipSubscription;
  }>(ASSIGN_BUSINESS_MEMBERSHIP, {
    fetchPolicy: "no-cache",
    onCompleted: async (data) => {
      const type = data.assignBusinessMembership.businessMembership?.membershipType ?? "";
      await handleCompleted(type);
    },
    onError: handleError,
  });

  const subscribing = personSubscribing || bizSubscribing;

  // ── Helpers ────────────────────────────────────────────────────────────────

  const resetSelection = () => {
    setPendingPlanKey(null);
    setPendingMembership(null);
    setShowPaymentForm(false);
    setShowDowngradeConfirm(false);
    setSavedCard(null);
  };

  const executeSubscription = async (membershipId: string, paymentId: string | null = null) => {
    if (isPersonProfile) {
      await assignPersonMembership({
        variables: {
          input: { personMembershipId: membershipId, autoRenew: true, paymentId },
          language: queryLanguage,
        },
      });
    } else {
      await assignBusinessMembership({
        variables: {
          input: { businessMembershipId: membershipId, autoRenew: true, paymentId },
          language: queryLanguage,
        },
      });
    }
  };

  // ── Public handlers ────────────────────────────────────────────────────────

  const handleSelectPlan = (planKey: string) => {
    if (isLoading || subscribing) return;

    const membership =
      planKey === "FREEMIUM"
        ? (memberships.find((m) => m.membershipType === "FREEMIUM") ?? null)
        : (memberships.find((m) => m.membershipType === planKey && m.durationMonths === targetDuration) ??
          null);

    setPendingPlanKey(planKey);
    setPendingMembership(membership);

    if (planKey === "FREEMIUM") {
      setShowDowngradeConfirm(true);
      setShowPaymentForm(false);
    } else {
      setShowPaymentForm(true);
      setShowDowngradeConfirm(false);
    }
    setSavedCard(null);
  };

  const handleSaveCard = (cardData: CardData) => {
    setSavedCard(cardData);
    setShowPaymentForm(false);
  };

  const handleConfirmPayment = async () => {
    if (!pendingMembership) return;
    await executeSubscription(String(pendingMembership.id), null);
  };

  const handleConfirmDowngrade = async () => {
    if (!pendingMembership) return;
    await executeSubscription(String(pendingMembership.id), null);
  };

  const handleCancelSelection = () => resetSelection();

  const pendingPlan = displayPlans.find((p) => p.key === pendingPlanKey) ?? null;

  return {
    currentPlanKey,
    displayPlans,
    billingCycle,
    setBillingCycle,
    isLoading,
    subscribing,
    pendingPlan,
    pendingPlanKey,
    showPaymentForm,
    setShowPaymentForm,
    showDowngradeConfirm,
    savedCard,
    handleSelectPlan,
    handleSaveCard,
    handleConfirmPayment,
    handleConfirmDowngrade,
    handleCancelSelection,
  };
}
