import { gql } from "@apollo/client";

import {
  SELLER_FIELDS_FRAGMENT,
  SELLER_LEVEL_FIELDS_FRAGMENT,
  PERSON_PROFILE_FIELDS_FRAGMENT,
  BUSINESS_PROFILE_FIELDS_FRAGMENT,
} from "./fragments";

export const GET_SELLER = gql`
  ${SELLER_FIELDS_FRAGMENT}
  ${PERSON_PROFILE_FIELDS_FRAGMENT}
  ${BUSINESS_PROFILE_FIELDS_FRAGMENT}
  query GetSeller($id: String!) {
    seller(id: $id) {
      ...SellerFields
      profile {
        ... on PersonProfile {
          ...PersonProfileFields
        }
        ... on BusinessProfile {
          ...BusinessProfileFields
        }
      }
    }
  }
`;

export const GET_SELLERS = gql`
  ${SELLER_FIELDS_FRAGMENT}
  query GetSellers(
    $sellerType: String
    $isActive: Boolean
    $isVerified: Boolean
    $limit: Int
    $offset: Int
  ) {
    sellers(
      sellerType: $sellerType
      isActive: $isActive
      isVerified: $isVerified
      limit: $limit
      offset: $offset
    ) {
      ...SellerFields
    }
  }
`;

export const GET_SELLER_LEVELS = gql`
  ${SELLER_LEVEL_FIELDS_FRAGMENT}
  query GetSellerLevels {
    sellerLevels {
      ...SellerLevelFields
    }
  }
`;

export const GET_SELLER_LEVEL = gql`
  ${SELLER_LEVEL_FIELDS_FRAGMENT}
  query GetSellerLevel($id: String!) {
    sellerLevel(id: $id) {
      ...SellerLevelFields
    }
  }
`;
