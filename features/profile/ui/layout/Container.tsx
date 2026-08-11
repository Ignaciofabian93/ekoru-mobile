import { useEffect, useState } from "react";
import { Keyboard, KeyboardAvoidingView, ScrollView, StyleSheet, View } from "react-native";
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
    <View style={[styles.outerContainer, enableBottomInset && { paddingBottom: bottom }]}>{children}</View>
  );
}

export function ScrollContainer({
  children,
  enableContentContainerStyle = false,
}: {
  children: React.ReactNode;
  enableContentContainerStyle?: boolean;
}) {
  const [keyboardOpen, setKeyboardOpen] = useState(false);

  useEffect(() => {
    const show = Keyboard.addListener("keyboardDidShow", () => setKeyboardOpen(true));
    const hide = Keyboard.addListener("keyboardDidHide", () => setKeyboardOpen(false));
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      // automaticallyAdjustKeyboardInsets handles inset + scroll-to-focus on iOS.
      // softwareKeyboardLayoutMode="pan" in app.json handles Android at OS level.
      // KAV behavior must be undefined on both to avoid double-adjusting the layout.
      behavior={undefined}
    >
      <ScrollView
        style={styles.scroll}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="none"
        // Automatically adjusts the scroll view's bottom inset when the
        // software keyboard appears and scrolls the focused input into view.
        automaticallyAdjustKeyboardInsets
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: enableContentContainerStyle ? (keyboardOpen ? 120 : 40) : 0,
        }}
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export function Content({ children }: { children: React.ReactNode }) {
  return <View style={styles.content}>{children}</View>;
}

const styles = StyleSheet.create({
  outerContainer: { flex: 1, backgroundColor: "#fff" },
  flex: { flex: 1 },
  scroll: { flex: 1 },
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
});
