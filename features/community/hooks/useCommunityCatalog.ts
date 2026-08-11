import { useQuery } from "@apollo/client/react";
import { useMemo } from "react";

import { GET_COMMUNITY_CATALOG } from "@/graphql/community/queries";

import type { CommunityCategory, Language } from "../types";

export default function useCommunityCatalog(language: Language) {
  const { data, loading, error } = useQuery<{
    getCommunityCatalog: CommunityCategory[];
  }>(GET_COMMUNITY_CATALOG, {
    variables: { language },
    fetchPolicy: "cache-first",
  });

  const categories = useMemo<CommunityCategory[]>(
    () => data?.getCommunityCatalog ?? [],
    [data],
  );

  return { categories, loading, error };
}
