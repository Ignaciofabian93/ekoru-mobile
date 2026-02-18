import type { Product } from "@/features/marketplace/types/Product";

export const DUMMY_PRODUCTS: Product[] = [
  {
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
  },
  {
    id: "2",
    name: "Bicicleta Urbana Vintage",
    description: "Bicicleta restaurada ideal para ciudad, cambios Shimano",
    price: 129990,
    brand: "Trek",
    color: "Azul",
    condition: "good",
    images: [],
    environmentalImpact: {
      totalCo2SavingsKG: 48.0,
      totalWaterSavingsLT: 120.0,
      materialBreakdown: [
        { materialType: "Acero reciclado", percentage: 85 },
        { materialType: "Caucho natural", percentage: 15 },
      ],
    },
    seller: {
      sellerType: "individual",
      profile: { firstName: "Carlos", lastName: "Muñoz" },
      phone: "+56 9 8765 4321",
      address: "Calle Bellavista 320",
      county: { county: "Recoleta" },
    },
  },
  {
    id: "3",
    name: "Maceta Cerámica Artesanal",
    description: "Set de 3 macetas hechas a mano con arcilla local",
    price: 18500,
    brand: "TierraViva",
    color: "Terracota",
    condition: "new",
    images: [],
    environmentalImpact: {
      totalCo2SavingsKG: 3.2,
      totalWaterSavingsLT: 55.0,
      materialBreakdown: [{ materialType: "Arcilla natural", percentage: 100 }],
    },
    seller: {
      sellerType: "store",
      profile: { firstName: "Ana", lastName: "Pérez" },
      phone: "+56 9 5555 1234",
      address: "Mercado Artesanal Local",
      county: { county: "Ñuñoa" },
    },
  },
];

export function getProductById(id: string): Product | undefined {
  return DUMMY_PRODUCTS.find((p) => p.id === id);
}
