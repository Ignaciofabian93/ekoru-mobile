import { Redirect } from "expo-router";

// Explicit entry point → always start at the home/tabs screen.
export default function Index() {
  return <Redirect href="/(tabs)" />;
}
