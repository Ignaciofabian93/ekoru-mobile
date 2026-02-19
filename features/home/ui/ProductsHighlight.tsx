import MarketplaceCard from "@/components/shared/Card/MarketplaceCard/MarketplaceCard";
import { Text } from "@/components/shared/Text/Text";
import { Title } from "@/components/shared/Title/Title";
import { DUMMY_PRODUCTS } from "@/features/marketplace/data/dummyProducts";
import { router } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";

export default function ProductsHighlight() {
  return (
    <View style={styles.container}>
      <Title level="h4" align="center">Outstanding Products</Title>
      <Text size="sm" color="secondary" align="center" style={{ marginTop: 4 }}>
        Most popular in the community
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {DUMMY_PRODUCTS.map((product) => (
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
