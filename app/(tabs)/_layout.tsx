import { Tabs } from "expo-router";
import { Bell, House, PackagePlus, UserRound } from "lucide-react-native";
import React from "react";
import { useTranslation } from "react-i18next";

import CustomHeader from "@/components/shared/Header/CustomHeader";
import CustomTabBar from "@/components/shared/TabBar/CustomTabBar";

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
        name="notifications"
        options={{
          title: t("tabs.notifications"),
          tabBarIcon: ({ color, size }) => (
            <Bell strokeWidth={1.5} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="publish"
        options={{
          title: t("tabs.publish"),
          tabBarIcon: ({ color, size }) => (
            <PackagePlus strokeWidth={1.5} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t("tabs.profile"),
          tabBarIcon: ({ color, size }) => (
            <UserRound strokeWidth={1.5} size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
