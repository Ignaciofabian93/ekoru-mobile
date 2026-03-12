import { useMemo, useState } from "react";
import { DUMMY_PRODUCTS } from "../data/dummyProducts";
import type { Product, ProductCondition } from "../types/Product";

export interface ProductFilters {
  brand: string;
  minPrice: string;
  maxPrice: string;
  conditions: ProductCondition[];
  isExchangeable: boolean | null;
}

export const DEFAULT_FILTERS: ProductFilters = {
  brand: "",
  minPrice: "",
  maxPrice: "",
  conditions: [],
  isExchangeable: null,
};

export const ITEMS_PER_PAGE_OPTIONS = [10, 20, 50] as const;

export default function useProductFilters(
  products: Product[] = DUMMY_PRODUCTS,
) {
  const [filters, setFilters] = useState<ProductFilters>(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(
    ITEMS_PER_PAGE_OPTIONS[0],
  );

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (
        filters.brand.trim() &&
        !p.brand?.toLowerCase().includes(filters.brand.trim().toLowerCase())
      )
        return false;

      const min = parseFloat(filters.minPrice);
      const max = parseFloat(filters.maxPrice);
      if (!isNaN(min) && p.price < min) return false;
      if (!isNaN(max) && p.price > max) return false;

      if (
        filters.conditions.length > 0 &&
        !filters.conditions.includes(p.condition)
      )
        return false;

      if (filters.isExchangeable !== null) {
        const sellerAllows =
          (p.seller?.profile as any)?.allowExchanges === true;
        if (filters.isExchangeable !== sellerAllows) return false;
      }

      return true;
    });
  }, [products, filters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const paginated = filtered.slice(
    (safePage - 1) * itemsPerPage,
    safePage * itemsPerPage,
  );

  const applyFilters = (newFilters: ProductFilters) => {
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
    filters.brand.trim() !== "" ||
    filters.minPrice !== "" ||
    filters.maxPrice !== "" ||
    filters.conditions.length > 0 ||
    filters.isExchangeable !== null;

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
    changeItemsPerPage,
    goToPage,
  };
}
