import { gql } from "@apollo/client";

export const ADD_PRODUCT = gql`
  mutation AddProduct($input: AddProductInput!) {
    addProduct(input: $input) {
      id
      name
    }
  }
`;

export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($input: UpdateProductInput!) {
    updateProduct(input: $input) {
      id
      name
      updatedAt
    }
  }
`;

export const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id) {
      id
      deletedAt
    }
  }
`;

export const TOGGLE_PRODUCT_ACTIVE = gql`
  mutation ToggleProductActive($id: ID!) {
    toggleProductActive(id: $id) {
      id
      isActive
    }
  }
`;

export const TOGGLE_PRODUCT_LIKE = gql`
  mutation ToggleProductLike($productId: ID!) {
    toggleProductLike(productId: $productId) {
      id
      isLiked
    }
  }
`;
