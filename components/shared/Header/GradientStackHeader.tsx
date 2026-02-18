import Colors from "@/constants/Colors";
import type { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowLeft } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function GradientStackHeader({
  navigation,
  options,
  back,
}: NativeStackHeaderProps) {
  const insets = useSafeAreaInsets();
  const title = options.title ?? "";

  return (
    <LinearGradient
      colors={[Colors.primaryDark, Colors.primary, Colors.primaryDark]}
      start={{ x: 0, y: 0.5 }}
      end={{ x: 1, y: 0.5 }}
      style={{ paddingTop: insets.top }}
    >
      <View style={styles.bar}>
        <View style={styles.side}>
          {back && (
            <Pressable
              onPress={() => navigation.goBack()}
              style={styles.backButton}
              hitSlop={8}
            >
              <ArrowLeft size={22} color="#fff" strokeWidth={2} />
            </Pressable>
          )}
        </View>

        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>

        <View style={styles.side} />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  bar: {
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
  },
  side: {
    width: 44,
    alignItems: "flex-start",
  },
  backButton: {
    padding: 8,
  },
  title: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    fontFamily: "Cabin_700Bold",
    color: "#fff",
  },
});
