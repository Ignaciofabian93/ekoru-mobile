import { QuotationStatus, ServicePricing } from "./enums";

export type StoreCatalog = {
  id: number;
  category: string;
  href: string;
  subcategories: {
    id: number;
    subCategory: string;
    href: string;
  }[];
};

export type StoreCategory = {
  id: number;
  category: string;
  href: string;
  subcategories?: StoreSubCategory[];
};

export type StoreSubCategory = {
  id: number;
  subCategory: string;
  storeCategoryId: number;
  href: string;
};

export type ServiceCategory = {
  id: number;
  category: string;
  href: string;
  subcategories?: ServiceSubCategory[];
};

export type ServiceSubCategory = {
  id: number;
  subCategory: string;
  serviceCategoryId: number;
  href: string;
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
