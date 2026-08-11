import { useQuery } from "@apollo/client/react";
import { useMemo } from "react";

import { GET_BLOG_CATALOG } from "@/graphql/blog/queries";

import type { BlogCatalogCategory, Language } from "../types";

export default function useBlogCatalog(language: Language) {
  const { data, loading, error } = useQuery<{
    getBlogCatalog: BlogCatalogCategory[];
  }>(GET_BLOG_CATALOG, {
    variables: { language },
    fetchPolicy: "cache-first",
  });

  const categories = useMemo<BlogCatalogCategory[]>(
    () => data?.getBlogCatalog ?? [],
    [data],
  );

  return { categories, loading, error };
}
