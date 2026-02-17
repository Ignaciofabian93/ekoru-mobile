import Colors from "@/constants/Colors";
import type { Product } from "@/features/marketplace/types/Product";
import { conditionTranslate } from "@/utils/conditionTranslate";
import { formatPrice } from "@/utils/formatPrice";
import { getImageUrl } from "@/utils/getImageUrl";
import { ImageOff, RotateCcw, ShoppingCart } from "lucide-react-native";
import { useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

interface Props {
  product: Product;
  onFlip: () => void;
  onPress: () => void;
}

export default function CardFrontSide({ product, onFlip, onPress }: Props) {
  const [imageError, setImageError] = useState(false);
  const imageUri = getImageUrl(product.images?.[0]);

  return (
    <Pressable onPress={onPress} style={styles.card}>
      {/* Image */}
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
            <ImageOff size={40} color="#9ca3af" strokeWidth={1.5} />
          </View>
        )}

        {/* Condition Badge */}
        <View style={styles.conditionBadge}>
          <Text style={styles.conditionText}>
            {conditionTranslate(product.condition)}
          </Text>
        </View>

        {/* Flip Button */}
        <Pressable onPress={onFlip} style={styles.flipButton}>
          <RotateCcw size={12} color="#fff" strokeWidth={2.5} />
        </Pressable>
      </View>

      {/* Info */}
      <View style={styles.info}>
        <View style={styles.header}>
          {product.brand && (
            <Text style={styles.brand} numberOfLines={1}>
              {product.brand}
            </Text>
          )}
          {product.color && <Text style={styles.color}>{product.color}</Text>}
        </View>

        <Text style={styles.name} numberOfLines={1}>
          {product.name}
        </Text>

        {product.description && (
          <Text style={styles.description} numberOfLines={1}>
            {product.description}
          </Text>
        )}

        <View style={styles.footer}>
          <Text style={styles.price}>{formatPrice(product.price)}</Text>
          <Pressable style={styles.cartButton}>
            <ShoppingCart size={16} color="#fff" strokeWidth={2} />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    height: "100%",
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e5e5e5",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  imageContainer: {
    aspectRatio: 4 / 3,
    backgroundColor: "#f5f5f5",
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
  conditionBadge: {
    position: "absolute",
    bottom: 8,
    left: 8,
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  conditionText: {
    fontSize: 11,
    fontFamily: "Cabin_500Medium",
    color: "#111827",
    textTransform: "capitalize",
  },
  flipButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: Colors.primary,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  info: {
    padding: 12,
    flex: 1,
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  brand: {
    fontSize: 11,
    fontFamily: "Cabin_400Regular",
    color: "#6b7280",
    flex: 1,
  },
  color: {
    fontSize: 11,
    fontFamily: "Cabin_400Regular",
    color: "#6b7280",
    marginLeft: 8,
  },
  name: {
    fontSize: 16,
    fontFamily: "Cabin_600SemiBold",
    color: "#111827",
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    fontFamily: "Cabin_400Regular",
    color: "#6b7280",
    marginBottom: 8,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  price: {
    fontSize: 18,
    fontFamily: "Cabin_700Bold",
    color: Colors.primary,
  },
  cartButton: {
    backgroundColor: Colors.primary,
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
});
