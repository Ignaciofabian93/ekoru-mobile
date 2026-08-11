import { colors, spacing } from "@/design/tokens";
import React from "react";
import { StyleSheet, View } from "react-native";
import EmptyState from "../ui/orderHistory/EmptyState";
import Header from "../ui/orderHistory/Header";
import OrderCard, { type Order } from "../ui/orderHistory/OrderCard";
import { OuterContainer, ScrollContainer } from "../ui/layout/Container";

// TODO: replace with real API data
const MOCK_ORDERS: Order[] = [
  { id: "ORD-001", date: "Feb 10, 2026", status: "Delivered", total: "$45.90", items: 3 },
  { id: "ORD-002", date: "Feb 5, 2026", status: "Shipped", total: "$28.50", items: 2 },
  { id: "ORD-003", date: "Jan 28, 2026", status: "Delivered", total: "$112.00", items: 5 },
  { id: "ORD-004", date: "Jan 15, 2026", status: "Processing", total: "$19.99", items: 1 },
];

export default function OrderHistoryScreen() {
  return (
    <OuterContainer enableBottomInset>
      <ScrollContainer enableContentContainerStyle>
        <Header />
        <View style={styles.list}>
          {MOCK_ORDERS.length === 0 ? (
            <EmptyState />
          ) : (
            MOCK_ORDERS.map((order) => <OrderCard key={order.id} order={order} />)
          )}
        </View>
      </ScrollContainer>
    </OuterContainer>
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
    backgroundColor: colors.backgroundTertiary,
    padding: spacing[5],
    gap: spacing[3],
  },
});
