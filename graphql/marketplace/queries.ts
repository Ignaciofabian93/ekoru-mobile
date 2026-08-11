import { gql } from "@apollo/client";

import {
  CATEGORY_TRANSLATION_FIELDS_FRAGMENT,
  DEPARTMENT_FIELDS_FRAGMENT,
  ENVIRONMENTAL_IMPACT_FIELDS_FRAGMENT,
  PRODUCT_CARD_SELLER_FIELDS_FRAGMENT,
  PRODUCT_CATEGORY_FIELDS_FRAGMENT,
  PRODUCT_FIELDS_FRAGMENT,
} from "./fragments";

export const GET_MARKETPLACE_CATALOG = gql`
  query GetMarketplaceCatalog(
    $language: Language
    $enableCategories: Boolean = true
    $enableSubCategories: Boolean = true
  ) {
    getMarketplaceCatalog(language: $language) {
      id
      name
      href
      slug
      categories @include(if: $enableCategories) {
        id
        name
        href
        slug
        productCategories @include(if: $enableSubCategories) {
          id
          name
          href
          slug
        }
      }
    }
  }
`;

export const GET_DEPARTMENTS = gql`
  ${DEPARTMENT_FIELDS_FRAGMENT}
  query GetDepartments($limit: Int = 20, $offset: Int = 0, $language: Language = ES) {
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
    getDepartmentCategories(limit: $limit, offset: $offset, language: $language) {
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

export const GET_PRODUCT_BY_ID = gql`
  query GetProductById($id: ID!) {
    getProductById(id: $id) {
      id
      name
      description
      color
      images
      brand
      price
      productCategoryId
      badges
      interests
      condition
      conditionDescription
      isActive
      isExchangeable
      sellerId
      viewCount
      createdAt
      updatedAt
      deletedAt
      isLiked
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
          ... on PersonProfile {
            id
            sellerId
            firstName
            lastName
            displayName
            bio
            birthday
            profileImage
            coverImage
            allowExchanges
            personMembershipSubscriptionId
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
      productCategory {
        id
        departmentCategoryId
        averageWeight
        size
        weightUnit
        isActive
        sortOrder
        createdAt
        updatedAt
        translation {
          id
          language
          name
          slug
          href
        }
        departmentCategory {
          id
          translation {
            id
            departmentCategoryId
            language
            name
            slug
            href
            metaTitle
            metaDescription
            metaKeywords
            createdAt
            updatedAt
          }
          department {
            id
            translation {
              id
              language
              name
              slug
              href
            }
          }
        }
      }
    }
  }
`;

export const GET_PRODUCTS = gql`
  ${PRODUCT_FIELDS_FRAGMENT}
  ${ENVIRONMENTAL_IMPACT_FIELDS_FRAGMENT}
  ${PRODUCT_CARD_SELLER_FIELDS_FRAGMENT}
  query GetProducts(
    $page: Int = 1
    $pageSize: Int = 10
    $filter: ProductFilterInput
    $sort: ProductSortInput
  ) {
    getProducts(page: $page, pageSize: $pageSize, filter: $filter, sort: $sort) {
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
        environmentalImpact {
          ...EnvironmentalImpactFields
        }
        seller {
          ...ProductCardSellerFields
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
  ${ENVIRONMENTAL_IMPACT_FIELDS_FRAGMENT}
  ${PRODUCT_CARD_SELLER_FIELDS_FRAGMENT}
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
        environmentalImpact {
          ...EnvironmentalImpactFields
        }
        seller {
          ...ProductCardSellerFields
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

export const GET_SELLER_STOREFRONT = gql`
  query GetSellerStorefront(
    $sellerId: ID!
    $page: Int = 1
    $pageSize: Int = 100
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
        soldAt
        soldVia
        sellerId
        viewCount
        isLiked
        createdAt
        updatedAt
        productCategory {
          id
          translation {
            name
            slug
            href
          }
        }
        seller {
          id
          email
          sellerType
          isVerified
          createdAt
          address
          phone
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
              bio
              profileImage
              coverImage
            }
            ... on BusinessProfile {
              id
              businessName
              description
              logo
              coverImage
              businessType
            }
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

export const GET_MY_FAVORITES = gql`
  ${PRODUCT_FIELDS_FRAGMENT}
  ${ENVIRONMENTAL_IMPACT_FIELDS_FRAGMENT}
  ${PRODUCT_CARD_SELLER_FIELDS_FRAGMENT}
  query GetMyFavorites($page: Int = 1, $pageSize: Int = 12) {
    getMyFavorites(page: $page, pageSize: $pageSize) {
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
        environmentalImpact {
          ...EnvironmentalImpactFields
        }
        seller {
          ...ProductCardSellerFields
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

//////////////////////////////////////////////////////////////////////////////
// EXCHANGEABLE PRODUCTS
//////////////////////////////////////////////////////////////////////////////

export const GET_EXCHANGEABLE_PRODUCTS = gql`
  ${PRODUCT_FIELDS_FRAGMENT}
  query GetExchangeableProducts(
    $page: Int = 1
    $pageSize: Int = 10
    $filter: ProductFilterInput
    $sort: ProductSortInput
    $requiresPageInfo: Boolean = true
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
      pageInfo @include(if: $requiresPageInfo) {
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

export const GET_DEPARTMENT_PRODUCTS_BY_SLUG = gql`
  query GetDepartmentProductsBySlug(
    $slug: String!
    $language: Language!
    $page: Int = 1
    $pageSize: Int = 20
    $filter: ProductFilterInput
    $sort: ProductSortInput
    $requireDepartmentFetch: Boolean! = true
  ) {
    getDepartmentProductsBySlug(
      slug: $slug
      language: $language
      page: $page
      pageSize: $pageSize
      filter: $filter
      sort: $sort
    ) {
      products {
        pageInfo {
          currentPage
          totalPages
          totalCount
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
          pageSize
        }
        nodes {
          id
          name
          description
          color
          images
          brand
          price
          productCategoryId
          badges
          interests
          condition
          conditionDescription
          isActive
          isExchangeable
          sellerId
          viewCount
          createdAt
          updatedAt
          deletedAt
          isLiked
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
              ... on PersonProfile {
                id
                sellerId
                firstName
                lastName
                displayName
                bio
                birthday
                profileImage
                coverImage
                allowExchanges
                personMembershipSubscriptionId
              }
              ... on BusinessProfile {
                id
                sellerId
                businessName
                logo
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
              translations {
                id
                sellerLevelId
                language
                levelName
                createdAt
                updatedAt
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
          productCategory {
            id
            departmentCategoryId
            averageWeight
            size
            weightUnit
            isActive
            sortOrder
            createdAt
            updatedAt
            translation {
              id
              productCategoryId
              language
              name
              slug
              keywords
              href
              metaTitle
              metaDescription
              metaKeywords
              createdAt
              updatedAt
            }
          }
        }
      }
      department @include(if: $requireDepartmentFetch) {
        id
        isActive
        sortOrder
        translation {
          id
          departmentId
          language
          name
          slug
          href
          metaTitle
          metaDescription
          metaKeywords
          createdAt
          updatedAt
        }
        departmentCategory {
          id
          departmentId
          isActive
          sortOrder
          translation {
            id
            departmentCategoryId
            language
            name
            slug
            href
            metaTitle
            metaDescription
            metaKeywords
            createdAt
            updatedAt
          }
          productCategory {
            id
            departmentCategoryId
            averageWeight
            size
            weightUnit
            isActive
            sortOrder
            createdAt
            updatedAt
            translation {
              id
              productCategoryId
              language
              name
              slug
              keywords
              href
              metaTitle
              metaDescription
              metaKeywords
              createdAt
              updatedAt
            }
          }
        }
      }
    }
  }
`;

export const GET_DEPARTMENT_CATEGORY_PRODUCTS_BY_SLUG = gql`
  query GetDepartmentCategoryProductsBySlug(
    $slug: String!
    $language: Language!
    $page: Int
    $pageSize: Int
    $filter: ProductFilterInput
    $sort: ProductSortInput
    $requireDepartmentCategoryFetch: Boolean! = true
  ) {
    getDepartmentCategoryProductsBySlug(
      slug: $slug
      language: $language
      page: $page
      pageSize: $pageSize
      sort: $sort
      filter: $filter
    ) {
      products {
        nodes {
          id
          name
          description
          color
          images
          brand
          price
          productCategoryId
          badges
          interests
          condition
          conditionDescription
          isActive
          isExchangeable
          sellerId
          viewCount
          createdAt
          updatedAt
          deletedAt
          isLiked
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
              ... on PersonProfile {
                id
                sellerId
                firstName
                lastName
                displayName
                bio
                birthday
                profileImage
                coverImage
                allowExchanges
                personMembershipSubscriptionId
              }
              ... on BusinessProfile {
                id
                sellerId
                businessName
                logo
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
          productCategory {
            id
            departmentCategoryId
            averageWeight
            size
            weightUnit
            isActive
            sortOrder
            createdAt
            updatedAt
            translation {
              id
              productCategoryId
              language
              name
              slug
              keywords
              href
              metaTitle
              metaDescription
              metaKeywords
              createdAt
              updatedAt
            }
          }
        }
        pageInfo {
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
      departmentCategory @include(if: $requireDepartmentCategoryFetch) {
        id
        departmentId
        isActive
        sortOrder
        translation {
          id
          departmentCategoryId
          language
          name
          slug
          href
          metaTitle
          metaDescription
          metaKeywords
          createdAt
          updatedAt
        }
        productCategory {
          id
          departmentCategoryId
          averageWeight
          size
          weightUnit
          isActive
          sortOrder
          createdAt
          updatedAt
          translation {
            id
            productCategoryId
            language
            name
            slug
            keywords
            href
            metaTitle
            metaDescription
            metaKeywords
            createdAt
            updatedAt
          }
        }
      }
    }
  }
`;

export const GET_PRODUCT_CATEGORY_PRODUCTS_BY_SLUG = gql`
  query GetProductCategoryProductsBySlug(
    $slug: String!
    $language: Language!
    $page: Int
    $pageSize: Int
    $filter: ProductFilterInput
    $sort: ProductSortInput
    $requireProductCategoryFetch: Boolean! = true
  ) {
    getProductCategoryProductsBySlug(
      slug: $slug
      language: $language
      page: $page
      pageSize: $pageSize
      filter: $filter
      sort: $sort
    ) {
      products {
        nodes {
          id
          name
          description
          color
          images
          brand
          price
          productCategoryId
          badges
          interests
          condition
          conditionDescription
          isActive
          isExchangeable
          sellerId
          viewCount
          createdAt
          updatedAt
          deletedAt
          isLiked
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
              ... on PersonProfile {
                id
                sellerId
                firstName
                lastName
                displayName
                bio
                birthday
                profileImage
                coverImage
                allowExchanges
                personMembershipSubscriptionId
              }
              ... on BusinessProfile {
                id
                sellerId
                businessName
                logo
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
          productCategory {
            id
            departmentCategoryId
            averageWeight
            size
            weightUnit
            isActive
            sortOrder
            createdAt
            updatedAt
            translation {
              id
              productCategoryId
              language
              name
              slug
              keywords
              href
              metaTitle
              metaDescription
              metaKeywords
              createdAt
              updatedAt
            }
          }
        }
        pageInfo {
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
      productCategory @include(if: $requireProductCategoryFetch) {
        id
        departmentCategoryId
        averageWeight
        size
        weightUnit
        isActive
        sortOrder
        createdAt
        updatedAt
        translation {
          id
          productCategoryId
          language
          name
          slug
          keywords
          href
          metaTitle
          metaDescription
          metaKeywords
          createdAt
          updatedAt
        }
      }
    }
  }
`;
