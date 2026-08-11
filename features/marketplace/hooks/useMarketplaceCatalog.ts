import { useQuery } from "@apollo/client/react";
import { useMemo } from "react";

import { GET_MARKETPLACE_CATALOG } from "@/graphql/marketplace/queries";

import type { CatalogDepartment, Language } from "../types";

export default function useMarketplaceCatalog(language: Language) {
  const { data, loading, error } = useQuery<{
    getMarketplaceCatalog: CatalogDepartment[];
  }>(GET_MARKETPLACE_CATALOG, {
    variables: { language },
    fetchPolicy: "cache-first",
  });

  const departments = useMemo<CatalogDepartment[]>(
    () => data?.getMarketplaceCatalog ?? [],
    [data],
  );

  return { departments, loading, error };
}
