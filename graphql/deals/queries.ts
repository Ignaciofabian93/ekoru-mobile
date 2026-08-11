import { gql } from "@apollo/client";

/**
 * The counterparty on a deal (buyer or seller), resolved via federation against
 * the users subgraph. Enough to show who they are + where they're from, matching
 * what the useSellerData hooks read (profile name/avatar, county, verified).
 */
export const DEAL_PARTY_FIELDS = gql`
  fragment DealPartyFields on Seller {
    id
    email
    phone
    sellerType
    isVerified
    profile {
      ... on PersonProfile {
        id
        displayName
        firstName
        lastName
        profileImage
      }
      ... on BusinessProfile {
        id
        businessName
        logo
      }
    }
    county {
      id
      county
    }
  }
`;

/**
 * Peer-to-peer marketplace deals (cash sales + exchanges) from the transactions
 * subgraph. `product` / `requestedProduct` / `offeredProduct` and `buyer` /
 * `seller` are federation refs (marketplace / users) pulled inline.
 */
export const DEAL_FIELDS = gql`
  ${DEAL_PARTY_FIELDS}
  fragment DealFields on P2PDeal {
    id
    type
    status
    buyerId
    sellerId
    compensationAmount
    compensationPayerId
    confirmationDeadline
    buyerConfirmedAt
    sellerConfirmedAt
    buyerEvidenceUrl
    sellerEvidenceUrl
    disputeReason
    cancelReason
    completedAt
    createdAt
    buyer {
      ...DealPartyFields
    }
    seller {
      ...DealPartyFields
    }
    product {
      id
      name
      images
      price
    }
    requestedProduct {
      id
      name
      images
      price
    }
    offeredProduct {
      id
      name
      images
      price
    }
  }
`;

export const MY_DEALS_AS_BUYER = gql`
  ${DEAL_FIELDS}
  query MyDealsAsBuyer {
    myDealsAsBuyer {
      ...DealFields
    }
  }
`;

export const MY_DEALS_AS_SELLER = gql`
  ${DEAL_FIELDS}
  query MyDealsAsSeller {
    myDealsAsSeller {
      ...DealFields
    }
  }
`;

export const GET_DEAL = gql`
  ${DEAL_FIELDS}
  query GetDeal($id: Int!) {
    deal(id: $id) {
      ...DealFields
    }
  }
`;

export const MY_P2P_REPUTATION = gql`
  query MyP2PReputation {
    myP2PReputation {
      strikes
      blockedUntil
      completedCount
      failedCount
    }
  }
`;
