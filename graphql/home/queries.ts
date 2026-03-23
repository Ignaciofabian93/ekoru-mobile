import { gql } from "@apollo/client";

export const EXCHANGEABLE_PRODUCTS = gql`
  query GetExchangeableProducts(
    $page: Int = 1
    $pageSize: Int = 20
    $sort: ProductSortInput
    $filter: ProductFilterInput
  ) {
    getExchangeableProducts(
      page: $page
      pageSize: $pageSize
      sort: $sort
      filter: $filter
    ) {
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
        environmentalImpact {
          totalCo2SavingsKG
          totalWaterSavingsLT
          materialBreakdown {
            materialType
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
            }
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
          }
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
          city {
            id
            city
            regionId
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
  }
`;
