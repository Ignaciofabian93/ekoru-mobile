import { GET_DEPARTMENTS } from "@/graphql/marketplace/queries";
import i18n from "@/i18n";
import { useQuery } from "@apollo/client/react";
import type { Department } from "../types/Department";

// Map i18n locale code to the GraphQL Language enum value
function toGqlLanguage(lang: string): string {
  return (lang ?? "es").toUpperCase();
}

export default function useDepartments() {
  const language = toGqlLanguage(i18n.language);

  const { data, loading, error, refetch } = useQuery<{
    getDepartments: Department[];
  }>(GET_DEPARTMENTS, {
    variables: { language },
  });

  return {
    departments: data?.getDepartments ?? [],
    loading,
    error,
    refetch,
  };
}
