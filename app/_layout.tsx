import "@/i18n";
import {
  Cabin_400Regular,
  Cabin_500Medium,
  Cabin_600SemiBold,
  Cabin_700Bold,
} from "@expo-google-fonts/cabin";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import "../global.css";

import { ApolloProvider } from "@apollo/client/react";

import BiometricGateScreen from "@/components/shared/BiometricGate/BiometricGateScreen";
import Drawer from "@/components/shared/Drawer/Drawer";
import ErrorScreen from "@/components/shared/ErrorScreen/ErrorScreen";
import toastConfig from "@/components/shared/Toast/toastConfig";
import { DrawerProvider } from "@/context/DrawerContext";
import client from "@/lib/apollo";
import { logger } from "@/lib/logger";
import useAuthStore from "@/store/useAuthStore";
import useLocationStore from "@/store/useLocationStore";
import Toast from "react-native-toast-message";

// ─── Global Error Boundary ────────────────────────────────────────────────────
// Expo Router expects a named export `ErrorBoundary` from the root layout.
// Exporting a custom component here instead of re-exporting from expo-router
// gives us full control over the UI and lets us log the error.
export function ErrorBoundary({
  error,
  retry,
}: {
  error: Error;
  retry: () => void;
}) {
  logger.error("RootErrorBoundary", error, { stack: error.stack });

  return (
    <ErrorScreen
      title="Something went wrong"
      message="An unexpected error occurred. You can try again or go back to the home screen."
      onAction={retry}
      actionLabel="Try again"
      showHomeLink
    />
  );
}

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
    useLocationStore.getState().hydrate();
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
  const requiresBiometric = useAuthStore((s) => s.requiresBiometric);

  return (
    <ApolloProvider client={client}>
      <DrawerProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(profile)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="product" options={{ headerShown: false }} />
          <Stack.Screen name="(marketplace)" options={{ headerShown: false }} />
          <Stack.Screen name="(stores)" options={{ headerShown: false }} />
          <Stack.Screen name="(services)" options={{ headerShown: false }} />
          <Stack.Screen name="(community)" options={{ headerShown: false }} />
          <Stack.Screen name="(blog)" options={{ headerShown: false }} />
          <Stack.Screen name="(legal)" options={{ headerShown: false }} />
          <Stack.Screen name="(publish)" options={{ headerShown: false }} />
        </Stack>
        <Drawer />
        <StatusBar style="auto" />
        {requiresBiometric && <BiometricGateScreen />}
      </DrawerProvider>
      <Toast config={toastConfig} />
    </ApolloProvider>
  );
}
