import type { Seller } from "../types/Product";

export function displaySellerName(seller: Seller): string {
  const { profile } = seller;
  if (!profile) return "Vendedor";
  return [profile.firstName, profile.lastName].filter(Boolean).join(" ") || "Vendedor";
}
