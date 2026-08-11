import { useQuery } from "@apollo/client/react";
import { useMemo } from "react";

import { GET_STORES_CATALOG } from "@/graphql/stores/queries";

import type { Language, StoreCatalogCategory } from "../types";

export default function useStoreCatalog(language: Language) {
  const { data, loading, error } = useQuery<{
    getStoreCatalog: StoreCatalogCategory[];
  }>(GET_STORES_CATALOG, {
    variables: { language },
    fetchPolicy: "cache-first",
  });

  const categories = useMemo<StoreCatalogCategory[]>(
    () => data?.getStoreCatalog ?? [],
    [data],
  );

  return { categories, loading, error };
}
