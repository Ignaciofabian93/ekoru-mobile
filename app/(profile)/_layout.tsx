import SectionHeader from "@/components/Navigation/Header/SectionHeader";
import { Stack } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";

export default function ProfileLayout() {
  const { t } = useTranslation();
  return (
    <Stack
      screenOptions={{
        header: (props) => <SectionHeader {...props} />,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: t("screens.profile.index"),
          headerBackButtonMenuEnabled: true,
        }}
      />
      <Stack.Screen name="settings" options={{ title: t("screens.profile.settings") }} />
      <Stack.Screen name="edit-profile" options={{ title: t("screens.profile.editProfile") }} />
      <Stack.Screen name="change-password" options={{ title: t("screens.profile.changePassword") }} />
      <Stack.Screen name="order-history" options={{ title: t("screens.profile.orderHistory") }} />
      <Stack.Screen name="favorites" options={{ title: t("screens.profile.favorites") }} />
      <Stack.Screen
        name="environmental-impact"
        options={{ title: t("screens.profile.environmentalImpact") }}
      />
      <Stack.Screen name="subscription" options={{ title: t("screens.profile.subscription") }} />
      <Stack.Screen name="payments" options={{ title: t("screens.profile.payments") }} />
      <Stack.Screen name="bookings" options={{ title: t("screens.profile.bookings") }} />
      <Stack.Screen name="messages/index" options={{ title: t("screens.profile.messages") }} />
      <Stack.Screen name="messages/[id]" options={{ title: t("screens.profile.thread") }} />
    </Stack>
  );
}
