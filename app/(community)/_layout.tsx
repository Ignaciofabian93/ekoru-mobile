import SectionHeader from "@/components/Navigation/Header/SectionHeader";
import { Stack } from "expo-router";
import React from "react";

export default function CommunityLayout() {
  return (
    <Stack
      screenOptions={{
        header: (props) => <SectionHeader {...props} />,
      }}
    >
      <Stack.Screen name="index" options={{ title: "Community" }} />
      <Stack.Screen name="community-category" options={{ title: "Category" }} />
      <Stack.Screen name="community-subcategory" options={{ title: "Topic" }} />
    </Stack>
  );
}
