import GuestScreen from "@/features/profile/screens/GuestScreen";
import ProfileScreen from "@/features/profile/screens/ProfileScreen";
import { useIsAuthenticated } from "@/store/useAuthStore";
import React from "react";

function GuestProfileScreen() {
  const isAuthenticated = useIsAuthenticated();

  if (isAuthenticated) {
    return <ProfileScreen />;
  }

  return <GuestScreen />;
}

export default function ProfileTab() {
  return <GuestProfileScreen />;
}
