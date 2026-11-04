import { colors } from "@/design/tokens";
import { formatPrice } from "@/utils/formatPrice";
import { useLocalSearchParams, useRouter } from "expo-router";
import { CheckCircle, Clock, House, Package, XCircle } from "lucide-react-native";
import React from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { usePaymentResult } from "../hooks/usePaymentResult";

const COPY = {
  PAID: {
    title: "¡Pago confirmado!",
    subtitle: "Tu pedido fue recibido y ya está en preparación.",
  },
  PENDING: {
    title: "Estamos confirmando tu pago",
    subtitle:
      "Esto puede tardar unos segundos. Si cerraste el pago sin terminarlo, tu carro sigue disponible.",
  },
  FAILED: {
    title: "El pago no se completó",
    subtitle: "No se hizo ningún cobro. Puedes intentarlo otra vez desde tu carro.",
  },
  UNKNOWN: {
    title: "Pedido registrado",
    subtitle: "Revisa el estado de tu compra en «Mis pedidos».",
  },
} as const;

/** A paid quote settles a service, not an order: every outcome leads back to the quotes (WEB-4). */
const QUOTE_COPY = {
  PAID: {
    title: "¡Pago confirmado!",
    subtitle: "Pagaste la cotización. Le avisamos al proveedor y recibirás un correo con el detalle.",
  },
  PENDING: {
    title: "Estamos confirmando tu pago",
    subtitle: "Esto puede tardar unos segundos. Si cerraste el pago sin terminarlo, puedes pagar desde tus cotizaciones.",
  },
  FAILED: {
    title: "El pago no se completó",
    subtitle: "No se hizo ningún cobro. Puedes intentarlo otra vez desde tus cotizaciones.",
  },
  UNKNOWN: {
    title: "Pago registrado",
    subtitle: "Revisa el estado en «Mis cotizaciones».",
  },
} as const;

export default function OrderConfirmationScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { paymentId, orderId, group, kind } = useLocalSearchParams<{
    paymentId?: string;
    orderId?: string;
    /** The cart group being paid, dropped from the cart once paid. */
    group?: string;
    /** "quote" when an accepted quote was paid. */
    kind?: string;
  }>();

  const { payment, outcome, loading } = usePaymentResult(paymentId, group);
  const isQuote = kind === "quote" || Boolean(payment?.quotationId);
  const copy = (isQuote ? QUOTE_COPY : COPY)[outcome];

  const Icon =
    outcome === "PAID"
      ? CheckCircle
      : outcome === "FAILED"
        ? XCircle
        : outcome === "PENDING"
          ? Clock
          : Package;
  const iconColor =
    outcome === "PAID"
      ? colors.success
      : outcome === "FAILED"
        ? colors.danger
        : colors.foregroundSecondary;

  return (
    <View style={[styles.root, { paddingBottom: insets.bottom + 24 }]}>
      <View style={styles.iconWrapper}>
        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : (
          <Icon size={72} color={iconColor} strokeWidth={1.5} />
        )}
      </View>

      <Text style={styles.title}>{copy.title}</Text>
      <Text style={styles.subtitle}>{copy.subtitle}</Text>

      <View style={styles.card}>
        <View style={styles.cardRow}>
          <Package size={18} color={colors.foregroundSecondary} strokeWidth={1.8} />
          <Text style={styles.cardLabel}>{isQuote ? "Cotización" : "Número de orden"}</Text>
          <Text style={styles.cardValue}>
            {isQuote
              ? payment?.quotationId
                ? `#${payment.quotationId}`
                : "—"
              : orderId
                ? `#${orderId}`
                : (payment?.orderId ?? "—")}
          </Text>
        </View>

        {payment?.amount != null && (
          <>
            <View style={styles.divider} />
            <View style={styles.cardRow}>
              <Text style={styles.cardLabel}>Monto</Text>
              <Text style={styles.cardValue}>{formatPrice(payment.amount)}</Text>
            </View>
          </>
        )}

        <View style={styles.divider} />
        <Text style={styles.cardNote}>
          {isQuote
            ? "El estado se actualiza solo; también puedes revisarlo en «Mis cotizaciones»."
            : outcome === "PAID"
              ? "Recibirás un correo con el detalle de tu compra y el seguimiento del envío."
              : "El estado se actualiza solo; también puedes revisarlo en «Mis pedidos»."}
        </Text>
      </View>

      <View style={styles.actions}>
        <Pressable
          style={styles.primaryBtn}
          onPress={() => router.replace(isQuote ? "/(profile)/quotes" : "/(profile)/order-history")}
        >
          <Package size={18} color="#fff" strokeWidth={2} />
          <Text style={styles.primaryBtnText}>{isQuote ? "Ver mis cotizaciones" : "Ver mis pedidos"}</Text>
        </Pressable>

        <Pressable style={styles.secondaryBtn} onPress={() => router.replace("/(tabs)")}>
          <House size={18} color={colors.foreground} strokeWidth={2} />
          <Text style={styles.secondaryBtnText}>Volver al inicio</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    gap: 16,
  },
  iconWrapper: {
    marginBottom: 8,
    height: 72,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontFamily: "Cabin_700Bold",
    color: colors.foreground,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    fontFamily: "Cabin_400Regular",
    color: colors.foregroundSecondary,
    textAlign: "center",
    lineHeight: 22,
  },
  card: {
    width: "100%",
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: 16,
    gap: 12,
    marginTop: 8,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cardLabel: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Cabin_400Regular",
    color: colors.foregroundSecondary,
  },
  cardValue: {
    fontSize: 14,
    fontFamily: "Cabin_600SemiBold",
    color: colors.foreground,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
  },
  cardNote: {
    fontSize: 13,
    fontFamily: "Cabin_400Regular",
    color: colors.foregroundSecondary,
    lineHeight: 19,
  },
  actions: {
    width: "100%",
    gap: 10,
    marginTop: 8,
  },
  primaryBtn: {
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
  },
  primaryBtnText: {
    fontSize: 15,
    fontFamily: "Cabin_600SemiBold",
    color: "#fff",
  },
  secondaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
  secondaryBtnText: {
    fontSize: 15,
    fontFamily: "Cabin_600SemiBold",
    color: colors.foreground,
  },
});
