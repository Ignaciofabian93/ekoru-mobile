import type { Seller } from "./Product";

export interface Store {
  id: string;
  storeName: string;
  seller: Seller;
  rating: number;
  reviewCount: number;
  productCount: number;
  tags: string[];
  image?: string;
}
