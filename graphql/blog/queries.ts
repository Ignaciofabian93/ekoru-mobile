import { gql } from "@apollo/client";

export const GET_BLOG_CATALOG = gql`
  query GetBlogCatalog($language: Language = ES) {
    getBlogCatalog(language: $language) {
      id
      icon
      name
      description
      slug
      href
    }
  }
`;

export const GET_BLOG_CATEGORY_BY_SLUG = gql`
  query GetBlogCategoryBySlug($slug: String!, $language: Language!) {
    getBlogCategoryBySlug(slug: $slug, language: $language) {
      id
      icon
      translation {
        id
        name
        slug
        description
        href
      }
    }
  }
`;

export const GET_BLOG_POSTS_BY_CATEGORY = gql`
  query GetBlogPostsByCategory(
    $categorySlug: String!
    $language: Language!
    $page: Int = 1
    $pageSize: Int = 12
  ) {
    getBlogPostsByCategory(
      categorySlug: $categorySlug
      language: $language
      page: $page
      pageSize: $pageSize
    ) {
      nodes {
        id
        coverImage
        type
        likes
        publishedAt
        translation {
          id
          title
          slug
          excerpt
        }
      }
      pageInfo {
        currentPage
        totalPages
        totalCount
        pageSize
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;

export const GET_BLOG_POST_BY_SLUG = gql`
  query GetBlogPostBySlug($slug: String!, $language: Language!) {
    getBlogPostBySlug(slug: $slug, language: $language) {
      id
      coverImage
      type
      likes
      publishedAt
      translation {
        id
        title
        slug
        excerpt
        content
        metaTitle
        metaDescription
      }
    }
  }
`;
