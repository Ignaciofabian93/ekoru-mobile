import { GET_DEPARTMENT_BY_SLUG } from "@/graphql/marketplace/queries";
import i18n from "@/i18n";
import { useQuery } from "@apollo/client/react";
import type { Department } from "../types/Department";

function toGqlLanguage(lang: string): string {
  return (lang ?? "es").toUpperCase();
}

export default function useDepartmentBySlug(slug: string) {
  const language = toGqlLanguage(i18n.language);

  const { data, loading, error, refetch } = useQuery<{
    getDepartmentBySlug: Department;
  }>(GET_DEPARTMENT_BY_SLUG, {
    variables: { slug, language },
    skip: !slug,
  });

  return {
    department: data?.getDepartmentBySlug ?? null,
    loading,
    error,
    refetch,
  };
}
