import Select, { Option } from "@/components/shared/Select/Select";
import { Text } from "@/components/shared/Text/Text";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import useLocation from "../../hooks/useLocation";
import { NAMESPACE } from "./i18n";
import { Title } from "@/components/shared/Title/Title";
import Input from "@/components/shared/Input/Input";

export type LocationFormValues = {
  countryId: number | null;
  regionId: number | null;
  cityId: number | null;
  countyId: number | null;
  address: string;
};

interface LocationFormProps {
  values: LocationFormValues;
  onChange: <K extends keyof LocationFormValues>(
    key: K,
    value: number | string | null,
  ) => void;
}

export default function LocationForm({ values, onChange }: LocationFormProps) {
  const { t } = useTranslation(NAMESPACE);
  const { countries, regions, cities, counties } = useLocation({
    countryId: values.countryId,
    regionId: values.regionId,
    cityId: values.cityId,
  });

  const countryOptions: Option[] = countries.map((c) => ({
    label: c.country,
    value: c.id,
  }));
  const regionOptions: Option[] = regions.map((r) => ({
    label: r.region,
    value: r.id,
  }));
  const cityOptions: Option[] = cities.map((c) => ({
    label: c.city,
    value: c.id,
  }));
  const countyOptions: Option[] = counties.map((c) => ({
    label: c.county,
    value: c.id,
  }));

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
