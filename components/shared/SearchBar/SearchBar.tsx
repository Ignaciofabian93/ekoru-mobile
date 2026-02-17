import { Search } from "lucide-react-native";
import React, { useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";

import Colors from "@/constants/Colors";

export default function SearchBar() {
  const [query, setQuery] = useState("");

  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <Search size={18} color="#9ca3af" strokeWidth={2} />
        <TextInput
          style={styles.input}
          placeholder="Search..."
          placeholderTextColor="#9ca3af"
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
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 12,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 40,
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#1f2937",
    padding: 0,
  },
});
