import { gql } from "@apollo/client";

export const TRANSLATION_FIELDS_FRAGMENT = gql`
  fragment TranslationFields on DepartmentTranslation {
    id
    name
    slug
    href
  }
`;

export const CATEGORY_TRANSLATION_FIELDS_FRAGMENT = gql`
  fragment CategoryTranslationFields on DepartmentCategoryTranslation {
    id
    name
    slug
    href
  }
`;

export const PRODUCT_CATEGORY_TRANSLATION_FIELDS_FRAGMENT = gql`
  fragment ProductCategoryTranslationFields on ProductCategoryTranslation {
    id
    name
    slug
    href
  }
`;

export const PRODUCT_CATEGORY_FIELDS_FRAGMENT = gql`
  ${PRODUCT_CATEGORY_TRANSLATION_FIELDS_FRAGMENT}
  fragment ProductCategoryFields on ProductCategory {
    id
    translation {
      ...ProductCategoryTranslationFields
    }
  }
`;

export const DEPARTMENT_CATEGORY_FIELDS_FRAGMENT = gql`
  ${CATEGORY_TRANSLATION_FIELDS_FRAGMENT}
  ${PRODUCT_CATEGORY_FIELDS_FRAGMENT}
  fragment DepartmentCategoryFields on DepartmentCategory {
    id
    translation {
      ...CategoryTranslationFields
    }
    productCategory {
      ...ProductCategoryFields
    }
  }
`;

export const DEPARTMENT_FIELDS_FRAGMENT = gql`
  ${TRANSLATION_FIELDS_FRAGMENT}
  ${DEPARTMENT_CATEGORY_FIELDS_FRAGMENT}
  fragment DepartmentFields on Department {
    id
    translation {
      ...TranslationFields
    }
    departmentCategory {
      ...DepartmentCategoryFields
    }
  }
`;

export const CATALOG_ITEM_FIELDS_FRAGMENT = gql`
  fragment CatalogItemFields on MarketplaceCatalogItem {
    id
    name
    slug
    href
    categories {
      id
      name
      slug
      href
      productCategories {
        id
        name
        slug
        href
      }
    }
  }
`;

export const PRODUCT_FIELDS_FRAGMENT = gql`
  fragment ProductFields on Product {
    id
    name
    description
    color
    brand
    price
    images
    badges
    interests
    condition
    conditionDescription
    isActive
    isExchangeable
    sellerId
    viewCount
    isLiked
    createdAt
    updatedAt
  }
`;

// Environmental impact projection used by the product card back side + the
// detailed impact modal. Mirrors `EnvironmentalImpact` in `types/product.ts`.
export const ENVIRONMENTAL_IMPACT_FIELDS_FRAGMENT = gql`
  fragment EnvironmentalImpactFields on EnvironmentalImpact {
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
`;

// Lean seller projection for the card back side (name + profile image + type
// + location). Full seller detail is fetched separately on the product page.
export const PRODUCT_CARD_SELLER_FIELDS_FRAGMENT = gql`
  fragment ProductCardSellerFields on Seller {
    id
    email
    sellerType
    isVerified
    address
    phone
    region {
      id
      region
      countryId
    }
    county {
      id
      county
      cityId
    }
    profile {
      ... on PersonProfile {
        id
        firstName
        lastName
        displayName
        profileImage
      }
      ... on BusinessProfile {
        id
        businessName
        logo
      }
    }
  }
`;
