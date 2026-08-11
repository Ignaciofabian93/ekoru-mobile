import { gql } from "@apollo/client";

import {
  SERVICE_CATALOG_ITEM_FIELDS_FRAGMENT,
  SERVICE_CATEGORY_FIELDS_FRAGMENT,
  SERVICE_DETAIL_FIELDS_FRAGMENT,
  SERVICE_PAGE_INFO_FIELDS_FRAGMENT,
  SERVICE_SUB_CATEGORY_FIELDS_FRAGMENT,
} from "./fragments";

export const GET_SERVICES_CATALOG = gql`
  ${SERVICE_CATALOG_ITEM_FIELDS_FRAGMENT}
  query GetServiceCatalog($language: Language = ES) {
    getServiceCatalog(language: $language) {
      ...ServiceCatalogItemFields
    }
  }
`;

export const GET_SERVICE_CATEGORIES = gql`
  ${SERVICE_CATEGORY_FIELDS_FRAGMENT}
  query GetServiceCategories(
    $limit: Int = 20
    $offset: Int = 0
    $language: Language = ES
  ) {
    getServiceCategories(limit: $limit, offset: $offset, language: $language) {
      ...ServiceCategoryFields
    }
  }
`;

export const GET_SERVICE_SUBCATEGORIES = gql`
  ${SERVICE_SUB_CATEGORY_FIELDS_FRAGMENT}
  query GetServiceSubCategories(
    $limit: Int = 20
    $offset: Int = 0
    $language: Language = ES
  ) {
    getServiceSubCategories(limit: $limit, offset: $offset, language: $language) {
      ...ServiceSubCategoryFields
    }
  }
`;

export const GET_SERVICE_CATEGORY_BY_SLUG = gql`
  ${SERVICE_CATEGORY_FIELDS_FRAGMENT}
  query GetServiceCategoryBySlug($slug: String!, $language: Language!) {
    getServiceCategoryBySlug(slug: $slug, language: $language) {
      ...ServiceCategoryFields
    }
  }
`;

export const GET_SERVICE_SUBCATEGORY_BY_SLUG = gql`
  ${SERVICE_SUB_CATEGORY_FIELDS_FRAGMENT}
  query GetServiceSubCategoryBySlug($slug: String!, $language: Language) {
    getServiceSubCategoryBySlug(slug: $slug, language: $language) {
      ...ServiceSubCategoryFields
    }
  }
`;

export const GET_SERVICE_BY_ID = gql`
  ${SERVICE_DETAIL_FIELDS_FRAGMENT}
  query GetService($id: ID!) {
    getService(id: $id) {
      ...ServiceDetailFields
    }
  }
`;

export const GET_MY_FAVORITE_SERVICES = gql`
  ${SERVICE_DETAIL_FIELDS_FRAGMENT}
  ${SERVICE_PAGE_INFO_FIELDS_FRAGMENT}
  query GetMyFavoriteServices($page: Int = 1, $pageSize: Int = 12) {
    getMyFavoriteServices(page: $page, pageSize: $pageSize) {
      pageInfo {
        ...ServicePageInfoFields
      }
      nodes {
        ...ServiceDetailFields
      }
    }
  }
`;

export const GET_SERVICES = gql`
  ${SERVICE_DETAIL_FIELDS_FRAGMENT}
  ${SERVICE_PAGE_INFO_FIELDS_FRAGMENT}
  query GetServices($page: Int = 1, $pageSize: Int = 10, $isActive: Boolean) {
    getServices(page: $page, pageSize: $pageSize, isActive: $isActive) {
      pageInfo {
        ...ServicePageInfoFields
      }
      nodes {
        ...ServiceDetailFields
      }
    }
  }
`;

export const GET_SERVICES_BY_SELLER = gql`
  ${SERVICE_DETAIL_FIELDS_FRAGMENT}
  ${SERVICE_PAGE_INFO_FIELDS_FRAGMENT}
  query GetServicesBySeller(
    $sellerId: ID!
    $page: Int = 1
    $pageSize: Int = 10
    $isActive: Boolean
  ) {
    getServicesBySeller(
      sellerId: $sellerId
      page: $page
      pageSize: $pageSize
      isActive: $isActive
    ) {
      pageInfo {
        ...ServicePageInfoFields
      }
      nodes {
        ...ServiceDetailFields
      }
    }
  }
`;

export const GET_SERVICES_BY_SUBCATEGORY = gql`
  ${SERVICE_DETAIL_FIELDS_FRAGMENT}
  ${SERVICE_PAGE_INFO_FIELDS_FRAGMENT}
  query GetServicesBySubCategory(
    $subcategoryId: ID!
    $page: Int = 1
    $pageSize: Int = 10
    $isActive: Boolean
  ) {
    getServicesBySubCategory(
      subcategoryId: $subcategoryId
      page: $page
      pageSize: $pageSize
      isActive: $isActive
    ) {
      pageInfo {
        ...ServicePageInfoFields
      }
      nodes {
        ...ServiceDetailFields
      }
    }
  }
`;

export const GET_SERVICES_BY_PRICING_TYPE = gql`
  ${SERVICE_DETAIL_FIELDS_FRAGMENT}
  ${SERVICE_PAGE_INFO_FIELDS_FRAGMENT}
  query GetServicesByPricingType(
    $pricingType: ServicePricing!
    $page: Int = 1
    $pageSize: Int = 10
    $isActive: Boolean
  ) {
    getServicesByPricingType(
      pricingType: $pricingType
      page: $page
      pageSize: $pageSize
      isActive: $isActive
    ) {
      pageInfo {
        ...ServicePageInfoFields
      }
      nodes {
        ...ServiceDetailFields
      }
    }
  }
`;

export const GET_SERVICE_CATALOG = gql`
  query GetServiceCatalog(
    $language: Language = ES
    $enableSubCategories: Boolean = true
  ) {
    getServiceCatalog(language: $language) {
      id
      name
      href
      slug
      subCategoryItems @include(if: $enableSubCategories) {
        id
        name
        href
        slug
      }
    }
  }
`;

export const GET_SERVICE_CATEGORY_SERVICES_BY_SLUG = gql`
  ${SERVICE_DETAIL_FIELDS_FRAGMENT}
  ${SERVICE_PAGE_INFO_FIELDS_FRAGMENT}
  ${SERVICE_CATEGORY_FIELDS_FRAGMENT}
  query GetServiceCategoryServicesBySlug(
    $slug: String!
    $language: Language!
    $page: Int = 1
    $pageSize: Int = 12
    $isActive: Boolean
    $requireServiceCategoryFetch: Boolean! = true
  ) {
    getServiceCategoryServicesBySlug(
      slug: $slug
      language: $language
      page: $page
      pageSize: $pageSize
      isActive: $isActive
    ) {
      services {
        nodes {
          ...ServiceDetailFields
        }
        pageInfo {
          ...ServicePageInfoFields
        }
      }
      serviceCategory @include(if: $requireServiceCategoryFetch) {
        ...ServiceCategoryFields
      }
    }
  }
`;

export const GET_SERVICE_SUB_CATEGORY_SERVICES_BY_SLUG = gql`
  ${SERVICE_DETAIL_FIELDS_FRAGMENT}
  ${SERVICE_PAGE_INFO_FIELDS_FRAGMENT}
  ${SERVICE_SUB_CATEGORY_FIELDS_FRAGMENT}
  query GetServiceSubCategoryServicesBySlug(
    $slug: String!
    $language: Language!
    $page: Int = 1
    $pageSize: Int = 12
    $isActive: Boolean
    $requireServiceSubCategoryFetch: Boolean! = true
  ) {
    getServiceSubCategoryServicesBySlug(
      slug: $slug
      language: $language
      page: $page
      pageSize: $pageSize
      isActive: $isActive
    ) {
      services {
        nodes {
          ...ServiceDetailFields
        }
        pageInfo {
          ...ServicePageInfoFields
        }
      }
      serviceSubCategory @include(if: $requireServiceSubCategoryFetch) {
        ...ServiceSubCategoryFields
      }
    }
  }
`;
