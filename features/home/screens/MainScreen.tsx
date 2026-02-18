import HeroCarousel from "@/components/HeroCarousel/HeroCarousel";
import Banner from "@/components/shared/Banner/Banner";
import { ScrollView, StyleSheet, View } from "react-native";
import CategoriesSection from "../ui/CategoriesSection";
import ProductsHighlight from "../ui/ProductsHighlight";
import StatsSection from "../ui/StatsSection";

export default function HomeScreen() {
  return (
    <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
      <HeroCarousel />
      <View style={styles.content}>
        <Banner
          title="Welcome to Ekoru!"
          description="Discover a new way to consume and connect with your community."
        />
        <StatsSection />
        <CategoriesSection />
        <ProductsHighlight />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    marginTop: 24,
    paddingHorizontal: 8,
    backgroundColor: "#fff",
  },
});
