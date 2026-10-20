import { Text } from "@/components/Primitives/Text/Text";
import { borderRadius, colors, fontFamily, fontSize, spacing } from "@/design/tokens";
import { formatPrice } from "@/utils/formatPrice";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { type BuyerOrder, lineName, type OrderStage, orderStage } from "../../utils/orders";
import { NAMESPACE } from "./i18n";

const STAGE_COLORS: Record<OrderStage, string> = {
  PENDING_PAYMENT: colors.foregroundSecondary,
  PREPARING: colors.accent,
  SHIPPED: colors.info,
  DELIVERED: colors.success,
  RETURNED: colors.danger,
  CANCELED: colors.danger,
};

export default function OrderCard({ order }: { order: BuyerOrder }) {
  const { t, i18n } = useTranslation(NAMESPACE);
  const stage = orderStage(order);
  const color = STAGE_COLORS[stage];
  const lines = order.orderItems ?? [];
  const units = lines.reduce((sum, line) => sum + line.quantity, 0);
  const names = lines.map(lineName).filter((name): name is string => Boolean(name));
  const date = new Date(order.createdAt).toLocaleDateString(i18n.language, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.orderId}>{t("order", { id: order.id })}</Text>
        <View style={[styles.statusBadge, { backgroundColor: `${color}1a` }]}>
          <Text style={[styles.statusText, { color }]}>{t(`stage.${stage}`)}</Text>
        </View>
      </View>

      {names.length > 0 && (
        <Text style={styles.items} numberOfLines={2}>
          {names.slice(0, 2).join(", ")}
          {names.length > 2 ? ` ${t("moreItems", { count: names.length - 2 })}` : ""}
        </Text>
      )}

      <View style={styles.cardBody}>
        <Text style={styles.cardDetail}>{date}</Text>
        <Text style={styles.cardDetail}>{t("item", { count: units })}</Text>
      </View>

      {/* The seller adds the carrier and number when shipping. */}
      {stage === "SHIPPED" && order.shippingStatus?.trackingInfo ? (
        <Text style={styles.cardDetail}>
          {t("tracking")}: {order.shippingStatus.trackingInfo}
        </Text>
      ) : null}

      <View style={styles.cardFooter}>
        <Text style={styles.totalLabel}>{t("total")}</Text>
        <Text style={styles.totalValue}>{formatPrice(order.total)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing[4],
    gap: spacing[2],
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderLight,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  items: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.medium,
    color: colors.foreground,
  },
  cardBody: {
    flexDirection: "row",
    gap: spacing[4],
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
