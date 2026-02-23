import { gql } from "@apollo/client";

export const COUNTRY_FIELDS_FRAGMENT = gql`
  fragment CountryFields on Country {
    id
    country
  }
`;

export const REGION_FIELDS_FRAGMENT = gql`
  fragment RegionFields on Region {
    id
    region
    countryId
  }
`;

export const CITY_FIELDS_FRAGMENT = gql`
  fragment CityFields on City {
    id
    city
    regionId
  }
`;

export const COUNTY_FIELDS_FRAGMENT = gql`
  fragment CountyFields on County {
    id
    county
    cityId
  }
`;
