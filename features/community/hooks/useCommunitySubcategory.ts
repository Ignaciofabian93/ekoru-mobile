import { useQuery } from "@apollo/client/react";

import { GET_COMMUNITY_SUBCATEGORY_BY_SLUG } from "@/graphql/community/queries";

import type { CommunitySubcategoryDetail } from "../types";

export default function useCommunitySubcategory(slug: string, language: string) {
  const { data, loading, error } = useQuery<{
    getCommunitySubCategoryBySlug: CommunitySubcategoryDetail | null;
  }>(GET_COMMUNITY_SUBCATEGORY_BY_SLUG, {
    variables: { slug, language: language.toUpperCase() },
    skip: !slug,
    fetchPolicy: "cache-first",
  });

  return {
    subcategory: data?.getCommunitySubCategoryBySlug ?? null,
    loading,
    error,
  };
}
