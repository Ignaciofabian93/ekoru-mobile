import { useQuery } from "@apollo/client/react";

import { GET_COMMUNITY_CATEGORY_BY_SLUG } from "@/graphql/community/queries";

import type { CommunityCategoryDetail } from "../types";

export default function useCommunityCategory(slug: string, language: string) {
  const { data, loading, error } = useQuery<{
    getCommunityCategoryBySlug: CommunityCategoryDetail | null;
  }>(GET_COMMUNITY_CATEGORY_BY_SLUG, {
    variables: { slug, language: language.toUpperCase() },
    skip: !slug,
    fetchPolicy: "cache-first",
  });

  return { category: data?.getCommunityCategoryBySlug ?? null, loading, error };
}
