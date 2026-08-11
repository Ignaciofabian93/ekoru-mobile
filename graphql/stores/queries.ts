import { gql } from "@apollo/client";

import {
  STORE_CATEGORY_FIELDS_FRAGMENT,
  STORE_PAGE_INFO_FIELDS_FRAGMENT,
  STORE_PRODUCT_DETAIL_FIELDS_FRAGMENT,
  STORE_SUB_CATEGORY_FIELDS_FRAGMENT,
} from "./fragments";

export const GET_STORES_CATALOG = gql`
  query GetStoreCatalog($language: Language = ES, $enableSubCategories: Boolean = true) {
    getStoreCatalog(language: $language) {
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

export const GET_MATERIALS = gql`
  query Materials($language: Language = ES) {
    materials(language: $language) {
      id
      materialType
      label
    }
  }
`;

export const GET_STORES_CATEGORIES = gql`
  ${STORE_CATEGORY_FIELDS_FRAGMENT}
  query GetStoreCategories($limit: Int = 20, $offset: Int = 0, $language: Language = ES) {
    getStoreCategories(limit: $limit, offset: $offset, language: $language) {
      ...StoreCategoryFields
    }
  }
`;

export const GET_STORE_SUBCATEGORIES = gql`
  ${STORE_SUB_CATEGORY_FIELDS_FRAGMENT}
  query GetStoreSubCategories(
    $limit: Int = 20
    $offset: Int = 0
    $language: Language = ES
  ) {
    getStoreSubCategories(limit: $limit, offset: $offset, language: $language) {
      ...StoreSubCategoryFields
    }
  }
`;

export const GET_STORE_CATEGORY_BY_SLUG = gql`
  ${STORE_CATEGORY_FIELDS_FRAGMENT}
  query GetStoreCategoryBySlug($slug: String!, $language: Language!) {
    getStoreCategoryBySlug(slug: $slug, language: $language) {
      ...StoreCategoryFields
    }
  }
`;

export const GET_STORE_SUBCATEGORY_BY_SLUG = gql`
  ${STORE_SUB_CATEGORY_FIELDS_FRAGMENT}
  query GetStoreSubCategoryBySlug($slug: String!, $language: Language) {
    getStoreSubCategoryBySlug(slug: $slug, language: $language) {
      ...StoreSubCategoryFields
    }
  }
`;

export const GET_STORE_PRODUCT_BY_ID = gql`
  query GetStoreProductById($id: ID!) {
    getStoreProductById(id: $id) {
      id
      name
      description
      stock
      barcode
      sku
      price
      hasOffer
      offerPrice
      sellerId
      images
      isActive
      badges
      color
      brand
      averageRating
      reviewsNumber
      likesCount
      saleCount
      viewCount
      materialComposition
      recycledContent
      weight
      weightUnit
      length
      width
      height
      dimensionUnit
      lowStockThreshold
      isLowStock
      tags
      metaTitle
      metaDescription
      warranty
      warrantyDuration
      features
      createdAt
      updatedAt
      deletedAt
      isLiked
      materials {
        id
        materialTypeId
        materialType
        label
        percentage
      }
      environmentalImpact {
        totalCo2SavingsKG
        totalWaterSavingsLT
        materialBreakdown {
          materialType
          materialTypeLabel
          quantity
          unit
          co2SavingsKG
          waterSavingsLT
        }
      }
      seller {
        id
        email
        sellerType
        isActive
        isVerified
        createdAt
        updatedAt
        address
        phone
        website
        preferredContactMethod
        socialMediaLinks
        points
        profile {
          ... on BusinessProfile {
            id
            sellerId
            businessName
            description
            logo
            coverImage
            businessType
            legalBusinessName
            taxId
            businessStartDate
            legalRepresentative
            legalRepresentativeTaxId
            shippingPolicy
            returnPolicy
            serviceArea
            yearsOfExperience
            certifications
            travelRadius
            businessHours
            createdAt
            updatedAt
            businessMembershipSubscriptionId
          }
        }
        sellerLevel {
          id
          levelName
          minPoints
          maxPoints
          benefits
          badgeIcon
          createdAt
          updatedAt
        }
        country {
          id
          country
          createdAt
          updatedAt
        }
        region {
          id
          region
          countryId
        }
        city {
          id
          city
          regionId
        }
        county {
          id
          county
          cityId
        }
      }
      storeSubCategory {
        id
        storeCategoryId
        averageWeight
        size
        weightUnit
        isActive
        translation {
          id
          storeSubCategoryId
          language
          name
          slug
          keywords
          href
          metaTitle
          metaDescription
          createdAt
          updatedAt
        }
        storeCategory {
          id
          translation {
            id
            storeCategoryId
            language
            name
            slug
            href
          }
        }
      }
    }
  }
`;

export const GET_MY_FAVORITE_STORE_PRODUCTS = gql`
  ${STORE_PRODUCT_DETAIL_FIELDS_FRAGMENT}
  ${STORE_PAGE_INFO_FIELDS_FRAGMENT}
  query GetMyFavoriteStoreProducts($page: Int = 1, $pageSize: Int = 12) {
    getMyFavoriteStoreProducts(page: $page, pageSize: $pageSize) {
      pageInfo {
        ...StorePageInfoFields
      }
      nodes {
        ...StoreProductDetailFields
      }
    }
  }
`;

export const GET_STORE_PRODUCTS = gql`
  query GetStoreProducts(
    $page: Int = 1
    $pageSize: Int = 20
    $sort: StoreProductSortInput
    $filter: StoreProductFilterInput
    $enablePagination: Boolean = true
  ) {
    getStoreProducts(page: $page, pageSize: $pageSize, sort: $sort, filter: $filter) {
      nodes {
        id
        name
        description
        stock
        barcode
        sku
        price
        hasOffer
        offerPrice
        sellerId
        images
        isActive
        badges
        color
        brand
        averageRating
        reviewsNumber
        likesCount
        saleCount
        viewCount
        materialComposition
        recycledContent
        weight
        weightUnit
        length
        width
        height
        dimensionUnit
        lowStockThreshold
        isLowStock
        tags
        metaTitle
        metaDescription
        warranty
        warrantyDuration
        features
        createdAt
        updatedAt
        deletedAt
        isLiked
        materials {
          id
          materialTypeId
          materialType
          label
          percentage
        }
        environmentalImpact {
          totalCo2SavingsKG
          totalWaterSavingsLT
          materialBreakdown {
            materialType
            materialTypeLabel
            quantity
            unit
            co2SavingsKG
            waterSavingsLT
          }
        }
        seller {
          id
          email
          sellerType
          isActive
          isVerified
          createdAt
          updatedAt
          address
          phone
          website
          preferredContactMethod
          socialMediaLinks
          points
          profile {
            ... on BusinessProfile {
              id
              sellerId
              businessName
              description
              logo
              coverImage
              businessType
              legalBusinessName
              taxId
              businessStartDate
              legalRepresentative
              legalRepresentativeTaxId
              shippingPolicy
              returnPolicy
              serviceArea
              yearsOfExperience
              certifications
              travelRadius
              businessHours
              createdAt
              updatedAt
              businessMembershipSubscriptionId
            }
          }
          country {
            id
            country
            createdAt
            updatedAt
          }
          region {
            id
            region
            countryId
          }
          city {
            id
            city
            regionId
          }
          county {
            id
            county
            cityId
          }
        }
        storeSubCategory {
          id
          storeCategoryId
          averageWeight
          size
          weightUnit
          isActive
          sortOrder
          createdAt
          updatedAt
          translation {
            id
            storeSubCategoryId
            language
            name
            slug
            keywords
            href
            metaTitle
            metaDescription
            createdAt
            updatedAt
          }
        }
      }
      pageInfo @include(if: $enablePagination) {
        currentPage
        totalPages
        totalCount
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
        pageSize
      }
    }
  }
`;

export const GET_STORE_PRODUCTS_BY_SELLER = gql`
  ${STORE_PRODUCT_DETAIL_FIELDS_FRAGMENT}
  ${STORE_PAGE_INFO_FIELDS_FRAGMENT}
  query GetStoreProductsBySeller(
    $sellerId: ID!
    $page: Int = 1
    $pageSize: Int = 10
    $filter: StoreProductFilterInput
    $sort: StoreProductSortInput
  ) {
    getStoreProductsBySeller(
      sellerId: $sellerId
      page: $page
      pageSize: $pageSize
      filter: $filter
      sort: $sort
    ) {
      pageInfo {
        ...StorePageInfoFields
      }
      nodes {
        ...StoreProductDetailFields
      }
    }
  }
`;

export const GET_STORE_PRODUCTS_BY_SUBCATEGORY = gql`
  ${STORE_PRODUCT_DETAIL_FIELDS_FRAGMENT}
  ${STORE_PAGE_INFO_FIELDS_FRAGMENT}
  query GetStoreProductsBySubCategory(
    $subCategoryId: ID!
    $page: Int = 1
    $pageSize: Int = 10
    $filter: StoreProductFilterInput
    $sort: StoreProductSortInput
  ) {
    getStoreProductsBySubCategory(
      subCategoryId: $subCategoryId
      page: $page
      pageSize: $pageSize
      filter: $filter
      sort: $sort
    ) {
      pageInfo {
        ...StorePageInfoFields
      }
      nodes {
        ...StoreProductDetailFields
      }
    }
  }
`;

export const GET_STORE_PRODUCTS_BY_CATEGORY = gql`
  ${STORE_PRODUCT_DETAIL_FIELDS_FRAGMENT}
  ${STORE_PAGE_INFO_FIELDS_FRAGMENT}
  query GetProductsByStoreCategory(
    $categoryId: ID!
    $page: Int = 1
    $pageSize: Int = 10
    $filter: StoreProductFilterInput
    $sort: StoreProductSortInput
  ) {
    getProductsByStoreCategory(
      categoryId: $categoryId
      page: $page
      pageSize: $pageSize
      filter: $filter
      sort: $sort
    ) {
      pageInfo {
        ...StorePageInfoFields
      }
      nodes {
        ...StoreProductDetailFields
      }
    }
  }
`;

export const GET_STORE_PRODUCTS_ON_OFFER = gql`
  ${STORE_PRODUCT_DETAIL_FIELDS_FRAGMENT}
  ${STORE_PAGE_INFO_FIELDS_FRAGMENT}
  query GetProductsOnOffer(
    $page: Int = 1
    $pageSize: Int = 10
    $filter: StoreProductFilterInput
    $sort: StoreProductSortInput
  ) {
    getProductsOnOffer(page: $page, pageSize: $pageSize, filter: $filter, sort: $sort) {
      pageInfo {
        ...StorePageInfoFields
      }
      nodes {
        ...StoreProductDetailFields
      }
    }
  }
`;

export const GET_STORE_CATEGORY_PRODUCTS_BY_SLUG = gql`
  ${STORE_PRODUCT_DETAIL_FIELDS_FRAGMENT}
  ${STORE_PAGE_INFO_FIELDS_FRAGMENT}
  ${STORE_CATEGORY_FIELDS_FRAGMENT}
  query GetStoreCategoryProductsBySlug(
    $slug: String!
    $language: Language!
    $page: Int = 1
    $pageSize: Int = 12
    $filter: StoreProductFilterInput
    $sort: StoreProductSortInput
    $requireStoreCategoryFetch: Boolean! = true
  ) {
    getStoreCategoryProductsBySlug(
      slug: $slug
      language: $language
      page: $page
      pageSize: $pageSize
      filter: $filter
      sort: $sort
    ) {
      products {
        nodes {
          ...StoreProductDetailFields
        }
        pageInfo {
          ...StorePageInfoFields
        }
      }
      storeCategory @include(if: $requireStoreCategoryFetch) {
        ...StoreCategoryFields
      }
    }
  }
`;

export const GET_STORE_SUB_CATEGORY_PRODUCTS_BY_SLUG = gql`
  ${STORE_PRODUCT_DETAIL_FIELDS_FRAGMENT}
  ${STORE_PAGE_INFO_FIELDS_FRAGMENT}
  ${STORE_SUB_CATEGORY_FIELDS_FRAGMENT}
  query GetStoreSubCategoryProductsBySlug(
    $slug: String!
    $language: Language!
    $page: Int = 1
    $pageSize: Int = 12
    $filter: StoreProductFilterInput
    $sort: StoreProductSortInput
    $requireStoreSubCategoryFetch: Boolean! = true
  ) {
    getStoreSubCategoryProductsBySlug(
      slug: $slug
      language: $language
      page: $page
      pageSize: $pageSize
      filter: $filter
      sort: $sort
    ) {
      products {
        nodes {
          ...StoreProductDetailFields
        }
        pageInfo {
          ...StorePageInfoFields
        }
      }
      storeSubCategory @include(if: $requireStoreSubCategoryFetch) {
        ...StoreSubCategoryFields
      }
    }
  }
`;
