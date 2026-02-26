import type { SellerType } from "../types/enums";

const sellerTypeMap: Record<SellerType, string> = {
  PERSON: "Particular",
  STARTUP: "Startup",
  COMPANY: "Empresa",
};

export function sellerTypeTranslate(type: SellerType): string {
  return sellerTypeMap[type] ?? type;
}
