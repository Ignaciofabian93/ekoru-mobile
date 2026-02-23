import { gql } from "@apollo/client";

import {
  CATALOG_ITEM_FIELDS_FRAGMENT,
  DEPARTMENT_FIELDS_FRAGMENT,
  CATEGORY_TRANSLATION_FIELDS_FRAGMENT,
  PRODUCT_CATEGORY_FIELDS_FRAGMENT,
  PRODUCT_FIELDS_FRAGMENT,
} from "./fragments";

export const GET_MARKETPLACE_CATALOG = gql`
  ${CATALOG_ITEM_FIELDS_FRAGMENT}
  query GetMarketplaceCatalog($language: Language = ES) {
    getMarketplaceCatalog(language: $language) {
      ...CatalogItemFields
    }
  }
`;

export const GET_DEPARTMENTS = gql`
  ${DEPARTMENT_FIELDS_FRAGMENT}
  query GetDepartments(
    $limit: Int = 20
    $offset: Int = 0
    $language: Language = ES
  ) {
    getDepartments(limit: $limit, offset: $offset, language: $language) {
      ...DepartmentFields
    }
  }
`;

export const GET_DEPARTMENT_BY_SLUG = gql`
  ${DEPARTMENT_FIELDS_FRAGMENT}
  query GetDepartmentBySlug($slug: String!, $language: Language!) {
    getDepartmentBySlug(slug: $slug, language: $language) {
      ...DepartmentFields
    }
  }
`;

export const GET_DEPARTMENT_CATEGORIES = gql`
  ${CATEGORY_TRANSLATION_FIELDS_FRAGMENT}
  ${PRODUCT_CATEGORY_FIELDS_FRAGMENT}
  query GetDepartmentCategories(
    $limit: Int = 20
    $offset: Int = 0
    $language: Language = ES
  ) {
    getDepartmentCategories(
      limit: $limit
      offset: $offset
      language: $language
    ) {
      id
      translation {
        ...CategoryTranslationFields
      }
      productCategory {
        ...ProductCategoryFields
      }
    }
  }
`;

export const GET_DEPARTMENT_CATEGORY_BY_SLUG = gql`
  ${CATEGORY_TRANSLATION_FIELDS_FRAGMENT}
  ${PRODUCT_CATEGORY_FIELDS_FRAGMENT}
  query GetDepartmentCategoryBySlug($slug: String!, $language: Language!) {
    getDepartmentCategoryBySlug(slug: $slug, language: $language) {
      id
      translation {
        ...CategoryTranslationFields
      }
      productCategory {
        ...ProductCategoryFields
      }
    }
  }
`;

export const GET_PRODUCT_CATEGORIES = gql`
  ${PRODUCT_CATEGORY_FIELDS_FRAGMENT}
  query GetProductCategories(
    $limit: Int = 10
    $offset: Int = 0
    $language: Language = ES
  ) {
    getProductCategories(limit: $limit, offset: $offset, language: $language) {
      ...ProductCategoryFields
    }
  }
`;

export const GET_PRODUCT_CATEGORY_BY_SLUG = gql`
  ${PRODUCT_CATEGORY_FIELDS_FRAGMENT}
  query GetProductCategoryBySlug($slug: String!, $language: Language = ES) {
    getProductCategoryBySlug(slug: $slug, language: $language) {
      ...ProductCategoryFields
    }
  }
`;

export const GET_PRODUCTS = gql`
  ${PRODUCT_FIELDS_FRAGMENT}
  query GetProducts(
    $page: Int = 1
    $pageSize: Int = 10
    $filter: ProductFilterInput
    $sort: ProductSortInput
  ) {
    getProducts(
      page: $page
      pageSize: $pageSize
      filter: $filter
      sort: $sort
    ) {
      nodes {
        ...ProductFields
        productCategory {
          id
          translation {
            name
            slug
            href
          }
        }
      }
      pageInfo {
        totalCount
        totalPages
        currentPage
        pageSize
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;

export const GET_PRODUCTS_BY_SELLER = gql`
  ${PRODUCT_FIELDS_FRAGMENT}
  query GetProductsBySeller(
    $sellerId: ID!
    $page: Int = 1
    $pageSize: Int = 10
    $filter: ProductFilterInput
    $sort: ProductSortInput
  ) {
    getProductsBySeller(
      sellerId: $sellerId
      page: $page
      pageSize: $pageSize
      filter: $filter
      sort: $sort
    ) {
      nodes {
        ...ProductFields
      }
      pageInfo {
        totalCount
        totalPages
        currentPage
        pageSize
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;

export const GET_PRODUCTS_BY_CATEGORY = gql`
  ${PRODUCT_FIELDS_FRAGMENT}
  query GetProductsByCategory(
    $productCategoryId: ID!
    $page: Int = 1
    $pageSize: Int = 10
    $filter: ProductFilterInput
    $sort: ProductSortInput
  ) {
    getProductsByCategory(
      productCategoryId: $productCategoryId
      page: $page
      pageSize: $pageSize
      filter: $filter
      sort: $sort
    ) {
      nodes {
        ...ProductFields
      }
      pageInfo {
        totalCount
        totalPages
        currentPage
        pageSize
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;

export const GET_PRODUCTS_BY_DEPARTMENT_CATEGORY = gql`
  ${PRODUCT_FIELDS_FRAGMENT}
  query GetProductsByDepartmentCategory(
    $departmentCategoryId: ID!
    $page: Int = 1
    $pageSize: Int = 10
    $filter: ProductFilterInput
    $sort: ProductSortInput
  ) {
    getProductsByDepartmentCategory(
      departmentCategoryId: $departmentCategoryId
      page: $page
      pageSize: $pageSize
      filter: $filter
      sort: $sort
    ) {
      nodes {
        ...ProductFields
      }
      pageInfo {
        totalCount
        totalPages
        currentPage
        pageSize
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;

export const GET_PRODUCTS_BY_DEPARTMENT = gql`
  ${PRODUCT_FIELDS_FRAGMENT}
  query GetProductsByDepartment(
    $departmentId: ID!
    $page: Int = 1
    $pageSize: Int = 10
    $filter: ProductFilterInput
    $sort: ProductSortInput
  ) {
    getProductsByDepartment(
      departmentId: $departmentId
      page: $page
      pageSize: $pageSize
      filter: $filter
      sort: $sort
    ) {
      nodes {
        ...ProductFields
      }
      pageInfo {
        totalCount
        totalPages
        currentPage
        pageSize
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;

export const GET_EXCHANGEABLE_PRODUCTS = gql`
  ${PRODUCT_FIELDS_FRAGMENT}
  query GetExchangeableProducts(
    $page: Int = 1
    $pageSize: Int = 10
    $filter: ProductFilterInput
    $sort: ProductSortInput
  ) {
    getExchangeableProducts(
      page: $page
      pageSize: $pageSize
      filter: $filter
      sort: $sort
    ) {
      nodes {
        ...ProductFields
      }
      pageInfo {
        totalCount
        totalPages
        currentPage
        pageSize
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;
