import MainButton from "@/components/Primitives/Button/MainButton";
import MarketplaceCard from "@/components/Cards/MarketplaceCard/MarketplaceCard";
import { Text } from "@/components/Primitives/Text/Text";
import { Title } from "@/components/Primitives/Title/Title";
import useProducts from "@/features/marketplace/hooks/useProducts";
import { router } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";

export default function UsedProductsSection() {
  // Newest live listings as the "used / pre-loved" rail.
  const { products } = useProducts({
    page: 1,
    pageSize: 8,
    sort: { field: "createdAt", order: "desc" },
  });

  if (products.length === 0) return null;

  return (
    <View style={styles.container}>
      <Title level="h4" align="center">
        Used Products
      </Title>
      <Text size="sm" color="secondary" align="center" style={{ marginTop: 4 }}>
        Pre-loved items ready for a second life
      </Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {products.map((product) => (
          <MarketplaceCard
            key={product.id}
            product={product}
            onPress={() =>
              router.push({
                pathname: "/product/[id]",
                params: { id: product.id },
              })
            }
          />
        ))}
      </ScrollView>

      <View style={styles.cta}>
        <MainButton
          text="See more products"
          onPress={() => router.push("/(marketplace)")}
          variant="primary"
          size="md"
          fullWidth
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 32,
    marginBottom: 0,
  },
  scroll: {
    gap: 8,
    marginVertical: 16,
  },
  cta: {
    paddingHorizontal: 4,
  },
});
