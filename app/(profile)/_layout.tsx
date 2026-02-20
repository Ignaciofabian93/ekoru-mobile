import GradientStackHeader from "@/components/shared/Header/GradientStackHeader";
import { Stack } from "expo-router";
import React from "react";

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        header: (props) => <GradientStackHeader {...props} />,
      }}
    >
      <Stack.Screen
        name="index"
        options={{ title: "Profile", headerBackButtonMenuEnabled: true }}
      />
      <Stack.Screen name="settings" options={{ title: "Settings" }} />
      <Stack.Screen name="edit-profile" options={{ title: "Edit Profile" }} />
      <Stack.Screen
        name="change-password"
        options={{ title: "Change Password" }}
      />
      <Stack.Screen name="order-history" options={{ title: "Order History" }} />
      <Stack.Screen name="favorites" options={{ title: "Favorites" }} />
      <Stack.Screen
        name="environmental-impact"
        options={{ title: "Environmental Impact" }}
      />
      <Stack.Screen name="subscription" options={{ title: "Subscription" }} />
    </Stack>
  );
}
