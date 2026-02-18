import Colors from "@/constants/Colors";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Fragment } from "react";

export default function AuthLayout() {
  return (
    <Fragment>
      <StatusBar style="dark" backgroundColor="#fff" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: Colors.primary },
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
