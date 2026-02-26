import type { ProductCondition } from "../types/enums";

const conditionMap: Record<ProductCondition, string> = {
  NEW: "Nuevo",
  OPEN_BOX: "Caja abierta",
  LIKE_NEW: "Como nuevo",
  FAIR: "Aceptable",
  POOR: "Desgastado",
  FOR_PARTS: "Para piezas",
  REFURBISHED: "Reacondicionado",
};

export function conditionTranslate(condition: ProductCondition): string {
  return conditionMap[condition] ?? condition;
}
