import { gql } from "@apollo/client";
import {
  BUSINESS_PROFILE_FIELDS_FRAGMENT,
  PERSON_PROFILE_FIELDS_FRAGMENT,
  SELLER_FIELDS_FRAGMENT,
  SELLER_LEVEL_FIELDS_FRAGMENT,
  SELLER_PREFERENCES_FIELDS_FRAGMENT,
} from "../users/fragments";

export const UPDATE_SELLER = gql`
  ${SELLER_FIELDS_FRAGMENT}
  mutation UpdateSeller($input: UpdateSellerInput!) {
    updateSeller(input: $input) {
      ...SellerFields
    }
  }
`;

export const UPDATE_PERSON_PROFILE = gql`
  ${PERSON_PROFILE_FIELDS_FRAGMENT}
  mutation UpdatePersonProfile($input: UpdatePersonProfileInput!) {
    updatePersonProfile(input: $input) {
      ...PersonProfileFields
    }
  }
`;

export const UPDATE_BUSINESS_PROFILE = gql`
  ${BUSINESS_PROFILE_FIELDS_FRAGMENT}
  mutation UpdateBusinessProfile($input: UpdateBusinessProfileInput!) {
    updateBusinessProfile(input: $input) {
      ...BusinessProfileFields
    }
  }
`;

export const UPDATE_SELLER_PREFERENCES = gql`
  ${SELLER_PREFERENCES_FIELDS_FRAGMENT}
  mutation UpdateSellerPreferences($input: UpdateSellerPreferencesInput!) {
    updateSellerPreferences(input: $input) {
      ...SellerPreferencesFields
    }
  }
`;

export const UPDATE_PASSWORD = gql`
  mutation UpdatePassword($currentPassword: String!, $newPassword: String!, $language: Language) {
    updatePassword(currentPassword: $currentPassword, newPassword: $newPassword, language: $language) {
      id
      email
    }
  }
`;

/**
 * Emails a one-time reset link. Always succeeds, whether or not the address has
 * an account — the answer must not reveal which addresses are registered.
 *
 * The link itself opens the web app (`/{lang}/reset-password?token=…`); the app
 * only asks for the link, it does not consume the token.
 */
export const REQUEST_PASSWORD_RESET = gql`
  mutation RequestPasswordReset($email: String!, $language: Language = ES) {
    requestPasswordReset(email: $email, language: $language)
  }
`;

export const DEACTIVATE_ACCOUNT = gql`
  mutation DeactivateAccount {
    deactivateAccount {
      id
      isActive
    }
  }
`;

export const REACTIVATE_ACCOUNT = gql`
  mutation ReactivateAccount {
    reactivateAccount {
      id
      isActive
    }
  }
`;

export const UPDATE_SELLER_CATEGORY = gql`
  ${SELLER_LEVEL_FIELDS_FRAGMENT}
  mutation UpdateSellerCategory($id: String!, $categoryId: Int!) {
    updateSellerCategory(id: $id, categoryId: $categoryId) {
      id
      sellerLevel {
        ...SellerLevelFields
      }
    }
  }
`;

export const GET_PERSON_MEMBERSHIPS = gql`
  query PersonMemberships($language: Language, $countryId: Int) {
    personMemberships(language: $language, countryId: $countryId) {
      id
      membershipType
      durationMonths
      isActive
      pricing {
        id
        personMembershipId
        countryId
        currency
        price
        isActive
      }
      translation {
        id
        personMembershipId
        language
        name
        description
      }
    }
  }
`;

export const GET_BUSINESS_MEMBERSHIPS = gql`
  query BusinessMemberships($language: Language, $countryId: Int) {
    businessMemberships(language: $language, countryId: $countryId) {
      id
      membershipType
      durationMonths
      isActive
      pricing {
        id
        businessMembershipId
        countryId
        currency
        price
        isActive
      }
      translation {
        id
        businessMembershipId
        language
        name
        description
      }
    }
  }
`;

export const ASSIGN_PERSON_MEMBERSHIP = gql`
  mutation AssignPersonMembership($input: CreatePersonMembershipSubscriptionInput, $language: Language) {
    assignPersonMembership(input: $input, language: $language) {
      id
      sellerId
      personMembershipId
      startDate
      endDate
      isActive
      autoRenew
      paymentId
      createdAt
      updatedAt
      personMembership {
        id
        membershipType
        durationMonths
        isActive
        createdAt
        updatedAt
      }
    }
  }
`;

export const ASSIGN_BUSINESS_MEMBERSHIP = gql`
  mutation AssignBusinessMembership($input: CreateBusinessMembershipSubscriptionInput, $language: Language) {
    assignBusinessMembership(input: $input, language: $language) {
      id
      sellerId
      businessMembershipId
      startDate
      endDate
      isActive
      autoRenew
      paymentId
      createdAt
      updatedAt
      businessMembership {
        id
        membershipType
        durationMonths
        isActive
        createdAt
        updatedAt
      }
    }
  }
`;
