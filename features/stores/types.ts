import type { EnvironmentalImpact } from "@/features/marketplace/types";
import type { Seller } from "@/types/user";

export type Language = "ES" | "EN" | "FR";

// ─── Store catalog (getStoreCatalog) ──────────────────────────────────
export interface StoreCatalogSubItem {
  id: number;
  name: string;
  slug: string;
  href: string;
}

export interface StoreCatalogCategory {
  id: number;
  name: string;
  slug: string;
  href: string;
  subCategoryItems: StoreCatalogSubItem[];
}

// ─── Store product (listing projection) ───────────────────────────────
// Narrow projection of the global StoreProduct — only what the grid/card read.
export interface StoreListProduct {
  id: number | string;
  name: string;
  brand?: string | null;
  price: number;
  hasOffer?: boolean;
  offerPrice?: number | null;
  images?: string[];
  averageRating?: number;
  reviewsNumber?: number;
  stock?: number;
  sellerId?: string;
  isLiked?: boolean;
  isActive?: boolean;
  description?: string | null;
  environmentalImpact?: EnvironmentalImpact | null;
  seller?: Seller | null;
}

export interface PageInfo {
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// ─── Consolidated category browsing (get*ProductsBySlug) ──────────────
export interface StoreSubCategoryDetail {
  id: number;
  translation: { id: number; name: string; slug: string; href: string } | null;
}

export interface StoreCategoryDetail {
  id: number;
  translation: { id: number; name: string; slug: string; href: string } | null;
  storeSubCategory: StoreSubCategoryDetail[];
}

// ─── Filters & sort ───────────────────────────────────────────────────
export type StoreSortField = "createdAt" | "price";

export interface StoreSortInput {
  field: StoreSortField;
  order: "asc" | "desc";
}

export type StoreSortValue = "newest" | "oldest" | "priceAsc" | "priceDesc";

export interface StoreFilters {
  search: string;
  minPrice: string;
  maxPrice: string;
  onOfferOnly: boolean;
}

export const DEFAULT_PAGE_SIZE = 12;

export const PAGE_SIZE_OPTIONS = [12, 24, 48];

export const EMPTY_FILTERS: StoreFilters = {
  search: "",
  minPrice: "",
  maxPrice: "",
  onOfferOnly: false,
};
