import SectionHeader from "@/components/shared/Header/SectionHeader";
import { Stack } from "expo-router";
import React from "react";

export default function CartLayout() {
  return (
    <Stack
      screenOptions={{
        header: (props) => <SectionHeader {...props} />,
      }}
    >
      <Stack.Screen name="index" options={{ title: "Mi Carrito" }} />
      <Stack.Screen name="checkout" options={{ title: "Finalizar Compra" }} />
      <Stack.Screen
        name="confirmation"
        options={{ title: "Pedido Confirmado", headerBackVisible: false }}
      />
    </Stack>
  );
}
