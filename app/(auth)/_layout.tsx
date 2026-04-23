import { colors } from "@/design/tokens";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Fragment } from "react";

export default function AuthLayout() {
  return (
    <Fragment>
      <StatusBar style="dark" backgroundColor="#fff" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold" },
          headerTitleAlign: "center",
        }}
      >
        <Stack.Screen
          name="index"
          options={{ title: "Login", headerShown: false }}
        />
        <Stack.Screen
          name="register"
          options={{ title: "Register", headerShown: false }}
        />
      </Stack>
    </Fragment>
  );
}
