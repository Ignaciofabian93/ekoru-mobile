import type { ProductCondition } from "../types/Product";

const conditionMap: Record<ProductCondition, string> = {
  new: "Nuevo",
  like_new: "Como nuevo",
  good: "Buen estado",
  fair: "Aceptable",
  poor: "Desgastado",
};

export function conditionTranslate(condition: ProductCondition): string {
  return conditionMap[condition] ?? condition;
}
