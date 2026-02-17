import { Tabs } from "expo-router";
import {
  BookCheck,
  House,
  Package,
  PackagePlus,
  ScanBarcode,
  Store,
} from "lucide-react-native";
import React from "react";
import { useTranslation } from "react-i18next";
import { Image, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import CustomTabBar from "@/components/CustomTabBar";
import HeaderRight from "@/components/HamburgerButton";
import SearchBar from "@/components/shared/SearchBar/SearchBar";
import Colors from "@/constants/Colors";
import { useHasRole } from "@/store/useAuthStore";

import type { BottomTabHeaderProps } from "@react-navigation/bottom-tabs";

function CustomHeader(_props: BottomTabHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.headerContainer, { paddingTop: insets.top }]}>
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
    </View>
  );
}

export default function TabLayout() {
  const { t } = useTranslation();
  const canUpload = useHasRole("store", "service", "admin");

  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        header: (props) => <CustomHeader {...props} />,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t("tabs.home"),
          tabBarIcon: ({ color, size }) => (
            <House strokeWidth={1.5} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="marketplace"
        options={{
          title: t("tabs.marketplace"),
          tabBarIcon: ({ color, size }) => (
            <Package strokeWidth={1.5} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="stores"
        options={{
          title: t("tabs.stores"),
          tabBarIcon: ({ color, size }) => (
            <Store strokeWidth={1.5} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="services"
        options={{
          title: t("tabs.services"),
          tabBarIcon: ({ color, size }) => (
            <ScanBarcode strokeWidth={1.5} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="education"
        options={{
          title: t("tabs.education"),
          tabBarIcon: ({ color, size }) => (
            <BookCheck strokeWidth={1.5} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="upload"
        options={{
          title: t("tabs.upload"),
          tabBarIcon: ({ color, size }) => (
            <PackagePlus strokeWidth={1.5} size={size} color={color} />
          ),
          href: canUpload ? "/(tabs)/upload" : null,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: Colors.primary,
  },
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 48,
    paddingHorizontal: 4,
  },
  logo: {
    height: 32,
    width: 100,
    marginLeft: 14,
  },
  headerRight: {
    alignItems: "flex-end",
  },
});
