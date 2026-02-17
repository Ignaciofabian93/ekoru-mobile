export type ProductCondition = "new" | "like_new" | "good" | "fair" | "poor";

export type SellerType = "individual" | "store" | "service";

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

export interface SellerProfile {
  firstName?: string;
  lastName?: string;
}

export interface Seller {
  sellerType: SellerType;
  profile?: SellerProfile;
  phone?: string;
  address?: string;
  county?: County;
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
