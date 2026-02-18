import MainButton from "@/components/shared/Button/MainButton";
import Input from "@/components/shared/Input/Input";
import Select from "@/components/shared/Select/Select";
import type { SellerType } from "@/types/enums";
import { ArrowRight } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import useRegister from "../hooks/useRegister";

export default function RegisterForm() {
  const {
    sellerType,
    setSellerType,
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    loading,
    handleFieldChange,
    handleRegister,
  } = useRegister();
  const { t } = useTranslation("auth");

  const sellerTypeOptions = [
    { label: t("person"), value: "PERSON" },
    { label: t("startup"), value: "STARTUP" },
    { label: t("company"), value: "COMPANY" },
  ];

  return (
    <View style={styles.container}>
      <Select
        label={t("accountType")}
        value={sellerType}
        onChange={(value) => setSellerType(value as SellerType)}
        options={sellerTypeOptions}
        searchEnabled={false}
        hasIcon={false}
      />

      <Input
        name="firstName"
        label={t("firstName")}
        placeholder={t("firstNamePlaceholder")}
        value={firstName}
        onChangeText={(value) => handleFieldChange({ name: "firstName", value })}
        type="text"
      />

      <Input
        name="lastName"
        label={t("lastName")}
        placeholder={t("lastNamePlaceholder")}
        value={lastName}
        onChangeText={(value) => handleFieldChange({ name: "lastName", value })}
        type="text"
      />

      <Input
        name="email"
        label={t("email")}
        placeholder={t("emailPlaceholder")}
        value={email}
        onChangeText={(value) => handleFieldChange({ name: "email", value })}
        type="email"
      />

      <Input
        name="password"
        label={t("password")}
        placeholder={t("passwordPlaceholder")}
        value={password}
        onChangeText={(value) => handleFieldChange({ name: "password", value })}
        type="password"
      />

      <Input
        name="confirmPassword"
        label={t("confirmPassword")}
        placeholder={t("confirmPasswordPlaceholder")}
        value={confirmPassword}
        onChangeText={(value) =>
          handleFieldChange({ name: "confirmPassword", value })
        }
        type="password"
      />

      <MainButton
        text={t("register")}
        onPress={handleRegister}
        style={{ marginTop: 8 }}
        rightIcon={ArrowRight}
        loading={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },
});
