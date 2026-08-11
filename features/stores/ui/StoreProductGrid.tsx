import { Pagination } from "@/components/Patterns/Pagination/Pagination";
import { Text } from "@/components/Primitives/Text/Text";
import { Title } from "@/components/Primitives/Title/Title";
import { borderRadius, colors, fontFamily, fontSize, shadows } from "@/design/tokens";
import { formatPrice } from "@/utils/formatPrice";
import { getImageUrl } from "@/utils/getImageUrl";
import { ImageOff, Leaf, Star } from "lucide-react-native";
import { useState } from "react";
import { Dimensions, Image, Pressable, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import { NAMESPACE } from "../i18n";
import type { StoreListProduct } from "../types";

const GAP = 10;
const H_PADDING = 32;
const COLUMN_WIDTH = (Dimensions.get("window").width - H_PADDING - GAP) / 2;
const ITEMS_PER_PAGE_OPTIONS = [12, 24, 48];

interface Props {
  products: StoreListProduct[];
  page: number;
  totalPages: number;
  itemsPerPage: number;
  filteredCount: number;
  onGoToPage: (p: number) => void;
  onChangeItemsPerPage: (n: number) => void;
  onPressProduct?: (product: StoreListProduct) => void;
  emptyMessage?: string;
}

export default function StoreProductGrid({
  products,
  page,
  totalPages,
  itemsPerPage,
  filteredCount,
  onGoToPage,
  onChangeItemsPerPage,
  onPressProduct,
  emptyMessage,
}: Props) {
  const { t } = useTranslation(NAMESPACE);

  if (products.length === 0) {
    return (
      <View style={styles.empty}>
        <View style={styles.emptyIcon}>
          <Leaf size={32} color={colors.primary} strokeWidth={1.5} />
        </View>
        <Title level="h5" weight="semibold" align="center">
          {emptyMessage ?? t("noProductsFound")}
        </Title>
      </View>
    );
  }

  return (
    <View>
      <Text size="sm" color="tertiary" style={styles.count}>
        {t("showingResults", { shown: products.length, total: filteredCount })}
      </Text>

      <View style={styles.grid}>
        {products.map((product) => (
          <StoreProductCard
            key={product.id}
            product={product}
            onPress={() => onPressProduct?.(product)}
          />
        ))}
      </View>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={onGoToPage}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={onChangeItemsPerPage}
        itemsPerPageOptions={ITEMS_PER_PAGE_OPTIONS}
        rowsLabel={t("rows")}
      />
    </View>
  );
}

function StoreProductCard({
  product,
  onPress,
}: {
  product: StoreListProduct;
  onPress: () => void;
}) {
  const [imageError, setImageError] = useState(false);
  const imageUri = getImageUrl(product.images?.[0]);
  const price = product.hasOffer && product.offerPrice ? product.offerPrice : product.price;

  return (
    <Pressable onPress={onPress} style={styles.card}>
      <View style={styles.imageContainer}>
        {imageUri && !imageError ? (
          <Image
            source={{ uri: imageUri }}
            style={styles.image}
            resizeMode="cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <ImageOff size={36} color={colors.foregroundTertiary} strokeWidth={1.5} />
          </View>
        )}
        {product.hasOffer && (
          <View style={styles.offerBadge}>
            <Text size="xs" weight="bold" style={styles.offerText}>
              %
            </Text>
          </View>
        )}
      </View>

      <View style={styles.info}>
        {product.brand ? (
          <Text style={styles.brand} numberOfLines={1}>
            {product.brand}
          </Text>
        ) : null}
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>

        {typeof product.averageRating === "number" && product.averageRating > 0 ? (
          <View style={styles.ratingRow}>
            <Star size={12} color={colors.accent} fill={colors.accent} strokeWidth={0} />
            <Text size="xs" weight="medium">
              {product.averageRating.toFixed(1)}
            </Text>
            {typeof product.reviewsNumber === "number" ? (
              <Text size="xs" color="tertiary">
                ({product.reviewsNumber})
              </Text>
            ) : null}
          </View>
        ) : null}

        <View style={styles.priceRow}>
          <Text style={styles.price}>{formatPrice(price)}</Text>
          {product.hasOffer && product.offerPrice ? (
            <Text style={styles.strikePrice}>{formatPrice(product.price)}</Text>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  count: {
    marginBottom: 12,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: GAP,
  },
  card: {
    width: COLUMN_WIDTH,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.borderStrong,
    marginBottom: GAP,
    ...shadows.sm,
  },
  imageContainer: {
    aspectRatio: 1,
    backgroundColor: colors.backgroundTertiary,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  offerBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: colors.accent,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  offerText: {
    color: "#fff",
  },
  info: {
    padding: 10,
    gap: 3,
  },
  brand: {
    fontSize: fontSize.xs,
    fontFamily: fontFamily.regular,
    color: colors.foregroundSecondary,
  },
  name: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.semibold,
    color: colors.foreground,
    minHeight: 34,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 2,
  },
  price: {
    fontSize: fontSize.base,
    fontFamily: fontFamily.bold,
    color: colors.primary,
  },
  strikePrice: {
    fontSize: fontSize.xs,
    fontFamily: fontFamily.regular,
    color: colors.foregroundTertiary,
    textDecorationLine: "line-through",
  },
  empty: {
    marginTop: 60,
    alignItems: "center",
    paddingHorizontal: 40,
    gap: 8,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
});
