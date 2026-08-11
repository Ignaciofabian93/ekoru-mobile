export type SearchResultType = "PRODUCT" | "STORE_PRODUCT" | "SERVICE";

/** Flat indexed projection every catalog hit shares (ekoru-search subgraph). */
export interface SearchResultItem {
  id: number;
  type: SearchResultType;
  name: string;
  description?: string | null;
  price?: number | null;
  offerPrice?: number | null;
  hasOffer: boolean;
  images?: string[] | null;
  category?: string | null;
  subcategory?: string | null;
  rating?: number | null;
  reviewCount?: number | null;
  sellerId?: string | null;
  tags?: string[] | null;
  highlightedName?: string | null;
}

export interface SearchPageInfo {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface SearchResponse {
  searchId?: number | null;
  query: string;
  processingTimeMs: number;
  items: SearchResultItem[];
  pageInfo: SearchPageInfo;
}

export const SEARCH_PAGE_SIZE = 10;
