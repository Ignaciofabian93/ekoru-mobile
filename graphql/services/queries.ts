import { gql } from "@apollo/client";

export const GET_SERVICES_CATALOG = gql`
  query GetServicesCatalog($language: Language = ES) {
    getServicesCatalog(language: $language) {
      id
      name
      slug
      href
      subCategoryItems {
        id
        name
        slug
        href
      }
    }
  }
`;
