import { useQuery } from "@apollo/client/react";

import { GET_PRODUCT_BY_ID } from "@/graphql/marketplace/queries";

import type { MarketplaceProduct } from "../types";

/** Single product detail by id (marketplace product page). */
export default function useProduct(id: string) {
  const { data, loading, error } = useQuery<{
    getProductById: MarketplaceProduct;
  }>(GET_PRODUCT_BY_ID, {
    variables: { id },
    skip: !id,
    fetchPolicy: "cache-and-network",
  });

  return { product: data?.getProductById ?? null, loading, error };
}
