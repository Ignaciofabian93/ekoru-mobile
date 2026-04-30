import SubHeader from "@/components/shared/SubHeader/SubHeader";
import { colors } from "@/design/tokens";
import type { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowLeft } from "lucide-react-native";
import React from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SearchBar from "../SearchBar/SearchBar";
import HeaderRight from "./HamburgerButton";

export default function SectionHeader({
  navigation,
  back,
}: NativeStackHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      colors={[colors.primaryDark, colors.primary, colors.primaryDark]}
      start={{ x: 0, y: 0.5 }}
      end={{ x: 1, y: 0.5 }}
      style={{ paddingTop: insets.top }}
    >
      <View style={styles.headerBar}>
        <View style={styles.side}>
          {back && (
            <Pressable
              onPress={() => navigation.goBack()}
              style={styles.backButton}
              hitSlop={8}
            >
              <ArrowLeft size={22} color={colors.onPrimary} strokeWidth={2} />
            </Pressable>
          )}
        </View>
        <Pressable onPress={() => navigation.replace("(tabs)")}>
          <Image
            source={require("@/assets/images/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </Pressable>
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
    paddingHorizontal: 4,
    paddingTop: 8,
  },
  logo: {
    height: 40,
    width: 124,
    marginLeft: 24,
    marginBottom: 8,
  },
  side: {
    width: 44,
    alignItems: "flex-start",
  },
  backButton: {
    padding: 8,
  },
  headerRight: {
    alignItems: "flex-end",
  },
});
