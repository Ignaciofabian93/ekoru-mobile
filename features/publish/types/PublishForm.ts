import type { Badge, ProductCondition } from "@/types/enums";

export interface PublishFormValues {
  images: string[];
  name: string;
  description: string;
  condition: ProductCondition | "";
  conditionDescription: string;
  brand: string;
  color: string;
  departmentId: string;
  departmentCategoryId: string;
  productCategoryId: string;
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
  departmentId: "",
  departmentCategoryId: "",
  productCategoryId: "",
  price: "",
  isExchangeable: false,
  badges: [],
  interests: [],
};
