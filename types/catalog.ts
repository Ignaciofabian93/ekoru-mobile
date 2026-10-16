import type { QuotationStatus, ServicePricing } from "./enums";

export type StoreCatalog = {
  id: number;
  category: string;
  subcategories: {
    id: number;
    subCategory: string;
  }[];
};

export type StoreCategory = {
  id: number;
  category: string;
  subcategories?: StoreSubCategory[];
};

export type StoreSubCategory = {
  id: number;
  subCategory: string;
  storeCategoryId: number;
};

export type ServiceCategory = {
  id: number;
  category: string;
  subcategories?: ServiceSubCategory[];
};

export type ServiceSubCategory = {
  id: number;
  subCategory: string;
  serviceCategoryId: number;
};

export type Service = {
  id: number;
  name: string;
  description: string;
  sellerId: string;
  serviceSubCategoryId: number;
  pricing: ServicePricing;
  price?: number;
  priceUnit?: string;
  estimatedDuration?: number;
  images?: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
};

export type ServiceReview = {
  id: number;
  serviceId: number;
  sellerId: string;
  rating: number;
  comment?: string;
  createdAt: string;
};

export type Quotation = {
  id: number;
  serviceId: number;
  clientId: string;
  providerId: string;
  description: string;
  requestedDate?: string;
  estimatedPrice?: number;
  finalPrice?: number;
  status: QuotationStatus;
  notes?: string;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
};
