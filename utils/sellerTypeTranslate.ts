import type { SellerType } from "../types/Product";

const sellerTypeMap: Record<SellerType, string> = {
  individual: "Particular",
  store: "Tienda",
  service: "Servicio",
};

export function sellerTypeTranslate(type: SellerType): string {
  return sellerTypeMap[type] ?? type;
}
