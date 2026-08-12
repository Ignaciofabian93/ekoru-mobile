import { colors } from "@/design/tokens";
import type { PaymentProviderId } from "@/types/checkout";
import { Building2, Check, CreditCard, Wallet } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { PAYMENT_PROVIDERS } from "../constants/shippingMethods";

const ICONS = {
  WEBPAY: CreditCard,
  KHIPU: Building2,
  MERCADOPAGO: Wallet,
} as const;

export default function PaymentMethodPicker({
  value,
  onChange,
}: {
  value: PaymentProviderId | null;
  onChange: (provider: PaymentProviderId) => void;
}) {
  return (
    <View style={styles.list}>
      {PAYMENT_PROVIDERS.map((option) => {
        const selected = value === option.id;
        const Icon = ICONS[option.id];

        return (
          <Pressable
            key={option.id}
            onPress={() => onChange(option.id)}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            style={[styles.option, selected && styles.optionSelected]}
          >
            <Icon
              size={20}
              strokeWidth={1.8}
              color={selected ? colors.primary : colors.foregroundTertiary}
            />
            <View style={styles.copy}>
              <Text style={[styles.label, selected && styles.labelSelected]}>
                {option.label}
              </Text>
              <Text style={styles.description}>{option.description}</Text>
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
