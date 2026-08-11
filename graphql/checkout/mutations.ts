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
