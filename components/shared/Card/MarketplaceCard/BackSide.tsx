import Colors from "@/constants/Colors";
import type { Product } from "@/features/marketplace/types/Product";
import { displaySellerName } from "@/utils/displaySellerName";
import { sellerTypeTranslate } from "@/utils/sellerTypeTranslate";
import {
  ChevronRight,
  Droplets,
  Leaf,
  MapPin,
  Phone,
  RotateCcw,
  UserRound,
} from "lucide-react-native";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

interface Props {
  product: Product;
  onFlip: () => void;
  onShowImpact: () => void;
}

function formatNumber(num: number): string {
  return new Intl.NumberFormat("es-CL", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(num);
}

export default function CardBackSide({ product, onFlip, onShowImpact }: Props) {
  const { environmentalImpact, seller } = product;

  return (
    <View style={styles.card}>
      {/* Flip Button */}
      <Pressable onPress={onFlip} style={styles.flipButton}>
        <RotateCcw size={12} color="#fff" strokeWidth={2.5} />
      </Pressable>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Environmental Impact */}
        {environmentalImpact && (
          <View style={styles.impactSection}>
            <View style={styles.sectionHeader}>
              <Leaf size={12} color="#16a34a" strokeWidth={2} />
              <Text style={styles.sectionTitle}>Impacto Ambiental</Text>
            </View>

            <View style={styles.statsRow}>
              {/* CO2 */}
              <View style={[styles.statCard, { backgroundColor: "#dcfce7" }]}>
                <View style={styles.statHeader}>
                  <Leaf size={10} color="#16a34a" strokeWidth={2} />
                  <Text style={styles.statLabel}>CO₂</Text>
                </View>
                <Text style={[styles.statValue, { color: "#16a34a" }]}>
                  {formatNumber(environmentalImpact.totalCo2SavingsKG)} kg
                </Text>
              </View>

              {/* Water */}
              <View style={[styles.statCard, { backgroundColor: "#dbeafe" }]}>
                <View style={styles.statHeader}>
                  <Droplets size={10} color="#2563eb" strokeWidth={2} />
                  <Text style={styles.statLabel}>Agua</Text>
                </View>
                <Text style={[styles.statValue, { color: "#2563eb" }]}>
                  {formatNumber(environmentalImpact.totalWaterSavingsLT)} L
                </Text>
              </View>
            </View>

            {/* Materials */}
            {environmentalImpact.materialBreakdown.length > 0 && (
              <View style={styles.materialsSection}>
                <Text style={styles.materialsLabel}>Materiales:</Text>
                {environmentalImpact.materialBreakdown
                  .slice(0, 2)
                  .map((material, index) => (
                    <View key={index} style={styles.materialRow}>
                      <Text style={styles.materialType} numberOfLines={1}>
                        {material.materialType}
                      </Text>
                      <Text style={styles.materialPct}>
                        {material.percentage.toFixed(1)}%
                      </Text>
                    </View>
                  ))}

                <Pressable onPress={onShowImpact} style={styles.viewMoreButton}>
                  <Text style={styles.viewMoreText}>Ver impacto completo</Text>
                  <ChevronRight
                    size={12}
                    color={Colors.primary}
                    strokeWidth={2}
                  />
                </Pressable>
              </View>
            )}
          </View>
        )}

        {/* Seller Info */}
        {seller && (
          <View style={styles.sellerSection}>
            <View style={styles.sellerHeader}>
              <Text style={styles.sectionTitle}>Vendedor</Text>
              <View style={styles.sellerBadge}>
                <Text style={styles.sellerBadgeText}>
                  {sellerTypeTranslate(seller.sellerType)}
                </Text>
              </View>
            </View>

            {seller.profile && (
              <View style={styles.sellerRow}>
                <UserRound size={10} color="#6b7280" strokeWidth={2} />
                <Text style={styles.sellerDetail} numberOfLines={1}>
                  {displaySellerName(seller)}
                </Text>
              </View>
            )}

            {seller.phone && (
              <View style={styles.sellerRow}>
                <Phone size={10} color="#6b7280" strokeWidth={2} />
                <Text style={styles.sellerDetail} numberOfLines={1}>
                  {seller.phone}
                </Text>
              </View>
            )}

            {seller.address && (
              <View style={styles.sellerRow}>
                <MapPin size={10} color="#6b7280" strokeWidth={2} />
                <Text style={styles.sellerDetail} numberOfLines={1}>
                  {seller.address}
                  {seller.county ? `, ${seller.county.county}` : ""}
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
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
    zIndex: 10,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 12,
    paddingTop: 16,
  },
  impactSection: {
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: "Cabin_700Bold",
    color: "#111827",
  },
  statsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 8,
  },
  statCard: {
    flex: 1,
    borderRadius: 8,
    padding: 8,
  },
  statHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 9,
    fontFamily: "Cabin_400Regular",
    color: "#6b7280",
  },
  statValue: {
    fontSize: 12,
    fontFamily: "Cabin_700Bold",
  },
  materialsSection: {
    gap: 4,
  },
  materialsLabel: {
    fontSize: 9,
    fontFamily: "Cabin_600SemiBold",
    color: "#6b7280",
  },
  materialRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  materialType: {
    fontSize: 10,
    fontFamily: "Cabin_400Regular",
    color: "#374151",
    flex: 1,
  },
  materialPct: {
    fontSize: 10,
    fontFamily: "Cabin_600SemiBold",
    color: "#111827",
    marginLeft: 4,
  },
  viewMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    marginTop: 8,
    backgroundColor: `${Colors.primary}1A`,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  viewMoreText: {
    fontSize: 10,
    fontFamily: "Cabin_600SemiBold",
    color: Colors.primary,
  },
  sellerSection: {
    borderTopWidth: 1,
    borderTopColor: "#e5e5e5",
    paddingTop: 8,
    gap: 6,
  },
  sellerHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  sellerBadge: {
    backgroundColor: `${Colors.primary}1A`,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  sellerBadgeText: {
    fontSize: 9,
    fontFamily: "Cabin_600SemiBold",
    color: Colors.primary,
  },
  sellerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  sellerDetail: {
    fontSize: 9,
    fontFamily: "Cabin_400Regular",
    color: "#374151",
    flex: 1,
  },
});
