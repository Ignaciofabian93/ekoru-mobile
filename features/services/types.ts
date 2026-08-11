export type Language = "ES" | "EN" | "FR";

/* ---- Catalog (getServiceCatalog) ---- */

export type ServiceCatalogSubItem = {
  id: number;
  name: string;
  slug: string;
  href: string | null;
};

export type ServiceCatalogItem = {
  id: number;
  name: string;
  slug: string;
  href: string | null;
  subCategoryItems: ServiceCatalogSubItem[];
};

/* ---- Category / subcategory detail (by slug) ---- */

export type ServiceSubCategory = {
  id: number;
  subCategory: string;
  serviceCount: number;
  href: string | null;
  translation: { subCategory: string; slug: string } | null;
};

export type ServiceCategoryDetail = {
  id: number;
  category: string;
  translation: {
    category: string;
    slug: string;
    metaDescription: string | null;
  } | null;
  subcategories: ServiceSubCategory[];
};

export type ServiceSubCategoryDetail = {
  id: number;
  subCategory: string;
  serviceCount: number;
  translation: {
    subCategory: string;
    slug: string;
    metaDescription: string | null;
  } | null;
};

/* ---- Services list (getServicesBySubCategory) ---- */

export type ServiceNode = {
  id: string;
  name: string;
  description: string | null;
  basePrice: number | null;
  duration: string | null;
  images: string[] | null;
  averageRating: number | null;
  reviewCount: number | null;
  isLiked?: boolean;
  // Fetched by the service fragment; drives the seller's active/drafts split in
  // their own listings dashboard.
  isActive?: boolean;
  seller: {
    isVerified: boolean;
    profile: { businessName?: string | null; logo?: string | null } | null;
  } | null;
  serviceCategory: { subCategory: string } | null;
};

export type ServicesConnection = {
  pageInfo: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNextPage: boolean;
  };
  nodes: ServiceNode[];
};
