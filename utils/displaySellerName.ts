import type { Seller } from "../types/user";

export function displaySellerName(seller: Seller): string {
  const { profile } = seller;
  if (!profile) return "Vendedor";
  if (profile.__typename === "PersonProfile") {
    return [profile.firstName, profile.lastName].filter(Boolean).join(" ") || "Vendedor";
  }
  return profile.businessName || "Vendedor";
}
