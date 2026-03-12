import SectionHeader from "@/components/shared/Header/SectionHeader";
import { Stack } from "expo-router";
import React from "react";

export default function MarketplaceLayout() {
  return (
    <Stack
      screenOptions={{
        header: (props) => <SectionHeader {...props} />,
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
