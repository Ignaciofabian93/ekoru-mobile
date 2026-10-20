import { gql } from "@apollo/client";

import {
  BUSINESS_PROFILE_FIELDS_FRAGMENT,
  SELLER_FIELDS_FRAGMENT,
} from "../users/fragments";

export const SERVICE_CATEGORY_TRANSLATION_FIELDS_FRAGMENT = gql`
  fragment ServiceCategoryTranslationFields on ServiceCategoryTranslation {
    id
    serviceCategoryId
    language
    category
    slug
    metaTitle
    metaDescription
    metaKeywords
    createdAt
    updatedAt
  }
`;

export const SERVICE_SUB_CATEGORY_TRANSLATION_FIELDS_FRAGMENT = gql`
  fragment ServiceSubCategoryTranslationFields on ServiceSubCategoryTranslation {
    id
    serviceSubCategoryId
    language
    subCategory
    slug
    metaTitle
    metaDescription
    metaKeywords
    createdAt
    updatedAt
  }
`;

export const SERVICE_SUB_CATEGORY_FIELDS_FRAGMENT = gql`
  ${SERVICE_SUB_CATEGORY_TRANSLATION_FIELDS_FRAGMENT}
  fragment ServiceSubCategoryFields on ServiceSubCategory {
    id
    serviceCategoryId
    isActive
    sortOrder
    subCategory
    serviceCount
    translation {
      ...ServiceSubCategoryTranslationFields
    }
  }
`;

export const SERVICE_CATEGORY_FIELDS_FRAGMENT = gql`
  ${SERVICE_CATEGORY_TRANSLATION_FIELDS_FRAGMENT}
  ${SERVICE_SUB_CATEGORY_FIELDS_FRAGMENT}
  fragment ServiceCategoryFields on ServiceCategory {
    id
    isActive
    sortOrder
    category
    translation {
      ...ServiceCategoryTranslationFields
    }
    subcategories {
      ...ServiceSubCategoryFields
    }
  }
`;

export const SERVICE_CATALOG_ITEM_FIELDS_FRAGMENT = gql`
  fragment ServiceCatalogItemFields on ServiceCatalogItem {
    id
    name
    slug
    subCategoryItems {
      id
      name
      slug
    }
  }
`;

export const SERVICE_SELLER_FIELDS_FRAGMENT = gql`
  ${SELLER_FIELDS_FRAGMENT}
  ${BUSINESS_PROFILE_FIELDS_FRAGMENT}
  fragment ServiceSellerFields on Seller {
    ...SellerFields
    profile {
      ... on BusinessProfile {
        ...BusinessProfileFields
      }
    }
  }
`;

export const SERVICE_FIELDS_FRAGMENT = gql`
  fragment ServiceFields on Service {
    id
    name
    description
    sellerId
    subcategoryId
    pricingType
    basePrice
    priceRange
    duration
    isActive
    images
    # Own first photo, or the provider's logo when the service has none.
    displayImage
    tags
    createdAt
    updatedAt
    deletedAt
    availabilitySchedule
    isCurrentlyAvailable
    maxConcurrentBookings
    advanceBookingDays
    serviceRadius
    serviceLocations
    isRemoteService
    averageRating
    reviewCount
    viewCount
    isLiked
  }
`;

export const SERVICE_DETAIL_FIELDS_FRAGMENT = gql`
  ${SERVICE_FIELDS_FRAGMENT}
  ${SERVICE_SELLER_FIELDS_FRAGMENT}
  ${SERVICE_SUB_CATEGORY_FIELDS_FRAGMENT}
  fragment ServiceDetailFields on Service {
    ...ServiceFields
    seller {
      ...ServiceSellerFields
    }
    serviceCategory {
      ...ServiceSubCategoryFields
    }
  }
`;

export const SERVICE_PAGE_INFO_FIELDS_FRAGMENT = gql`
  fragment ServicePageInfoFields on PageInfo {
    currentPage
    totalPages
    totalCount
    hasNextPage
    hasPreviousPage
    startCursor
    endCursor
    pageSize
  }
`;
