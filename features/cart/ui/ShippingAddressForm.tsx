import Input from "@/components/Primitives/Input/Input";
import Select, { type Option } from "@/components/Primitives/Select/Select";
import useLocation from "@/features/profile/hooks/useLocation";
import type { ShippingAddressInput } from "@/types/checkout";
import { MapPin, Phone, User } from "lucide-react-native";
import { StyleSheet, View } from "react-native";

interface Props {
  value: Partial<ShippingAddressInput>;
  onChange: <K extends keyof ShippingAddressInput>(
    key: K,
    next: ShippingAddressInput[K] | undefined,
  ) => void;
}

/**
 * Delivery address for `createOrder`. The backend stores geography by id, so
 * country → region → city → county are cascading selects fed by the same
 * `useLocation` hook the profile editor uses; picking a level higher up clears
 * everything below it, or the order would carry a county from another region.
 */
export default function ShippingAddressForm({ value, onChange }: Props) {
  const { countries, regions, cities, counties } = useLocation({
    countryId: value.countryId,
    regionId: value.regionId,
    cityId: value.cityId,
  });

  const toOptions = <T,>(list: T[], label: (item: T) => string, id: (item: T) => number): Option[] =>
    list.map((item) => ({ label: label(item), value: id(item) }));

  return (
    <View style={styles.form}>
      <Input
        name="recipientName"
        label="Nombre de quien recibe"
        placeholder="Ej. Juan Pérez"
        value={value.recipientName ?? ""}
        onChangeText={(next) => onChange("recipientName", next)}
        leftIcon={User}
      />

      <Select
        label="País"
        placeholder="Selecciona un país"
        options={toOptions(countries, (c) => c.country, (c) => c.id)}
        value={value.countryId}
        onChange={(next) => {
          onChange("countryId", Number(next));
          onChange("regionId", undefined);
          onChange("cityId", undefined);
          onChange("countyId", undefined);
        }}
        width="full"
      />

      <Select
        label="Región"
        placeholder="Selecciona una región"
        options={toOptions(regions, (r) => r.region, (r) => r.id)}
        value={value.regionId}
        disabled={!value.countryId}
        onChange={(next) => {
          onChange("regionId", Number(next));
          onChange("cityId", undefined);
          onChange("countyId", undefined);
        }}
        width="full"
      />

      <Select
        label="Ciudad"
        placeholder="Selecciona una ciudad"
        options={toOptions(cities, (c) => c.city, (c) => c.id)}
        value={value.cityId}
        disabled={!value.regionId}
        onChange={(next) => {
          onChange("cityId", Number(next));
          onChange("countyId", undefined);
        }}
        width="full"
      />

      <Select
        label="Comuna"
        placeholder="Selecciona una comuna"
        options={toOptions(counties, (c) => c.county, (c) => c.id)}
        value={value.countyId}
        disabled={!value.cityId}
        onChange={(next) => onChange("countyId", Number(next))}
        width="full"
      />

      <Input
        name="street"
        label="Dirección"
        placeholder="Ej. Av. Providencia 1234, Dpto 5"
        value={value.street ?? ""}
        onChangeText={(next) => onChange("street", next)}
        leftIcon={MapPin}
      />

      <Input
        name="reference"
        label="Referencia (opcional)"
        placeholder="Ej. Portón negro, timbre 2"
        value={value.reference ?? ""}
        onChangeText={(next) => onChange("reference", next)}
      />

      <Input
        name="phone"
        label="Teléfono de contacto"
        placeholder="+56 9 1234 5678"
        value={value.phone ?? ""}
        onChangeText={(next) => onChange("phone", next)}
        leftIcon={Phone}
        keyboardType="phone-pad"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: 14,
  },
});
