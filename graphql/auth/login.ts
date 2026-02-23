import { gql } from "@apollo/client";

import {
  SELLER_FIELDS_FRAGMENT,
  PERSON_PROFILE_FIELDS_FRAGMENT,
  BUSINESS_PROFILE_FIELDS_FRAGMENT,
} from "../users/fragments";

export const GET_ME = gql`
  ${SELLER_FIELDS_FRAGMENT}
  ${PERSON_PROFILE_FIELDS_FRAGMENT}
  ${BUSINESS_PROFILE_FIELDS_FRAGMENT}
  query Me {
    me {
      ...SellerFields
      profile {
        ... on BusinessProfile {
          ...BusinessProfileFields
        }
        ... on PersonProfile {
          ...PersonProfileFields
        }
      }
    }
  }
`;
