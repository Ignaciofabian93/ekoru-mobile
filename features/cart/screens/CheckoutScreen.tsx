import { colors } from "@/design/tokens";
import { formatPrice } from "@/utils/formatPrice";
import {
  AlertTriangle,
  MapPin,
  Package,
  Truck,
  Wallet,
} from "lucide-react-native";
import React from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { shippingMethodById } from "../constants/shippingMethods";
import useCheckout, { type CheckoutStep } from "../hooks/useCheckout";
import PaymentMethodPicker from "../ui/PaymentMethodPicker";
import ShippingAddressForm from "../ui/ShippingAddressForm";
import ShippingMethodPicker from "../ui/ShippingMethodPicker";

const STEPS: { key: CheckoutStep; label: string }[] = [
  { key: "shipping", label: "Entrega" },
  { key: "payment", label: "Pago" },
  { key: "review", label: "Revisión" },
];

function SectionTitle({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <View style={styles.sectionHeader}>
      {icon}
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );
}

function StepBar({ current }: { current: CheckoutStep }) {
  const currentIndex = STEPS.findIndex((s) => s.key === current);
  return (
    <View style={styles.stepBar}>
      {STEPS.map((step, index) => {
        const done = index < currentIndex;
        const active = index === currentIndex;
        return (
          <View key={step.key} style={styles.step}>
            <View
              style={[
                styles.stepDot,
                (active || done) && styles.stepDotActive,
                done && styles.stepDotDone,
              ]}
            >
              <Text style={[styles.stepNumber, (active || done) && styles.stepNumberActive]}>
                {index + 1}
              </Text>
            </View>
            <Text style={[styles.stepLabel, active && styles.stepLabelActive]}>
              {step.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

export default function CheckoutScreen() {
  const insets = useSafeAreaInsets();
  const {
    step,
    goNext,
    goBack,
    items,
    subtotal,
    shippingCost,
    total,
    shippingMethod,
    setShippingMethod,
    address,
    updateAddressField,
    provider,
    setProvider,
    hasMultipleSellers,
    loading,
    pay,
  } = useCheckout();

  const requiresAddress = shippingMethod
    ? shippingMethodById(shippingMethod).requiresAddress
    : false;
  const isReview = step === "review";

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <StepBar current={step} />

        {hasMultipleSellers && (
          <View style={styles.warning}>
            <AlertTriangle size={18} color={colors.warning} strokeWidth={2} />
            <Text style={styles.warningText}>
              Tu carro tiene productos de más de un vendedor. Cada compra se paga por
              separado: deja los productos de un solo vendedor para continuar.
            </Text>
          </View>
        )}

        {step === "shipping" && (
          <>
            <View style={styles.section}>
              <SectionTitle
                icon={<Truck size={18} color={colors.primary} strokeWidth={2} />}
                title="Método de entrega"
              />
              <ShippingMethodPicker value={shippingMethod} onChange={setShippingMethod} />
            </View>

            {requiresAddress && (
              <View style={styles.section}>
                <SectionTitle
                  icon={<MapPin size={18} color={colors.primary} strokeWidth={2} />}
                  title="Datos de entrega"
                />
                <ShippingAddressForm value={address} onChange={updateAddressField} />
              </View>
            )}
          </>
        )}

        {step === "payment" && (
          <View style={styles.section}>
            <SectionTitle
              icon={<Wallet size={18} color={colors.primary} strokeWidth={2} />}
              title="Medio de pago"
            />
            <PaymentMethodPicker value={provider} onChange={setProvider} />
            <Text style={styles.hint}>
              El pago se completa en el sitio del proveedor. Volverás a la app al
              terminar.
            </Text>
          </View>
        )}

        {/* Summary is always visible: it is the thing being agreed to. */}
        <View style={styles.section}>
          <SectionTitle
            icon={<Package size={18} color={colors.primary} strokeWidth={2} />}
            title="Resumen del pedido"
          />
          {items.map((item) => (
            <View key={item.product.id} style={styles.summaryRow}>
              <Text style={styles.summaryName} numberOfLines={1}>
                {item.product.name}
                <Text style={styles.summaryQty}> ×{item.quantity}</Text>
              </Text>
              <Text style={styles.summaryPrice}>
                {formatPrice(item.product.price * item.quantity)}
              </Text>
            </View>
          ))}

          <View style={styles.divider} />

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryPrice}>{formatPrice(subtotal)}</Text>
          </View>

          <View style={styles.summaryRow}>
            <View style={styles.summaryShipping}>
              <Truck size={14} color={colors.foregroundSecondary} strokeWidth={1.8} />
              <Text style={styles.summaryLabel}>Envío</Text>
            </View>
            <Text style={styles.summaryPrice}>
              {shippingCost === 0 ? "Sin costo" : formatPrice(shippingCost)}
            </Text>
          </View>

          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatPrice(total)}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
        <View style={styles.footerRow}>
          {step !== "shipping" && (
            <Pressable style={styles.backBtn} onPress={goBack} disabled={loading}>
              <Text style={styles.backBtnText}>Atrás</Text>
            </Pressable>
          )}
          <Pressable
            style={[styles.primaryBtn, (loading || hasMultipleSellers) && styles.primaryBtnDisabled]}
            onPress={isReview ? pay : goNext}
            disabled={loading || hasMultipleSellers}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryBtnText}>
                {isReview ? `Pagar · ${formatPrice(total)}` : "Continuar"}
              </Text>
            )}
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  scroll: {
    padding: 16,
    gap: 16,
  },
  // Steps
  stepBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  step: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  stepDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
  stepDotActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  stepDotDone: {
    opacity: 0.7,
  },
  stepNumber: {
    fontSize: 12,
    fontFamily: "Cabin_600SemiBold",
    color: colors.foregroundTertiary,
  },
  stepNumberActive: {
    color: "#fff",
  },
  stepLabel: {
    fontSize: 13,
    fontFamily: "Cabin_500Medium",
    color: colors.foregroundTertiary,
  },
  stepLabelActive: {
    color: colors.foreground,
    fontFamily: "Cabin_600SemiBold",
  },
  // Warning
  warning: {
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-start",
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.warning,
    padding: 14,
  },
  warningText: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Cabin_400Regular",
    color: colors.foregroundSecondary,
    lineHeight: 19,
  },
  section: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: 16,
    gap: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 2,
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: "Cabin_600SemiBold",
    color: colors.foreground,
  },
  hint: {
    fontSize: 12,
    fontFamily: "Cabin_400Regular",
    color: colors.foregroundTertiary,
    lineHeight: 18,
  },
  // Summary
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryName: {
    fontSize: 14,
    fontFamily: "Cabin_400Regular",
    color: colors.foreground,
    flex: 1,
    marginRight: 8,
  },
  summaryQty: {
    color: colors.foregroundTertiary,
  },
  summaryPrice: {
    fontSize: 14,
    fontFamily: "Cabin_500Medium",
    color: colors.foregroundSecondary,
  },
  summaryShipping: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  summaryLabel: {
    fontSize: 14,
    fontFamily: "Cabin_400Regular",
    color: colors.foregroundSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: 4,
  },
  totalRow: {
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 16,
    fontFamily: "Cabin_600SemiBold",
    color: colors.foreground,
  },
  totalValue: {
    fontSize: 18,
    fontFamily: "Cabin_700Bold",
    color: colors.foreground,
  },
  // Footer
  footer: {
    padding: 16,
    paddingTop: 12,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  footerRow: {
    flexDirection: "row",
    gap: 10,
  },
  backBtn: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    alignItems: "center",
    justifyContent: "center",
  },
  backBtnText: {
    fontSize: 15,
    fontFamily: "Cabin_600SemiBold",
    color: colors.foreground,
  },
  primaryBtn: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBtnDisabled: {
    opacity: 0.6,
  },
  primaryBtnText: {
    fontSize: 16,
    fontFamily: "Cabin_600SemiBold",
    color: "#fff",
  },
});
