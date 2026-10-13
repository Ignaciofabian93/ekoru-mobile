import { gql } from "@apollo/client";

import { SELLER_LEVEL_FIELDS_FRAGMENT } from "./fragments";

export const GET_SELLER_LEVELS = gql`
  ${SELLER_LEVEL_FIELDS_FRAGMENT}
  query GetSellerLevels {
    sellerLevels {
      ...SellerLevelFields
    }
  }
`;
