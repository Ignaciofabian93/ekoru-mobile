import { GATEWAY_BASE_URL } from "@/config/endpoints";
import {
  ASSIGN_BUSINESS_MEMBERSHIP,
  ASSIGN_PERSON_MEMBERSHIP,
  GET_BUSINESS_MEMBERSHIPS,
  GET_PERSON_MEMBERSHIPS,
} from "@/graphql/auth/profile";
import { CREATE_MEMBERSHIP_PAYMENT } from "@/graphql/subscription/mutations";
import { MY_SUBSCRIPTION } from "@/graphql/subscription/queries";
import useUserSettings from "@/hooks/useUserSettings";
import { logger } from "@/lib/logger";
import { showError, showSuccess } from "@/lib/toast";
import useAuthStore, { useBusinessProfile, usePersonProfile } from "@/store/useAuthStore";
import type { CreatePaymentResponse } from "@/types/checkout";
import type { BusinessMembership, PersonMembership, SellerMembershipSubscription } from "@/types/user";
import { useMutation, useQuery } from "@apollo/client/react";
import * as WebBrowser from "expo-web-browser";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { type Plan } from "../constants/subscriptions";
import { DEFAULT_PAYMENT_PROVIDER } from "@/features/cart/constants/shippingMethods";
import { NAMESPACE } from "../ui/subscription/i18n";

type AnyMembership = PersonMembership | BusinessMembership;
type MySubscription = { plan: string; isActive: boolean } | null;
export type BillingCycle = "monthly" | "yearly";

const PERSON_PLAN_KEYS = ["FREEMIUM", "BASIC", "ADVANCED"];
const BUSINESS_PLAN_KEYS = ["FREEMIUM", "STARTUP", "BASIC", "ADVANCED", "EXPERT"];

export default function useSubscription() {
  const seller = useAuthStore((s) => s.seller);
  const updateSubscriptionPlan = useAuthStore((s) => s.updateSubscriptionPlan);
  const personProfile = usePersonProfile();
  const bizProfile = useBusinessProfile();
  const { storedLanguage } = useUserSettings();
  const { t } = useTranslation(NAMESPACE);

  const isPersonProfile = !!personProfile;
  const currentPlanKey =
    personProfile?.personSubscriptionPlan ?? bizProfile?.businessSubscriptionPlan ?? "FREEMIUM";
  const countryId = seller?.countryId ?? undefined;

  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
  const [pendingPlanKey, setPendingPlanKey] = useState<string | null>(null);
  const [pendingMembership, setPendingMembership] = useState<AnyMembership | null>(null);
  const [showDowngradeConfirm, setShowDowngradeConfirm] = useState(false);
  const [paying, setPaying] = useState(false);

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

  const { refetch: refetchMySubscription } = useQuery<{ mySubscription: MySubscription }>(MY_SUBSCRIPTION, {
    skip: !seller,
    fetchPolicy: "network-only",
  });

  const pendingPlan = displayPlans.find((p) => p.key === pendingPlanKey) ?? null;

  // ── Completion / error callbacks ───────────────────────────────────────────

  // Only the free plan is granted directly (USR-9); paid plans come from a
  // completed payment, see handleConfirmPayment.
  const handleCompleted = async (membershipType: string) => {
    await updateSubscriptionPlan(membershipType);
    resetSelection();
    showSuccess({ title: t("feedback.downgradedTitle"), message: t("feedback.downgraded") });
  };

  const handleError = (error: Error) => {
    showError({ title: t("feedback.failedTitle"), message: error.message });
  };

  const [createMembershipPayment] = useMutation<
    { createMembershipPayment: Pick<CreatePaymentResponse, "paymentId" | "redirect"> },
    { membershipId: number; returnUrl: string; provider: string }
  >(CREATE_MEMBERSHIP_PAYMENT);

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

  const subscribing = personSubscribing || bizSubscribing || paying;

  // ── Helpers ────────────────────────────────────────────────────────────────

  const resetSelection = () => {
    setPendingPlanKey(null);
    setPendingMembership(null);
    setShowDowngradeConfirm(false);
  };

  /** Moves to the free plan, the one plan a client may grant itself. */
  const executeDowngrade = async (membershipId: string) => {
    if (isPersonProfile) {
      await assignPersonMembership({
        variables: {
          input: { personMembershipId: membershipId, autoRenew: false },
          language: queryLanguage,
        },
      });
    } else {
      await assignBusinessMembership({
        variables: {
          input: { businessMembershipId: membershipId, autoRenew: false },
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

    setShowDowngradeConfirm(planKey === "FREEMIUM");
  };

  /**
   * Pays for the plan on Webpay (MOB-2), the same way checkout does: the
   * provider returns the buyer to the gateway, which commits the payment and
   * lets ekoru-users activate the term. Back in the app, the server's
   * subscription is what decides whether the plan changed.
   */
  const handleConfirmPayment = async () => {
    if (!pendingMembership || !pendingPlanKey) return;
    const planKey = pendingPlanKey;
    setPaying(true);
    try {
      const res = await createMembershipPayment({
        variables: {
          membershipId: Number(pendingMembership.id),
          // The return path names the provider the payment was started with.
          returnUrl: `${GATEWAY_BASE_URL}/payments/return/${DEFAULT_PAYMENT_PROVIDER.toLowerCase()}`,
          provider: DEFAULT_PAYMENT_PROVIDER,
        },
      });
      const redirect = res.data?.createMembershipPayment.redirect;
      if (!redirect) throw new Error("createMembershipPayment returned no redirect");

      // Webpay only takes a form POST; the gateway serves the page that does it.
      const handoffUrl =
        redirect.kind === "WEBPAY_FORM"
          ? `${GATEWAY_BASE_URL}/payments/webpay/redirect?url=${encodeURIComponent(
              redirect.url,
            )}&token=${encodeURIComponent(redirect.token)}`
          : redirect.url;
      await WebBrowser.openBrowserAsync(handoffUrl, { showTitle: true });

      const { data } = await refetchMySubscription();
      const active = data?.mySubscription;
      if (active?.isActive && active.plan === planKey) {
        await updateSubscriptionPlan(planKey);
        resetSelection();
        showSuccess({
          title: t("feedback.activatedTitle"),
          message: t("feedback.activated", { plan: pendingPlan?.label ?? planKey }),
        });
      } else {
        resetSelection();
        showError({ title: t("feedback.pendingTitle"), message: t("feedback.pending") });
      }
    } catch (error) {
      logger.error("[Subscription] payment failed:", error);
      handleError(error instanceof Error ? error : new Error(String(error)));
    } finally {
      setPaying(false);
    }
  };

  const handleConfirmDowngrade = async () => {
    if (!pendingMembership) return;
    await executeDowngrade(String(pendingMembership.id));
  };

  const handleCancelSelection = () => resetSelection();

  return {
    currentPlanKey,
    displayPlans,
    billingCycle,
    setBillingCycle,
    isLoading,
    subscribing,
    pendingPlan,
    pendingPlanKey,
    showDowngradeConfirm,
    handleSelectPlan,
    handleConfirmPayment,
    handleConfirmDowngrade,
    handleCancelSelection,
  };
}
