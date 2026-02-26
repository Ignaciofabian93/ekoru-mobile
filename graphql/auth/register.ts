import { gql } from "@apollo/client";

export const REGISTER_PERSON = gql`
  mutation RegisterPerson($input: RegisterPersonInput!) {
    registerPerson(input: $input) {
      id
      email
      sellerType
      createdAt
      updatedAt
    }
  }
`;

export const REGISTER_BUSINESS = gql`
  mutation RegisterBusiness($input: RegisterBusinessInput!) {
    registerBusiness(input: $input) {
      id
      email
      sellerType
      createdAt
      updatedAt
    }
  }
`;
