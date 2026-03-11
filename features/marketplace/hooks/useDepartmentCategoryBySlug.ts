import { GET_DEPARTMENT_CATEGORY_BY_SLUG } from "@/graphql/marketplace/queries";
import i18n from "@/i18n";
import { useQuery } from "@apollo/client/react";
import type { DepartmentCategory } from "../types/Department";

function toGqlLanguage(lang: string): string {
  return (lang ?? "es").toUpperCase();
}

export default function useDepartmentCategoryBySlug(slug: string) {
  const language = toGqlLanguage(i18n.language);

  const { data, loading, error, refetch } = useQuery<{
    getDepartmentCategoryBySlug: DepartmentCategory;
  }>(GET_DEPARTMENT_CATEGORY_BY_SLUG, {
    variables: { slug, language },
    skip: !slug,
  });

  return {
    departmentCategory: data?.getDepartmentCategoryBySlug ?? null,
    loading,
    error,
    refetch,
  };
}
