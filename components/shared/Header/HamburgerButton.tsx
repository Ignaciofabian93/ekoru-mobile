import { useDrawer } from "@/context/DrawerContext";
import { Bell, Menu, ShoppingCart } from "lucide-react-native";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

export default function HeaderRight() {
  const { openDrawer } = useDrawer();

  return (
    <View style={styles.container}>
      <Pressable hitSlop={8}>
        <Bell size={22} strokeWidth={1.5} color="#fff" />
      </Pressable>
      <Pressable hitSlop={8}>
        <ShoppingCart size={22} strokeWidth={1.5} color="#fff" />
      </Pressable>
      <Pressable onPress={openDrawer} hitSlop={8}>
        <Menu size={24} strokeWidth={1.5} color="#fff" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginRight: 16,
  },
});
