import { gql } from "@apollo/client";

// Fragments for the entity references a search hit carries.
//
// The search subgraph indexes a flat projection — enough to rank and to render
// a bare tile — so it cannot answer "is this exchangeable?", "what did it save
// in CO2?" or "who is selling it?". Each hit therefore exposes a federated
// reference to the entity that owns it (`product` / `storeProduct` / `service`),
// and these fragments project exactly the fields MarketplaceCard,
// StoreProductCard and ServiceCard read off those entities.
//
// Field sets mirror the TS types in `types/product.ts`, `types/service.ts` and
// `types/user.ts`, and are kept deliberately narrow: every field selected here
// costs the gateway an entity fetch against the owning subgraph.

export const SEARCH_ENVIRONMENTAL_IMPACT_FIELDS_FRAGMENT = gql`
  fragment SearchEnvironmentalImpactFields on EnvironmentalImpact {
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

export const SEARCH_SELLER_FIELDS_FRAGMENT = gql`
  fragment SearchSellerFields on Seller {
    id
    sellerType
    isActive
    isVerified
    profile {
      ... on PersonProfile {
        id
        sellerId
        firstName
        lastName
        displayName
        profileImage
        allowExchanges
      }
      ... on BusinessProfile {
        id
        sellerId
        businessName
        logo
        businessType
      }
    }
    county {
      id
      county
      cityId
    }
  }
`;

/** Marketplace (peer-to-peer) product behind a `PRODUCT` hit. */
export const SEARCH_PRODUCT_FIELDS_FRAGMENT = gql`
  ${SEARCH_ENVIRONMENTAL_IMPACT_FIELDS_FRAGMENT}
  ${SEARCH_SELLER_FIELDS_FRAGMENT}
  fragment SearchProductFields on Product {
    id
    brand
    badges
    condition
    conditionDescription
    isExchangeable
    isLiked
    environmentalImpact {
      ...SearchEnvironmentalImpactFields
    }
    seller {
      ...SearchSellerFields
    }
  }
`;

/** Store (business catalog) product behind a `STORE_PRODUCT` hit. */
export const SEARCH_STORE_PRODUCT_FIELDS_FRAGMENT = gql`
  ${SEARCH_ENVIRONMENTAL_IMPACT_FIELDS_FRAGMENT}
  ${SEARCH_SELLER_FIELDS_FRAGMENT}
  fragment SearchStoreProductFields on StoreProduct {
    id
    brand
    badges
    stock
    isLowStock
    warranty
    warrantyDuration
    isLiked
    environmentalImpact {
      ...SearchEnvironmentalImpactFields
    }
    seller {
      ...SearchSellerFields
    }
  }
`;

/** Service behind a `SERVICE` hit. */
export const SEARCH_SERVICE_FIELDS_FRAGMENT = gql`
  ${SEARCH_SELLER_FIELDS_FRAGMENT}
  fragment SearchServiceFields on Service {
    id
    pricingType
    priceRange
    duration
    isRemoteService
    serviceLocations
    isLiked
    seller {
      ...SearchSellerFields
    }
  }
`;
