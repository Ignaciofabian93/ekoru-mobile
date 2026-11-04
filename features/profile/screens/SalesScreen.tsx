import MainButton from "@/components/Primitives/Button/MainButton";
import Input from "@/components/Primitives/Input/Input";
import { colors } from "@/design/tokens";
import type { Seller } from "@/types/user";
import { displaySellerName } from "@/utils/displaySellerName";
import { formatPrice } from "@/utils/formatPrice";
import { PackageCheck, Receipt, Truck } from "lucide-react-native";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { type SaleOrder, SALES_FILTERS, type SalesFilter, useAddressNames, useSales } from "../hooks/useSales";
import { NAMESPACE } from "../i18n";
import { lineName, type OrderStage, orderStage } from "../utils/orders";

const STAGE_COLORS: Record<OrderStage, string> = {
  PENDING_PAYMENT: colors.foregroundSecondary,
  PREPARING: colors.accent,
  SHIPPED: colors.info,
  DELIVERED: colors.success,
  RETURNED: colors.danger,
  CANCELED: colors.danger,
};

const FILTERS = Object.keys(SALES_FILTERS) as SalesFilter[];

function SaleCard({
  order,
  busy,
  onMove,
}: {
  order: SaleOrder;
  busy: boolean;
  onMove: (stage: "SHIPPED" | "DELIVERED", trackingInfo?: string) => Promise<boolean>;
}) {
  const { t, i18n } = useTranslation(NAMESPACE);
  const [open, setOpen] = useState(false);
  const [shipping, setShipping] = useState(false);
  const [tracking, setTracking] = useState("");
  const stage = orderStage(order);
  const color = STAGE_COLORS[stage];
  const address = order.shippingAddress;
  const place = useAddressNames(address, open);
  const lines = order.orderItems ?? [];
  const date = new Date(order.createdAt).toLocaleDateString(i18n.language, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  // Only a paid order ships, and only forward (transactions' shipping rules).
  const paid = order.status === "PAID";
  const canShip = paid && stage === "PREPARING";
  const canDeliver = paid && stage === "SHIPPED";

  const deliver = () =>
    Alert.alert(t("sales.deliver.title"), t("sales.deliver.description"), [
      { text: t("sales.cancel"), style: "cancel" },
      { text: t("sales.deliver.confirm"), onPress: () => void onMove("DELIVERED") },
    ]);

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.orderId}>{t("sales.order", { id: order.id })}</Text>
        <View style={[styles.badge, { backgroundColor: `${color}1a` }]}>
          <Text style={[styles.badgeText, { color }]}>{t(`sales.stage.${stage}`)}</Text>
        </View>
      </View>
      <Text style={styles.muted}>
        {t("sales.receivedOn", { date })}
        {order.buyer ? ` · ${displaySellerName(order.buyer as Seller)}` : ""}
      </Text>
      {lines.map((line) => (
        <Text key={line.id} style={styles.line} numberOfLines={1}>
          {line.quantity} × {lineName(line) ?? t("sales.unavailableItem")}
        </Text>
      ))}
      <View style={styles.totalRow}>
        <Text style={styles.muted}>{t(`sales.method.${order.shippingMethod}`, order.shippingMethod)}</Text>
        <Text style={styles.total}>{formatPrice(order.total)}</Text>
      </View>
      {order.shippingStatus?.trackingInfo ? (
        <Text style={styles.muted}>
          {t("sales.tracking")}: {order.shippingStatus.trackingInfo}
        </Text>
      ) : null}

      <Pressable onPress={() => setOpen((v) => !v)} hitSlop={6}>
        <Text style={styles.link}>{open ? t("sales.hideDetails") : t("sales.viewDetails")}</Text>
      </Pressable>
      {open ? (
        <View style={styles.details}>
          {order.buyer?.email ? (
            <Text style={styles.muted}>
              {t("sales.details.email")}: {order.buyer.email}
            </Text>
          ) : null}
          {order.buyer?.phone ? (
            <Text style={styles.muted}>
              {t("sales.details.phone")}: {order.buyer.phone}
            </Text>
          ) : null}
          {address ? (
            <>
              <Text style={styles.muted}>
                {t("sales.details.recipient")}: {address.recipientName} · {address.phone}
              </Text>
              <Text style={styles.muted}>
                {t("sales.details.address")}: {[address.street, ...place].join(", ")}
              </Text>
              {address.reference ? (
                <Text style={styles.muted}>
                  {t("sales.details.reference")}: {address.reference}
                </Text>
              ) : null}
            </>
          ) : null}
        </View>
      ) : null}

      {canShip && !shipping ? (
        <MainButton
          text={t("sales.actions.ship")}
          leftIcon={Truck}
          size="sm"
          disabled={busy}
          onPress={() => setShipping(true)}
        />
      ) : null}
      {canShip && shipping ? (
        <View style={styles.form}>
          <Text style={styles.muted}>{t("sales.ship.description")}</Text>
          <Input
            label={t("sales.ship.trackingLabel")}
            placeholder={t("sales.ship.trackingPlaceholder")}
            value={tracking}
            onChangeText={setTracking}
            maxLength={200}
          />
          <View style={styles.actions}>
            <MainButton
              text={t("sales.cancel")}
              size="sm"
              variant="outline"
              disabled={busy}
              onPress={() => setShipping(false)}
            />
            <MainButton
              text={t("sales.ship.confirm")}
              size="sm"
              loading={busy}
              onPress={() =>
                void onMove("SHIPPED", tracking).then((done) => {
                  if (done) {
                    setShipping(false);
                    setTracking("");
                  }
                })
              }
            />
          </View>
        </View>
      ) : null}
      {canDeliver ? (
        <MainButton
          text={t("sales.actions.deliver")}
          leftIcon={PackageCheck}
          size="sm"
          variant="outline"
          disabled={busy}
          onPress={deliver}
        />
      ) : null}
    </View>
  );
}

/**
 * Profile → Mis ventas (MOB-3), for stores and mixed businesses as on the web
 * (WEB-1, WEB-14): what to ship first, this month's figures, and the shipping
 * moves. Refunds stay with EKORU.
 */
export default function SalesScreen() {
  const { t } = useTranslation(NAMESPACE);
  const sales = useSales({ errorTitle: t("sales.moveError") });

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      refreshControl={<RefreshControl refreshing={sales.refreshing} onRefresh={() => void sales.refetch()} />}
    >
      {sales.stats ? (
        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{formatPrice(sales.stats.revenue)}</Text>
            <Text style={styles.muted}>{t("sales.stats.revenue")}</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{sales.stats.paidCount}</Text>
            <Text style={styles.muted}>{t("sales.stats.paidOrders")}</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{sales.stats.toShip}</Text>
            <Text style={styles.muted}>{t("sales.stats.toShip")}</Text>
          </View>
        </View>
      ) : null}

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
        {FILTERS.map((key) => (
          <Pressable
            key={key}
            onPress={() => sales.setFilter(key)}
            style={[styles.chip, sales.filter === key && styles.chipActive]}
            accessibilityRole="button"
            accessibilityState={{ selected: sales.filter === key }}
          >
            <Text style={[styles.chipText, sales.filter === key && styles.chipTextActive]}>
              {t(`sales.filter.${key}`)}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <View style={styles.list}>
        {sales.initialLoading ? (
          <ActivityIndicator color={colors.primary} style={styles.loader} />
        ) : sales.error && sales.orders.length === 0 ? (
          <Text style={styles.empty}>{t("sales.error")}</Text>
        ) : sales.orders.length === 0 ? (
          <View style={styles.emptyBox}>
            <Receipt size={40} color={colors.foregroundTertiary} strokeWidth={1.5} />
            <Text style={styles.empty}>
              {sales.filter === "all" ? t("sales.empty") : t("sales.emptyFiltered")}
            </Text>
          </View>
        ) : (
          <>
            {sales.orders.map((order) => (
              <SaleCard
                key={order.id}
                order={order}
                busy={sales.moving}
                onMove={(stage, tracking) => sales.moveTo(order.id, stage, tracking)}
              />
            ))}
            {sales.hasMore ? (
              <MainButton text={t("sales.showMore")} variant="ghost" onPress={sales.showMore} />
            ) : null}
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.backgroundTertiary },
  content: { paddingBottom: 32 },
  stats: { flexDirection: "row", gap: 8, padding: 12, backgroundColor: colors.background },
  stat: { flex: 1, borderRadius: 12, padding: 10, backgroundColor: colors.backgroundSecondary, gap: 2 },
  statValue: { fontFamily: "Cabin_700Bold", fontSize: 16, color: colors.foreground },
  filters: { gap: 8, paddingHorizontal: 12, paddingVertical: 10 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontFamily: "Cabin_600SemiBold", fontSize: 13, color: colors.foregroundSecondary },
  chipTextActive: { color: "#fff" },
  list: { paddingHorizontal: 16, gap: 12 },
  loader: { marginTop: 40 },
  emptyBox: { alignItems: "center", gap: 12, paddingVertical: 40 },
  empty: {
    textAlign: "center",
    fontSize: 14,
    fontFamily: "Cabin_400Regular",
    color: colors.foregroundSecondary,
  },
  card: { backgroundColor: colors.surface, borderRadius: 12, padding: 14, gap: 6 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 8 },
  orderId: { fontFamily: "Cabin_700Bold", fontSize: 15, color: colors.foreground },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  badgeText: { fontFamily: "Cabin_600SemiBold", fontSize: 12 },
  line: { fontFamily: "Cabin_500Medium", fontSize: 14, color: colors.foreground },
  totalRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  total: { fontFamily: "Cabin_700Bold", fontSize: 16, color: colors.primary },
  muted: { fontFamily: "Cabin_400Regular", fontSize: 13, color: colors.foregroundSecondary },
  link: { fontFamily: "Cabin_600SemiBold", fontSize: 13, color: colors.primary },
  details: { gap: 4, paddingTop: 4 },
  form: { gap: 8, paddingTop: 4 },
  actions: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
});
