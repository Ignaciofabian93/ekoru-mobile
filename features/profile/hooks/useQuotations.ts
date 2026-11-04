import { DEFAULT_PAYMENT_PROVIDER } from "@/features/cart/constants/shippingMethods";
import { openPaymentHandoff, paymentReturnUrl } from "@/features/cart/utils/paymentHandoff";
import { CREATE_QUOTATION_PAYMENT } from "@/graphql/checkout/mutations";
import {
  ACCEPT_QUOTATION,
  DECLINE_QUOTATION,
  GET_MY_PROVIDER_QUOTATIONS,
  GET_MY_QUOTATIONS,
  UPDATE_QUOTATION,
} from "@/graphql/services/quotations";
import useAppRouter from "@/hooks/useAppRouter";
import { logger } from "@/lib/logger";
import { showError } from "@/lib/toast";
import type { CreatePaymentResponse } from "@/types/checkout";
import { useMutation, useQuery } from "@apollo/client/react";
import { useState } from "react";

export type QuotationStatus = "PENDING" | "ACCEPTED" | "DECLINED" | "COMPLETED" | "CANCELLED" | "EXPIRED";

export interface Quotation {
  id: string;
  serviceId: number;
  clientId: string;
  providerId: string;
  title: string;
  description: string;
  estimatedPrice?: number | null;
  finalPrice?: number | null;
  /** Minutes. */
  estimatedDuration?: number | null;
  status: QuotationStatus;
  clientNotes?: string | null;
  providerNotes?: string | null;
  declineReason?: string | null;
  /** Set once the client paid the accepted quote (WEB-4). */
  paidAt?: string | null;
  createdAt: string;
  service?: { id: string; name: string; displayImage?: string | null; sellerId: string } | null;
}

export interface QuoteReply {
  id: string;
  estimatedPrice: number;
  estimatedDuration?: number;
  providerNotes?: string;
}

interface Connection<T> {
  nodes: T[];
}

async function attempt(fn: () => Promise<unknown>, title: string): Promise<boolean> {
  try {
    await fn();
    return true;
  } catch (error) {
    showError({ title, message: error instanceof Error ? error.message : "" });
    return false;
  }
}

/**
 * Both sides of service quotes (MOB-3), as the web's quotes inbox (WEB-4). A
 * seller is a client on some quotes and the provider on others, so both lists
 * load and the screen splits them into tabs. The client accepts or declines
 * once there is a price, and pays an accepted quote through Mercado Pago; the
 * provider answers a pending one with a price.
 */
export function useQuotations({ errorTitle }: { errorTitle: string }) {
  const { replace } = useAppRouter();
  const sent = useQuery<{ myQuotations: Connection<Quotation> }>(GET_MY_QUOTATIONS, {
    fetchPolicy: "cache-and-network",
  });
  const received = useQuery<{ myProviderQuotations: Connection<Quotation> }>(GET_MY_PROVIDER_QUOTATIONS, {
    fetchPolicy: "cache-and-network",
  });
  const refetchQueries = [{ query: GET_MY_QUOTATIONS }, { query: GET_MY_PROVIDER_QUOTATIONS }];
  const [acceptQuotation, s1] = useMutation(ACCEPT_QUOTATION, { refetchQueries });
  const [declineQuotation, s2] = useMutation(DECLINE_QUOTATION, { refetchQueries });
  const [updateQuotation, s3] = useMutation(UPDATE_QUOTATION, { refetchQueries });
  const [createQuotationPayment] = useMutation<{
    createQuotationPayment: Pick<CreatePaymentResponse, "paymentId" | "status" | "redirect">;
  }>(CREATE_QUOTATION_PAYMENT);
  // The quote being paid, so only that card's button spins.
  const [payingId, setPayingId] = useState<string | null>(null);

  const pay = async (id: string) => {
    setPayingId(id);
    try {
      const { data } = await createQuotationPayment({
        variables: {
          quotationId: Number(id),
          returnUrl: paymentReturnUrl(DEFAULT_PAYMENT_PROVIDER),
          provider: DEFAULT_PAYMENT_PROVIDER,
        },
      });
      const payment = data?.createQuotationPayment;
      if (!payment) throw new Error("createQuotationPayment no devolvió datos");
      await openPaymentHandoff(payment.redirect);
      // The confirmation screen asks the API what happened, as after checkout.
      replace({ pathname: "/(cart)/confirmation", params: { paymentId: payment.paymentId, kind: "quote" } });
    } catch (error) {
      logger.error("[Quotes] payment failed:", error);
      showError({ title: errorTitle, message: error instanceof Error ? error.message : "" });
    } finally {
      setPayingId(null);
    }
  };

  return {
    sent: sent.data?.myQuotations.nodes ?? [],
    received: received.data?.myProviderQuotations.nodes ?? [],
    loading: (sent.loading && !sent.data) || (received.loading && !received.data),
    refreshing: sent.loading || received.loading,
    refetch: () => Promise.all([sent.refetch(), received.refetch()]),
    busy: s1.loading || s2.loading || s3.loading,
    accept: (id: string) => attempt(() => acceptQuotation({ variables: { id } }), errorTitle),
    decline: (id: string) => attempt(() => declineQuotation({ variables: { id } }), errorTitle),
    respond: (input: QuoteReply) => attempt(() => updateQuotation({ variables: { input } }), errorTitle),
    pay,
    payingId,
  };
}
