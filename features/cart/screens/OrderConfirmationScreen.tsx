import Colors from "@/constants/Colors";
import { useRouter } from "expo-router";
import { CheckCircle, House, Package } from "lucide-react-native";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ORDER_NUMBER = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

export default function OrderConfirmationScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { paddingBottom: insets.bottom + 24 }]}>
      {/* Icon */}
      <View style={styles.iconWrapper}>
        <CheckCircle size={72} color={Colors.success} strokeWidth={1.5} />
      </View>

      <Text style={styles.title}>¡Pedido confirmado!</Text>
      <Text style={styles.subtitle}>
        Tu pedido ha sido recibido y está siendo procesado.
      </Text>

      {/* Order info card */}
      <View style={styles.card}>
        <View style={styles.cardRow}>
          <Package
            size={18}
            color={Colors.foregroundSecondary}
            strokeWidth={1.8}
          />
          <Text style={styles.cardLabel}>Número de orden</Text>
          <Text style={styles.cardValue}>{ORDER_NUMBER}</Text>
        </View>
        <View style={styles.divider} />
        <Text style={styles.cardNote}>
          Recibirás una confirmación con el detalle de tu compra y el
          seguimiento del envío.
        </Text>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <Pressable
          style={styles.primaryBtn}
          onPress={() => router.replace("/(profile)/order-history" as any)}
        >
          <Package size={18} color="#fff" strokeWidth={2} />
          <Text style={styles.primaryBtnText}>Ver mis pedidos</Text>
        </Pressable>

        <Pressable
          style={styles.secondaryBtn}
          onPress={() => router.replace("/(tabs)")}
        >
          <House size={18} color={Colors.foreground} strokeWidth={2} />
          <Text style={styles.secondaryBtnText}>Volver al inicio</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    gap: 16,
  },
  iconWrapper: {
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontFamily: "Cabin_700Bold",
    color: Colors.foreground,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    fontFamily: "Cabin_400Regular",
    color: Colors.foregroundSecondary,
    textAlign: "center",
    lineHeight: 22,
  },
  card: {
    width: "100%",
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
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
    color: Colors.foregroundSecondary,
  },
  cardValue: {
    fontSize: 14,
    fontFamily: "Cabin_600SemiBold",
    color: Colors.foreground,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
  },
  cardNote: {
    fontSize: 13,
    fontFamily: "Cabin_400Regular",
    color: Colors.foregroundSecondary,
    lineHeight: 19,
  },
  actions: {
    width: "100%",
    gap: 10,
    marginTop: 8,
  },
  primaryBtn: {
    backgroundColor: Colors.primary,
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
    borderColor: Colors.borderStrong,
  },
  secondaryBtnText: {
    fontSize: 15,
    fontFamily: "Cabin_600SemiBold",
    color: Colors.foreground,
  },
});
