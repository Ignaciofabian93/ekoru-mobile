import SectionHeader from "@/components/Navigation/Header/SectionHeader";
import { Stack } from "expo-router";
import React from "react";

export default function ServicesLayout() {
  return (
    <Stack
      screenOptions={{
        header: (props) => <SectionHeader {...props} />,
      }}
    >
      <Stack.Screen name="index" options={{ title: "Services" }} />
      <Stack.Screen name="service-category" options={{ title: "Category" }} />
      <Stack.Screen name="service-subcategory" options={{ title: "Services" }} />
    </Stack>
  );
}
