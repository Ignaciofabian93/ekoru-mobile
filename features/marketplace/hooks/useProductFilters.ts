import { useCallback, useMemo, useState } from "react";

import type { ProductCondition } from "@/types/enums";

import {
  DEFAULT_PAGE_SIZE,
  EMPTY_FILTERS,
  type ProductFilters,
  type ProductSortValue,
  type SortInput,
} from "../types";

// Values match the marketplace service's ProductSortInput: prisma field name
// plus lowercase order.
const SORT_MAP: Record<ProductSortValue, SortInput> = {
  newest: { field: "createdAt", order: "desc" },
  oldest: { field: "createdAt", order: "asc" },
  priceAsc: { field: "price", order: "asc" },
  priceDesc: { field: "price", order: "desc" },
};

/**
 * Server-side filter/sort/pagination state for marketplace product queries.
 * Produces `filterInput`/`sortInput` to feed a GraphQL query — the gateway
 * does the filtering, not the client. `applyFilters` supports the filter
 * sheet's batch draft-then-apply UX.
 */
export default function useProductFilters() {
  const [filters, setFilters] = useState<ProductFilters>(EMPTY_FILTERS);
  const [sort, setSort] = useState<ProductSortValue>("newest");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);

  const setField = useCallback(
    <K extends keyof ProductFilters>(key: K, value: ProductFilters[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
      setPage(1);
    },
    [],
  );

  // Batch-apply a full draft from the filter sheet.
  const applyFilters = useCallback((next: ProductFilters) => {
    setFilters(next);
    setPage(1);
  }, []);

  const reset = useCallback(() => {
    setFilters(EMPTY_FILTERS);
    setSort("newest");
    setPage(1);
  }, []);

  const setSortValue = useCallback((value: ProductSortValue) => {
    setSort(value);
    setPage(1);
  }, []);

  const setPageSizeValue = useCallback((size: number) => {
    setPageSize(size);
    setPage(1);
  }, []);

  // Build the GraphQL filter input. Empty fields are dropped so the gateway
  // does not receive nulls that would short-circuit the SQL where-clause.
  const filterInput = useMemo(() => {
    const input: Record<string, unknown> = {};
    if (filters.search.trim()) input.name = filters.search.trim();
    if (filters.minPrice) input.minPrice = Number(filters.minPrice);
    if (filters.maxPrice) input.maxPrice = Number(filters.maxPrice);
    if (filters.condition) input.condition = filters.condition as ProductCondition;
    if (filters.isExchangeable) input.isExchangeable = true;
    return Object.keys(input).length ? input : undefined;
  }, [filters]);

  const sortInput = useMemo(() => SORT_MAP[sort], [sort]);

  const hasActiveFilters = useMemo(
    () =>
      filters.search.trim() !== "" ||
      filters.minPrice !== "" ||
      filters.maxPrice !== "" ||
      filters.condition !== "" ||
      filters.isExchangeable,
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
