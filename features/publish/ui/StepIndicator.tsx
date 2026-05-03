import { colors } from "@/design/tokens";
import { StyleSheet, View } from "react-native";

interface Props {
  total: number;
  current: number;
}

export default function StepIndicator({ total, current }: Props) {
  return (
    <View style={styles.container}>
      {Array.from({ length: total }).map((_, i) => (
        <StepDot key={i} active={i === current} done={i < current} />
      ))}
    </View>
  );
}

function StepDot({ active, done }: { active: boolean; done: boolean }) {
  return (
    <View
      style={[
        styles.dot,
        {
          width: active ? 24 : 8,
          backgroundColor: active || done ? colors.primary : colors.borderLight,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 16,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
});
