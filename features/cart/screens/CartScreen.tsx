import { colors } from "@/design/tokens";
import useCartStore, { type CartGroup, type CartItem, useCartGroups } from "@/store/useCartStore";
import { formatPrice } from "@/utils/formatPrice";
import { getImageUrl } from "@/utils/getImageUrl";
import { useRouter } from "expo-router";
import { ImageOff, Minus, Plus, ShoppingCart, Store, Trash2 } from "lucide-react-native";
import React, { useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function EmptyCart() {
  const router = useRouter();
  return (
    <View style={styles.empty}>
      <ShoppingCart size={60} color={colors.foregroundMuted} strokeWidth={1.5} />
      <Text style={styles.emptyTitle}>Tu carrito está vacío</Text>
      <Text style={styles.emptySubtitle}>Agrega productos desde las tiendas o el marketplace para comenzar.</Text>
      <Pressable style={styles.shopButton} onPress={() => router.push("/(stores)")}>
        <Text style={styles.shopButtonText}>Ir a las tiendas</Text>
      </Pressable>
    </View>
  );
}

function CartItemCard({ item }: { item: CartItem }) {
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const [imageError, setImageError] = useState(false);
  const imageUri = getImageUrl(item.image);
  // A marketplace item is one unit; a store line goes up to the stock.
  const stepper = item.source === "store";
  const atMax = typeof item.maxStock === "number" && item.quantity >= item.maxStock;

  return (
    <View style={styles.card}>
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
            <ImageOff size={24} color={colors.foregroundMuted} strokeWidth={1.5} />
          </View>
        )}
      </View>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.price}>{formatPrice(item.unitPrice)}</Text>

        <View style={styles.qtyRow}>
          {stepper ? (
            <>
              <Pressable
                style={styles.qtyBtn}
                onPress={() => updateQuantity(item.productId, item.source, item.quantity - 1)}
                hitSlop={6}
                accessibilityLabel="Menos"
              >
                <Minus size={14} color={colors.foreground} strokeWidth={2} />
              </Pressable>
              <Text style={styles.qtyText}>{item.quantity}</Text>
              <Pressable
                style={[styles.qtyBtn, atMax && styles.qtyBtnDisabled]}
                onPress={() => updateQuantity(item.productId, item.source, item.quantity + 1)}
                disabled={atMax}
                hitSlop={6}
                accessibilityLabel="Más"
              >
                <Plus size={14} color={colors.foreground} strokeWidth={2} />
              </Pressable>
            </>
          ) : (
            <Text style={styles.unique}>Pieza única</Text>
          )}

          <View style={{ flex: 1 }} />

          <Pressable
            onPress={() => removeItem(item.productId, item.source)}
            hitSlop={6}
            style={styles.removeBtn}
            accessibilityLabel="Quitar"
          >
            <Trash2 size={16} color={colors.danger} strokeWidth={1.8} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

/** One seller's lines: one order, paid on its own (transactions refuses mixed orders). */
function GroupSection({ group }: { group: CartGroup }) {
  const router = useRouter();
  return (
    <View style={styles.group}>
      <View style={styles.groupHeader}>
        <Store size={16} color={colors.primary} strokeWidth={2} />
        <Text style={styles.groupName} numberOfLines={1}>
          {group.sellerName ?? "Vendedor"}
        </Text>
      </View>
      {group.items.map((item) => (
        <CartItemCard key={`${item.source}-${item.productId}`} item={item} />
      ))}
      <View style={styles.subtotalRow}>
        <Text style={styles.subtotalLabel}>Subtotal</Text>
        <Text style={styles.subtotalValue}>{formatPrice(group.subtotal)}</Text>
      </View>
      <Pressable
        style={styles.checkoutBtn}
        onPress={() => router.push({ pathname: "/(cart)/checkout", params: { g: group.id } })}
      >
        <Text style={styles.checkoutBtnText}>Pagar esta compra</Text>
      </Pressable>
    </View>
  );
}

export default function CartScreen() {
  const groups = useCartGroups();
  const clearCart = useCartStore((s) => s.clearCart);
  const insets = useSafeAreaInsets();

  if (groups.length === 0) {
    return <EmptyCart />;
  }

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 24 }]}
      showsVerticalScrollIndicator={false}
    >
      {groups.length > 1 && (
        <Text style={styles.hint}>Cada vendedor se paga por separado: una compra por vendedor.</Text>
      )}
      {groups.map((group) => (
        <GroupSection key={group.id} group={group} />
      ))}
      <Pressable style={styles.clearBtn} onPress={clearCart}>
        <Text style={styles.clearBtnText}>Vaciar carrito</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    padding: 16,
    gap: 16,
  },
  hint: {
    fontSize: 13,
    fontFamily: "Cabin_400Regular",
    color: colors.foregroundSecondary,
  },
  // Empty
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    gap: 12,
    backgroundColor: colors.background,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: "Cabin_600SemiBold",
    color: colors.foreground,
    marginTop: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: "Cabin_400Regular",
    color: colors.foregroundSecondary,
    textAlign: "center",
  },
  shopButton: {
    marginTop: 8,
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  shopButtonText: {
    fontSize: 15,
    fontFamily: "Cabin_600SemiBold",
    color: "#fff",
  },
  // Group
  group: {
    gap: 10,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.borderLight,
    backgroundColor: colors.backgroundSecondary,
  },
  groupHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  groupName: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Cabin_600SemiBold",
    color: colors.foreground,
  },
  // Card
  card: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
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
    backgroundColor: colors.backgroundTertiary,
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    flex: 1,
    padding: 12,
    gap: 2,
  },
  name: {
    fontSize: 14,
    fontFamily: "Cabin_600SemiBold",
    color: colors.foreground,
    lineHeight: 19,
  },
  price: {
    fontSize: 15,
    fontFamily: "Cabin_600SemiBold",
    color: colors.primary,
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
    borderColor: colors.borderStrong,
    alignItems: "center",
    justifyContent: "center",
  },
  qtyBtnDisabled: {
    opacity: 0.4,
  },
  qtyText: {
    fontSize: 14,
    fontFamily: "Cabin_600SemiBold",
    color: colors.foreground,
    minWidth: 20,
    textAlign: "center",
  },
  unique: {
    fontSize: 12,
    fontFamily: "Cabin_400Regular",
    color: colors.foregroundTertiary,
  },
  removeBtn: {
    padding: 4,
  },
  // Clear
  clearBtn: {
    alignSelf: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  clearBtnText: {
    fontSize: 13,
    fontFamily: "Cabin_400Regular",
    color: colors.danger,
    textDecorationLine: "underline",
  },
  // Group footer
  subtotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  subtotalLabel: {
    fontSize: 15,
    fontFamily: "Cabin_400Regular",
    color: colors.foregroundSecondary,
  },
  subtotalValue: {
    fontSize: 18,
    fontFamily: "Cabin_700Bold",
    color: colors.foreground,
  },
  checkoutBtn: {
    backgroundColor: colors.primary,
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
