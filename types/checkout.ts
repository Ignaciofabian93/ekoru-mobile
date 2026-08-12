import type { PaymentStatus } from "./enums";

/**
 * Checkout contract shared with the web app (`ekoru-web-app/types/checkout.ts`).
 * Keep the two in step: both talk to the same `createOrder` / `createPayment`
 * mutations on the transactions subgraph.
 */

export type ShippingMethod =
  | "DELIVERED_TO_HOME"
  | "IN_HOUSE_PICKUP"
  | "IN_MID_POINT_PICKUP"
  | "CARRIER";

export type PaymentProviderId = "WEBPAY" | "KHIPU" | "MERCADOPAGO";

export type ShippingAddressInput = {
  recipientName: string;
  countryId: number;
  regionId: number;
  cityId: number;
  countyId: number;
  street: string;
  reference?: string;
  zipCode?: string;
  phone: string;
};

export type CheckoutItemInput = {
  /** Marketplace (peer-to-peer) product. Mutually exclusive with storeProductId. */
  productId?: number;
  /** Store (business catalogue) product. Mutually exclusive with productId. */
  storeProductId?: number;
  quantity: number;
};

export type CreateOrderInput = {
  items: CheckoutItemInput[];
  shippingMethod: ShippingMethod;
  shippingAddress?: ShippingAddressInput;
  currency: string;
};

export type CreateOrderResponse = {
  id: number;
  subtotal: number;
  shippingCost: number;
  taxAmount: number;
  total: number;
  currency: string;
};

export type CreatePaymentInput = {
  orderId: number;
  provider: PaymentProviderId;
  /** Absolute URL the provider sends the buyer back to. */
  returnUrl: string;
};

export type WebpayRedirect = {
  kind: "WEBPAY_FORM";
  url: string;
  token: string;
};

export type ExternalRedirect = {
  kind: "EXTERNAL";
  url: string;
};

export type CreatePaymentResponse = {
  paymentId: string;
  provider: PaymentProviderId;
  status: PaymentStatus;
  redirect: WebpayRedirect | ExternalRedirect;
};

export type PaymentStatusResponse = {
  id: string;
  status: PaymentStatus;
  amount: number;
  currency: string;
  orderId: number;
  provider: PaymentProviderId;
  providerTransactionId?: string | null;
  paidAt?: string | null;
};
