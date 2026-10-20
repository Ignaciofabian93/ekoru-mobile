import MainButton from "@/components/Primitives/Button/MainButton";
import { colors } from "@/design/tokens";
import { useStartConversation } from "@/features/chat/hooks/useChatQueries";
import { useSeller } from "@/store/useAuthStore";
import { displaySellerName } from "@/utils/displaySellerName";
import { formatPrice } from "@/utils/formatPrice";
import { getImageUrl } from "@/utils/getImageUrl";
import { Stack, useLocalSearchParams } from "expo-router";
import { ImageOff, Info, Layers, MessageCircle, PackageCheck, User } from "lucide-react-native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, View } from "react-native";
import useStoreProduct, { type StoreProductDetail } from "../hooks/useStoreProduct";
import { NAMESPACE } from "../i18n";

/**
 * Store purchases are off on the web for the beta (`storePurchase` in the web's
 * constants/features.ts), so the app shows the same notice instead of a cart
 * button. Flip both together.
 */
const STORE_PURCHASE_ENABLED = false;

/** A store product (MOB-3): what it is, what it is made of, and who sells it. */
export default function StoreProductScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { product, loading } = useStoreProduct(id ?? "");
  const { t } = useTranslation(NAMESPACE);

  if (loading && !product) {
    return (
      <>
        <Stack.Screen options={{ title: t("product.title") }} />
        <View style={styles.center}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      </>
    );
  }
  if (!product) {
    return (
      <>
        <Stack.Screen options={{ title: t("product.title") }} />
        <View style={styles.center}>
          <Text style={styles.muted}>{t("product.notFound")}</Text>
        </View>
      </>
    );
  }
  return <StoreProductDetailView product={product} />;
}

function StoreProductDetailView({ product }: { product: StoreProductDetail }) {
  const { t } = useTranslation(NAMESPACE);
  const { t: tRoot } = useTranslation();
  const [imageError, setImageError] = useState(false);
  const me = useSeller();
  const { start, loading: contacting } = useStartConversation();
  const isOwnProduct = Boolean(me && product.sellerId === me.id);
  const imageUri = getImageUrl(product.images?.[0]);
  const onOffer = Boolean(product.hasOffer && product.offerPrice != null);
  // Largest share first, as on the web (STO-4, D3: a new product shows what it
  // is made of, never a "you saved" figure).
  const materials = [...(product.materials ?? [])].sort((a, b) => b.percentage - a.percentage);

  return (
    <>
      <Stack.Screen options={{ title: product.name }} />
      <ScrollView style={styles.root} contentContainerStyle={styles.content}>
        <View style={styles.imageBox}>
          {imageUri && !imageError ? (
            <Image
              source={{ uri: imageUri }}
              style={styles.image}
              resizeMode="cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <View style={styles.center}>
              <ImageOff size={56} color="#9ca3af" strokeWidth={1.5} />
            </View>
          )}
        </View>

        <View style={styles.body}>
          <View style={styles.titleRow}>
            <View style={styles.titleBlock}>
              {product.brand ? <Text style={styles.muted}>{product.brand}</Text> : null}
              <Text style={styles.name}>{product.name}</Text>
            </View>
            <View style={styles.priceBlock}>
              <Text style={styles.price}>
                {formatPrice(onOffer ? (product.offerPrice as number) : product.price)}
              </Text>
              {onOffer ? <Text style={styles.oldPrice}>{formatPrice(product.price)}</Text> : null}
            </View>
          </View>

          <Text style={styles.muted}>
            {(product.stock ?? 0) > 0
              ? t("product.inStock", { count: product.stock ?? 0 })
              : t("product.outOfStock")}
          </Text>

          {product.description ? <Text style={styles.description}>{product.description}</Text> : null}

          {materials.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Layers size={18} color={colors.primary} strokeWidth={2} />
                <Text style={styles.sectionTitle}>{t("product.materials")}</Text>
              </View>
              <Text style={styles.muted}>{t("product.materialsSubtitle")}</Text>
              {materials.map((m) => (
                <View key={m.id} style={styles.row}>
                  <Text style={styles.rowLabel}>{m.label}</Text>
                  <Text style={styles.rowValue}>{Number(m.percentage.toFixed(1))}%</Text>
                </View>
              ))}
            </View>
          )}

          {product.seller ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t("product.seller")}</Text>
              <View style={styles.sellerRow}>
                <User size={16} color={colors.foregroundSecondary} strokeWidth={1.5} />
                <Text style={styles.rowLabel}>{displaySellerName(product.seller)}</Text>
              </View>
            </View>
          ) : null}

          <View style={styles.section}>
            {isOwnProduct ? (
              <Notice icon={PackageCheck} text={t("product.ownListing")} />
            ) : (
              <>
                {!STORE_PURCHASE_ENABLED && <Notice icon={Info} text={t("product.browsingOnly")} />}
                {/* Questions go through EKORU's chat (MOB-5). */}
                <MainButton
                  text={tRoot("chat.contactSeller")}
                  leftIcon={MessageCircle}
                  variant="outline"
                  loading={contacting}
                  onPress={() => void start({ itemType: "STORE_PRODUCT", itemId: Number(product.id) })}
                />
              </>
            )}
          </View>
        </View>
      </ScrollView>
    </>
  );
}

function Notice({ icon: Icon, text }: { icon: typeof Info; text: string }) {
  return (
    <View style={styles.notice}>
      <Icon size={18} color={colors.primary} strokeWidth={2} />
      <Text style={styles.noticeText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: 32 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", minHeight: 200 },
  imageBox: { width: "100%", aspectRatio: 4 / 3, backgroundColor: "#f5f5f5" },
  image: { width: "100%", height: "100%" },
  body: { padding: 16, gap: 18 },
  titleRow: { flexDirection: "row", justifyContent: "space-between", gap: 12 },
  titleBlock: { flex: 1, gap: 2 },
  priceBlock: { alignItems: "flex-end" },
  name: { fontSize: 22, fontFamily: "Cabin_700Bold", color: colors.foreground, lineHeight: 28 },
  price: { fontSize: 22, fontFamily: "Cabin_700Bold", color: colors.primary },
  oldPrice: {
    fontSize: 14,
    fontFamily: "Cabin_400Regular",
    color: colors.foregroundSecondary,
    textDecorationLine: "line-through",
  },
  muted: { fontSize: 14, fontFamily: "Cabin_400Regular", color: colors.foregroundSecondary },
  description: {
    fontSize: 15,
    fontFamily: "Cabin_400Regular",
    color: colors.foregroundSecondary,
    lineHeight: 22,
  },
  section: { gap: 10 },
  sectionHeader: { flexDirection: "row", alignItems: "center", gap: 8 },
  sectionTitle: { fontSize: 16, fontFamily: "Cabin_600SemiBold", color: colors.foreground },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  rowLabel: { fontSize: 14, fontFamily: "Cabin_500Medium", color: colors.foreground },
  rowValue: { fontSize: 14, fontFamily: "Cabin_600SemiBold", color: colors.primary },
  sellerRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  notice: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
    backgroundColor: colors.backgroundSecondary,
    padding: 12,
  },
  noticeText: { flex: 1, fontSize: 14, fontFamily: "Cabin_500Medium", color: colors.foregroundSecondary },
});
