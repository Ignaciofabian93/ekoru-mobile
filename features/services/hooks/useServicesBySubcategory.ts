import { useQuery } from "@apollo/client/react";
import { useState } from "react";

import { GET_SERVICE_SUB_CATEGORY_SERVICES_BY_SLUG } from "@/graphql/services/queries";

import type { ServiceSubCategoryDetail, ServicesConnection } from "../types";

const DEFAULT_PAGE_SIZE = 12;

export default function useServicesBySubcategory({
  slug,
  language,
}: {
  slug: string;
  language: string;
}) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const requireServiceSubCategoryFetch = page === 1;

  const { data, loading, error, previousData } = useQuery<{
    getServiceSubCategoryServicesBySlug: {
      serviceSubCategory?: ServiceSubCategoryDetail;
      services: ServicesConnection;
    } | null;
  }>(GET_SERVICE_SUB_CATEGORY_SERVICES_BY_SLUG, {
    variables: {
      slug,
      language: language.toUpperCase(),
      page,
      pageSize,
      isActive: true,
      requireServiceSubCategoryFetch,
    },
    skip: !slug,
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  const payload =
    data?.getServiceSubCategoryServicesBySlug ??
    previousData?.getServiceSubCategoryServicesBySlug;

  return {
    services: payload?.services.nodes ?? [],
    pageInfo: payload?.services.pageInfo,
    serviceSubCategory:
      data?.getServiceSubCategoryServicesBySlug?.serviceSubCategory ??
      previousData?.getServiceSubCategoryServicesBySlug?.serviceSubCategory ??
      null,
    loading,
    error,
    pageSize,
    handlePageChange: setPage,
    handlePageSizeChange: (size: number) => {
      setPageSize(size);
      setPage(1);
    },
  };
}
