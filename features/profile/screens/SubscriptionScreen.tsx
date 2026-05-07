import React from "react";
import useSubscription from "../hooks/useSubscription";
import { Content, OuterContainer, ScrollContainer } from "../ui/layout/Container";
import AvailablePlans from "../ui/subscription/AvailablePlans";
import ConfirmModal from "../ui/subscription/ConfirmModal";
import CurrentPlan from "../ui/subscription/CurrentPlan";
import DownGradePlan from "../ui/subscription/DownGradePlan";
import Header from "../ui/subscription/Header";
import PlanList from "../ui/subscription/PlanList";

export default function SubscriptionScreen() {
  const {
    currentPlanKey,
    displayPlans,
    billingCycle,
    setBillingCycle,
    isLoading,
    subscribing,
    pendingPlan,
    showPaymentForm,
    setShowPaymentForm,
    showDowngradeConfirm,
    savedCard,
    handleSelectPlan,
    handleSaveCard,
    handleConfirmPayment,
    handleConfirmDowngrade,
    handleCancelSelection,
  } = useSubscription();

  const currentPlan = displayPlans.find((p) => p.key === currentPlanKey) ?? null;

  return (
    <OuterContainer enableBottomInset>
      <ScrollContainer enableContentContainerStyle>
        <Header />
        <Content>
          <CurrentPlan currentPlan={currentPlan} isLoading={isLoading} />

          <AvailablePlans billingCycle={billingCycle} setBillingCycle={setBillingCycle} />

          <PlanList
            displayPlans={displayPlans}
            currentPlanKey={currentPlanKey}
            isLoading={isLoading}
            handleSelectPlan={handleSelectPlan}
          />

          {/* ── Downgrade confirmation ────────────────────────────────── */}
          {showDowngradeConfirm && pendingPlan && (
            <DownGradePlan
              pendingPlan={pendingPlan}
              subscribing={subscribing}
              handleCancelSelection={handleCancelSelection}
              handleConfirmDowngrade={handleConfirmDowngrade}
            />
          )}
        </Content>
      </ScrollContainer>

      {/* ── Payment confirmation modal ────────────────────────────── */}
      {pendingPlan && pendingPlan.key !== "FREEMIUM" && (
        <ConfirmModal
          pendingPlan={pendingPlan}
          billingCycle={billingCycle}
          savedCard={savedCard}
          showPaymentForm={showPaymentForm}
          setShowPaymentForm={setShowPaymentForm}
          subscribing={subscribing}
          onSaveCard={handleSaveCard}
          onConfirm={handleConfirmPayment}
          onCancel={handleCancelSelection}
        />
      )}
    </OuterContainer>
  );
}
