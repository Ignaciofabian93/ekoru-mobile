import { useQuery } from "@apollo/client/react";

import { GET_SELLER_STOREFRONT } from "@/graphql/marketplace/queries";
import type { MarketplaceProduct, PageInfo } from "@/features/marketplace/types";

/**
 * A seller's public storefront: their live listings + the seller header (read
 * off the first product's federated seller projection).
 */
export default function useSellerStorefront(sellerId: string, pageSize = 100) {
  const { data, loading, error } = useQuery<{
    getProductsBySeller: { nodes: MarketplaceProduct[]; pageInfo: PageInfo };
  }>(GET_SELLER_STOREFRONT, {
    variables: { sellerId, page: 1, pageSize },
    skip: !sellerId,
    fetchPolicy: "cache-and-network",
  });

  const products = data?.getProductsBySeller.nodes ?? [];
  const seller = products[0]?.seller ?? null;

  return {
    products,
    seller,
    pageInfo: data?.getProductsBySeller.pageInfo,
    loading,
    error,
  };
}
