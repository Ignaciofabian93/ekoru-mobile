import Colors from "@/constants/Colors";
import type { CartItem } from "@/store/useCartStore";
import useCartStore from "@/store/useCartStore";
import { formatPrice } from "@/utils/formatPrice";
import { getImageUrl } from "@/utils/getImageUrl";
import { useRouter } from "expo-router";
import {
  ImageOff,
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function EmptyCart() {
  const router = useRouter();
  return (
    <View style={styles.empty}>
      <ShoppingCart
        size={60}
        color={Colors.foregroundMuted}
        strokeWidth={1.5}
      />
      <Text style={styles.emptyTitle}>Tu carrito está vacío</Text>
      <Text style={styles.emptySubtitle}>
        Agrega productos desde el marketplace para comenzar.
      </Text>
      <Pressable
        style={styles.shopButton}
        onPress={() => router.push("/(marketplace)" as any)}
      >
        <Text style={styles.shopButtonText}>Ir al Marketplace</Text>
      </Pressable>
    </View>
  );
}

function CartItemCard({ item }: { item: CartItem }) {
  const { removeItem, updateQuantity } = useCartStore();
  const [imageError, setImageError] = useState(false);
  const imageUri = getImageUrl(item.product.images?.[0]);

  return (
    <View style={styles.card}>
      {/* Thumbnail */}
      <View style={styles.thumb}>
        {imageUri && !imageError ? (
          <Image
            source={{ uri: imageUri }}
            style={styles.thumbImage}
            resizeMode="cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <View style={styles.thumbPlaceholder}>
            <ImageOff
              size={24}
              color={Colors.foregroundMuted}
              strokeWidth={1.5}
            />
          </View>
        )}
      </View>

      {/* Info */}
      <View style={styles.info}>
        {item.product.brand && (
          <Text style={styles.brand} numberOfLines={1}>
            {item.product.brand}
          </Text>
        )}
        <Text style={styles.name} numberOfLines={2}>
          {item.product.name}
        </Text>
        <Text style={styles.price}>{formatPrice(item.product.price)}</Text>

        {/* Quantity controls */}
        <View style={styles.qtyRow}>
          <Pressable
            style={styles.qtyBtn}
            onPress={() => updateQuantity(item.product.id, item.quantity - 1)}
            hitSlop={6}
          >
            <Minus size={14} color={Colors.foreground} strokeWidth={2} />
          </Pressable>
          <Text style={styles.qtyText}>{item.quantity}</Text>
          <Pressable
            style={styles.qtyBtn}
            onPress={() => updateQuantity(item.product.id, item.quantity + 1)}
            hitSlop={6}
          >
            <Plus size={14} color={Colors.foreground} strokeWidth={2} />
          </Pressable>

          <View style={{ flex: 1 }} />

          <Pressable
            onPress={() => removeItem(item.product.id)}
            hitSlop={6}
            style={styles.removeBtn}
          >
            <Trash2 size={16} color={Colors.danger} strokeWidth={1.8} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

export default function CartScreen() {
  const { items, subtotal, clearCart } = useCartStore();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  if (items.length === 0) {
    return <EmptyCart />;
  }

  return (
    <View style={styles.root}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.product.id}
        renderItem={({ item }) => <CartItemCard item={item} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          <Pressable style={styles.clearBtn} onPress={clearCart}>
            <Text style={styles.clearBtnText}>Vaciar carrito</Text>
          </Pressable>
        }
      />

      {/* Footer */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
        <View style={styles.subtotalRow}>
          <Text style={styles.subtotalLabel}>Subtotal</Text>
          <Text style={styles.subtotalValue}>{formatPrice(subtotal())}</Text>
        </View>
        <Pressable
          style={styles.checkoutBtn}
          onPress={() => router.push("/(cart)/checkout" as any)}
        >
          <Text style={styles.checkoutBtnText}>Ir a pagar</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  list: {
    padding: 16,
    gap: 12,
  },
  // Empty
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    gap: 12,
    backgroundColor: Colors.background,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: "Cabin_600SemiBold",
    color: Colors.foreground,
    marginTop: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: "Cabin_400Regular",
    color: Colors.foregroundSecondary,
    textAlign: "center",
  },
  shopButton: {
    marginTop: 8,
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  shopButtonText: {
    fontSize: 15,
    fontFamily: "Cabin_600SemiBold",
    color: "#fff",
  },
  // Card
  card: {
    flexDirection: "row",
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    overflow: "hidden",
  },
  thumb: {
    width: 100,
    height: 100,
  },
  thumbImage: {
    width: "100%",
    height: "100%",
  },
  thumbPlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: Colors.backgroundTertiary,
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    flex: 1,
    padding: 12,
    gap: 2,
  },
  brand: {
    fontSize: 11,
    fontFamily: "Cabin_400Regular",
    color: Colors.foregroundTertiary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  name: {
    fontSize: 14,
    fontFamily: "Cabin_600SemiBold",
    color: Colors.foreground,
    lineHeight: 19,
  },
  price: {
    fontSize: 15,
    fontFamily: "Cabin_600SemiBold",
    color: Colors.primary,
    marginTop: 2,
  },
  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 6,
  },
  qtyBtn: {
    width: 26,
    height: 26,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.borderStrong,
    alignItems: "center",
    justifyContent: "center",
  },
  qtyText: {
    fontSize: 14,
    fontFamily: "Cabin_600SemiBold",
    color: Colors.foreground,
    minWidth: 20,
    textAlign: "center",
  },
  removeBtn: {
    padding: 4,
  },
  // Clear
  clearBtn: {
    alignSelf: "center",
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  clearBtnText: {
    fontSize: 13,
    fontFamily: "Cabin_400Regular",
    color: Colors.danger,
    textDecorationLine: "underline",
  },
  // Footer
  footer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    gap: 10,
  },
  subtotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  subtotalLabel: {
    fontSize: 15,
    fontFamily: "Cabin_400Regular",
    color: Colors.foregroundSecondary,
  },
  subtotalValue: {
    fontSize: 18,
    fontFamily: "Cabin_700Bold",
    color: Colors.foreground,
  },
  checkoutBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  checkoutBtnText: {
    fontSize: 16,
    fontFamily: "Cabin_600SemiBold",
    color: "#fff",
  },
});
