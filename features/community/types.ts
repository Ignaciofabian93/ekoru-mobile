export type Language = "ES" | "EN" | "FR";

export type CommunitySubcategory = {
  id: number;
  subcategory: string;
  slug: string;
  href: string | null;
  description: string | null;
};

export type CommunityCategory = {
  id: number;
  category: string;
  slug: string;
  href: string | null;
  description: string | null;
  subcategories: CommunitySubcategory[];
};

export type CommunityCategoryTranslation = {
  id: number;
  category: string;
  slug: string;
  description: string | null;
  href: string | null;
};

export type CommunitySubcategoryTranslation = {
  id: number;
  subCategory: string;
  slug: string;
  description: string | null;
  href: string | null;
};

/** Shape returned by `getCommunityCategoryBySlug` — translated fields nested under `translation`. */
export type CommunityCategoryDetail = {
  id: number;
  translation: CommunityCategoryTranslation | null;
  subcategories: {
    id: number;
    translation: CommunitySubcategoryTranslation | null;
  }[];
};

/** Shape returned by `getCommunitySubCategoryBySlug`. */
export type CommunitySubcategoryDetail = {
  id: number;
  communityCategoryId: number;
  translation: CommunitySubcategoryTranslation | null;
};
