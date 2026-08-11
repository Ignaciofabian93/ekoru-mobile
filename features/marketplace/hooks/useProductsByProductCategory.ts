import { useQuery } from "@apollo/client/react";

import { GET_PRODUCT_CATEGORY_PRODUCTS_BY_SLUG } from "@/graphql/marketplace/queries";

import type { MarketplaceProduct, PageInfo, ProductCategory } from "../types";
import useProductFilters from "./useProductFilters";

export default function useProductsByProductCategory({
  slug,
  language,
}: {
  slug: string;
  language: string;
}) {
  const fp = useProductFilters();

  const requireProductCategoryFetch = fp.page === 1;

  const { data, loading, error, previousData } = useQuery<{
    getProductCategoryProductsBySlug: {
      productCategory?: ProductCategory;
      products: { nodes: MarketplaceProduct[]; pageInfo: PageInfo };
    };
  }>(GET_PRODUCT_CATEGORY_PRODUCTS_BY_SLUG, {
    variables: {
      slug,
      language: language.toUpperCase(),
      page: fp.page,
      pageSize: fp.pageSize,
      filter: fp.filterInput,
      sort: fp.sortInput,
      requireProductCategoryFetch,
    },
    skip: !slug,
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  return {
    products:
      data?.getProductCategoryProductsBySlug.products.nodes ??
      previousData?.getProductCategoryProductsBySlug.products.nodes ??
      [],
    pageInfo:
      data?.getProductCategoryProductsBySlug.products.pageInfo ??
      previousData?.getProductCategoryProductsBySlug.products.pageInfo,
    productCategory:
      data?.getProductCategoryProductsBySlug.productCategory ??
      previousData?.getProductCategoryProductsBySlug.productCategory ??
      null,
    loading,
    error,
    ...fp,
  };
}
