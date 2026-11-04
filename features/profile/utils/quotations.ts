import type { Quotation } from "../hooks/useQuotations";

/** The price on a quote: the final one once set, else the provider's estimate. */
export const quotedPrice = (q: Pick<Quotation, "finalPrice" | "estimatedPrice">): number | null =>
  q.finalPrice ?? q.estimatedPrice ?? null;

/** Whether the client can pay this quote now: what transactions checks too. */
export const isPayable = (q: Pick<Quotation, "status" | "paidAt" | "finalPrice" | "estimatedPrice">): boolean =>
  q.status === "ACCEPTED" && !q.paidAt && (quotedPrice(q) ?? 0) > 0;
