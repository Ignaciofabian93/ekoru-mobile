import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ScreenLayoutProps {
  useKeyboardAvoidingView?: boolean;
  children: React.ReactNode;
  enablePaddingBottom?: boolean;
  enablePaddingTop?: boolean;
}

export default function ScreenLayout({
  children,
  useKeyboardAvoidingView = false,
  enablePaddingBottom = true,
  enablePaddingTop = true,
}: ScreenLayoutProps) {
  const { top, bottom } = useSafeAreaInsets();
  const { height } = useWindowDimensions();

  if (useKeyboardAvoidingView) {
    return (
      <KeyboardAvoidingView
        style={[
          styles.outerContainer,
          {
            paddingTop: enablePaddingTop ? top : 0,
            paddingBottom: enablePaddingBottom ? bottom : 0,
            height,
          },
        ]}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {children}
      </KeyboardAvoidingView>
    );
  }

  return (
    <View style={[styles.outerContainer, { paddingBottom: bottom }]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
