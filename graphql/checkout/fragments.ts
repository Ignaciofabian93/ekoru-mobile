import { gql } from "@apollo/client";

export const ORDER_TOTALS_FIELDS_FRAGMENT = gql`
  fragment OrderTotalsFields on Order {
    id
    subtotal
    shippingCost
    taxAmount
    total
    currency
  }
`;

export const PAYMENT_FIELDS_FRAGMENT = gql`
  fragment PaymentFields on Payment {
    id
    status
    amount
    currency
    orderId
    # The transactions subgraph names these differently. Alias them back to the
    # web-app's Payment vocabulary so types/transaction.ts and the UI are unchanged.
    provider: paymentProvider
    providerTransactionId: externalId
    paidAt: processedAt
  }
`;

/**
 * The gateway returns one of two redirect shapes:
 *  - WebpayRedirect: HTML form-POST (token + url) — required by Transbank
 *  - ExternalRedirect: simple URL redirect — used by Khipu and MercadoPago
 *
 * Modeled as a GraphQL union. Adjust to whatever the gateway actually emits.
 */
export const PAYMENT_REDIRECT_FRAGMENT = gql`
  fragment PaymentRedirectFields on PaymentRedirect {
    __typename
    ... on WebpayRedirect {
      kind
      url
      token
    }
    ... on ExternalRedirect {
      kind
      url
    }
  }
`;
