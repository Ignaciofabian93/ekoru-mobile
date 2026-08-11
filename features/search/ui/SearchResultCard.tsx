import { Text } from "@/components/Primitives/Text/Text";
import { colors } from "@/design/tokens";
import { formatPrice } from "@/utils/formatPrice";
import { getImageUrl } from "@/utils/getImageUrl";
import { router } from "expo-router";
import { ImageOff } from "lucide-react-native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Image, Pressable, StyleSheet, View } from "react-native";
import { NAMESPACE } from "../i18n";
import type { SearchResultItem } from "../types";

export default function SearchResultCard({ item }: { item: SearchResultItem }) {
  const { t } = useTranslation(NAMESPACE);
  const [err, setErr] = useState(false);
  const uri = getImageUrl(item.images?.[0] ?? undefined);
  const price = item.hasOffer && item.offerPrice != null ? item.offerPrice : item.price;

  const onPress = () => {
    // Marketplace product detail exists; store-product & service detail routes
    // are pending — those hits are display-only for now.
    if (item.type === "PRODUCT") {
      router.push({ pathname: "/product/[id]", params: { id: String(item.id) } });
    }
  };

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.thumb}>
        {uri && !err ? (
          <Image source={{ uri }} style={styles.thumbImg} onError={() => setErr(true)} resizeMode="cover" />
        ) : (
          <ImageOff size={20} color={colors.foregroundTertiary} strokeWidth={1.5} />
        )}
      </View>
      <View style={{ flex: 1, gap: 3 }}>
        <View style={styles.typeBadge}>
          <Text size="xs" weight="semibold" style={{ color: colors.primaryDark }}>
            {t(`type${item.type}`)}
          </Text>
        </View>
        <Text size="sm" weight="semibold" numberOfLines={2}>
          {item.name}
        </Text>
        {price != null ? (
          <Text size="xs" weight="bold" color="primary">
            {formatPrice(price)}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  thumb: {
    width: 56,
    height: 56,
    borderRadius: 10,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.borderLight,
    overflow: "hidden",
  },
  thumbImg: { width: "100%", height: "100%" },
  typeBadge: {
    alignSelf: "flex-start",
    backgroundColor: colors.navbar,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
});
