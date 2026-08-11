import MarketplaceCard from "@/components/Cards/MarketplaceCard/MarketplaceCard";
import { Text } from "@/components/Primitives/Text/Text";
import { Title } from "@/components/Primitives/Title/Title";
import useProducts from "@/features/marketplace/hooks/useProducts";
import { router } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";

export default function ProductsHighlight() {
  // Most-viewed live products as the "outstanding" rail.
  const { products } = useProducts({
    page: 1,
    pageSize: 10,
    sort: { field: "viewCount", order: "desc" },
  });

  if (products.length === 0) return null;

  return (
    <View style={styles.container}>
      <Title level="h4" align="center">
        Outstanding Products
      </Title>
      <Text size="sm" color="secondary" align="center" style={{ marginTop: 4 }}>
        Most popular in the community
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
});
