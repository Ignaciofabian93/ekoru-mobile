import { useQuery } from "@apollo/client/react";

import { GET_STORE_SUB_CATEGORY_PRODUCTS_BY_SLUG } from "@/graphql/stores/queries";

import type {
  PageInfo,
  StoreListProduct,
  StoreSubCategoryDetail,
} from "../types";
import useStoreProductFilters from "./useStoreProductFilters";

export default function useProductsByStoreSubCategory({
  slug,
  language,
}: {
  slug: string;
  language: string;
}) {
  const fp = useStoreProductFilters();

  const requireStoreSubCategoryFetch = fp.page === 1;

  const { data, loading, error, previousData } = useQuery<{
    getStoreSubCategoryProductsBySlug: {
      storeSubCategory?: StoreSubCategoryDetail;
      products: { nodes: StoreListProduct[]; pageInfo: PageInfo };
    };
  }>(GET_STORE_SUB_CATEGORY_PRODUCTS_BY_SLUG, {
    variables: {
      slug,
      language: language.toUpperCase(),
      page: fp.page,
      pageSize: fp.pageSize,
      filter: fp.filterInput,
      sort: fp.sortInput,
      requireStoreSubCategoryFetch,
    },
    skip: !slug,
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  return {
    products:
      data?.getStoreSubCategoryProductsBySlug.products.nodes ??
      previousData?.getStoreSubCategoryProductsBySlug.products.nodes ??
      [],
    pageInfo:
      data?.getStoreSubCategoryProductsBySlug.products.pageInfo ??
      previousData?.getStoreSubCategoryProductsBySlug.products.pageInfo,
    storeSubCategory:
      data?.getStoreSubCategoryProductsBySlug.storeSubCategory ??
      previousData?.getStoreSubCategoryProductsBySlug.storeSubCategory ??
      null,
    loading,
    error,
    ...fp,
  };
}
