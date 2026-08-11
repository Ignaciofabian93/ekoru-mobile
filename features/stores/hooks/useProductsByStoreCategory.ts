import { useQuery } from "@apollo/client/react";

import { GET_STORE_CATEGORY_PRODUCTS_BY_SLUG } from "@/graphql/stores/queries";

import type { PageInfo, StoreCategoryDetail, StoreListProduct } from "../types";
import useStoreProductFilters from "./useStoreProductFilters";

export default function useProductsByStoreCategory({
  slug,
  language,
}: {
  slug: string;
  language: string;
}) {
  const fp = useStoreProductFilters();

  const requireStoreCategoryFetch = fp.page === 1;

  const { data, loading, error, previousData } = useQuery<{
    getStoreCategoryProductsBySlug: {
      storeCategory?: StoreCategoryDetail;
      products: { nodes: StoreListProduct[]; pageInfo: PageInfo };
    };
  }>(GET_STORE_CATEGORY_PRODUCTS_BY_SLUG, {
    variables: {
      slug,
      language: language.toUpperCase(),
      page: fp.page,
      pageSize: fp.pageSize,
      filter: fp.filterInput,
      sort: fp.sortInput,
      requireStoreCategoryFetch,
    },
    skip: !slug,
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  return {
    products:
      data?.getStoreCategoryProductsBySlug.products.nodes ??
      previousData?.getStoreCategoryProductsBySlug.products.nodes ??
      [],
    pageInfo:
      data?.getStoreCategoryProductsBySlug.products.pageInfo ??
      previousData?.getStoreCategoryProductsBySlug.products.pageInfo,
    storeCategory:
      data?.getStoreCategoryProductsBySlug.storeCategory ??
      previousData?.getStoreCategoryProductsBySlug.storeCategory ??
      null,
    loading,
    error,
    ...fp,
  };
}
