export type Language = "ES" | "EN" | "FR";

export type BlogCatalogCategory = {
  id: number;
  /** Icon name as returned by the API (mapped to a lucide icon in `constants/icons`). */
  icon: string;
  name: string;
  description: string;
  slug: string;
  href: string;
};

export type BlogCategoryTranslation = {
  id: number;
  name: string;
  slug: string;
  description: string;
  href: string | null;
};

/** Shape returned by `getBlogCategoryBySlug` — translated fields are nested under `translation`. */
export type BlogCategoryDetail = {
  id: number;
  icon: string;
  translation: BlogCategoryTranslation | null;
};

/** One language's copy of a blog post (the requested language). */
export type BlogPostTranslation = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  /** Full article body — only requested on the post detail query. */
  content?: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
};

/** A published blog post, carrying its translation for the requested language. */
export type BlogPost = {
  id: number;
  coverImage: string | null;
  type: string;
  likes: number;
  publishedAt: string | null;
  translation: BlogPostTranslation | null;
};

export type PageInfo = {
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};
