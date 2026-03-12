import { useMemo, useState } from "react";
import { DUMMY_STORES } from "../data/dummyStores";
import type { Store } from "../types/Store";

export interface StoreFilters {
  verified: boolean | null;
  minRating: number | null;
  tags: string[];
}

export const DEFAULT_FILTERS: StoreFilters = {
  verified: null,
  minRating: null,
  tags: [],
};

export const ITEMS_PER_PAGE_OPTIONS = [10, 20, 50] as const;

export default function useStoreFilters(stores: Store[] = DUMMY_STORES) {
  const [filters, setFilters] = useState<StoreFilters>(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(
    ITEMS_PER_PAGE_OPTIONS[0],
  );

  const filtered = useMemo(() => {
    return stores.filter((s) => {
      if (filters.verified !== null && s.verified !== filters.verified)
        return false;
      if (filters.minRating !== null && s.rating < filters.minRating)
        return false;
      if (
        filters.tags.length > 0 &&
        !filters.tags.some((tag) => s.tags.includes(tag))
      )
        return false;
      return true;
    });
  }, [stores, filters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const paginated = filtered.slice(
    (safePage - 1) * itemsPerPage,
    safePage * itemsPerPage,
  );

  const applyFilters = (newFilters: StoreFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setPage(1);
  };

  const goToPage = (p: number) => setPage(Math.max(1, Math.min(p, totalPages)));

  const changeItemsPerPage = (n: number) => {
    setItemsPerPage(n);
    setPage(1);
  };

  const hasActiveFilters =
    filters.verified !== null ||
    filters.minRating !== null ||
    filters.tags.length > 0;

  return {
    filters,
    applyFilters,
    resetFilters,
    hasActiveFilters,
    filteredCount: filtered.length,
    paginated,
    page: safePage,
    totalPages,
    itemsPerPage,
    goToPage,
    changeItemsPerPage,
  };
}
