import Input from "@/components/shared/Input/Input";
import { Text } from "@/components/shared/Text/Text";
import Colors from "@/constants/Colors";
import type { BusinessType } from "@/types/enums";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View } from "react-native";
import { NAMESPACE } from "./i18n";
import { Title } from "@/components/shared/Title/Title";
import DatePicker from "@/components/shared/DatePicker/DatePicker";

export type BusinessFormValues = {
  businessName: string;
  description: string;
  businessType: BusinessType | "";
  legalBusinessName: string;
  taxId: string;
  businessStartDate: string;
  legalRepresentative: string;
  legalRepresentativeTaxId: string;
  shippingPolicy: string;
  returnPolicy: string;
  serviceArea: string;
  yearsOfExperience: string;
  travelRadius: string;
};

interface BusinessInfoFormProps {
  values: BusinessFormValues;
  onChange: <K extends keyof BusinessFormValues>(
    key: K,
    value: BusinessFormValues[K],
  ) => void;
}

const BUSINESS_TYPES: BusinessType[] = ["RETAIL", "SERVICES", "MIXED"];

export default function BusinessInfoForm({
  values,
  onChange,
}: BusinessInfoFormProps) {
  const { t } = useTranslation(NAMESPACE);

  const isRetailOrMixed =
    values.businessType === "RETAIL" || values.businessType === "MIXED";
  const isServicesOrMixed =
    values.businessType === "SERVICES" || values.businessType === "MIXED";

  return (
    <>
      <Title level="h6" weight="semibold" style={styles.sectionTitle}>
        {t("businessInformation")}
      </Title>
      <View style={styles.card}>
        <Input
          label={t("businessName")}
          value={values.businessName}
          onChangeText={(v) => onChange("businessName", v)}
          placeholder={t("businessNamePlaceholder")}
        />
        <Input
          label={t("description")}
          value={values.description}
          onChangeText={(v) => onChange("description", v)}
          placeholder={t("descriptionPlaceholder")}
          multiline
          numberOfLines={3}
          style={styles.textArea}
        />

        {/* Business type selector */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>{t("businessType")}</Text>
          <View style={styles.typeRow}>
            {BUSINESS_TYPES.map((type) => (
              <Pressable
                key={type}
                style={[
                  styles.typeChip,
                  values.businessType === type && styles.typeChipActive,
                ]}
                onPress={() => onChange("businessType", type)}
              >
                <Text
                  style={[
                    styles.typeChipText,
                    ...(values.businessType === type
                      ? [styles.typeChipTextActive]
                      : []),
                  ]}
                >
                  {t(`businessType_${type}`)}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <Input
          label={t("legalBusinessName")}
          value={values.legalBusinessName}
          onChangeText={(v) => onChange("legalBusinessName", v)}
          placeholder={t("legalNamePlaceholder")}
        />
        <Input
          label={t("taxId")}
          value={values.taxId}
          onChangeText={(v) => onChange("taxId", v)}
          placeholder={t("taxIdPlaceholder")}
        />
        <DatePicker
          label={t("businessStartDate")}
          value={values.businessStartDate}
          onChange={(v: string) => onChange("businessStartDate", v)}
          placeholder={t("businessStartDatePlaceholder")}
          confirmLabel={t("birthdayConfirm")}
        />
        <Input
          label={t("legalRepresentative")}
          value={values.legalRepresentative}
          onChangeText={(v) => onChange("legalRepresentative", v)}
          placeholder={t("legalRepresentativePlaceholder")}
        />
        <Input
          label={t("legalRepresentativeTaxId")}
          value={values.legalRepresentativeTaxId}
          onChangeText={(v) => onChange("legalRepresentativeTaxId", v)}
          placeholder={t("legalRepresentativeTaxIdPlaceholder")}
        />
      </View>

      {/* Retail / Mixed */}
      {isRetailOrMixed && (
        <>
          <Text style={styles.sectionTitle}>{t("retailSection")}</Text>
          <View style={styles.card}>
            <Input
              label={t("shippingPolicy")}
              value={values.shippingPolicy}
              onChangeText={(v) => onChange("shippingPolicy", v)}
              placeholder={t("shippingPolicyPlaceholder")}
              multiline
              numberOfLines={3}
              style={styles.textArea}
            />
            <Input
              label={t("returnPolicy")}
              value={values.returnPolicy}
              onChangeText={(v) => onChange("returnPolicy", v)}
              placeholder={t("returnPolicyPlaceholder")}
              multiline
              numberOfLines={3}
              style={styles.textArea}
            />
          </View>
        </>
      )}

      {/* Services / Mixed */}
      {isServicesOrMixed && (
        <>
          <Text style={styles.sectionTitle}>{t("servicesSection")}</Text>
          <View style={styles.card}>
            <Input
              label={t("serviceArea")}
              value={values.serviceArea}
              onChangeText={(v) => onChange("serviceArea", v)}
              placeholder={t("serviceAreaPlaceholder")}
            />
            <Input
              label={t("yearsOfExperience")}
              value={values.yearsOfExperience}
              onChangeText={(v) => onChange("yearsOfExperience", v)}
              placeholder={t("yearsOfExperiencePlaceholder")}
              type="number"
            />
            <Input
              label={t("travelRadius")}
              value={values.travelRadius}
              onChangeText={(v) => onChange("travelRadius", v)}
              placeholder={t("travelRadiusPlaceholder")}
              type="number"
            />
          </View>
        </>
      )}
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
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  fieldGroup: { gap: 8 },
  fieldLabel: {
    fontSize: 14,
    fontFamily: "Cabin_500Medium",
    color: Colors.foreground,
  },
  typeRow: {
    flexDirection: "row",
    gap: 8,
  },
  typeChip: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 8,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  typeChipActive: {
    backgroundColor: `${Colors.primary}15`,
    borderColor: Colors.primary,
  },
  typeChipText: {
    fontSize: 13,
    fontFamily: "Cabin_500Medium",
    color: "#6b7280",
  },
  typeChipTextActive: {
    fontFamily: "Cabin_600SemiBold",
    color: Colors.primaryDark,
  },
});
