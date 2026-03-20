export interface ProductCategoryTranslation {
  id: number;
  name: string;
  slug: string;
  href: string;
}

export interface ProductCategory {
  id: number;
  translation: ProductCategoryTranslation;
}

export interface DepartmentCategoryTranslation {
  id: number;
  name: string;
  slug: string;
  href: string;
}

export interface DepartmentCategory {
  id: number;
  translation: DepartmentCategoryTranslation;
  productCategory: ProductCategory[];
}

export interface DepartmentTranslation {
  id: number;
  name: string;
  slug: string;
  href: string;
}

export interface Department {
  id: number;
  translation: DepartmentTranslation;
  departmentCategory: DepartmentCategory[];
}
