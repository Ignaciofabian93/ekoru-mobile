import { colors } from "@/design/tokens";
import type { ShippingMethod } from "@/types/checkout";
import { Check } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { SHIPPING_METHODS } from "../constants/shippingMethods";

export default function ShippingMethodPicker({
  value,
  onChange,
}: {
  value: ShippingMethod | null;
  onChange: (method: ShippingMethod) => void;
}) {
  return (
    <View style={styles.list}>
      {SHIPPING_METHODS.map((method) => {
        const selected = value === method.id;
        // Not payable (mid-point) or not quotable yet (courier): still shown so
        // the buyer knows the option exists, but it cannot be selected here.
        const disabled = !method.payable || method.isQuoted;
        const Icon = method.icon;

        return (
          <Pressable
            key={method.id}
            onPress={() => !disabled && onChange(method.id)}
            disabled={disabled}
            accessibilityRole="radio"
            accessibilityState={{ selected, disabled }}
            style={[
              styles.option,
              selected && styles.optionSelected,
              disabled && styles.optionDisabled,
            ]}
          >
            <Icon
              size={20}
              strokeWidth={1.8}
              color={selected ? colors.primary : colors.foregroundTertiary}
            />
            <View style={styles.copy}>
              <Text style={[styles.label, selected && styles.labelSelected]}>
                {method.label}
              </Text>
              <Text style={styles.description}>{method.description}</Text>
            </View>
            {selected && <Check size={18} strokeWidth={2.2} color={colors.primary} />}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 10,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    backgroundColor: colors.backgroundSecondary,
  },
  optionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.background,
  },
  optionDisabled: {
    opacity: 0.5,
  },
  copy: {
    flex: 1,
    gap: 2,
  },
  label: {
    fontSize: 14,
    fontFamily: "Cabin_600SemiBold",
    color: colors.foreground,
  },
  labelSelected: {
    color: colors.primary,
  },
  description: {
    fontSize: 12,
    fontFamily: "Cabin_400Regular",
    color: colors.foregroundSecondary,
  },
});
