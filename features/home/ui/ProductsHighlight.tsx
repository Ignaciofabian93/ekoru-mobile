import MarketplaceCard from "@/components/shared/Card/MarketplaceCard/MarketplaceCard";
import { DUMMY_PRODUCTS } from "@/features/marketplace/data/dummyProducts";
import { router } from "expo-router";
import { ScrollView } from "react-native";

export default function ProductsHighlight() {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 8, marginVertical: 24 }}
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
  );
}
