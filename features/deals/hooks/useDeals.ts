import { useQuery } from "@apollo/client/react";

import {
  MY_DEALS_AS_BUYER,
  MY_DEALS_AS_SELLER,
  MY_P2P_REPUTATION,
} from "@/graphql/deals/queries";

import type { Deal, P2PReputation } from "../types";

/**
 * The current seller's deals on both sides plus their P2P reputation. Polls so
 * status changes (a seller accepting, the sweep expiring one) surface without a
 * manual refresh.
 */
export default function useDeals() {
  const asBuyer = useQuery<{ myDealsAsBuyer: Deal[] }>(MY_DEALS_AS_BUYER, {
    fetchPolicy: "cache-and-network",
    pollInterval: 15000,
  });
  const asSeller = useQuery<{ myDealsAsSeller: Deal[] }>(MY_DEALS_AS_SELLER, {
    fetchPolicy: "cache-and-network",
    pollInterval: 15000,
  });
  const reputation = useQuery<{ myP2PReputation: P2PReputation }>(
    MY_P2P_REPUTATION,
    { fetchPolicy: "cache-and-network" },
  );

  return {
    buyerDeals: asBuyer.data?.myDealsAsBuyer ?? [],
    sellerDeals: asSeller.data?.myDealsAsSeller ?? [],
    reputation: reputation.data?.myP2PReputation ?? null,
    loading: asBuyer.loading || asSeller.loading,
    refetch: () => {
      void asBuyer.refetch();
      void asSeller.refetch();
      void reputation.refetch();
    },
  };
}
