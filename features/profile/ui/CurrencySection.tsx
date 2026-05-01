import Select from "@/components/shared/Select/Select";
import { Title } from "@/components/shared/Title/Title";
import { CURRENCIES_SUPPORTED } from "@/config/currencies";
import { CURRENCY_STORAGE_KEY } from "@/constants/locale";
import useStoredCurrency from "@/hooks/useStoredCurrency";
import { storageSet } from "@/lib/storage";
import { useAppCurrency } from "@/store/useLocationStore";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { NAMESPACE } from "../i18n";

export default function CurrencySection() {
  const { t } = useTranslation(NAMESPACE);
  const detected = useAppCurrency();
  const stored = useStoredCurrency();
  const [selected, setSelected] = useState(stored ?? detected);

  const handleSelection = (e: string | number) => {
    setSelected(e as string);
    storageSet(CURRENCY_STORAGE_KEY, e);
  };

  return (
    <View style={styles.container}>
      <Title level="h6" style={{ color: "#2f2f2f" }}>
        {t("currency")}
      </Title>
      <Select
        value={selected}
        options={CURRENCIES_SUPPORTED.map((c) => ({ label: c, value: c }))}
        onChange={(e) => handleSelection(e)}
        dropdownDirection="up"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    gap: 10,
  },
});
