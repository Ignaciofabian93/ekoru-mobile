import Input from "@/components/shared/Input/Input";
import { Text } from "@/components/shared/Text/Text";
import { colors } from "@/design/tokens";
import { useTranslation } from "react-i18next";
import { StyleSheet, Switch, View } from "react-native";
import { NAMESPACE } from "./i18n";
import { Title } from "@/components/shared/Title/Title";
import TextArea from "@/components/shared/TextArea/TextArea";
import DatePicker from "@/components/shared/DatePicker/DatePicker";

export type PersonFormValues = {
  firstName: string;
  lastName: string;
  displayName: string;
  bio: string;
  birthday: string;
  allowExchanges: boolean;
};

interface PersonInfoFormProps {
  values: PersonFormValues;
  onChange: <K extends keyof PersonFormValues>(
    key: K,
    value: PersonFormValues[K],
  ) => void;
}

export default function PersonInfoForm({
  values,
  onChange,
}: PersonInfoFormProps) {
  const { t } = useTranslation(NAMESPACE);

  return (
    <>
      <Title level="h6" weight="semibold" style={styles.sectionTitle}>
        {t("personalInformation")}
      </Title>
      <View style={styles.card}>
        <Input
          label={t("firstName")}
          value={values.firstName}
          onChangeText={(v) => onChange("firstName", v)}
          placeholder={t("firstNamePlaceholder")}
        />
        <Input
          label={t("lastName")}
          value={values.lastName}
          onChangeText={(v) => onChange("lastName", v)}
          placeholder={t("lastNamePlaceholder")}
        />
        <Input
          label={t("displayName")}
          value={values.displayName}
          onChangeText={(v) => onChange("displayName", v)}
          placeholder={t("displayNamePlaceholder")}
        />
        <TextArea
          label={t("bio")}
          value={values.bio}
          onChangeText={(v) => onChange("bio", v)}
          placeholder={t("bioPlaceholder")}
          multiline
          numberOfLines={3}
          style={styles.textArea}
        />
        <DatePicker
          label={t("birthday")}
          value={values.birthday}
          onChange={(v: string) => onChange("birthday", v)}
          placeholder={t("birthdayPlaceholder")}
          confirmLabel={t("birthdayConfirm")}
          maximumDate={new Date()}
        />
        <View style={styles.toggleRow}>
          <View style={styles.toggleLabelWrap}>
            <Text style={styles.toggleLabel}>{t("allowExchanges")}</Text>
            <Text style={styles.toggleDesc}>{t("allowExchangesDesc")}</Text>
          </View>
          <Switch
            value={values.allowExchanges}
            onValueChange={(v) => onChange("allowExchanges", v)}
            trackColor={{ false: "#e5e7eb", true: `${colors.primary}60` }}
            thumbColor={values.allowExchanges ? colors.primary : "#9ca3af"}
          />
        </View>
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
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  toggleLabelWrap: { flex: 1, gap: 2 },
  toggleLabel: {
    fontSize: 14,
    fontFamily: "Cabin_500Medium",
    color: "#1f2937",
  },
  toggleDesc: {
    fontSize: 12,
    fontFamily: "Cabin_400Regular",
    color: "#6b7280",
  },
});
