import Colors from "@/constants/Colors";
import { Text, View } from "react-native";

export default function Banner() {
  return (
    <View
      style={{
        backgroundColor: Colors.primary,
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
      }}
    >
      <Text
        style={{
          color: "#fff",
          fontSize: 16,
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        Welcome to Ekoru! Discover a new way to consume and connect with your
        community.
      </Text>
    </View>
  );
}
