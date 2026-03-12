export interface StoreCategory {
  id: string;
  name: string;
}

export interface Store {
  id: string;
  storeName: string;
  category: string;
  rating: number;
  reviewCount: number;
  productCount: number;
  location: string;
  verified: boolean;
  tags: string[];
  storeCategories: StoreCategory[];
}
