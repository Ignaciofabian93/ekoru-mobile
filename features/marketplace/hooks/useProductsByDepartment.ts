import { useQuery } from "@apollo/client/react";

import { GET_DEPARTMENT_PRODUCTS_BY_SLUG } from "@/graphql/marketplace/queries";

import type { Department, MarketplaceProduct, PageInfo } from "../types";
import useProductFilters from "./useProductFilters";

export default function useProductsByDepartment({
  slug,
  language,
}: {
  slug: string;
  language: string;
}) {
  const fp = useProductFilters();

  // The category tree only needs to travel once. Filter/sort changes reset to
  // page 1, so the tree is re-included exactly when it is already cached.
  const requireDepartmentFetch = fp.page === 1;

  const { data, loading, error, previousData } = useQuery<{
    getDepartmentProductsBySlug: {
      department?: Department;
      products: { nodes: MarketplaceProduct[]; pageInfo: PageInfo };
    };
  }>(GET_DEPARTMENT_PRODUCTS_BY_SLUG, {
    variables: {
      slug,
      language: language.toUpperCase(),
      page: fp.page,
      pageSize: fp.pageSize,
      filter: fp.filterInput,
      sort: fp.sortInput,
      requireDepartmentFetch,
    },
    skip: !slug,
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  return {
    products:
      data?.getDepartmentProductsBySlug.products.nodes ??
      previousData?.getDepartmentProductsBySlug.products.nodes ??
      [],
    pageInfo:
      data?.getDepartmentProductsBySlug.products.pageInfo ??
      previousData?.getDepartmentProductsBySlug.products.pageInfo,
    // The tree only comes back on page 1 — fall back to the cached copy so the
    // category chips do not vanish while paginating.
    department:
      data?.getDepartmentProductsBySlug.department ??
      previousData?.getDepartmentProductsBySlug.department ??
      null,
    loading,
    error,
    ...fp,
  };
}
