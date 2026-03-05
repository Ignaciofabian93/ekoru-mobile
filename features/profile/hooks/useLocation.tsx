import {
  GET_CITIES_BY_REGION,
  GET_COUNTIES_BY_CITY,
  GET_COUNTRIES,
  GET_REGIONS_BY_COUNTRY,
} from "@/graphql/location/queries";
import { City, Country, County, Region } from "@/types/location";
import { useQuery } from "@apollo/client/react";

interface UseLocationParams {
  countryId?: number | null;
  regionId?: number | null;
  cityId?: number | null;
}

export default function useLocation({
  countryId,
  regionId,
  cityId,
}: UseLocationParams = {}) {
  const { data: countriesData, loading: countriesLoading } = useQuery<{ countries: Country[] }>(
    GET_COUNTRIES,
    { fetchPolicy: "cache-first" },
  );

  const { data: regionsData, loading: regionsLoading } = useQuery<{ regionsByCountryId: Region[] }>(
    GET_REGIONS_BY_COUNTRY,
    {
      variables: { countryId },
      skip: !countryId,
      fetchPolicy: "cache-first",
    },
  );

  const { data: citiesData, loading: citiesLoading } = useQuery<{ citiesByRegionId: City[] }>(
    GET_CITIES_BY_REGION,
    {
      variables: { regionId },
      skip: !regionId,
      fetchPolicy: "cache-first",
    },
  );

  const { data: countiesData, loading: countiesLoading } = useQuery<{ countiesByCityId: County[] }>(
    GET_COUNTIES_BY_CITY,
    {
      variables: { cityId },
      skip: !cityId,
      fetchPolicy: "cache-first",
    },
  );

  return {
    countries: countriesData?.countries ?? [],
    regions: regionsData?.regionsByCountryId ?? [],
    cities: citiesData?.citiesByRegionId ?? [],
    counties: countiesData?.countiesByCityId ?? [],
    loading: countriesLoading || regionsLoading || citiesLoading || countiesLoading,
  };
}
