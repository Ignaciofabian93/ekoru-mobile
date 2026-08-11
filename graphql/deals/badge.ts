import { gql } from "@apollo/client";

/**
 * Lightweight query for the deals badge count — no federation, just the fields
 * needed to decide which deals need the current user's action:
 *   - incoming requests as seller (PROPOSED)
 *   - accepted deals where I haven't confirmed yet
 */
export const DEALS_BADGE = gql`
  query DealsBadge {
    myDealsAsSeller {
      id
      status
      sellerConfirmedAt
    }
    myDealsAsBuyer {
      id
      status
      buyerConfirmedAt
    }
  }
`;
