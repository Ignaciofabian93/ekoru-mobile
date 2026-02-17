import Colors from "@/constants/Colors";
import { Check } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Size = "sm" | "md" | "lg";

interface CheckboxProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: Size;
}

const sizeConfig: Record<Size, { box: number; icon: number; radius: number }> = {
  sm: { box: 18, icon: 12, radius: 4 },
  md: { box: 22, icon: 16, radius: 5 },
  lg: { box: 26, icon: 20, radius: 6 },
};

export default function Checkbox({
  label,
  description,
  checked,
  onChange,
  disabled = false,
  size = "md",
}: CheckboxProps) {
  const s = sizeConfig[size];

  return (
    <Pressable
      onPress={() => !disabled && onChange(!checked)}
      disabled={disabled}
      style={[styles.container, disabled && styles.disabled]}
    >
      <View
        style={[
          styles.box,
          {
            width: s.box,
            height: s.box,
            borderRadius: s.radius,
          },
          checked && styles.boxChecked,
        ]}
      >
        {checked && <Check size={s.icon} color="#fff" strokeWidth={3} />}
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.label}>{label}</Text>
        {description && <Text style={styles.description}>{description}</Text>}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  disabled: {
    opacity: 0.5,
  },
  box: {
    borderWidth: 2,
    borderColor: "#d1d5db",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  boxChecked: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  textContainer: {
    flex: 1,
    gap: 2,
  },
  label: {
    fontSize: 14,
    fontFamily: "Cabin_500Medium",
    color: "#111827",
  },
  description: {
    fontSize: 14,
    fontFamily: "Cabin_400Regular",
    color: "#6b7280",
  },
});
