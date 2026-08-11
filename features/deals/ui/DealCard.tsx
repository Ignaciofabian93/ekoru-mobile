import { Text } from "@/components/Primitives/Text/Text";
import { colors } from "@/design/tokens";
import { displaySellerName } from "@/utils/displaySellerName";
import { formatPrice } from "@/utils/formatPrice";
import { getImageUrl } from "@/utils/getImageUrl";
import { Clock, ImageOff } from "lucide-react-native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Image, Pressable, StyleSheet, View } from "react-native";
import { NAMESPACE } from "../i18n";
import type { Deal, DealPerspective, DealProduct } from "../types";

const STATUS_COLOR: Record<string, string> = {
  PROPOSED: colors.accent,
  ACCEPTED: colors.primary,
  COMPLETED: colors.success,
  DISPUTED: colors.danger,
  EXPIRED: colors.foregroundTertiary,
  CANCELLED: colors.foregroundTertiary,
  DECLINED: colors.danger,
};

function timeLeft(deadline?: string | null): { label: string; urgent: boolean; expired: boolean } | null {
  if (!deadline) return null;
  const ms = new Date(deadline).getTime() - Date.now();
  if (isNaN(ms)) return null;
  if (ms <= 0) return { label: "", urgent: true, expired: true };
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  return { label: h > 0 ? `${h}h ${m}m` : `${m}m`, urgent: h < 12, expired: false };
}

function ProductRow({ product }: { product?: DealProduct | null }) {
  const [err, setErr] = useState(false);
  if (!product) return null;
  const uri = getImageUrl(product.images?.[0] ?? undefined);
  return (
    <View style={styles.productRow}>
      <View style={styles.thumb}>
        {uri && !err ? (
          <Image source={{ uri }} style={styles.thumbImg} onError={() => setErr(true)} resizeMode="cover" />
        ) : (
          <ImageOff size={20} color={colors.foregroundTertiary} strokeWidth={1.5} />
        )}
      </View>
      <View style={{ flex: 1 }}>
        <Text size="sm" weight="semibold" numberOfLines={1}>
          {product.name}
        </Text>
        <Text size="xs" color="primary" weight="bold">
          {formatPrice(product.price)}
        </Text>
      </View>
    </View>
  );
}

interface Props {
  deal: Deal;
  perspective: DealPerspective;
  busyId: number | null;
  onAccept: (id: number) => void;
  onDecline: (id: number) => void;
  onConfirm: (id: number) => void;
  onCancel: (id: number) => void;
}

export default function DealCard({
  deal,
  perspective,
  busyId,
  onAccept,
  onDecline,
  onConfirm,
  onCancel,
}: Props) {
  const { t } = useTranslation(NAMESPACE);
  const busy = busyId === deal.id;
  const counterparty = perspective === "buyer" ? deal.seller : deal.buyer;
  const tl = deal.status === "ACCEPTED" ? timeLeft(deal.confirmationDeadline) : null;
  const confirmLabel =
    perspective === "buyer" || deal.type === "EXCHANGE"
      ? t("confirmReceipt")
      : t("confirmHandover");
  const statusColor = STATUS_COLOR[deal.status] ?? colors.foregroundTertiary;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.typeBadge}>
          <Text size="xs" weight="semibold" style={{ color: colors.primaryDark }}>
            {deal.type === "SALE" ? t("sale") : t("exchange")}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: `${statusColor}22` }]}>
          <Text size="xs" weight="semibold" style={{ color: statusColor }}>
            {t(`status${deal.status}`)}
          </Text>
        </View>
      </View>

      {deal.type === "SALE" ? (
        <ProductRow product={deal.product} />
      ) : (
        <>
          <ProductRow product={deal.requestedProduct} />
          <ProductRow product={deal.offeredProduct} />
        </>
      )}

      {counterparty && (
        <Text size="xs" color="tertiary" style={{ marginTop: 6 }}>
          {displaySellerName(counterparty)}
        </Text>
      )}

      {deal.status === "ACCEPTED" && (
        <View style={styles.banner}>
          {perspective === "buyer" ? (
            <Text size="xs" weight="medium" style={{ color: colors.primaryDark, flex: 1 }}>
              {t("acceptedBanner")}
            </Text>
          ) : (
            <View style={{ flex: 1 }} />
          )}
          {tl && (
            <View style={styles.timeRow}>
              <Clock size={12} color={tl.urgent ? colors.danger : colors.foregroundSecondary} strokeWidth={2} />
              <Text size="xs" weight="semibold" style={{ color: tl.urgent ? colors.danger : colors.foregroundSecondary }}>
                {tl.expired ? t("expired") : tl.label}
              </Text>
            </View>
          )}
        </View>
      )}

      <View style={styles.actions}>
        {deal.status === "PROPOSED" && perspective === "seller" && (
          <>
            <Pressable disabled={busy} style={[styles.btn, styles.primaryBtn]} onPress={() => onAccept(deal.id)}>
              <Text size="sm" weight="semibold" style={{ color: "#fff" }}>
                {t("accept")}
              </Text>
            </Pressable>
            <Pressable disabled={busy} style={[styles.btn, styles.outlineBtn]} onPress={() => onDecline(deal.id)}>
              <Text size="sm" weight="medium" color="secondary">
                {t("decline")}
              </Text>
            </Pressable>
          </>
        )}
        {deal.status === "PROPOSED" && perspective === "buyer" && (
          <>
            <Text size="xs" color="tertiary" style={{ flex: 1, alignSelf: "center" }}>
              {t("waitingSeller")}
            </Text>
            <Pressable disabled={busy} style={[styles.btn, styles.outlineBtn]} onPress={() => onCancel(deal.id)}>
              <Text size="sm" weight="medium" color="secondary">
                {t("cancel")}
              </Text>
            </Pressable>
          </>
        )}
        {deal.status === "ACCEPTED" && (
          <>
            <Pressable disabled={busy} style={[styles.btn, styles.primaryBtn]} onPress={() => onConfirm(deal.id)}>
              <Text size="sm" weight="semibold" style={{ color: "#fff" }}>
                {confirmLabel}
              </Text>
            </Pressable>
            <Pressable disabled={busy} style={[styles.btn, styles.outlineBtn]} onPress={() => onCancel(deal.id)}>
              <Text size="sm" weight="medium" color="secondary">
                {t("cancel")}
              </Text>
            </Pressable>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.borderLight,
    gap: 4,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  typeBadge: {
    backgroundColor: colors.navbar,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  productRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 4,
  },
  thumb: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.borderLight,
    overflow: "hidden",
  },
  thumbImg: { width: "100%", height: "100%" },
  banner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
    padding: 8,
    borderRadius: 8,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.borderFocus,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  actions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
  },
  btn: {
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    flex: 1,
  },
  primaryBtn: {
    backgroundColor: colors.primary,
  },
  outlineBtn: {
    borderWidth: 1,
    borderColor: colors.border,
  },
});
