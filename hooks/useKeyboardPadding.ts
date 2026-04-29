import { useEffect, useState } from "react";
import { Keyboard, Platform } from "react-native";

/**
 * Returns the current on-screen keyboard height on Android (0 when hidden).
 *
 * On iOS, KeyboardAvoidingView with behavior="padding" already handles this,
 * so the hook returns 0 to avoid double-adjusting.
 *
 * Usage — add the returned value to your ScrollView's contentContainerStyle
 * paddingBottom so the last inputs can scroll clear of the keyboard:
 *
 *   const keyboardPadding = useKeyboardPadding();
 *   <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + keyboardPadding }} />
 */
export default function useKeyboardPadding(): number {
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    if (Platform.OS !== "android") return;

    const show = Keyboard.addListener("keyboardDidShow", (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });

    const hide = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardHeight(0);
    });

    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  return keyboardHeight;
}
