import Input from "@/components/shared/Input/Input";
import { Text } from "@/components/shared/Text/Text";
import { Title } from "@/components/shared/Title/Title";
import { colors } from "@/design/tokens";
import { ArrowLeftRight, DollarSign } from "lucide-react-native";
import { StyleSheet, Switch, View } from "react-native";
import type { PublishFormValues } from "../../types/PublishForm";

interface Props {
  values: PublishFormValues;
  errors: Partial<Record<keyof PublishFormValues, string>>;
  set: <K extends keyof PublishFormValues>(
    key: K,
    value: PublishFormValues[K],
  ) => void;
}

export default function PricingStep({ values, errors, set }: Props) {
  return (
    <View style={styles.container}>
      <Title level="h5" weight="semibold" style={styles.title}>
        Pricing
      </Title>

      <Input
        label="Price (CLP) *"
        placeholder="e.g. 15000"
        value={values.price}
        onChangeText={(v) => set("price", v.replace(/[^0-9.]/g, ""))}
        keyboardType="decimal-pad"
        leftIcon={DollarSign}
        errorMessage={errors.price}
        width="full"
      />

      {/* Exchange toggle */}
      <View style={styles.toggleCard}>
        <View style={styles.toggleLeft}>
          <View style={styles.toggleIcon}>
            <ArrowLeftRight
              size={18}
              color={colors.primary}
              strokeWidth={1.75}
            />
          </View>
          <View style={styles.toggleText}>
            <Text size="sm" weight="semibold">
              Open to exchange
            </Text>
            <Text size="xs" color="secondary" style={{ lineHeight: 18 }}>
              Allow buyers to propose swaps instead of paying.
            </Text>
          </View>
        </View>
        <Switch
          value={values.isExchangeable}
          onValueChange={(v) => set("isExchangeable", v)}
          trackColor={{ false: colors.borderLight, true: colors.primary }}
          thumbColor="#fff"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },
  title: {
    marginBottom: 2,
  },
  toggleCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: 14,
    gap: 12,
  },
  toggleLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  toggleIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: colors.backgroundPrimaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  toggleText: {
    flex: 1,
    gap: 2,
  },
});
