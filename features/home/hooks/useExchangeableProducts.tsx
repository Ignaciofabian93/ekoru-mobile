import { EXCHANGEABLE_PRODUCTS } from "@/graphql/home/queries";
import type { PageInfo } from "@/types/general";
import type { Product } from "@/types/product";
import { useQuery } from "@apollo/client/react";

export interface ProductSortInput {
  field: string;
  order: "asc" | "desc";
}

interface UseExchangeableProductsOptions {
  page?: number;
  pageSize?: number;
  sort?: ProductSortInput;
}

interface ExchangeableProductsData {
  getExchangeableProducts: {
    nodes: Product[];
    pageInfo: PageInfo;
  };
}

export default function useExchangeableProducts({
  page = 1,
  pageSize = 20,
  sort,
}: UseExchangeableProductsOptions = {}) {
  const { data, loading, error, refetch } = useQuery<ExchangeableProductsData>(
    EXCHANGEABLE_PRODUCTS,
    {
      variables: { page, pageSize, sort },
      fetchPolicy: "cache-first",
    },
  );

  return {
    products: data?.getExchangeableProducts.nodes ?? [],
    pageInfo: data?.getExchangeableProducts.pageInfo ?? null,
    loading,
    error,
    refetch,
  };
}
