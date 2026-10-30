import { useQuery } from "@apollo/client/react";
import { useEffect, useState } from "react";

import { SEARCH } from "@/graphql/search/queries";

import { SEARCH_PAGE_SIZE, type SearchResponse } from "../types";

// The ekoru-search subgraph scopes results to a market. Mobile is Chile-primary;
// wire this to the location store when multi-market mobile lands.
const COUNTRY = "CL";

/** How long typing must pause before the term is searched. */
const DEBOUNCE_MS = 350;

/**
 * Federated catalog search (products + store products + services), scoped to
 * `language` + market. Skipped while the term is empty; keeps the previous page
 * on screen while the next loads.
 *
 * The term is searched once typing pauses: every search is logged for the
 * search analytics, and a query per keystroke would log "b", "bo", "bol"…
 */
export default function useSearch(query: string, language: string) {
  const [page, setPage] = useState(1);
  const [trimmed, setTrimmed] = useState(() => query.trim());

  useEffect(() => {
    const next = query.trim();
    if (next === "") {
      setTrimmed("");
      return;
    }
    const timer = setTimeout(() => setTrimmed(next), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [query]);

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
    /** Ties a result tap to this search, for the search analytics. */
    searchId: payload?.searchId ?? null,
    items: payload?.items ?? [],
    pageInfo: payload?.pageInfo,
    total: payload?.pageInfo?.totalItems ?? 0,
    // Still typing counts as loading, so the screen never flashes "no results".
    loading: loading || query.trim() !== trimmed,
    error,
    page,
    setPage,
  };
}
