import { DEFAULT_PAYMENT_PROVIDER } from "@/features/cart/constants/shippingMethods";
import { openPaymentHandoff, paymentReturnUrl } from "@/features/cart/utils/paymentHandoff";
import { CREATE_PAYMENT } from "@/graphql/checkout/mutations";
import useAppRouter from "@/hooks/useAppRouter";
import { logger } from "@/lib/logger";
import { showError } from "@/lib/toast";
import type { CreatePaymentInput, CreatePaymentResponse } from "@/types/checkout";
import { useMutation } from "@apollo/client/react";
import { useState } from "react";
import { type BuyerOrder, orderCartGroup } from "../utils/orders";

/**
 * Pays an order still waiting for payment, from the order history (WEB-24):
 * a buyer who left Mercado Pago's page comes back here. It starts a new
 * payment for the same order; transactions refunds a second charge on its own,
 * so an older attempt that still goes through can't charge the buyer twice.
 */
export function useOrderPayment() {
  const { replace } = useAppRouter();
  // The order being paid, so only that card's button spins.
  const [payingId, setPayingId] = useState<string | null>(null);
  const [createPayment] = useMutation<{ createPayment: CreatePaymentResponse }, { input: CreatePaymentInput }>(
    CREATE_PAYMENT,
  );

  const pay = async (order: BuyerOrder) => {
    setPayingId(order.id);
    try {
      const { data } = await createPayment({
        variables: {
          input: {
            orderId: Number(order.id),
            provider: DEFAULT_PAYMENT_PROVIDER,
            returnUrl: paymentReturnUrl(DEFAULT_PAYMENT_PROVIDER),
          },
        },
      });
      const payment = data?.createPayment;
      if (!payment) throw new Error("createPayment no devolvió datos");
      await openPaymentHandoff(payment.redirect);
      const group = orderCartGroup(order);
      replace({
        pathname: "/(cart)/confirmation",
        params: { paymentId: payment.paymentId, orderId: order.id, ...(group ? { group } : {}) },
      });
    } catch (error) {
      logger.error("[Orders] payment failed:", error);
      showError({
        title: "No pudimos iniciar el pago",
        message: error instanceof Error ? error.message : "Inténtalo nuevamente en unos minutos",
      });
    } finally {
      setPayingId(null);
    }
  };

  return { pay, payingId };
}
