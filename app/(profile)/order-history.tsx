import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

import Colors from "@/constants/Colors";

interface Order {
  id: string;
  date: string;
  status: "Delivered" | "Shipped" | "Processing";
  total: string;
  items: number;
}

const orders: Order[] = [
  {
    id: "ORD-001",
    date: "Feb 10, 2026",
    status: "Delivered",
    total: "$45.90",
    items: 3,
  },
  {
    id: "ORD-002",
    date: "Feb 5, 2026",
    status: "Shipped",
    total: "$28.50",
    items: 2,
  },
  {
    id: "ORD-003",
    date: "Jan 28, 2026",
    status: "Delivered",
    total: "$112.00",
    items: 5,
  },
  {
    id: "ORD-004",
    date: "Jan 15, 2026",
    status: "Processing",
    total: "$19.99",
    items: 1,
  },
];

const statusColors: Record<Order["status"], string> = {
  Delivered: "#16a34a",
  Shipped: "#2563eb",
  Processing: "#d97706",
};

function OrderCard({ order }: { order: Order }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.orderId}>{order.id}</Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: statusColors[order.status] + "1a" },
          ]}
        >
          <Text
            style={[styles.statusText, { color: statusColors[order.status] }]}
          >
            {order.status}
          </Text>
        </View>
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.cardDetail}>{order.date}</Text>
        <Text style={styles.cardDetail}>
          {order.items} item{order.items > 1 ? "s" : ""}
        </Text>
      </View>
      <View style={styles.cardFooter}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>{order.total}</Text>
      </View>
    </View>
  );
}

export default function OrderHistoryScreen() {
  return (
    <FlatList
      data={orders}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <OrderCard order={item} />}
      contentContainerStyle={styles.list}
      style={styles.scroll}
      ListEmptyComponent={
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No orders yet</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },
  list: {
    padding: 20,
    gap: 12,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  orderId: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1f2937",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  cardBody: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 10,
  },
  cardDetail: {
    fontSize: 14,
    color: "#6b7280",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#e5e7eb",
    paddingTop: 10,
  },
  totalLabel: {
    fontSize: 14,
    color: "#6b7280",
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.primary,
  },
  empty: {
    alignItems: "center",
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 16,
    color: "#9ca3af",
  },
});
