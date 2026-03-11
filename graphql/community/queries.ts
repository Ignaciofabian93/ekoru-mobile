import { gql } from "@apollo/client";

export const GET_COMMUNITY_CATALOG = gql`
  query GetCommunityCatalog($language: Language = ES) {
    getCommunityCatalog(language: $language) {
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
