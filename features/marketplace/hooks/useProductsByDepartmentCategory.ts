import { useQuery } from "@apollo/client/react";

import { GET_DEPARTMENT_CATEGORY_PRODUCTS_BY_SLUG } from "@/graphql/marketplace/queries";

import type {
  DepartmentCategory,
  MarketplaceProduct,
  PageInfo,
} from "../types";
import useProductFilters from "./useProductFilters";

export default function useProductsByDepartmentCategory({
  slug,
  language,
}: {
  slug: string;
  language: string;
}) {
  const fp = useProductFilters();

  const requireDepartmentCategoryFetch = fp.page === 1;

  const { data, loading, error, previousData } = useQuery<{
    getDepartmentCategoryProductsBySlug: {
      departmentCategory?: DepartmentCategory;
      products: { nodes: MarketplaceProduct[]; pageInfo: PageInfo };
    };
  }>(GET_DEPARTMENT_CATEGORY_PRODUCTS_BY_SLUG, {
    variables: {
      slug,
      language: language.toUpperCase(),
      page: fp.page,
      pageSize: fp.pageSize,
      filter: fp.filterInput,
      sort: fp.sortInput,
      requireDepartmentCategoryFetch,
    },
    skip: !slug,
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  return {
    products:
      data?.getDepartmentCategoryProductsBySlug.products.nodes ??
      previousData?.getDepartmentCategoryProductsBySlug.products.nodes ??
      [],
    pageInfo:
      data?.getDepartmentCategoryProductsBySlug.products.pageInfo ??
      previousData?.getDepartmentCategoryProductsBySlug.products.pageInfo,
    departmentCategory:
      data?.getDepartmentCategoryProductsBySlug.departmentCategory ??
      previousData?.getDepartmentCategoryProductsBySlug.departmentCategory ??
      null,
    loading,
    error,
    ...fp,
  };
}
