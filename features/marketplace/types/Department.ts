export interface ProductCategoryTranslation {
  id: string;
  name: string;
  slug: string;
  href: string;
}

export interface ProductCategory {
  id: string;
  translation: ProductCategoryTranslation;
}

export interface DepartmentCategoryTranslation {
  id: string;
  name: string;
  slug: string;
  href: string;
}

export interface DepartmentCategory {
  id: string;
  translation: DepartmentCategoryTranslation;
  productCategory: ProductCategory[];
}

export interface DepartmentTranslation {
  id: string;
  name: string;
  slug: string;
  href: string;
}

export interface Department {
  id: string;
  translation: DepartmentTranslation;
  departmentCategory: DepartmentCategory[];
}
