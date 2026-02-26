import Colors from "@/constants/Colors";
import { PackageSearch } from "lucide-react-native";
import React from "react";
import { useTranslation } from "react-i18next";
import { FlatList, StyleSheet, Text, View } from "react-native";
import "../i18n";
import { NAMESPACE } from "../i18n";

type OrderStatus = "Delivered" | "Shipped" | "Processing" | "Cancelled";

interface Order {
  id: string;
  date: string;
  status: OrderStatus;
  total: string;
  items: number;
}

// TODO: replace with real API data
const MOCK_ORDERS: Order[] = [
  { id: "ORD-001", date: "Feb 10, 2026", status: "Delivered", total: "$45.90", items: 3 },
  { id: "ORD-002", date: "Feb 5, 2026", status: "Shipped", total: "$28.50", items: 2 },
  { id: "ORD-003", date: "Jan 28, 2026", status: "Delivered", total: "$112.00", items: 5 },
  { id: "ORD-004", date: "Jan 15, 2026", status: "Processing", total: "$19.99", items: 1 },
];

const STATUS_COLORS: Record<OrderStatus, string> = {
  Delivered: "#16a34a",
  Shipped: "#2563eb",
  Processing: "#d97706",
  Cancelled: "#dc2626",
};

function OrderCard({ order, statusLabel, totalLabel, itemLabel }: {
  order: Order;
  statusLabel: string;
  totalLabel: string;
  itemLabel: string;
}) {
  const color = STATUS_COLORS[order.status];
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.orderId}>{order.id}</Text>
        <View style={[styles.statusBadge, { backgroundColor: color + "1a" }]}>
          <Text style={[styles.statusText, { color }]}>{statusLabel}</Text>
        </View>
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.cardDetail}>{order.date}</Text>
        <Text style={styles.cardDetail}>{itemLabel}</Text>
      </View>
      <View style={styles.cardFooter}>
        <Text style={styles.totalLabel}>{totalLabel}</Text>
        <Text style={styles.totalValue}>{order.total}</Text>
      </View>
    </View>
  );
}

function EmptyState({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <View style={styles.empty}>
      <PackageSearch size={52} color="#d1d5db" strokeWidth={1.5} />
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptySubtitle}>{subtitle}</Text>
    </View>
  );
}

export default function OrderHistoryScreen() {
  const { t } = useTranslation(NAMESPACE);

  return (
    <FlatList
      data={MOCK_ORDERS}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <OrderCard
          order={item}
          statusLabel={t(`status_${item.status}`)}
          totalLabel={t("total")}
          itemLabel={t("item", { count: item.items })}
        />
      )}
      contentContainerStyle={styles.list}
      style={styles.scroll}
      ListEmptyComponent={
        <EmptyState
          title={t("noOrders")}
          subtitle={t("noOrdersSubtitle")}
        />
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
    paddingBottom: 40,
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
    fontSize: 15,
    fontFamily: "Cabin_700Bold",
    color: "#1f2937",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontFamily: "Cabin_600SemiBold",
  },
  cardBody: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 10,
  },
  cardDetail: {
    fontSize: 13,
    fontFamily: "Cabin_400Regular",
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
    fontSize: 13,
    fontFamily: "Cabin_400Regular",
    color: "#6b7280",
  },
  totalValue: {
    fontSize: 15,
    fontFamily: "Cabin_700Bold",
    color: Colors.primary,
  },
  empty: {
    alignItems: "center",
    paddingTop: 80,
    gap: 10,
  },
  emptyTitle: {
    fontSize: 17,
    fontFamily: "Cabin_600SemiBold",
    color: "#374151",
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: "Cabin_400Regular",
    color: "#9ca3af",
    textAlign: "center",
  },
});
