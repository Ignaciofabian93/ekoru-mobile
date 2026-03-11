import MarketplaceCard from "@/components/shared/Card/MarketplaceCard/MarketplaceCard";
import { Text } from "@/components/shared/Text/Text";
import { Title } from "@/components/shared/Title/Title";
import { DUMMY_PRODUCTS } from "@/features/marketplace/data/dummyProducts";
import { router } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";

export default function FeaturedProductsSection() {
  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Title level="h5" weight="semibold">
          Featured Products
        </Title>
        <Text size="sm" color="tertiary" style={{ marginTop: 2 }}>
          Handpicked eco-friendly picks
        </Text>
      </View>

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
  },
  sectionHeader: {
    marginBottom: 4,
  },
  scroll: {
    gap: 8,
    paddingVertical: 12,
  },
});
