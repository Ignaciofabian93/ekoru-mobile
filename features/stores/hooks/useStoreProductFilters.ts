import { useCallback, useMemo, useState } from "react";

import {
  DEFAULT_PAGE_SIZE,
  EMPTY_FILTERS,
  type StoreFilters,
  type StoreSortInput,
  type StoreSortValue,
} from "../types";

// Matches the stores service's StoreProductSortInput: prisma field + lowercase order.
const SORT_MAP: Record<StoreSortValue, StoreSortInput> = {
  newest: { field: "createdAt", order: "desc" },
  oldest: { field: "createdAt", order: "asc" },
  priceAsc: { field: "price", order: "asc" },
  priceDesc: { field: "price", order: "desc" },
};

/**
 * Server-side filter/sort/pagination state for store-product queries.
 * `applyFilters` supports the filter sheet's batch draft-then-apply UX.
 */
export default function useStoreProductFilters() {
  const [filters, setFilters] = useState<StoreFilters>(EMPTY_FILTERS);
  const [sort, setSort] = useState<StoreSortValue>("newest");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);

  const setField = useCallback(
    <K extends keyof StoreFilters>(key: K, value: StoreFilters[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
      setPage(1);
    },
    [],
  );

  const applyFilters = useCallback((next: StoreFilters) => {
    setFilters(next);
    setPage(1);
  }, []);

  const reset = useCallback(() => {
    setFilters(EMPTY_FILTERS);
    setSort("newest");
    setPage(1);
  }, []);

  const setSortValue = useCallback((value: StoreSortValue) => {
    setSort(value);
    setPage(1);
  }, []);

  const setPageSizeValue = useCallback((size: number) => {
    setPageSize(size);
    setPage(1);
  }, []);

  const filterInput = useMemo(() => {
    const input: Record<string, unknown> = {};
    if (filters.search.trim()) input.name = filters.search.trim();
    if (filters.minPrice) input.minPrice = Number(filters.minPrice);
    if (filters.maxPrice) input.maxPrice = Number(filters.maxPrice);
    if (filters.onOfferOnly) input.hasOffer = true;
    return Object.keys(input).length ? input : undefined;
  }, [filters]);

  const sortInput = useMemo(() => SORT_MAP[sort], [sort]);

  const hasActiveFilters = useMemo(
    () =>
      filters.search.trim() !== "" ||
      filters.minPrice !== "" ||
      filters.maxPrice !== "" ||
      filters.onOfferOnly,
    [filters],
  );

  return {
    filters,
    sort,
    page,
    pageSize,
    setField,
    applyFilters,
    reset,
    setSort: setSortValue,
    setPage,
    setPageSize: setPageSizeValue,
    filterInput,
    sortInput,
    hasActiveFilters,
  };
}
