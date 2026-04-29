import Checkbox from "@/components/shared/Checkbox/Checkbox";
import MainButton from "@/components/shared/Button/MainButton";
import Input from "@/components/shared/Input/Input";
import Select from "@/components/shared/Select/Select";
import { colors } from "@/design/tokens";
import type { BusinessType, SellerType } from "@/types/enums";
import { useRouter } from "expo-router";
import { ArrowRight } from "lucide-react-native";
import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";
import useRegister from "../hooks/useRegister";
import { isEmailValid } from "@/utils/regexValidations";

export default function RegisterForm() {
  const {
    sellerType,
    businessType,
    firstName,
    lastName,
    businessName,
    displayName,
    email,
    password,
    confirmPassword,
    loading,
    handleFieldChange,
    handleRegister,
    termsAccepted,
    setTermsAccepted,
    isSubmitEnabled,
  } = useRegister();
  const { t } = useTranslation("auth");
  const router = useRouter();

  const sellerTypeOptions = [
    { label: t("person"), value: "PERSON" },
    { label: t("startup"), value: "STARTUP" },
    { label: t("company"), value: "COMPANY" },
  ];

  const businessTypeOptions = [
    { label: t("retail"), value: "RETAIL" },
    { label: t("services"), value: "SERVICES" },
    { label: t("mixed"), value: "MIXED" },
  ];

  return (
    <View style={styles.container}>
      <Select
        label={t("accountType")}
        value={sellerType}
        onChange={(value) => handleFieldChange({ name: "sellerType", value: value as SellerType })}
        options={sellerTypeOptions}
        searchEnabled={false}
      />
      {sellerType !== "PERSON" && (
        <Fragment>
          <Select
            label={t("businessType")}
            value={businessType}
            onChange={(value) => handleFieldChange({ name: "businessType", value: value as BusinessType })}
            options={businessTypeOptions}
            searchEnabled={false}
          />
          <Input
            name="businessName"
            label={t("businessName")}
            placeholder={t("businessNamePlaceholder")}
            value={businessName}
            onChangeText={(value) => handleFieldChange({ name: "businessName", value })}
          />
          <Input
            name="displayName"
            label={t("displayName")}
            placeholder={t("displayNamePlaceholder")}
            value={displayName}
            onChangeText={(value) => handleFieldChange({ name: "displayName", value })}
          />
        </Fragment>
      )}
      {sellerType === "PERSON" && (
        <Fragment>
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
        </Fragment>
      )}
      <Input
        name="email"
        label={t("email")}
        placeholder={t("emailPlaceholder")}
        value={email}
        onChangeText={(value) => handleFieldChange({ name: "email", value })}
        type="email"
        isInvalid={email.length > 0 && !isEmailValid(email)}
        errorMessage={email.length > 0 && !isEmailValid(email) ? t("emailError") : undefined}
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
        onChangeText={(value) => handleFieldChange({ name: "confirmPassword", value })}
        type="password"
      />
      {/* Terms & Policies checkbox */}
      <View style={styles.termsRow}>
        <Checkbox checked={termsAccepted} onCheckedChange={setTermsAccepted} size="md" />
        <Text style={styles.termsText}>
          {t("termsAcceptLabel")}{" "}
          <Pressable
            onPress={() => router.push("/(legal)/terms-and-policies")}
            style={styles.termsLinkPressable}
          >
            <Text style={styles.termsLink}>{t("termsAcceptLink")}</Text>
          </Pressable>
        </Text>
      </View>

      <MainButton
        text={t("register")}
        onPress={handleRegister}
        style={{ marginTop: 8 }}
        rightIcon={ArrowRight}
        loading={loading}
        disabled={!isSubmitEnabled()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 18,
  },
  termsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  termsText: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    fontSize: 13,
    fontFamily: "Cabin_400Regular",
    color: "#3c3c3c",
    lineHeight: 20,
  },
  termsLink: {
    fontSize: 13,
    fontFamily: "Cabin_700Bold",
    color: colors.primary,
    marginBottom: -4.5,
    textDecorationLine: "underline",
  },
  termsLinkPressable: {
    alignSelf: "flex-start",
  },
});
