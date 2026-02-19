import HeroCarousel from "@/components/HeroCarousel/HeroCarousel";
import AdBanner from "@/components/shared/AdBanner/AdBanner";
import Banner from "@/components/shared/Banner/Banner";
import MainButton from "@/components/shared/Button/MainButton";
import Colors from "@/constants/Colors";
import Container from "@/ui/Layout/Container";
import { Tag } from "lucide-react-native";
import { ScrollView, StyleSheet, View } from "react-native";
import CategoriesSection from "../ui/CategoriesSection";
import EventsSection from "../ui/EventsSection";
import ExchangeSection from "../ui/ExchangeSection";
import GlobalSavingsSection from "../ui/GlobalSavingsSection";
import ProductsHighlight from "../ui/ProductsHighlight";
import StatsSection from "../ui/StatsSection";
import StoresHighlight from "../ui/StoresHighlight";
import UsedProductsSection from "../ui/UsedProductsSection";

const GAP = { marginTop: 32 } as const;

export default function HomeScreen() {
  return (
    <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
      <HeroCarousel />
      <Container>
        {/* ── Social proof ─────────────────────────────────────────── */}
        <StatsSection />

        {/* ── Main navigation ──────────────────────────────────────── */}
        <CategoriesSection />

        {/* B2B: after seeing categories, store owners are primed */}
        <View style={GAP}>
          <Banner
            title="Join us as allied store"
            description="Be part of the sustainable network"
          />
        </View>

        {/* ── Impact & discovery ───────────────────────────────────── */}
        <GlobalSavingsSection />
        <StoresHighlight />

        {/* Conversion: users just browsed stores → push to shop */}
        <View style={GAP}>
          <AdBanner
            title="Special Offer"
            description="Get 20% off on all eco-friendly products"
            cta={
              <MainButton
                text="Shop Now"
                onPress={() => {}}
                variant="success"
                size="sm"
              />
            }
          />
        </View>

        {/* ── Marketplace ──────────────────────────────────────────── */}
        <ProductsHighlight />
        <UsedProductsSection />

        {/* Supply-side CTA: users just browsed items → flip to seller mindset */}
        <View style={GAP}>
          <AdBanner
            icon={Tag}
            title="Got items to sell?"
            description="List in minutes, reach thousands of eco-conscious buyers"
            variant="outlined"
            cta={
              <MainButton
                text="List Now"
                onPress={() => {}}
                variant="primary"
                size="sm"
              />
            }
          />
        </View>

        {/* ── Community ────────────────────────────────────────────── */}
        <ExchangeSection />
        <EventsSection />

        {/* Emotional close: last thing users see — leaves them inspired */}
        <View style={GAP}>
          <Banner
            title="Join 8,200+ members"
            description="Together we're building a more sustainable world"
            variant="secondary"
          />
        </View>
      </Container>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
