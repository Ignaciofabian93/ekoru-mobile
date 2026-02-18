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

import CustomTabBar from "@/components/shared/TabBar/CustomTabBar";

import CustomHeader from "@/components/shared/Header/CustomHeader";

export default function TabLayout() {
  const { t } = useTranslation();

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
          href: "/(tabs)/upload",
        }}
      />
    </Tabs>
  );
}
