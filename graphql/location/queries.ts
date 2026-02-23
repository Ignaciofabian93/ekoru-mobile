import { gql } from "@apollo/client";

import {
  COUNTRY_FIELDS_FRAGMENT,
  REGION_FIELDS_FRAGMENT,
  CITY_FIELDS_FRAGMENT,
  COUNTY_FIELDS_FRAGMENT,
} from "./fragments";

export const GET_COUNTRIES = gql`
  ${COUNTRY_FIELDS_FRAGMENT}
  query GetCountries {
    countries {
      ...CountryFields
    }
  }
`;

export const GET_REGIONS_BY_COUNTRY = gql`
  ${REGION_FIELDS_FRAGMENT}
  query GetRegionsByCountry($countryId: Int!) {
    regionsByCountryId(countryId: $countryId) {
      ...RegionFields
    }
  }
`;

export const GET_CITIES_BY_REGION = gql`
  ${CITY_FIELDS_FRAGMENT}
  query GetCitiesByRegion($regionId: Int!) {
    citiesByRegionId(regionId: $regionId) {
      ...CityFields
    }
  }
`;

export const GET_COUNTIES_BY_CITY = gql`
  ${COUNTY_FIELDS_FRAGMENT}
  query GetCountiesByCity($cityId: Int!) {
    countiesByCityId(cityId: $cityId) {
      ...CountyFields
    }
  }
`;
