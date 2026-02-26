import type { ProductCondition, SellerType } from "../../../types/enums";
import type { Seller } from "../../../types/user";

export type { ProductCondition, SellerType, Seller };

export interface MaterialBreakdown {
  materialType: string;
  percentage: number;
}

export interface EnvironmentalImpact {
  totalCo2SavingsKG: number;
  totalWaterSavingsLT: number;
  materialBreakdown: MaterialBreakdown[];
}

export interface County {
  county: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  brand?: string;
  color?: string;
  condition: ProductCondition;
  images?: string[];
  environmentalImpact?: EnvironmentalImpact;
  seller?: Seller;
}
