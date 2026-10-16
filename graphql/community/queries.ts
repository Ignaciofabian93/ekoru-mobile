import { gql } from "@apollo/client";

export const GET_COMMUNITY_CATALOG = gql`
  query GetCommunityCatalog(
    $language: Language = ES
    $enableSubCategories: Boolean = true
  ) {
    getCommunityCatalog(language: $language) {
      id
      category
      slug
      description
      subcategories @include(if: $enableSubCategories) {
        id
        subcategory
        slug
        description
      }
    }
  }
`;

export const GET_COMMUNITY_CATEGORY_BY_SLUG = gql`
  query GetCommunityCategoryBySlug($slug: String!, $language: Language!) {
    getCommunityCategoryBySlug(slug: $slug, language: $language) {
      id
      translation {
        id
        category
        slug
        description
      }
      subcategories {
        id
        translation {
          id
          subCategory
          slug
          description
        }
      }
    }
  }
`;

export const GET_COMMUNITY_SUBCATEGORY_BY_SLUG = gql`
  query GetCommunitySubCategoryBySlug($slug: String!, $language: Language) {
    getCommunitySubCategoryBySlug(slug: $slug, language: $language) {
      id
      communityCategoryId
      translation {
        id
        subCategory
        slug
        description
      }
    }
  }
`;
