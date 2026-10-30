import { gql } from "@apollo/client";

export const TRACK_ITEM_VIEW = gql`
  mutation TrackItemView($input: TrackItemViewInput!) {
    trackItemView(input: $input)
  }
`;

export const TRACK_SEARCH_CLICK = gql`
  mutation TrackSearchClick($input: TrackSearchClickInput!) {
    trackSearchClick(input: $input)
  }
`;
