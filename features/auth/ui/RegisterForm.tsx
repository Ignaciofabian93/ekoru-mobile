import MainButton from "@/components/Primitives/Button/MainButton";
import Checkbox from "@/components/Primitives/Checkbox/Checkbox";
import Input from "@/components/Primitives/Input/Input";
import { Text } from "@/components/Primitives/Text/Text";
import { Title } from "@/components/Primitives/Title/Title";
import { colors } from "@/design/tokens";
import type { BusinessType, SellerType } from "@/types/enums";
import { isEmailValid } from "@/utils/regexValidations";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  Rocket,
  User,
  type LucideIcon,
} from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Animated, Pressable, StyleSheet, Text as RNText, View } from "react-native";
import useRegister from "../hooks/useRegister";

const TOTAL_STEPS = 3;

const ACCOUNT_TYPES: { value: SellerType; icon: LucideIcon; labelKey: string; descKey: string }[] = [
  { value: "PERSON", icon: User, labelKey: "person", descKey: "personDesc" },
  { value: "STARTUP", icon: Rocket, labelKey: "startup", descKey: "startupDesc" },
  { value: "COMPANY", icon: Building2, labelKey: "company", descKey: "companyDesc" },
];

const BUSINESS_TYPES: { value: BusinessType; labelKey: string }[] = [
  { value: "RETAIL", labelKey: "retail" },
  { value: "SERVICES", labelKey: "services" },
  { value: "MIXED", labelKey: "mixed" },
];

export default function RegisterForm() {
  const { t } = useTranslation("auth");
  const router = useRouter();
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
  } = useRegister();

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  // Reveals validation errors only after the user attempts to advance/submit.
  const [submitted, setSubmitted] = useState(false);

  const isBusiness = sellerType !== "PERSON";

  const emailValid = isEmailValid(email);
  const detailsValid = isBusiness
    ? businessName.trim().length > 0 && displayName.trim().length > 0 && emailValid
    : firstName.trim().length > 0 && lastName.trim().length > 0 && emailValid;
  const passwordValid = password.length >= 8;
  const confirmValid = confirmPassword.length > 0 && password === confirmPassword;

  // Step transition animation (RN Animated — mirrors the no-Reanimated convention
  // used across the shared components).
  const anim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    anim.setValue(0);
    Animated.timing(anim, {
      toValue: 1,
      duration: 260,
      useNativeDriver: true,
    }).start();
  }, [step, anim]);

  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [direction === "forward" ? 24 : -24, 0],
  });

  const goTo = (next: number, dir: "forward" | "back") => {
    setDirection(dir);
    setSubmitted(false);
    setStep(next);
  };

  const handleBack = () => goTo(step - 1, "back");

  const handleContinue = () => {
    if (step === 1 && !detailsValid) {
      setSubmitted(true);
      return;
    }
    goTo(step + 1, "forward");
  };

  const handleSubmit = async () => {
    if (!passwordValid || !confirmValid) {
      setSubmitted(true);
      return;
    }
    setSubmitted(false);
    await handleRegister();
  };

  const stepHeaders = [
    { title: t("accountTypeTitle"), subtitle: t("accountTypeSubtitle") },
    { title: t("detailsTitle"), subtitle: t("detailsSubtitle") },
    { title: t("securityTitle"), subtitle: t("securitySubtitle") },
  ];
  const stepHeader = stepHeaders[step];

  return (
    <View style={styles.container}>
      {/* Progress indicator */}
      <View style={styles.progress}>
        <View style={styles.progressBars}>
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <View
              key={i}
              style={[
                styles.progressBar,
                { backgroundColor: i <= step ? colors.primary : colors.borderLight },
              ]}
            />
          ))}
        </View>
        <Text variant="small" color="tertiary">
          {t("step", { current: String(step + 1), total: String(TOTAL_STEPS) })}
        </Text>
      </View>

      <Animated.View style={[styles.step, { opacity: anim, transform: [{ translateX }] }]}>
        <View style={styles.stepHeader}>
          <Title level="h4" weight="semibold" color="primary">
            {stepHeader.title}
          </Title>
          <Text variant="span" color="secondary">
            {stepHeader.subtitle}
          </Text>
        </View>

        {/* Step 1 — Account type */}
        {step === 0 && (
          <View style={styles.cardList}>
            {ACCOUNT_TYPES.map(({ value, icon: Icon, labelKey, descKey }) => {
              const selected = sellerType === value;
              return (
                <Pressable
                  key={value}
                  onPress={() => handleFieldChange({ name: "sellerType", value })}
                  style={[
                    styles.card,
                    {
                      borderColor: selected ? colors.primary : colors.inputBorder,
                      backgroundColor: selected ? colors.primaryLightBg : colors.surface,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.cardIcon,
                      { backgroundColor: selected ? colors.primary : colors.backgroundTertiary },
                    ]}
                  >
                    <Icon
                      size={20}
                      color={selected ? colors.onPrimary : colors.foregroundTertiary}
                      strokeWidth={2}
                    />
                  </View>
                  <View style={styles.cardText}>
                    <Text variant="span" weight="bold">
                      {t(labelKey)}
                    </Text>
                    <Text variant="small" color="tertiary">
                      {t(descKey)}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.radio,
                      {
                        borderColor: selected ? colors.primary : colors.borderStrong,
                        backgroundColor: selected ? colors.primary : "transparent",
                      },
                    ]}
                  >
                    {selected && <Check size={12} color={colors.onPrimary} strokeWidth={3} />}
                  </View>
                </Pressable>
              );
            })}
          </View>
        )}

        {/* Step 2 — Details */}
        {step === 1 && (
          <View style={styles.fields}>
            {isBusiness ? (
              <>
                <Input
                  name="businessName"
                  label={t("businessName")}
                  placeholder={t("businessNamePlaceholder")}
                  value={businessName}
                  onChangeText={(value) => handleFieldChange({ name: "businessName", value })}
                  isInvalid={submitted && businessName.trim().length === 0}
                  errorMessage={
                    submitted && businessName.trim().length === 0
                      ? t("registerFieldsRequired")
                      : undefined
                  }
                />
                <Input
                  name="displayName"
                  label={t("displayName")}
                  placeholder={t("displayNamePlaceholder")}
                  value={displayName}
                  onChangeText={(value) => handleFieldChange({ name: "displayName", value })}
                  isInvalid={submitted && displayName.trim().length === 0}
                  errorMessage={
                    submitted && displayName.trim().length === 0
                      ? t("registerFieldsRequired")
                      : undefined
                  }
                />
                <View style={styles.businessTypeGroup}>
                  <Text variant="span" weight="medium" color="secondary">
                    {t("businessType")}
                  </Text>
                  <View style={styles.pillRow}>
                    {BUSINESS_TYPES.map(({ value, labelKey }) => {
                      const selected = businessType === value;
                      return (
                        <Pressable
                          key={value}
                          onPress={() => handleFieldChange({ name: "businessType", value })}
                          style={[
                            styles.pill,
                            {
                              borderColor: selected ? colors.primary : colors.inputBorder,
                              backgroundColor: selected ? colors.primaryLightBg : colors.surface,
                            },
                          ]}
                        >
                          <Text
                            variant="small"
                            weight={selected ? "bold" : "normal"}
                            color={selected ? "primary" : "secondary"}
                          >
                            {t(labelKey)}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>
              </>
            ) : (
              <>
                <Input
                  name="firstName"
                  label={t("firstName")}
                  placeholder={t("firstNamePlaceholder")}
                  value={firstName}
                  onChangeText={(value) => handleFieldChange({ name: "firstName", value })}
                  type="text"
                  isInvalid={submitted && firstName.trim().length === 0}
                />
                <Input
                  name="lastName"
                  label={t("lastName")}
                  placeholder={t("lastNamePlaceholder")}
                  value={lastName}
                  onChangeText={(value) => handleFieldChange({ name: "lastName", value })}
                  type="text"
                  isInvalid={submitted && lastName.trim().length === 0}
                />
              </>
            )}
            <Input
              name="email"
              label={t("email")}
              placeholder={t("emailPlaceholder")}
              value={email}
              onChangeText={(value) => handleFieldChange({ name: "email", value })}
              type="email"
              isInvalid={(submitted || email.length > 0) && !emailValid}
              errorMessage={
                (submitted || email.length > 0) && !emailValid ? t("emailError") : undefined
              }
            />
          </View>
        )}

        {/* Step 3 — Password */}
        {step === 2 && (
          <View style={styles.fields}>
            <Input
              name="password"
              label={t("password")}
              placeholder={t("passwordPlaceholder")}
              value={password}
              onChangeText={(value) => handleFieldChange({ name: "password", value })}
              type="password"
              isInvalid={(submitted || password.length > 0) && !passwordValid}
              errorMessage={
                (submitted || password.length > 0) && !passwordValid ? t("passwordError") : undefined
              }
            />
            <Input
              name="confirmPassword"
              label={t("confirmPassword")}
              placeholder={t("confirmPasswordPlaceholder")}
              value={confirmPassword}
              onChangeText={(value) => handleFieldChange({ name: "confirmPassword", value })}
              type="password"
              isInvalid={(submitted || confirmPassword.length > 0) && !confirmValid}
              errorMessage={
                (submitted || confirmPassword.length > 0) && !confirmValid
                  ? t("confirmPasswordError")
                  : undefined
              }
            />

            {/* Terms & Policies checkbox */}
            <View style={styles.termsRow}>
              <Checkbox checked={termsAccepted} onCheckedChange={setTermsAccepted} size="md" />
              <RNText style={styles.termsText}>
                {t("termsAcceptLabel") + " "}
                <Pressable
                  onPress={() => router.push("/(legal)/terms-and-policies")}
                  style={styles.termsLinkPressable}
                >
                  <RNText style={styles.termsLink}>{t("termsAcceptLink")}</RNText>
                </Pressable>
              </RNText>
            </View>
          </View>
        )}
      </Animated.View>

      {/* Navigation */}
      <View style={styles.nav}>
        {step > 0 && (
          <MainButton
            text={t("back")}
            variant="outline"
            leftIcon={ArrowLeft}
            onPress={handleBack}
            size="md"
          />
        )}
        <View style={styles.navPrimary}>
          {step < TOTAL_STEPS - 1 ? (
            <MainButton
              text={t("continue")}
              rightIcon={ArrowRight}
              onPress={handleContinue}
              fullWidth
              size="md"
            />
          ) : (
            <MainButton
              text={t("register")}
              rightIcon={ArrowRight}
              onPress={handleSubmit}
              loading={loading}
              fullWidth
              size="md"
            />
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 24,
  },

  // Progress indicator
  progress: {
    gap: 8,
  },
  progressBars: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  progressBar: {
    flex: 1,
    height: 6,
    borderRadius: 999,
  },

  // Step container
  step: {
    minHeight: 300,
  },
  stepHeader: {
    gap: 4,
    marginBottom: 20,
  },

  // Account type cards
  cardList: {
    gap: 12,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    borderWidth: 2,
    borderRadius: 12,
    padding: 16,
  },
  cardIcon: {
    width: 44,
    height: 44,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  cardText: {
    flex: 1,
    gap: 2,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 999,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },

  // Details / password fields
  fields: {
    gap: 20,
  },
  businessTypeGroup: {
    gap: 8,
  },
  pillRow: {
    flexDirection: "row",
    gap: 8,
  },
  pill: {
    flex: 1,
    borderWidth: 2,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: "center",
  },

  // Terms & Policies
  termsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  termsText: {
    flex: 1,
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

  // Navigation
  nav: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  navPrimary: {
    flex: 1,
  },
});
