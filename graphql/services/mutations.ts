import { gql } from "@apollo/client";

export const ADD_SERVICE = gql`
  mutation AddService($input: AddServiceInput!) {
    addService(input: $input) {
      id
      name
    }
  }
`;

export const UPDATE_SERVICE = gql`
  mutation UpdateService($input: UpdateServiceInput!) {
    updateService(input: $input) {
      id
      name
      updatedAt
    }
  }
`;

export const DELETE_SERVICE = gql`
  mutation DeleteService($id: ID!) {
    deleteService(id: $id) {
      id
      deletedAt
    }
  }
`;

export const TOGGLE_SERVICE_ACTIVE = gql`
  mutation ToggleServiceActive($id: ID!) {
    toggleServiceActive(id: $id) {
      id
      isActive
    }
  }
`;

export const TOGGLE_SERVICE_LIKE = gql`
  mutation ToggleServiceLike($serviceId: ID!) {
    toggleServiceLike(serviceId: $serviceId) {
      id
      isLiked
    }
  }
`;
