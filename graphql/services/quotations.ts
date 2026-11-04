import { gql } from "@apollo/client";

import { SERVICE_PAGE_INFO_FIELDS_FRAGMENT } from "./fragments";

// Service quotes, both sides (MOB-3), the same operations as the web (WEB-4).
// The client asks, the provider prices, the client accepts and pays through
// Mercado Pago. The services subgraph takes the identity from the session.

export const QUOTATION_FIELDS_FRAGMENT = gql`
  fragment QuotationFields on Quotation {
    id
    serviceId
    clientId
    providerId
    title
    description
    estimatedPrice
    finalPrice
    estimatedDuration
    status
    clientNotes
    providerNotes
    expiresAt
    acceptedAt
    declineReason
    paidAt
    createdAt
    updatedAt
    service {
      id
      name
      displayImage
      sellerId
    }
  }
`;

export const GET_MY_QUOTATIONS = gql`
  ${QUOTATION_FIELDS_FRAGMENT}
  ${SERVICE_PAGE_INFO_FIELDS_FRAGMENT}
  query GetMyQuotations($page: Int = 1, $pageSize: Int = 30) {
    myQuotations(page: $page, pageSize: $pageSize) {
      nodes {
        ...QuotationFields
      }
      pageInfo {
        ...ServicePageInfoFields
      }
    }
  }
`;

export const GET_MY_PROVIDER_QUOTATIONS = gql`
  ${QUOTATION_FIELDS_FRAGMENT}
  ${SERVICE_PAGE_INFO_FIELDS_FRAGMENT}
  query GetMyProviderQuotations($page: Int = 1, $pageSize: Int = 30) {
    myProviderQuotations(page: $page, pageSize: $pageSize) {
      nodes {
        ...QuotationFields
      }
      pageInfo {
        ...ServicePageInfoFields
      }
    }
  }
`;

/** The client's request. The subgraph sets the provider (the service's seller); no price is sent. */
export const ADD_QUOTATION = gql`
  ${QUOTATION_FIELDS_FRAGMENT}
  mutation AddQuotation($input: AddQuotationInput!) {
    addQuotation(input: $input) {
      ...QuotationFields
    }
  }
`;

/** The provider's reply: price, duration and terms. Provider-only server-side. */
export const UPDATE_QUOTATION = gql`
  ${QUOTATION_FIELDS_FRAGMENT}
  mutation UpdateQuotation($input: UpdateQuotationInput!) {
    updateQuotation(input: $input) {
      ...QuotationFields
    }
  }
`;

export const ACCEPT_QUOTATION = gql`
  ${QUOTATION_FIELDS_FRAGMENT}
  mutation AcceptQuotation($id: ID!) {
    acceptQuotation(id: $id) {
      ...QuotationFields
    }
  }
`;

export const DECLINE_QUOTATION = gql`
  ${QUOTATION_FIELDS_FRAGMENT}
  mutation DeclineQuotation($id: ID!, $reason: String) {
    declineQuotation(id: $id, reason: $reason) {
      ...QuotationFields
    }
  }
`;
