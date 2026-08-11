import { useQuery } from "@apollo/client/react";
import { useState } from "react";

import { GET_SERVICE_CATEGORY_SERVICES_BY_SLUG } from "@/graphql/services/queries";

import type { ServiceCategoryDetail, ServicesConnection } from "../types";

const DEFAULT_PAGE_SIZE = 12;

export default function useServicesByCategory({
  slug,
  language,
}: {
  slug: string;
  language: string;
}) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const requireServiceCategoryFetch = page === 1;

  const { data, loading, error, previousData } = useQuery<{
    getServiceCategoryServicesBySlug: {
      serviceCategory?: ServiceCategoryDetail;
      services: ServicesConnection;
    } | null;
  }>(GET_SERVICE_CATEGORY_SERVICES_BY_SLUG, {
    variables: {
      slug,
      language: language.toUpperCase(),
      page,
      pageSize,
      isActive: true,
      requireServiceCategoryFetch,
    },
    skip: !slug,
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  const payload =
    data?.getServiceCategoryServicesBySlug ??
    previousData?.getServiceCategoryServicesBySlug;

  return {
    services: payload?.services.nodes ?? [],
    pageInfo: payload?.services.pageInfo,
    serviceCategory:
      data?.getServiceCategoryServicesBySlug?.serviceCategory ??
      previousData?.getServiceCategoryServicesBySlug?.serviceCategory ??
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
