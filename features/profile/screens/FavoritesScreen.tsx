import Colors from "@/constants/Colors";
import { useRouter } from "expo-router";
import { Heart } from "lucide-react-native";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function FavouritesScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.empty}>
        <View style={styles.iconWrap}>
          <Heart size={48} color={Colors.primary} strokeWidth={1.5} />
        </View>
        <Text style={styles.title}>No favourites yet</Text>
        <Text style={styles.subtitle}>
          Save products and stores you love and they will appear here.
        </Text>
        <Pressable
          style={styles.button}
          onPress={() => router.push("/(tabs)/marketplace")}
        >
          <Text style={styles.buttonText}>Browse Marketplace</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    gap: 12,
  },
  iconWrap: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: `${Colors.primary}18`,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontFamily: "Cabin_700Bold",
    color: "#1f2937",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Cabin_400Regular",
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 20,
  },
  button: {
    marginTop: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: Colors.primary,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 15,
    fontFamily: "Cabin_600SemiBold",
    color: "#fff",
  },
});
