import { gql } from "@apollo/client";

export const ADD_STORE_PRODUCT = gql`
  mutation AddStoreProduct($input: AddStoreProductInput!) {
    addStoreProduct(input: $input) {
      id
      name
    }
  }
`;

export const UPDATE_STORE_PRODUCT = gql`
  mutation UpdateStoreProduct($input: UpdateStoreProductInput!) {
    updateStoreProduct(input: $input) {
      id
      name
      updatedAt
    }
  }
`;

export const DELETE_STORE_PRODUCT = gql`
  mutation DeleteStoreProduct($id: ID!) {
    deleteStoreProduct(id: $id) {
      id
      deletedAt
    }
  }
`;

export const TOGGLE_STORE_PRODUCT_ACTIVE = gql`
  mutation ToggleStoreProductActive($id: ID!) {
    toggleStoreProductActive(id: $id) {
      id
      isActive
    }
  }
`;

export const TOGGLE_STORE_PRODUCT_LIKE = gql`
  mutation ToggleStoreProductLike($storeProductId: ID!) {
    toggleStoreProductLike(storeProductId: $storeProductId) {
      id
      isLiked
    }
  }
`;
