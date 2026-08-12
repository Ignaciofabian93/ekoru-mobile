import { GET_PAYMENT_STATUS } from "@/graphql/checkout/queries";
import useCartStore from "@/store/useCartStore";
import type { PaymentStatusResponse } from "@/types/checkout";
import { useQuery } from "@apollo/client/react";
import { useEffect } from "react";

/** Payment states the backend will not move away from. */
const FINAL_STATUSES = [
  "COMPLETED",
  "FAILED",
  "CANCELLED",
  "REFUNDED",
  "PARTIALLY_REFUNDED",
  "EXPIRED",
] as const;

const POLL_INTERVAL_MS = 3000;
/** Stop polling after this long so a stuck payment doesn't drain the battery. */
const POLL_TIMEOUT_MS = 90_000;

export type PaymentOutcome = "PENDING" | "PAID" | "FAILED" | "UNKNOWN";

/**
 * Resolves what happened to a payment after the buyer came back from the
 * provider's browser session.
 *
 * The app never sees the provider's result: the redirect lands on the gateway,
 * which commits the payment and knows the truth. So the confirmation screen
 * asks — repeatedly, while the state is still moving — instead of assuming the
 * payment succeeded because the browser closed.
 */
export function usePaymentResult(paymentId?: string) {
  const clearCart = useCartStore((s) => s.clearCart);

  const { data, loading, error, startPolling, stopPolling } = useQuery<{
    payment: PaymentStatusResponse | null;
  }>(GET_PAYMENT_STATUS, {
    variables: { paymentId },
    skip: !paymentId,
    fetchPolicy: "network-only",
    pollInterval: POLL_INTERVAL_MS,
  });

  const status = data?.payment?.status;
  const isFinal = !!status && (FINAL_STATUSES as readonly string[]).includes(status);

  useEffect(() => {
    if (isFinal) stopPolling();
  }, [isFinal, stopPolling]);

  useEffect(() => {
    if (!paymentId || isFinal) return;
    const timer = setTimeout(stopPolling, POLL_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [paymentId, isFinal, stopPolling]);

  // The cart is only dropped once the money is in: an abandoned or failed
  // payment leaves it intact so the buyer can retry without rebuilding it.
  useEffect(() => {
    if (status === "COMPLETED") clearCart();
  }, [status, clearCart]);

  const outcome: PaymentOutcome = !paymentId
    ? "UNKNOWN"
    : status === "COMPLETED"
      ? "PAID"
      : isFinal
        ? "FAILED"
        : "PENDING";

  return {
    payment: data?.payment ?? null,
    outcome,
    loading: loading && !data,
    error,
    retry: () => startPolling(POLL_INTERVAL_MS),
  };
}
