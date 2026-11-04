import { gql } from "@apollo/client";

import { PAYMENT_FIELDS_FRAGMENT } from "./fragments";

/**
 * Order history for the signed-in buyer, the same query as the web. The buyer
 * comes from the session, so there is no id to pass. `product` and
 * `storeProduct` are federation refs resolved by the gateway; exactly one of
 * the two is set per line.
 */
export const GET_MY_ORDERS = gql`
  query GetMyOrders($page: Int = 1, $pageSize: Int = 10) {
    getOrdersByBuyer(page: $page, pageSize: $pageSize) {
      nodes {
        id
        sellerId
        status
        subtotal
        shippingCost
        total
        currency
        createdAt
        shippingMethod
        shippingStatus {
          id
          status
          trackingInfo
        }
        orderItems {
          id
          quantity
          price
          product {
            id
            name
            images
          }
          storeProduct {
            id
            name
            images
          }
        }
      }
      pageInfo {
        currentPage
        totalPages
        totalCount
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;

export const GET_PAYMENT_STATUS = gql`
  ${PAYMENT_FIELDS_FRAGMENT}
  query GetPaymentStatus($paymentId: ID!) {
    payment(id: $paymentId) {
      ...PaymentFields
    }
  }
`;

/**
 * Orders the signed-in seller received (WEB-1), the web's "Mis ventas" query.
 * `status` filters on payment and `stage` on shipping, so "to ship" is
 * `status: PAID, stage: PREPARING`. `buyer` is a users reference, and the
 * address carries location ids only.
 */
export const GET_MY_SALES = gql`
  query GetMySales($page: Int = 1, $pageSize: Int = 10, $status: OrderStatus, $stage: ShippingStage) {
    getOrdersBySeller(page: $page, pageSize: $pageSize, status: $status, stage: $stage) {
      nodes {
        id
        status
        subtotal
        shippingCost
        total
        currency
        createdAt
        shippingMethod
        shippingStatus {
          id
          status
          trackingInfo
        }
        shippingAddress {
          id
          recipientName
          phone
          countryId
          regionId
          cityId
          countyId
          street
          reference
          zipCode
        }
        buyer {
          id
          email
          phone
          profile {
            ... on PersonProfile {
              id
              displayName
              firstName
              lastName
            }
            ... on BusinessProfile {
              id
              businessName
            }
          }
        }
        orderItems {
          id
          quantity
          price
          product {
            id
            name
            images
          }
          storeProduct {
            id
            name
            images
          }
        }
      }
      pageInfo {
        currentPage
        totalPages
        totalCount
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;

/**
 * The sales header (WEB-14): paid revenue since `dateFrom`, and how many paid
 * orders still wait to ship.
 */
export const GET_SALES_STATS = gql`
  query GetSalesStats($dateFrom: DateTime) {
    getSellerRevenueStats(dateFrom: $dateFrom) {
      totalRevenue
      completedCount
      pendingCount
    }
    toShip: getOrdersBySeller(page: 1, pageSize: 1, status: PAID, stage: PREPARING) {
      pageInfo {
        totalCount
      }
    }
  }
`;
