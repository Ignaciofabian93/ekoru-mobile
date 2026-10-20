import { colors, spacing } from "@/design/tokens";
import React from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import useMyOrders from "../hooks/useMyOrders";
import EmptyState from "../ui/orderHistory/EmptyState";
import Header from "../ui/orderHistory/Header";
import { NAMESPACE } from "../ui/orderHistory/i18n";
import OrderCard from "../ui/orderHistory/OrderCard";
import { OuterContainer } from "../ui/layout/Container";

/** The buyer's orders (MOB-3), from the same query as the web's order history. */
export default function OrderHistoryScreen() {
  const { t } = useTranslation(NAMESPACE);
  const { orders, initialLoading, refreshing, error, refetch } = useMyOrders();

  return (
    <OuterContainer enableBottomInset>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => void refetch()} />}
      >
        <Header />
        <View style={styles.list}>
          {initialLoading ? (
            <ActivityIndicator color={colors.primary} style={styles.loader} />
          ) : error && orders.length === 0 ? (
            <Text style={styles.error}>{t("error")}</Text>
          ) : orders.length === 0 ? (
            <EmptyState />
          ) : (
            orders.map((order) => <OrderCard key={order.id} order={order} />)
          )}
        </View>
      </ScrollView>
    </OuterContainer>
  );
}

const styles = StyleSheet.create({
  content: { flexGrow: 1 },
  list: {
    flex: 1,
    backgroundColor: colors.backgroundTertiary,
    padding: spacing[5],
    gap: spacing[3],
  },
  loader: { marginTop: spacing[10] },
  error: {
    marginTop: spacing[10],
    textAlign: "center",
    fontSize: 14,
    fontFamily: "Cabin_400Regular",
    color: colors.foregroundSecondary,
  },
});
