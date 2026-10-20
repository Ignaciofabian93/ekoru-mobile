import { GET_STORE_PRODUCT_BY_ID } from "@/graphql/stores/queries";
import type { Seller } from "@/types/user";
import { useQuery } from "@apollo/client/react";

/** One declared material and its share of the product (STO-4). */
export interface StoreProductMaterial {
  id: number;
  materialTypeId: number;
  materialType: string;
  label: string;
  percentage: number;
}

/** What the store product screen reads from `getStoreProductById`. */
export interface StoreProductDetail {
  id: number | string;
  name: string;
  description?: string | null;
  price: number;
  hasOffer?: boolean;
  offerPrice?: number | null;
  stock?: number;
  images?: string[];
  brand?: string | null;
  color?: string | null;
  warranty?: string | null;
  averageRating?: number;
  reviewsNumber?: number;
  sellerId: string;
  isActive?: boolean;
  materials?: StoreProductMaterial[] | null;
  seller?: Seller | null;
}

export default function useStoreProduct(id: string) {
  const { data, loading } = useQuery<{ getStoreProductById: StoreProductDetail | null }>(
    GET_STORE_PRODUCT_BY_ID,
    { variables: { id }, skip: !id },
  );
  return { product: data?.getStoreProductById ?? null, loading };
}
