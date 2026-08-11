import SectionHeader from "@/components/Navigation/Header/SectionHeader";
import { Stack } from "expo-router";
import React from "react";

export default function DealsLayout() {
  return (
    <Stack
      screenOptions={{
        header: (props) => <SectionHeader {...props} />,
      }}
    >
      <Stack.Screen name="index" options={{ title: "My Deals" }} />
    </Stack>
  );
}
