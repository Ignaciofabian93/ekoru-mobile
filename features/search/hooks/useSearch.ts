import { useQuery } from "@apollo/client/react";
import { useState } from "react";

import { SEARCH } from "@/graphql/search/queries";

import { SEARCH_PAGE_SIZE, type SearchResponse } from "../types";

// The ekoru-search subgraph scopes results to a market. Mobile is Chile-primary;
// wire this to the location store when multi-market mobile lands.
const COUNTRY = "CL";

/**
 * Federated catalog search (products + store products + services), scoped to
 * `language` + market. Skipped while the term is empty; keeps the previous page
 * on screen while the next loads.
 */
export default function useSearch(query: string, language: string) {
  const [page, setPage] = useState(1);
  const trimmed = query.trim();

  const { data, previousData, loading, error } = useQuery<{
    search: SearchResponse;
  }>(SEARCH, {
    variables: {
      input: { query: trimmed, page, pageSize: SEARCH_PAGE_SIZE },
      language: language.toUpperCase(),
      country: COUNTRY,
    },
    skip: trimmed.length === 0,
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  const payload = data?.search ?? previousData?.search;

  return {
    items: payload?.items ?? [],
    pageInfo: payload?.pageInfo,
    total: payload?.pageInfo?.totalItems ?? 0,
    loading,
    error,
    page,
    setPage,
  };
}
