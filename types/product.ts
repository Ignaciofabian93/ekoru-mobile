import {
  type Badge,
  type ProductCondition,
  type ProductSize,
  type WeightUnit,
} from "./enums";
import { type Seller } from "./user";

export type MaterialImpactBreakdown = {
  materialType: string;
  percentage: number;
  weightKG: number;
  co2SavingsKG: number;
  waterSavingsLT: number;
};

export type EnvironmentalImpact = {
  totalCo2SavingsKG: number;
  totalWaterSavingsLT: number;
  materialBreakdown: MaterialImpactBreakdown[];
};

export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  hasOffer: boolean;
  offerPrice?: number;
  sellerId: string;
  badges: Badge[];
  brand: string;
  color?: string;
  createdAt: string;
  images: string[];
  interests: string[];
  isActive: boolean;
  isExchangeable: boolean;
  productCategoryId: number;
  updatedAt: string;
  condition: ProductCondition;
  conditionDescription?: string;
  deletedAt?: string; // Soft delete - null means active
  environmentalImpact?: EnvironmentalImpact;
  seller?: Seller;
  productCategory?: ProductCategory;
};

export type StoreProduct = {
  id: number;
  name: string;
  description: string;
  stock: number;
  barcode?: string;
  sku?: string;
  price: number;
  hasOffer: boolean;
  offerPrice?: number;
  sellerId: string;
  createdAt: string;
  images: string[];
  isActive: boolean;
  updatedAt: string;
  badges: Badge[];
  brand?: string;
  color?: string;
  ratingCount: number;
  averageRating: number;
  reviewsNumber: number;
  storeSubCategoryId: number;
  deletedAt?: string;
};

export type ProductVariant = {
  id: number;
  storeProductId: number;
  variantName: string;
  sku?: string;
  price: number;
  stock: number;
  attributes?: Record<string, unknown>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type StoreProductMaterial = {
  id: number;
  storeProductId: number;
  materialTypeId: number;
  quantity: number;
  unit: string;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ProductCategoryMaterial = {
  id: number;
  productCategoryId: number;
  materialTypeId: number;
  quantity: number;
  unit: string;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
  material: MaterialImpactEstimate;
};

export type StoreCategory = {
  id: number;
  category: string;
  subcategories: StoreSubCategory[];
  href: string;
};

export type StoreSubCategory = {
  id: number;
  storeCategoryId: number;
  subCategory: string;
  storeCategory: StoreCategory;
  products: StoreProduct[];
  href: string;
  materials: StoreProductMaterial[];
};

export type ProductLike = {
  id: number;
  productId: number;
  sellerId: string; // Changed from userId to sellerId
};

export type ProductComment = {
  id: number;
  comment: string;
  productId: number;
  sellerId: string; // Changed from userId to sellerId
};

export type MaterialImpactEstimate = {
  id: number;
  materialType: string;
  estimatedCo2SavingsKG: number;
  estimatedWaterSavingsLT: number;
};

export type ProductCategory = {
  id: number;
  departmentCategoryId: number;
  keywords: string[];
  productCategoryName: string;
  size?: ProductSize;
  averageWeight?: number;
  weightUnit?: WeightUnit;
  products?: Product[];
  materials?: ProductCategoryMaterial[];
  href: string;
};

export type DepartmentCategory = {
  id: number;
  departmentCategoryName: string;
  departmentId: number;
  productCategory: ProductCategory[];
  href: string;
};

export type Department = {
  id: number;
  departmentName: string;
  departmentCategory: DepartmentCategory[];
  href: string;
};
