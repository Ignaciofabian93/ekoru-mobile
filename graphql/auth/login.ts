import { gql } from "@apollo/client";

export const GET_ME = gql`
  query Me {
    me {
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
        }
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
      }
      preferences {
        id
        sellerId
        preferredLanguage
        currency
        emailNotifications
        pushNotifications
        orderUpdates
        communityUpdates
        securityAlerts
        weeklySummary
        twoFactorAuth
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
  }
`;
