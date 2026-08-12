import { Text } from "@/components/Primitives/Text/Text";
import { colors } from "@/design/tokens";
import { displaySellerName } from "@/utils/displaySellerName";
import { formatPrice } from "@/utils/formatPrice";
import { getImageUrl } from "@/utils/getImageUrl";
import useAuthStore from "@/store/useAuthStore";
import * as ImagePicker from "expo-image-picker";
import { Check, Clock, Coins, ImageOff, ImagePlus, Quote } from "lucide-react-native";
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
  onConfirm: (
    id: number,
    photoUri?: string,
    compensationSettled?: boolean,
  ) => void;
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
  const myId = useAuthStore((s) => s.seller?.id);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [cashReceived, setCashReceived] = useState(false);
  const busy = busyId === deal.id;
  const counterparty = perspective === "buyer" ? deal.seller : deal.buyer;
  const tl = deal.status === "ACCEPTED" ? timeLeft(deal.confirmationDeadline) : null;
  // The buyer always receives an item; the seller only in an exchange. Whoever
  // receives one must attach a photo — the server rejects the confirmation
  // without it.
  const iReceiveItem = perspective === "buyer" || deal.type === "EXCHANGE";
  const confirmLabel = iReceiveItem ? t("confirmReceipt") : t("confirmHandover");
  const statusColor = STATUS_COLOR[deal.status] ?? colors.foregroundTertiary;

  // Cash gap: only the side owed the money can attest it changed hands.
  const hasCashGap = deal.compensationAmount > 0 && !!deal.compensationPayerId;
  const iPayCash = hasCashGap && deal.compensationPayerId === myId;
  const cashSettled = !!deal.compensationSettledAt;
  const mustTickCash = hasCashGap && !iPayCash && !cashSettled;
  const canConfirm =
    !busy && (!iReceiveItem || !!photoUri) && (!mustTickCash || cashReceived);

  async function pickEvidence() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    const picker =
      status === "granted"
        ? ImagePicker.launchCameraAsync
        : ImagePicker.launchImageLibraryAsync;
    const result = await picker({ quality: 0.7, allowsEditing: true });
    if (!result.canceled) setPhotoUri(result.assets[0].uri);
  }

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

      {/* What the proposer wrote when they opened the deal. */}
      {deal.message ? (
        <View style={styles.messageBox}>
          <Quote size={12} color={colors.foregroundTertiary} strokeWidth={2} />
          <View style={{ flex: 1 }}>
            <Text size="xs" color="tertiary" weight="medium">
              {perspective === "seller" ? t("messageFrom") : t("messageYours")}
            </Text>
            <Text size="xs" color="secondary">
              {deal.message}
            </Text>
          </View>
        </View>
      ) : null}

      {hasCashGap && (
        <View style={styles.cashRow}>
          <Coins size={12} color={colors.foregroundSecondary} strokeWidth={2} />
          <Text size="xs" color="secondary" style={{ flex: 1 }}>
            {iPayCash
              ? t("cashYouBring", { amount: formatPrice(deal.compensationAmount) })
              : t("cashTheyBring", { amount: formatPrice(deal.compensationAmount) })}
          </Text>
        </View>
      )}

      {cashSettled && (
        <View style={styles.cashRow}>
          <Check size={12} color={colors.success} strokeWidth={2.5} />
          <Text size="xs" style={{ color: colors.success, flex: 1 }}>
            {t("cashSettled")}
          </Text>
        </View>
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

      {/* Evidence photo + cash tick — both gate the confirm button. */}
      {deal.status === "ACCEPTED" && (
        <View style={styles.confirmPrep}>
          {iReceiveItem && (
            <Pressable style={styles.photoPicker} onPress={pickEvidence}>
              {photoUri ? (
                <>
                  <Image source={{ uri: photoUri }} style={styles.photoPreview} />
                  <Text size="xs" color="primary" weight="medium">
                    {t("changePhoto")}
                  </Text>
                </>
              ) : (
                <>
                  <ImagePlus size={16} color={colors.foregroundSecondary} strokeWidth={2} />
                  <Text size="xs" color="secondary" weight="medium">
                    {t("uploadPhoto")}
                  </Text>
                </>
              )}
            </Pressable>
          )}
          {mustTickCash && (
            <Pressable
              style={styles.checkRow}
              onPress={() => setCashReceived((v) => !v)}
            >
              <View style={[styles.checkbox, cashReceived && styles.checkboxOn]}>
                {cashReceived && <Check size={11} color="#fff" strokeWidth={3} />}
              </View>
              <Text size="xs" color="secondary" style={{ flex: 1 }}>
                {t("cashConfirmReceived", {
                  amount: formatPrice(deal.compensationAmount),
                })}
              </Text>
            </Pressable>
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
            <Pressable
              disabled={!canConfirm}
              style={[styles.btn, styles.primaryBtn, !canConfirm && styles.btnDisabled]}
              onPress={() =>
                onConfirm(
                  deal.id,
                  photoUri ?? undefined,
                  mustTickCash ? cashReceived : undefined,
                )
              }
            >
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
  btnDisabled: { opacity: 0.5 },
  messageBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginTop: 8,
    padding: 8,
    borderRadius: 8,
    backgroundColor: colors.background,
  },
  cashRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 6,
  },
  confirmPrep: {
    gap: 8,
    marginTop: 8,
  },
  photoPicker: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: colors.border,
  },
  photoPreview: {
    width: 32,
    height: 32,
    borderRadius: 6,
  },
  checkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  checkbox: {
    width: 16,
    height: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxOn: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  outlineBtn: {
    borderWidth: 1,
    borderColor: colors.border,
  },
});
