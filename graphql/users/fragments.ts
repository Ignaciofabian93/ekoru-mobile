import { gql } from "@apollo/client";

import {
  COUNTRY_FIELDS_FRAGMENT,
  REGION_FIELDS_FRAGMENT,
  CITY_FIELDS_FRAGMENT,
  COUNTY_FIELDS_FRAGMENT,
} from "../location/fragments";

export const SELLER_LEVEL_FIELDS_FRAGMENT = gql`
  fragment SellerLevelFields on SellerLevel {
    id
    levelName
    minPoints
    maxPoints
    benefits
    badgeIcon
    createdAt
    updatedAt
  }
`;

export const SELLER_PREFERENCES_FIELDS_FRAGMENT = gql`
  fragment SellerPreferencesFields on SellerPreferences {
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
`;

export const PERSON_PROFILE_FIELDS_FRAGMENT = gql`
  fragment PersonProfileFields on PersonProfile {
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
`;

export const BUSINESS_PROFILE_FIELDS_FRAGMENT = gql`
  fragment BusinessProfileFields on BusinessProfile {
    id
    sellerId
    businessName
    displayName
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
`;

export const SELLER_FIELDS_FRAGMENT = gql`
  ${COUNTRY_FIELDS_FRAGMENT}
  ${REGION_FIELDS_FRAGMENT}
  ${CITY_FIELDS_FRAGMENT}
  ${COUNTY_FIELDS_FRAGMENT}
  ${SELLER_LEVEL_FIELDS_FRAGMENT}
  ${SELLER_PREFERENCES_FIELDS_FRAGMENT}
  fragment SellerFields on Seller {
    id
    email
    sellerType
    isActive
    isVerified
    address
    phone
    website
    preferredContactMethod
    socialMediaLinks
    points
    createdAt
    updatedAt
    country {
      ...CountryFields
    }
    region {
      ...RegionFields
    }
    city {
      ...CityFields
    }
    county {
      ...CountyFields
    }
    sellerLevel {
      ...SellerLevelFields
    }
    preferences {
      ...SellerPreferencesFields
    }
  }
`;
