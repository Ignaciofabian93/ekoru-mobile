import { gql } from "@apollo/client";

import { PAYMENT_REDIRECT_FRAGMENT } from "../checkout/fragments";

/**
 * Starts a one-off subscription payment to EKORU's own account (transactions
 * subgraph). Returns the same redirect union the cart checkout uses, so the
 * client hands off to Webpay identically. On success the users subgraph
 * activates the membership; the buyer returns to /cart/confirmation.
 */
export const CREATE_MEMBERSHIP_PAYMENT = gql`
  ${PAYMENT_REDIRECT_FRAGMENT}
  mutation CreateMembershipPayment($membershipId: Int!, $returnUrl: String!) {
    createMembershipPayment(membershipId: $membershipId, returnUrl: $returnUrl) {
      paymentId
      status
      redirect {
        ...PaymentRedirectFields
      }
    }
  }
`;
