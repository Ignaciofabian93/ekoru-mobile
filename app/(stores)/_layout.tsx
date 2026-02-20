import SectionHeader from "@/components/shared/Header/SectionHeader";
import { Stack } from "expo-router";
import React from "react";

export default function StoresLayout() {
  return (
    <Stack
      screenOptions={{
        header: (props) => <SectionHeader {...props} />,
      }}
    >
      <Stack.Screen name="index" options={{ title: "Stores" }} />
    </Stack>
  );
}
