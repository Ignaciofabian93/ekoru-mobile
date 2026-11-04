import { gql } from "@apollo/client";

import {
  ORDER_TOTALS_FIELDS_FRAGMENT,
  PAYMENT_FIELDS_FRAGMENT,
  PAYMENT_REDIRECT_FRAGMENT,
} from "./fragments";

export const CREATE_ORDER = gql`
  ${ORDER_TOTALS_FIELDS_FRAGMENT}
  mutation CreateOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      ...OrderTotalsFields
    }
  }
`;

export const CREATE_PAYMENT = gql`
  ${PAYMENT_FIELDS_FRAGMENT}
  ${PAYMENT_REDIRECT_FRAGMENT}
  mutation CreatePayment($input: CreatePaymentInput!) {
    createPayment(input: $input) {
      paymentId
      provider
      status
      redirect {
        ...PaymentRedirectFields
      }
      payment {
        ...PaymentFields
      }
    }
  }
`;

/**
 * Pays an accepted service quote (WEB-4). Transactions reads the amount and
 * the provider from services, so only the quote is sent; the hand-off and the
 * return are checkout's.
 */
export const CREATE_QUOTATION_PAYMENT = gql`
  ${PAYMENT_REDIRECT_FRAGMENT}
  mutation CreateQuotationPayment(
    $quotationId: Int!
    $returnUrl: String!
    $provider: ChileanPaymentProvider! = MERCADOPAGO
  ) {
    createQuotationPayment(quotationId: $quotationId, returnUrl: $returnUrl, provider: $provider) {
      paymentId
      status
      redirect {
        ...PaymentRedirectFields
      }
    }
  }
`;

/**
 * Moves an order the seller received to its next shipping stage (WEB-1).
 * `trackingInfo` is kept only when the stage is SHIPPED.
 */
export const UPDATE_SHIPPING = gql`
  mutation UpdateShipping($input: UpdateShippingInput!) {
    updateShipping(input: $input) {
      id
      shippingStatus {
        id
        status
        trackingInfo
      }
    }
  }
`;
