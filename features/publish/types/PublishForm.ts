import type { Badge, ProductCondition } from "@/types/enums";

export interface PublishFormValues {
  images: string[];
  name: string;
  description: string;
  condition: ProductCondition | "";
  conditionDescription: string;
  brand: string;
  color: string;
  departmentId: number | null;
  departmentCategoryId: number | null;
  productCategoryId: number | null;
  price: string;
  isExchangeable: boolean;
  badges: Badge[];
  interests: string[];
}

export const INITIAL_FORM_VALUES: PublishFormValues = {
  images: [],
  name: "",
  description: "",
  condition: "",
  conditionDescription: "",
  brand: "",
  color: "",
  departmentId: null,
  departmentCategoryId: null,
  productCategoryId: null,
  price: "",
  isExchangeable: false,
  badges: [],
  interests: [],
};
