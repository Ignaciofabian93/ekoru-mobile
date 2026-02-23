import { gql } from "@apollo/client";

export const ADD_POINTS = gql`
  mutation AddPoints($id: String!, $points: Int!) {
    addPoints(id: $id, points: $points) {
      id
      points
    }
  }
`;

export const DEDUCT_POINTS = gql`
  mutation DeductPoints($id: String!, $points: Int!) {
    deductPoints(id: $id, points: $points) {
      id
      points
    }
  }
`;
