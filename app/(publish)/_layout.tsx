import SectionHeader from "@/components/Navigation/Header/SectionHeader";
import { Stack } from "expo-router";
import React from "react";

export default function PublishLayout() {
  return (
    <Stack
      screenOptions={{
        header: (props) => <SectionHeader {...props} />,
      }}
    >
      <Stack.Screen name="create" options={{ title: "Publish" }} />
    </Stack>
  );
}
