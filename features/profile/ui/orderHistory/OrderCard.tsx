import { Text } from "@/components/Primitives/Text/Text";
import { borderRadius, colors, fontFamily, fontSize, spacing } from "@/design/tokens";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { NAMESPACE } from "./i18n";

export type OrderStatus = "Delivered" | "Shipped" | "Processing" | "Cancelled";

export interface Order {
  id: string;
  date: string;
  status: OrderStatus;
  total: string;
  items: number;
}

const STATUS_COLORS: Record<OrderStatus, string> = {
  Delivered: colors.success,
  Shipped: colors.info,
  Processing: colors.accent,
  Cancelled: colors.danger,
};

export default function OrderCard({ order }: { order: Order }) {
  const { t } = useTranslation(NAMESPACE);
  const color = STATUS_COLORS[order.status];

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.orderId}>{order.id}</Text>
        <View style={[styles.statusBadge, { backgroundColor: `${color}1a` }]}>
          <Text style={[styles.statusText, { color }]}>{t(`status.${order.status}`)}</Text>
        </View>
      </View>

      <View style={styles.cardBody}>
        <Text style={styles.cardDetail}>{order.date}</Text>
        <Text style={styles.cardDetail}>{t("item", { count: order.items })}</Text>
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.totalLabel}>{t("total")}</Text>
        <Text style={styles.totalValue}>{order.total}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing[4],
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderLight,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing[2.5],
  },
  orderId: {
    fontSize: fontSize.base,
    fontFamily: fontFamily.bold,
    color: colors.foreground,
  },
  statusBadge: {
    paddingHorizontal: spacing[2.5],
    paddingVertical: spacing[1],
    borderRadius: borderRadius.full,
  },
  statusText: {
    fontSize: fontSize.xs,
    fontFamily: fontFamily.semibold,
  },
  cardBody: {
    flexDirection: "row",
    gap: spacing[4],
    marginBottom: spacing[2.5],
  },
  cardDetail: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.regular,
    color: colors.foregroundSecondary,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.borderLight,
    paddingTop: spacing[2.5],
  },
  totalLabel: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.regular,
    color: colors.foregroundSecondary,
  },
  totalValue: {
    fontSize: fontSize.base,
    fontFamily: fontFamily.bold,
    color: colors.primary,
  },
});
