import MainButton from "@/components/shared/Button/MainButton";
import MarketplaceCard from "@/components/shared/Card/MarketplaceCard/MarketplaceCard";
import { Text } from "@/components/shared/Text/Text";
import { Title } from "@/components/shared/Title/Title";
import type { Product } from "@/features/marketplace/types/Product";
import { router } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";

// ─── Dummy data ───────────────────────────────────────────────────────────────

const USED_PRODUCTS: Product[] = [
  {
    id: "u1",
    name: "Chaqueta de Lana Reciclada",
    description: "Abrigada, hecha con lana 100% reciclada. Talla M.",
    price: 45990,
    brand: "EcoWear",
    color: "Verde",
    condition: "LIKE_NEW",
    images: [],
    environmentalImpact: {
      totalCo2SavingsKG: 12.5,
      totalWaterSavingsLT: 340,
      materialBreakdown: [{ materialType: "Lana reciclada", percentage: 100 }],
    },
    seller: {
      id: "seller-u1",
      email: "maria@ekoru.cl",
      password: "",
      sellerType: "PERSON",
      isActive: true,
      isVerified: true,
      createdAt: "2024-01-01T00:00:00.000Z",
      updatedAt: "2024-01-01T00:00:00.000Z",
      points: 0,
      profile: {
        __typename: "PersonProfile",
        id: "pp-u1",
        sellerId: "seller-u1",
        firstName: "María",
        lastName: "González",
        allowExchanges: true,
        personSubscriptionPlan: "FREEMIUM",
      },
      phone: "+56 9 1234 5678",
      address: "Av. Providencia 1234",
      county: { id: 0, county: "Providencia", cityId: 0 },
    },
  },
  {
    id: "u2",
    name: "Bicicleta Urbana Vintage",
    description: "Restaurada, cambios Shimano, ideal para ciudad.",
    price: 129990,
    brand: "Trek",
    color: "Azul",
    condition: "FAIR",
    images: [],
    environmentalImpact: {
      totalCo2SavingsKG: 48,
      totalWaterSavingsLT: 120,
      materialBreakdown: [{ materialType: "Acero reciclado", percentage: 100 }],
    },
    seller: {
      id: "seller-u2",
      email: "carlos@ekoru.cl",
      password: "",
      sellerType: "PERSON",
      isActive: true,
      isVerified: true,
      createdAt: "2024-01-01T00:00:00.000Z",
      updatedAt: "2024-01-01T00:00:00.000Z",
      points: 0,
      profile: {
        __typename: "PersonProfile",
        id: "pp-u2",
        sellerId: "seller-u2",
        firstName: "Carlos",
        lastName: "Muñoz",
        allowExchanges: true,
        personSubscriptionPlan: "FREEMIUM",
      },
      phone: "+56 9 8765 4321",
      address: "Calle Bellavista 320",
      county: { id: 0, county: "Recoleta", cityId: 0 },
    },
  },
  {
    id: "u3",
    name: "Maceta Cerámica Artesanal",
    description: "Set de 3 macetas hechas a mano con arcilla local.",
    price: 18500,
    brand: "TierraViva",
    color: "Terracota",
    condition: "FAIR",
    images: [],
    environmentalImpact: {
      totalCo2SavingsKG: 3.2,
      totalWaterSavingsLT: 55,
      materialBreakdown: [{ materialType: "Arcilla natural", percentage: 100 }],
    },
    seller: {
      id: "seller-u3",
      email: "ana@tierraviva.cl",
      password: "",
      sellerType: "COMPANY",
      isActive: true,
      isVerified: true,
      createdAt: "2024-01-01T00:00:00.000Z",
      updatedAt: "2024-01-01T00:00:00.000Z",
      points: 0,
      profile: {
        __typename: "BusinessProfile",
        id: "bp-u3",
        sellerId: "seller-u3",
        businessName: "Ana Pérez",
        businessType: "RETAIL",
        businessSubscriptionPlan: "FREEMIUM",
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z",
      },
      phone: "+56 9 5555 1234",
      address: "Mercado Artesanal Local",
      county: { id: 0, county: "Ñuñoa", cityId: 0 },
    },
  },
  {
    id: "u4",
    name: "Cafetera de Émbolo",
    description: "French press 600 ml, como nueva. Incluye filtro extra.",
    price: 12990,
    brand: "Bodum",
    color: "Negro",
    condition: "LIKE_NEW",
    images: [],
    environmentalImpact: {
      totalCo2SavingsKG: 1.8,
      totalWaterSavingsLT: 30,
      materialBreakdown: [
        { materialType: "Vidrio reciclado", percentage: 100 },
      ],
    },
    seller: {
      id: "seller-u4",
      email: "lucas@ekoru.cl",
      password: "",
      sellerType: "PERSON",
      isActive: true,
      isVerified: true,
      createdAt: "2024-01-01T00:00:00.000Z",
      updatedAt: "2024-01-01T00:00:00.000Z",
      points: 0,
      profile: {
        __typename: "PersonProfile",
        id: "pp-u4",
        sellerId: "seller-u4",
        firstName: "Lucas",
        lastName: "Herrera",
        allowExchanges: true,
        personSubscriptionPlan: "FREEMIUM",
      },
      phone: "+56 9 3333 7777",
      address: "Las Condes",
      county: { id: 0, county: "Las Condes", cityId: 0 },
    },
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function UsedProductsSection() {
  return (
    <View style={styles.container}>
      <Title level="h4" align="center">Used Products</Title>
      <Text size="sm" color="secondary" align="center" style={{ marginTop: 4 }}>
        Pre-loved items ready for a second life
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {USED_PRODUCTS.map((product) => (
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
    gap: 8,
    marginVertical: 16,
  },
  cta: {
    paddingHorizontal: 4,
  },
});
