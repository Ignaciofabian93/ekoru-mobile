import { gql } from "@apollo/client";

export const GET_STORES_CATALOG = gql`
  query GetStoreCatalog($language: Language = ES) {
    getStoreCatalog(language: $language) {
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
