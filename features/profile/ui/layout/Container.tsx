import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function OuterContainer({
  children,
  enableBottomInset = false,
}: {
  children: React.ReactNode;
  enableBottomInset?: boolean;
}) {
  const { bottom } = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.outerContainer,
        enableBottomInset && { paddingBottom: bottom },
      ]}
    >
      {children}
    </View>
  );
}

export function ScrollContainer({ children }: { children: React.ReactNode }) {
  return (
    <KeyboardAvoidingView
      style={styles.flex}
      // On iOS, automaticallyAdjustKeyboardInsets handles both the inset and
      // auto-scrolling to the focused input, so no KAV behavior is needed.
      // softwareKeyboardLayoutMode is "pan" in app.json — Android pans the
      // window at the OS level, so KAV must be a no-op on Android to avoid
      // double-adjusting the layout and leaving a gray gap when keyboard closes.
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={styles.scroll}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        // Automatically adjusts the scroll view's bottom inset when the
        // software keyboard appears and scrolls the focused input into view.
        automaticallyAdjustKeyboardInsets
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  outerContainer: { flex: 1, backgroundColor: "#fff" },
  flex: { flex: 1 },
  scroll: { flex: 1 },
});
