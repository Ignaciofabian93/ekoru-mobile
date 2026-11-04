import { useDrawer } from "@/context/DrawerContext";
import { colors, iconSize, spacing } from "@/design/tokens";
import useAppRouter from "@/hooks/useAppRouter";
import { useCartCount } from "@/store/useCartStore";
import { Menu, ShoppingCart } from "lucide-react-native";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function HeaderRight() {
  const { openDrawer } = useDrawer();
  const { navigate } = useAppRouter();
  const count = useCartCount();

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => navigate("/(cart)")}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel={count > 0 ? `Carro, ${count} productos` : "Carro"}
      >
        <ShoppingCart size={iconSize.xl} strokeWidth={1.5} color={colors.onPrimary} />
        {count > 0 ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{count > 99 ? "99+" : count}</Text>
          </View>
        ) : null}
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
  badge: {
    position: "absolute",
    top: -6,
    right: -8,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.accent,
  },
  badgeText: {
    fontSize: 11,
    fontFamily: "Cabin_700Bold",
    color: colors.foreground,
  },
});
