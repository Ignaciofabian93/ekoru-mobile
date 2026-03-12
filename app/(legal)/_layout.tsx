import SectionHeader from "@/components/shared/Header/SectionHeader";
import { Stack } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";

export default function LegalLayout() {
  const { t } = useTranslation();
  return (
    <Stack
      screenOptions={{
        header: (props) => <SectionHeader {...props} />,
      }}
    >
      <Stack.Screen
        name="terms-of-service"
        options={{ title: t("screens.legal.termsOfService") }}
      />
      <Stack.Screen
        name="privacy-policy"
        options={{ title: t("screens.legal.privacyPolicy") }}
      />
    </Stack>
  );
}
