import { gql } from "@apollo/client";

export const ADD_PRODUCT = gql`
  mutation AddProduct($input: AddProductInput!) {
    addProduct(input: $input) {
      id
      name
      description
      color
      images
      brand
      price
      productCategoryId
      badges
      interests
      condition
      conditionDescription
      isActive
      isExchangeable
      sellerId
      viewCount
      createdAt
      updatedAt
    }
  }
`;
