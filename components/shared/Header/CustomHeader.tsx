import Colors from "@/constants/Colors";
import type { BottomTabHeaderProps } from "@react-navigation/bottom-tabs";
import { LinearGradient } from "expo-linear-gradient";
import { Image, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SearchBar from "../SearchBar/SearchBar";
import SubHeader from "../SubHeader/SubHeader";
import HeaderRight from "./HamburgerButton";

export default function CustomHeader(_props: BottomTabHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      colors={[Colors.primaryDark, Colors.primary, Colors.primaryDark]}
      start={{ x: 0, y: 0.5 }}
      end={{ x: 1, y: 0.5 }}
      style={[{ paddingTop: insets.top }]}
    >
      <View style={styles.headerBar}>
        <Image
          source={require("@/assets/images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <View style={styles.headerRight}>
          <HeaderRight />
        </View>
      </View>
      <SearchBar />
      <SubHeader />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 48,
    paddingHorizontal: 4,
    paddingTop: 8,
  },
  logo: {
    height: 40,
    width: 120,
    marginLeft: 14,
  },
  headerRight: {
    alignItems: "flex-end",
  },
});
