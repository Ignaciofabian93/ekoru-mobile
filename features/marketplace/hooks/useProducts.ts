import { useQuery } from "@apollo/client/react";

import { GET_PRODUCTS } from "@/graphql/marketplace/queries";

import type { MarketplaceProduct, PageInfo, SortInput } from "../types";

interface Params {
  page: number;
  pageSize: number;
  filter?: Record<string, unknown>;
  sort?: SortInput;
}

export default function useProducts({ page, pageSize, filter, sort }: Params) {
  const { data, loading, error, previousData } = useQuery<{
    getProducts: { nodes: MarketplaceProduct[]; pageInfo: PageInfo };
  }>(GET_PRODUCTS, {
    variables: { page, pageSize, filter, sort },
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  // Fall back to the previous page while a new one loads so the grid does not
  // flash empty between paginations.
  const payload = data?.getProducts ?? previousData?.getProducts;

  return {
    products: payload?.nodes ?? [],
    pageInfo: payload?.pageInfo,
    loading,
    error,
  };
}
