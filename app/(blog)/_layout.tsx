import SectionHeader from "@/components/Navigation/Header/SectionHeader";
import { Stack } from "expo-router";
import React from "react";

export default function BlogLayout() {
  return (
    <Stack
      screenOptions={{
        header: (props) => <SectionHeader {...props} />,
      }}
    >
      <Stack.Screen name="index" options={{ title: "Blog" }} />
      <Stack.Screen name="blog-category" options={{ title: "Articles" }} />
      <Stack.Screen name="blog-post" options={{ title: "Article" }} />
    </Stack>
  );
}
