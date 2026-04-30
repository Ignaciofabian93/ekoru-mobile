import { borderRadius, colors, fontSize, iconSize, spacing } from "@/design/tokens";
import { Search } from "lucide-react-native";
import React, { useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";

export default function SearchBar() {
  const [query, setQuery] = useState("");

  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <Search size={iconSize.md} color={colors.inputPlaceholder} strokeWidth={2} />
        <TextInput
          style={styles.input}
          placeholder="Search..."
          placeholderTextColor={colors.inputPlaceholder}
          value={query}
          onChangeText={setQuery}
          returnKeyType="search"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    paddingHorizontal: spacing[4],
    paddingTop: spacing[1],
    paddingBottom: spacing[3],
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing[3],
    height: spacing[10],
    gap: spacing[2],
  },
  input: {
    flex: 1,
    fontSize: fontSize.base,
    color: colors.foreground,
    padding: 0,
  },
});
