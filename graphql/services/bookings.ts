import { gql } from "@apollo/client";

import { SERVICE_PAGE_INFO_FIELDS_FRAGMENT } from "./fragments";

// Service bookings, both sides (MOB-3), the same operations as the web
// (WEB-5). The services subgraph takes the identity from the session, so no
// query carries an id a caller could swap for someone else's. Booked on EKORU,
// paid to the provider on site (D7).

export const SERVICE_BOOKING_FIELDS_FRAGMENT = gql`
  fragment ServiceBookingFields on ServiceBooking {
    id
    serviceId
    clientId
    providerId
    scheduledDate
    scheduledTimeSlot
    agreedPrice
    status
    paymentMode
    clientNotes
    providerNotes
    cancellationReason
    cancelledBy
    completedAt
    createdAt
    service {
      id
      name
      displayImage
      sellerId
    }
  }
`;

export const GET_MY_SERVICE_BOOKINGS = gql`
  ${SERVICE_BOOKING_FIELDS_FRAGMENT}
  ${SERVICE_PAGE_INFO_FIELDS_FRAGMENT}
  query GetMyServiceBookings($page: Int = 1, $pageSize: Int = 30) {
    myServiceBookings(page: $page, pageSize: $pageSize) {
      nodes {
        ...ServiceBookingFields
      }
      pageInfo {
        ...ServicePageInfoFields
      }
    }
  }
`;

export const GET_MY_PROVIDER_BOOKINGS = gql`
  ${SERVICE_BOOKING_FIELDS_FRAGMENT}
  ${SERVICE_PAGE_INFO_FIELDS_FRAGMENT}
  query GetMyProviderBookings($page: Int = 1, $pageSize: Int = 30) {
    myProviderBookings(page: $page, pageSize: $pageSize) {
      nodes {
        ...ServiceBookingFields
        client {
          id
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
      }
      pageInfo {
        ...ServicePageInfoFields
      }
    }
  }
`;

/**
 * Books a service for the signed-in buyer. The subgraph fills in the client
 * (from the session), the provider (the service's seller) and the starting
 * price (its base price), so none of them is sent from the app.
 */
export const ADD_SERVICE_BOOKING = gql`
  ${SERVICE_BOOKING_FIELDS_FRAGMENT}
  mutation AddServiceBooking($input: AddServiceBookingInput!) {
    addServiceBooking(input: $input) {
      ...ServiceBookingFields
    }
  }
`;

export const CANCEL_SERVICE_BOOKING = gql`
  ${SERVICE_BOOKING_FIELDS_FRAGMENT}
  mutation CancelServiceBooking($id: ID!, $reason: String!) {
    cancelServiceBooking(id: $id, reason: $reason) {
      ...ServiceBookingFields
    }
  }
`;

/** The provider confirms, starts or marks a no-show; services enforces the moves. */
export const UPDATE_SERVICE_BOOKING_STATUS = gql`
  ${SERVICE_BOOKING_FIELDS_FRAGMENT}
  mutation UpdateServiceBookingStatus($id: ID!, $status: String!) {
    updateServiceBooking(input: { id: $id, status: $status }) {
      ...ServiceBookingFields
    }
  }
`;

/** The provider closes the work; this is what awards the client's eco-points. */
export const COMPLETE_SERVICE_BOOKING = gql`
  ${SERVICE_BOOKING_FIELDS_FRAGMENT}
  mutation CompleteServiceBooking($id: ID!) {
    completeServiceBooking(id: $id) {
      ...ServiceBookingFields
    }
  }
`;
