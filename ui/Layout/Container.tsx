import React from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

interface ContainerProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export default function Container({ children, style }: ContainerProps) {
  return <View style={[styles.content, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 40,
  },
});
