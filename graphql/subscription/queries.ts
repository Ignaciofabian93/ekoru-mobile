import { gql } from "@apollo/client";

/**
 * The static plan cards render by plan key (FREEMIUM/BASIC/…), but the
 * subscription payment needs the real DB membership id. These list the active
 * memberships with just `id` + `membershipType` so the UI can map a card's plan
 * key to the id to charge. (Price + term are resolved server-side at payment.)
 */
export const PERSON_MEMBERSHIPS = gql`
  query PersonMemberships {
    personMemberships {
      id
      membershipType
    }
  }
`;

export const BUSINESS_MEMBERSHIPS = gql`
  query BusinessMemberships {
    businessMemberships {
      id
      membershipType
    }
  }
`;
