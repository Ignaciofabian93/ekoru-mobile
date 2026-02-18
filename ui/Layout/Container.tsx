import { StyleSheet, View } from "react-native";

export default function Container({ children }: { children: React.ReactNode }) {
  return <View style={styles.content}>{children}</View>;
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 8,
  },
});
