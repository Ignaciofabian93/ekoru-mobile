import type { ProductCondition, SellerType } from "@/types/enums";
import type { Seller } from "@/types/user";

export type { ProductCondition, SellerType, Seller };

/** GraphQL `Language` enum value. */
export type Language = "ES" | "EN" | "FR";

// ─── Environmental impact ─────────────────────────────────────────────
// Mirrors the marketplace `EnvironmentalImpactFields` GraphQL fragment.
export interface MaterialBreakdown {
  materialType: string;
  materialTypeLabel?: string;
  quantity?: number;
  unit?: string;
  co2SavingsKG?: number;
  waterSavingsLT?: number;
}

export interface EnvironmentalImpact {
  totalCo2SavingsKG: number;
  totalWaterSavingsLT: number;
  materialBreakdown: MaterialBreakdown[];
}

// ─── Product (marketplace card / grid / detail projection) ────────────
// GraphQL `ID` serializes as a string, so `id` is a string here.
export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  brand?: string;
  color?: string;
  condition: ProductCondition;
  images?: string[];
  isActive?: boolean;
  isExchangeable?: boolean;
  isLiked?: boolean;
  viewCount?: number;
  sellerId?: string;
  environmentalImpact?: EnvironmentalImpact;
  seller?: Seller;
}

/** Alias mirroring the web app's naming. */
export type MarketplaceProduct = Product;

// ─── Department / category tree (getDepartments / by-slug queries) ────
export interface Translation {
  id: number;
  name: string;
  slug: string;
  href: string;
}

export interface ProductCategory {
  id: number;
  translation: Translation;
}

export interface DepartmentCategory {
  id: number;
  translation: Translation;
  productCategory: ProductCategory[];
}

export interface Department {
  id: number;
  translation: Translation;
  departmentCategory: DepartmentCategory[];
}

// ─── Catalog projection (getMarketplaceCatalog) ───────────────────────
export interface CatalogProductCategory {
  id: number;
  name: string;
  slug: string;
  href: string;
}

export interface CatalogDepartmentCategory {
  id: number;
  name: string;
  slug: string;
  href: string;
  productCategories: CatalogProductCategory[];
}

export interface CatalogDepartment {
  id: number;
  name: string;
  slug: string;
  href: string;
  categories: CatalogDepartmentCategory[];
}

// ─── Pagination ───────────────────────────────────────────────────────
export interface PageInfo {
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// ─── Filters & sort ───────────────────────────────────────────────────
export interface SortInput {
  field: string;
  order: "asc" | "desc";
}

export type ProductSortValue = "newest" | "oldest" | "priceAsc" | "priceDesc";

export interface ProductFilters {
  search: string;
  minPrice: string;
  maxPrice: string;
  condition: ProductCondition | "";
  isExchangeable: boolean;
}

export const DEFAULT_PAGE_SIZE = 10;

export const PAGE_SIZE_OPTIONS = [10, 20, 50];

export const EMPTY_FILTERS: ProductFilters = {
  search: "",
  minPrice: "",
  maxPrice: "",
  condition: "",
  isExchangeable: false,
};
