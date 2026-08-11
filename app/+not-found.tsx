import ErrorScreen from "@/components/Feedback/ErrorScreen/ErrorScreen";
import { Stack } from "expo-router";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ErrorScreen
        title="Page not found"
        message="The screen you're looking for doesn't exist or may have been moved."
        showHomeLink
      />
    </>
  );
}
