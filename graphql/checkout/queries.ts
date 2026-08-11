import { gql } from "@apollo/client";

import { PAYMENT_FIELDS_FRAGMENT } from "./fragments";

export const GET_PAYMENT_STATUS = gql`
  ${PAYMENT_FIELDS_FRAGMENT}
  query GetPaymentStatus($paymentId: ID!) {
    payment(id: $paymentId) {
      ...PaymentFields
    }
  }
`;
