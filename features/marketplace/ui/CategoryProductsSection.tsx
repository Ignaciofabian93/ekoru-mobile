import MarketplaceCard from "@/components/shared/Card/MarketplaceCard/MarketplaceCard";
import { Text } from "@/components/shared/Text/Text";
import { Title } from "@/components/shared/Title/Title";
import Colors from "@/constants/Colors";
import { DUMMY_PRODUCTS } from "@/features/marketplace/data/dummyProducts";
import { router } from "expo-router";
import { Leaf } from "lucide-react-native";
import { ScrollView, StyleSheet, View } from "react-native";

interface Props {
  categoryName: string;
}

export default function CategoryProductsSection({ categoryName }: Props) {
  if (DUMMY_PRODUCTS.length === 0) {
    return (
      <View style={styles.empty}>
        <View style={styles.emptyIcon}>
          <Leaf size={40} color={Colors.primary} strokeWidth={1.5} />
        </View>
        <Title level="h5" weight="semibold" align="center">
          No products yet
        </Title>
        <Text
          size="sm"
          color="secondary"
          align="center"
          style={{ marginTop: 4 }}
        >
          Products in {categoryName} will appear here soon
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Title level="h5" weight="semibold">
          Products
        </Title>
        <Text size="sm" color="tertiary" style={{ marginTop: 2 }}>
          {DUMMY_PRODUCTS.length} results (demo)
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
    marginTop: 4,
  },
  header: {
    marginBottom: 4,
  },
  scroll: {
    gap: 8,
    paddingVertical: 12,
  },
  empty: {
    marginTop: 60,
    alignItems: "center",
    paddingHorizontal: 40,
    gap: 8,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.backgroundPrimaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
});
