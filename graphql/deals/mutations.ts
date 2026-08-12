import { gql } from "@apollo/client";

import { DEAL_FIELDS } from "./queries";

export const PROPOSE_SALE_DEAL = gql`
  ${DEAL_FIELDS}
  mutation ProposeSaleDeal($productId: Int!, $message: String) {
    proposeSaleDeal(productId: $productId, message: $message) {
      ...DealFields
    }
  }
`;

export const PROPOSE_EXCHANGE_DEAL = gql`
  ${DEAL_FIELDS}
  mutation ProposeExchangeDeal(
    $requestedProductId: Int!
    $offeredProductId: Int!
    $message: String
  ) {
    proposeExchangeDeal(
      requestedProductId: $requestedProductId
      offeredProductId: $offeredProductId
      message: $message
    ) {
      ...DealFields
    }
  }
`;

export const ACCEPT_DEAL = gql`
  ${DEAL_FIELDS}
  mutation AcceptDeal($id: Int!) {
    acceptDeal(id: $id) {
      ...DealFields
    }
  }
`;

export const DECLINE_DEAL = gql`
  ${DEAL_FIELDS}
  mutation DeclineDeal($id: Int!, $reason: String) {
    declineDeal(id: $id, reason: $reason) {
      ...DealFields
    }
  }
`;

export const CONFIRM_DEAL = gql`
  ${DEAL_FIELDS}
  mutation ConfirmDeal(
    $id: Int!
    $evidenceUrl: String
    $compensationSettled: Boolean
  ) {
    confirmDeal(
      id: $id
      evidenceUrl: $evidenceUrl
      compensationSettled: $compensationSettled
    ) {
      ...DealFields
    }
  }
`;

export const DISPUTE_DEAL = gql`
  ${DEAL_FIELDS}
  mutation DisputeDeal($id: Int!, $reason: String!) {
    disputeDeal(id: $id, reason: $reason) {
      ...DealFields
    }
  }
`;

export const CANCEL_DEAL = gql`
  ${DEAL_FIELDS}
  mutation CancelDeal($id: Int!, $reason: String) {
    cancelDeal(id: $id, reason: $reason) {
      ...DealFields
    }
  }
`;
