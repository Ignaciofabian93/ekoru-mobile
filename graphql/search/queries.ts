import { gql } from "@apollo/client";

import {
  SEARCH_PRODUCT_FIELDS_FRAGMENT,
  SEARCH_SERVICE_FIELDS_FRAGMENT,
  SEARCH_STORE_PRODUCT_FIELDS_FRAGMENT,
} from "./fragments";

/**
 * Federated catalog search (ekoru-search subgraph). `language` and `country`
 * are required and always supplied by the client (web + mobile): results are
 * scoped to that market and the items indexed under that language. The `input`
 * carries the free-text query plus paging — see SearchInput in the subgraph.
 *
 * Every hit carries the flat indexed projection plus a reference to the entity
 * it came from. Exactly one of `product` / `storeProduct` / `service` is
 * non-null — picked by `type` — and the gateway resolves it against the owning
 * subgraph, which is where exchangeability, environmental impact and the seller
 * profile actually live.
 */
export const SEARCH = gql`
  ${SEARCH_PRODUCT_FIELDS_FRAGMENT}
  ${SEARCH_STORE_PRODUCT_FIELDS_FRAGMENT}
  ${SEARCH_SERVICE_FIELDS_FRAGMENT}
  query Search(
    $input: SearchInput!
    $language: Language!
    $country: String!
  ) {
    search(input: $input, language: $language, country: $country) {
      searchId
      query
      processingTimeMs
      items {
        id
        type
        name
        description
        price
        offerPrice
        hasOffer
        images
        category
        subcategory
        rating
        reviewCount
        sellerId
        tags
        highlightedName
        product {
          ...SearchProductFields
        }
        storeProduct {
          ...SearchStoreProductFields
        }
        service {
          ...SearchServiceFields
        }
      }
      pageInfo {
        currentPage
        pageSize
        totalItems
        totalPages
        hasNextPage
        hasPreviousPage
      }
      facets {
        categories {
          name
          count
        }
        types {
          name
          count
        }
        tags {
          name
          count
        }
      }
    }
  }
`;
