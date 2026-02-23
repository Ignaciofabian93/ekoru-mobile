import Colors from "@/constants/Colors";
import useCartStore from "@/store/useCartStore";
import { formatPrice } from "@/utils/formatPrice";
import { useRouter } from "expo-router";
import {
  CreditCard,
  MapPin,
  Package,
  Truck,
  Wallet,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type PaymentMethod = "card" | "cash";

interface DeliveryForm {
  fullName: string;
  address: string;
  city: string;
  phone: string;
  notes: string;
}

const SHIPPING_COST = 2990;

function SectionTitle({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <View style={styles.sectionHeader}>
      {icon}
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );
}

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = "default",
  multiline = false,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  keyboardType?: "default" | "phone-pad" | "email-address";
  multiline?: boolean;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.inputMultiline]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.inputPlaceholder}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={multiline ? 3 : 1}
        textAlignVertical={multiline ? "top" : "center"}
      />
    </View>
  );
}

export default function CheckoutScreen() {
  const { items, subtotal, clearCart } = useCartStore();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [form, setForm] = useState<DeliveryForm>({
    fullName: "",
    address: "",
    city: "",
    phone: "",
    notes: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [isPlacing, setIsPlacing] = useState(false);

  const total = subtotal() + SHIPPING_COST;

  const updateField = (key: keyof DeliveryForm) => (value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handlePlaceOrder = async () => {
    if (!form.fullName || !form.address || !form.city || !form.phone) {
      return; // TODO: show validation errors
    }
    setIsPlacing(true);
    // TODO: call real order API
    await new Promise((res) => setTimeout(res, 800));
    clearCart();
    router.replace("/(cart)/confirmation" as any);
  };

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
        {/* Delivery */}
        <View style={styles.section}>
          <SectionTitle
            icon={<MapPin size={18} color={Colors.primary} strokeWidth={2} />}
            title="Datos de entrega"
          />
          <Field
            label="Nombre completo"
            value={form.fullName}
            onChangeText={updateField("fullName")}
            placeholder="Ej. Juan Pérez"
          />
          <Field
            label="Dirección"
            value={form.address}
            onChangeText={updateField("address")}
            placeholder="Ej. Av. Providencia 1234, Dpto 5"
          />
          <Field
            label="Ciudad / Comuna"
            value={form.city}
            onChangeText={updateField("city")}
            placeholder="Ej. Santiago"
          />
          <Field
            label="Teléfono"
            value={form.phone}
            onChangeText={updateField("phone")}
            placeholder="+56 9 1234 5678"
            keyboardType="phone-pad"
          />
          <Field
            label="Notas (opcional)"
            value={form.notes}
            onChangeText={updateField("notes")}
            placeholder="Instrucciones para el repartidor..."
            multiline
          />
        </View>

        {/* Payment method */}
        <View style={styles.section}>
          <SectionTitle
            icon={<Wallet size={18} color={Colors.primary} strokeWidth={2} />}
            title="Método de pago"
          />
          <View style={styles.paymentOptions}>
            <Pressable
              style={[
                styles.paymentOption,
                paymentMethod === "card" && styles.paymentOptionActive,
              ]}
              onPress={() => setPaymentMethod("card")}
            >
              <CreditCard
                size={20}
                color={
                  paymentMethod === "card"
                    ? Colors.primary
                    : Colors.foregroundTertiary
                }
                strokeWidth={1.8}
              />
              <Text
                style={[
                  styles.paymentOptionText,
                  paymentMethod === "card" && styles.paymentOptionTextActive,
                ]}
              >
                Tarjeta
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.paymentOption,
                paymentMethod === "cash" && styles.paymentOptionActive,
              ]}
              onPress={() => setPaymentMethod("cash")}
            >
              <Wallet
                size={20}
                color={
                  paymentMethod === "cash"
                    ? Colors.primary
                    : Colors.foregroundTertiary
                }
                strokeWidth={1.8}
              />
              <Text
                style={[
                  styles.paymentOptionText,
                  paymentMethod === "cash" && styles.paymentOptionTextActive,
                ]}
              >
                Efectivo
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <SectionTitle
            icon={<Package size={18} color={Colors.primary} strokeWidth={2} />}
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
            <View style={styles.summaryShipping}>
              <Truck
                size={14}
                color={Colors.foregroundSecondary}
                strokeWidth={1.8}
              />
              <Text style={styles.summaryLabel}>Envío</Text>
            </View>
            <Text style={styles.summaryPrice}>
              {formatPrice(SHIPPING_COST)}
            </Text>
          </View>

          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatPrice(total)}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer CTA */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
        <Pressable
          style={[
            styles.placeOrderBtn,
            isPlacing && styles.placeOrderBtnDisabled,
          ]}
          onPress={handlePlaceOrder}
          disabled={isPlacing}
        >
          <Text style={styles.placeOrderBtnText}>
            {isPlacing
              ? "Procesando..."
              : `Confirmar pedido · ${formatPrice(total)}`}
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  scroll: {
    padding: 16,
    gap: 16,
  },
  section: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
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
    color: Colors.foreground,
  },
  // Fields
  field: {
    gap: 4,
  },
  fieldLabel: {
    fontSize: 13,
    fontFamily: "Cabin_500Medium",
    color: Colors.foregroundSecondary,
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontFamily: "Cabin_400Regular",
    fontSize: 14,
    color: Colors.inputText,
    backgroundColor: Colors.inputBg,
  },
  inputMultiline: {
    height: 80,
    paddingTop: 10,
  },
  // Payment
  paymentOptions: {
    flexDirection: "row",
    gap: 10,
  },
  paymentOption: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: Colors.borderStrong,
    backgroundColor: Colors.backgroundSecondary,
  },
  paymentOptionActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.backgroundPrimaryLight,
  },
  paymentOptionText: {
    fontSize: 14,
    fontFamily: "Cabin_500Medium",
    color: Colors.foregroundTertiary,
  },
  paymentOptionTextActive: {
    color: Colors.primary,
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
    color: Colors.foreground,
    flex: 1,
    marginRight: 8,
  },
  summaryQty: {
    color: Colors.foregroundTertiary,
  },
  summaryPrice: {
    fontSize: 14,
    fontFamily: "Cabin_500Medium",
    color: Colors.foregroundSecondary,
  },
  summaryShipping: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  summaryLabel: {
    fontSize: 14,
    fontFamily: "Cabin_400Regular",
    color: Colors.foregroundSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: 4,
  },
  totalRow: {
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 16,
    fontFamily: "Cabin_600SemiBold",
    color: Colors.foreground,
  },
  totalValue: {
    fontSize: 18,
    fontFamily: "Cabin_700Bold",
    color: Colors.foreground,
  },
  // Footer
  footer: {
    padding: 16,
    paddingTop: 12,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  placeOrderBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  placeOrderBtnDisabled: {
    opacity: 0.6,
  },
  placeOrderBtnText: {
    fontSize: 16,
    fontFamily: "Cabin_600SemiBold",
    color: "#fff",
  },
});
