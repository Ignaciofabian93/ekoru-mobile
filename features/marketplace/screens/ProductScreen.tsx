import Colors from "@/constants/Colors";
import { getProductById } from "@/features/marketplace/data/dummyProducts";
import type { Product } from "@/features/marketplace/types/Product";
import { conditionTranslate } from "@/utils/conditionTranslate";
import { displaySellerName } from "@/utils/displaySellerName";
import { formatPrice } from "@/utils/formatPrice";
import { getImageUrl } from "@/utils/getImageUrl";
import { sellerTypeTranslate } from "@/utils/sellerTypeTranslate";
import { Stack, useLocalSearchParams } from "expo-router";
import {
  Droplets,
  ImageOff,
  Leaf,
  MapPin,
  Phone,
  ShoppingCart,
  User,
} from "lucide-react-native";
import { useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ProductScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const product = getProductById(id);

  if (!product) {
    return <ProductNotFound />;
  }

  return <ProductDetail product={product} />;
}

function ProductNotFound() {
  return (
    <>
      <Stack.Screen options={{ title: "Producto" }} />
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Producto no encontrado</Text>
      </View>
    </>
  );
}

function ProductDetail({ product }: { product: Product }) {
  const insets = useSafeAreaInsets();
  const [imageError, setImageError] = useState(false);
  const imageUri = getImageUrl(product.images?.[0]);

  return (
    <>
      <Stack.Screen options={{ title: product.name }} />
      <View style={styles.root}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
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
                <ImageOff size={56} color="#9ca3af" strokeWidth={1.5} />
              </View>
            )}
            <View style={styles.conditionBadge}>
              <Text style={styles.conditionText}>
                {conditionTranslate(product.condition)}
              </Text>
            </View>
          </View>

          <View style={styles.body}>
            {/* Title & Price */}
            <View style={styles.titleRow}>
              <View style={styles.titleBlock}>
                {product.brand && (
                  <Text style={styles.brand}>{product.brand}</Text>
                )}
                <Text style={styles.name}>{product.name}</Text>
              </View>
              <Text style={styles.price}>{formatPrice(product.price)}</Text>
            </View>

            {/* Description */}
            {product.description && (
              <Text style={styles.description}>{product.description}</Text>
            )}

            {/* Details */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Detalles</Text>
              <View style={styles.detailsGrid}>
                {product.color && (
                  <DetailRow label="Color" value={product.color} />
                )}
                <DetailRow
                  label="Estado"
                  value={conditionTranslate(product.condition)}
                />
              </View>
            </View>

            {/* Environmental Impact */}
            {product.environmentalImpact && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Impacto ambiental</Text>
                <View style={styles.impactRow}>
                  <View style={styles.impactCard}>
                    <Leaf size={20} color={Colors.primary} strokeWidth={1.5} />
                    <Text style={styles.impactValue}>
                      {product.environmentalImpact.totalCo2SavingsKG} kg
                    </Text>
                    <Text style={styles.impactLabel}>CO₂ ahorrado</Text>
                  </View>
                  <View style={styles.impactCard}>
                    <Droplets
                      size={20}
                      color={Colors.secondary}
                      strokeWidth={1.5}
                    />
                    <Text style={styles.impactValue}>
                      {product.environmentalImpact.totalWaterSavingsLT} L
                    </Text>
                    <Text style={styles.impactLabel}>Agua ahorrada</Text>
                  </View>
                </View>
                {product.environmentalImpact.materialBreakdown.length > 0 && (
                  <View style={styles.materialsContainer}>
                    <Text style={styles.materialsLabel}>Materiales</Text>
                    {product.environmentalImpact.materialBreakdown.map((m) => (
                      <View key={m.materialType} style={styles.materialRow}>
                        <Text style={styles.materialName}>
                          {m.materialType}
                        </Text>
                        <Text style={styles.materialPct}>{m.percentage}%</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            )}

            {/* Seller */}
            {product.seller && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Vendedor</Text>
                <View style={styles.sellerCard}>
                  <View style={styles.sellerRow}>
                    <User
                      size={16}
                      color={Colors.foregroundSecondary}
                      strokeWidth={1.5}
                    />
                    <Text style={styles.sellerName}>
                      {displaySellerName(product.seller)}
                    </Text>
                    <View style={styles.sellerTypeBadge}>
                      <Text style={styles.sellerTypeText}>
                        {sellerTypeTranslate(product.seller.sellerType)}
                      </Text>
                    </View>
                  </View>
                  {product.seller.county && (
                    <View style={styles.sellerRow}>
                      <MapPin
                        size={16}
                        color={Colors.foregroundSecondary}
                        strokeWidth={1.5}
                      />
                      <Text style={styles.sellerDetail}>
                        {product.seller.county.county}
                        {product.seller.address
                          ? ` · ${product.seller.address}`
                          : ""}
                      </Text>
                    </View>
                  )}
                  {product.seller.phone && (
                    <View style={styles.sellerRow}>
                      <Phone
                        size={16}
                        color={Colors.foregroundSecondary}
                        strokeWidth={1.5}
                      />
                      <Text style={styles.sellerDetail}>
                        {product.seller.phone}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Footer CTA */}
        <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
          <Pressable style={styles.cartButton}>
            <ShoppingCart size={20} color="#fff" strokeWidth={2} />
            <Text style={styles.cartButtonText}>Agregar al carrito</Text>
          </Pressable>
        </View>
      </View>
    </>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  notFound: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  notFoundText: {
    fontSize: 16,
    fontFamily: "Cabin_400Regular",
    color: Colors.foregroundSecondary,
  },
  imageContainer: {
    width: "100%",
    aspectRatio: 4 / 3,
    backgroundColor: "#f5f5f5",
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
    bottom: 12,
    left: 12,
    backgroundColor: "rgba(255,255,255,0.92)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  conditionText: {
    fontSize: 12,
    fontFamily: "Cabin_500Medium",
    color: "#111827",
    textTransform: "capitalize",
  },
  body: {
    padding: 16,
    gap: 20,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  titleBlock: {
    flex: 1,
    gap: 2,
  },
  brand: {
    fontSize: 13,
    fontFamily: "Cabin_400Regular",
    color: Colors.foregroundSecondary,
  },
  name: {
    fontSize: 22,
    fontFamily: "Cabin_700Bold",
    color: Colors.foreground,
    lineHeight: 28,
  },
  price: {
    fontSize: 22,
    fontFamily: "Cabin_700Bold",
    color: Colors.primary,
    flexShrink: 0,
  },
  description: {
    fontSize: 15,
    fontFamily: "Cabin_400Regular",
    color: Colors.foregroundSecondary,
    lineHeight: 22,
    marginTop: -8,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "Cabin_600SemiBold",
    color: Colors.foreground,
  },
  detailsGrid: {
    gap: 8,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  detailLabel: {
    fontSize: 14,
    fontFamily: "Cabin_400Regular",
    color: Colors.foregroundSecondary,
  },
  detailValue: {
    fontSize: 14,
    fontFamily: "Cabin_500Medium",
    color: Colors.foreground,
  },
  impactRow: {
    flexDirection: "row",
    gap: 12,
  },
  impactCard: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 10,
    padding: 14,
    alignItems: "center",
    gap: 4,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  impactValue: {
    fontSize: 18,
    fontFamily: "Cabin_700Bold",
    color: Colors.foreground,
  },
  impactLabel: {
    fontSize: 12,
    fontFamily: "Cabin_400Regular",
    color: Colors.foregroundSecondary,
    textAlign: "center",
  },
  materialsContainer: {
    gap: 6,
  },
  materialsLabel: {
    fontSize: 13,
    fontFamily: "Cabin_500Medium",
    color: Colors.foregroundSecondary,
  },
  materialRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  materialName: {
    fontSize: 14,
    fontFamily: "Cabin_400Regular",
    color: Colors.foreground,
  },
  materialPct: {
    fontSize: 14,
    fontFamily: "Cabin_500Medium",
    color: Colors.foregroundSecondary,
  },
  sellerCard: {
    gap: 10,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  sellerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sellerName: {
    fontSize: 15,
    fontFamily: "Cabin_600SemiBold",
    color: Colors.foreground,
    flex: 1,
  },
  sellerTypeBadge: {
    backgroundColor: Colors.primaryDark,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  sellerTypeText: {
    fontSize: 11,
    fontFamily: "Cabin_500Medium",
    color: "#fff",
  },
  sellerDetail: {
    fontSize: 14,
    fontFamily: "Cabin_400Regular",
    color: Colors.foregroundSecondary,
    flex: 1,
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  cartButton: {
    backgroundColor: Colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
  },
  cartButtonText: {
    fontSize: 16,
    fontFamily: "Cabin_600SemiBold",
    color: "#fff",
  },
});
