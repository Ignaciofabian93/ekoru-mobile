import Input from "@/components/shared/Input/Input";
import Select, { type Option } from "@/components/shared/Select/Select";
import { Title } from "@/components/shared/Title/Title";
import type { City, Country, County, Region } from "@/types/location";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import useLocation from "../../hooks/useLocation";
import { NAMESPACE } from "./i18n";

export type LocationFormValues = {
  countryId: number | null;
  regionId: number | null;
  cityId: number | null;
  countyId: number | null;
  address: string;
};

export type SellerLocationFallback = {
  country?: Country | null;
  region?: Region | null;
  city?: City | null;
  county?: County | null;
};

interface LocationFormProps {
  values: LocationFormValues;
  onChange: <K extends keyof LocationFormValues>(
    key: K,
    value: number | string | null,
  ) => void;
  /** Seller's current location objects — shown immediately while Apollo loads */
  fallback?: SellerLocationFallback;
}

function withFallback(
  apollo: Option[],
  fallbackOption: Option | null,
): Option[] {
  if (apollo.length > 0) return apollo;
  if (fallbackOption) return [fallbackOption];
  return [];
}

export default function LocationForm({
  values,
  onChange,
  fallback,
}: LocationFormProps) {
  const { t } = useTranslation(NAMESPACE);
  const { countries, regions, cities, counties } = useLocation({
    countryId: values.countryId,
    regionId: values.regionId,
    cityId: values.cityId,
  });

  const countryOptions = withFallback(
    countries.map((c) => ({ label: c.country, value: c.id })),
    fallback?.country
      ? { label: fallback.country.country, value: fallback.country.id }
      : null,
  );

  const regionOptions = withFallback(
    regions.map((r) => ({ label: r.region, value: r.id })),
    fallback?.region
      ? { label: fallback.region.region, value: fallback.region.id }
      : null,
  );

  const cityOptions = withFallback(
    cities.map((c) => ({ label: c.city, value: c.id })),
    fallback?.city
      ? { label: fallback.city.city, value: fallback.city.id }
      : null,
  );

  const countyOptions = withFallback(
    counties.map((c) => ({ label: c.county, value: c.id })),
    fallback?.county
      ? { label: fallback.county.county, value: fallback.county.id }
      : null,
  );

  return (
    <>
      <Title level="h6" weight="semibold" style={styles.sectionTitle}>
        {t("location")}
      </Title>
      <View style={styles.card}>
        <Select
          label={t("country")}
          options={countryOptions}
          value={values.countryId ?? undefined}
          placeholder={t("countryPlaceholder")}
          onChange={(v) => onChange("countryId", v as number)}
        />
        <Select
          label={t("region")}
          options={regionOptions}
          value={values.regionId ?? undefined}
          placeholder={t("regionPlaceholder")}
          onChange={(v) => onChange("regionId", v as number)}
          disabled={!values.countryId}
        />
        <Select
          label={t("city")}
          options={cityOptions}
          value={values.cityId ?? undefined}
          placeholder={t("cityPlaceholder")}
          onChange={(v) => onChange("cityId", v as number)}
          disabled={!values.regionId}
          dropdownDirection="up"
        />
        <Select
          label={t("county")}
          options={countyOptions}
          value={values.countyId ?? undefined}
          placeholder={t("countyPlaceholder")}
          onChange={(v) => onChange("countyId", v as number)}
          disabled={!values.cityId}
          dropdownDirection="up"
        />
        <Input
          label={t("address")}
          value={values.address}
          onChangeText={(v) => onChange("address", v)}
          placeholder={t("addressPlaceholder")}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    marginBottom: 8,
    marginHorizontal: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    gap: 16,
  },
});
