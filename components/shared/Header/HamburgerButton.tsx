import { useDrawer } from "@/context/DrawerContext";
import { colors, iconSize, spacing } from "@/design/tokens";
import { Menu, ShoppingCart } from "lucide-react-native";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

export default function HeaderRight() {
  const { openDrawer } = useDrawer();

  return (
    <View style={styles.container}>
      <Pressable hitSlop={8}>
        <ShoppingCart size={iconSize.xl} strokeWidth={1.5} color={colors.onPrimary} />
      </Pressable>
      <Pressable onPress={openDrawer} hitSlop={8}>
        <Menu size={iconSize["2xl"]} strokeWidth={1.5} color={colors.onPrimary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[4],
    marginRight: spacing[2],
  },
});
