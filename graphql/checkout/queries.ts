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
