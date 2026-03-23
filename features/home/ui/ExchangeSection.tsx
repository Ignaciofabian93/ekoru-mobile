import MainButton from "@/components/shared/Button/MainButton";
import { Text as AppText } from "@/components/shared/Text/Text";
import { Title } from "@/components/shared/Title/Title";
import Colors from "@/constants/Colors";
import type { ProductCondition } from "@/types/enums";
import type { Product } from "@/types/product";
import { displaySellerName } from "@/utils/displaySellerName";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowLeftRight, MapPin } from "lucide-react-native";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import useExchangeableProducts from "../hooks/useExchangeableProducts";

// ─── Condition display maps ───────────────────────────────────────────────────

const CONDITION_LABEL: Record<ProductCondition, string> = {
  NEW: "New",
  OPEN_BOX: "Open box",
  LIKE_NEW: "Like new",
  FAIR: "Fair",
  POOR: "Poor",
  FOR_PARTS: "For parts",
  REFURBISHED: "Refurbished",
};

const CONDITION_COLOR: Record<ProductCondition, string> = {
  NEW: Colors.success,
  OPEN_BOX: Colors.info,
  LIKE_NEW: Colors.success,
  FAIR: Colors.accent,
  POOR: Colors.danger,
  FOR_PARTS: Colors.danger,
  REFURBISHED: Colors.primary,
};

// ─── Exchange card ────────────────────────────────────────────────────────────

function ExchangeCard({
  product,
  onPress,
}: {
  product: Product;
  onPress: () => void;
}) {
  const categoryName = product.productCategory?.productCategoryName ?? "Item";
  const location =
    product.seller?.city?.city ?? product.seller?.region?.region ?? null;
  const ownerName = product.seller ? displaySellerName(product.seller) : null;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, { opacity: pressed ? 0.92 : 1 }]}
    >
      {/* Gradient header */}
      <LinearGradient
        colors={[Colors.accentHover, Colors.accent]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.cardHeader}
      >
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{categoryName}</Text>
        </View>
        <ArrowLeftRight size={18} color="#fff" strokeWidth={2} />
      </LinearGradient>

      {/* Body */}
      <View style={styles.cardBody}>
        {/* Offering */}
        <Text style={styles.offeringLabel}>Offering</Text>
        <Text style={styles.offeringName} numberOfLines={1}>
          {product.name}
        </Text>

        {/* Condition badge */}
        <View
          style={[
            styles.conditionBadge,
            { borderColor: CONDITION_COLOR[product.condition] },
          ]}
        >
          <Text
            style={[
              styles.conditionText,
              { color: CONDITION_COLOR[product.condition] },
            ]}
          >
            {CONDITION_LABEL[product.condition]}
          </Text>
        </View>

        {/* Description */}
        {product.conditionDescription ? (
          <>
            <View style={styles.divider} />
            <Text style={styles.descriptionText} numberOfLines={2}>
              {product.conditionDescription}
            </Text>
          </>
        ) : null}

        {/* Footer */}
        {location || ownerName ? (
          <View style={styles.cardFooter}>
            {location ? (
              <>
                <MapPin
                  size={11}
                  color={Colors.foregroundTertiary}
                  strokeWidth={1.5}
                />
                <Text style={styles.locationText} numberOfLines={1}>
                  {location}
                </Text>
              </>
            ) : null}
            {ownerName ? (
              <Text style={styles.ownerText}>
                {location ? `· ${ownerName}` : ownerName}
              </Text>
            ) : null}
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ExchangeSection() {
  const { products, loading } = useExchangeableProducts({
    pageSize: 10,
    sort: { field: "createdAt", order: "desc" },
  });

  return (
    <View style={styles.container}>
      <Title level="h4" align="center">
        Exchange & Swap
      </Title>
      <AppText
        size="sm"
        color="secondary"
        align="center"
        style={{ marginTop: 4 }}
      >
        Trade what you have for what you need
      </AppText>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={Colors.primary} />
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
        >
          {products.map((product) => (
            <ExchangeCard
              key={product.id}
              product={product}
              onPress={() => {}}
            />
          ))}
        </ScrollView>
      )}

      <View style={styles.cta}>
        <MainButton
          text="Propose an Exchange"
          onPress={() => {}}
          variant="primary"
          size="md"
          fullWidth
        />
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    marginTop: 32,
    marginBottom: 0,
  },
  scroll: {
    gap: 10,
    marginVertical: 16,
  },
  cta: {
    paddingHorizontal: 4,
  },
  loadingContainer: {
    height: 180,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: 200,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.borderLight,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  categoryBadge: {
    backgroundColor: "rgba(255,255,255,0.25)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  categoryText: {
    fontSize: 11,
    fontFamily: "Cabin_600SemiBold",
    color: "#fff",
  },
  cardBody: {
    padding: 12,
    gap: 4,
  },
  offeringLabel: {
    fontSize: 10,
    fontFamily: "Cabin_500Medium",
    color: Colors.foregroundTertiary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  offeringName: {
    fontSize: 14,
    fontFamily: "Cabin_700Bold",
    color: Colors.foreground,
  },
  conditionBadge: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginTop: 2,
  },
  conditionText: {
    fontSize: 10,
    fontFamily: "Cabin_600SemiBold",
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.borderLight,
    marginVertical: 6,
  },
  descriptionText: {
    fontSize: 12,
    fontFamily: "Cabin_400Regular",
    color: Colors.foregroundSecondary,
    lineHeight: 17,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    marginTop: 6,
  },
  locationText: {
    fontSize: 11,
    fontFamily: "Cabin_400Regular",
    color: Colors.foregroundTertiary,
    flex: 1,
  },
  ownerText: {
    fontSize: 11,
    fontFamily: "Cabin_500Medium",
    color: Colors.foregroundTertiary,
  },
});
