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
    </Stack>
  );
}
