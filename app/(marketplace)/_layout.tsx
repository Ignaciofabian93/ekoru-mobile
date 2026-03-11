import GradientStackHeader from "@/components/shared/Header/GradientStackHeader";
import { Stack } from "expo-router";
import React from "react";

export default function MarketplaceLayout() {
  return (
    <Stack
      screenOptions={{
        header: (props) => <GradientStackHeader {...props} />,
      }}
    >
      <Stack.Screen name="index" options={{ title: "Marketplace" }} />
      <Stack.Screen name="department" options={{ title: "Department" }} />
      <Stack.Screen
        name="department-category"
        options={{ title: "Category" }}
      />
      <Stack.Screen name="product-category" options={{ title: "Products" }} />
    </Stack>
  );
}
