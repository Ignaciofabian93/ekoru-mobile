import HeroCarousel from "@/components/HeroCarousel/HeroCarousel";
import Banner from "@/components/shared/Banner/Banner";
import { ScrollView, StyleSheet, View } from "react-native";
import ProductsHighlight from "../ui/ProductsHighlight";
import StatsSection from "../ui/StatsSection";

export default function HomeScreen() {
  return (
    <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
      <HeroCarousel />
      <View style={styles.content}>
        <StatsSection />
        <Banner
          title="Welcome to Ekoru!"
          description="Discover a new way to consume and connect with your community."
        />
        <ProductsHighlight />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
});
