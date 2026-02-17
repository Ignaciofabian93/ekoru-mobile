import "@/i18n";
import {
  Cabin_400Regular,
  Cabin_500Medium,
  Cabin_600SemiBold,
  Cabin_700Bold,
} from "@expo-google-fonts/cabin";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import "../global.css";

import { ApolloProvider } from "@apollo/client/react";

import Drawer from "@/components/Drawer";
import { DrawerProvider } from "@/components/DrawerContext";
import toastConfig from "@/components/shared/Toast/toastConfig";
import { useColorScheme } from "@/components/useColorScheme";
import client from "@/lib/apollo";
import useAuthStore from "@/store/useAuthStore";
import Toast from "react-native-toast-message";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Cabin_400Regular,
    Cabin_500Medium,
    Cabin_600SemiBold,
    Cabin_700Bold,
    ...FontAwesome.font,
  });
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const [authHydrating, setAuthHydrating] = useState(true);

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    useAuthStore.getState().hydrate();
  }, []);

  useEffect(() => {
    if (isHydrated) {
      setAuthHydrating(false);
    }
  }, [isHydrated]);

  useEffect(() => {
    if (loaded && !authHydrating) {
      SplashScreen.hideAsync();
    }
  }, [loaded, authHydrating]);

  if (!loaded || authHydrating) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ApolloProvider client={client}>
      <DrawerProvider>
        <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(profile)" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          </Stack>
          <Drawer />
          <StatusBar style="light" />
        </ThemeProvider>
      </DrawerProvider>
      <Toast config={toastConfig} />
    </ApolloProvider>
  );
}
