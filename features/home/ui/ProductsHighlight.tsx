import MarketplaceCard from "@/components/shared/Card/MarketplaceCard/MarketplaceCard";
import type { Product } from "@/features/marketplace/types/Product";
import { ScrollView } from "react-native";

const DUMMY_PRODUCT: Product = {
  id: "1",
  name: "Chaqueta de Lana Reciclada",
  description: "Chaqueta abrigada hecha con lana 100% reciclada",
  price: 45990,
  brand: "EcoWear",
  color: "Verde",
  condition: "like_new",
  images: [],
  environmentalImpact: {
    totalCo2SavingsKG: 12.5,
    totalWaterSavingsLT: 340.8,
    materialBreakdown: [
      { materialType: "Lana reciclada", percentage: 70 },
      { materialType: "Algodón orgánico", percentage: 30 },
    ],
  },
  seller: {
    sellerType: "store",
    profile: { firstName: "María", lastName: "González" },
    phone: "+56 9 1234 5678",
    address: "Av. Providencia 1234",
    county: { county: "Providencia" },
  },
};

export default function ProductsHighlight() {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ padding: 16, gap: 12 }}>
      <MarketplaceCard product={DUMMY_PRODUCT} />
    </ScrollView>
  );
}
