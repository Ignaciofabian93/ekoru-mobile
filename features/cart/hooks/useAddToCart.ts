import type { Product } from "@/features/marketplace/types";
import type { StoreProductDetail } from "@/features/stores/hooks/useStoreProduct";
import useAppRouter from "@/hooks/useAppRouter";
import { showError, showInfo, showSuccess } from "@/lib/toast";
import useCartStore from "@/store/useCartStore";
import type { Seller } from "@/types/user";
import { displaySellerName } from "@/utils/displaySellerName";
import { useSeller } from "@/store/useAuthStore";
import type { Href } from "expo-router";
import { unitPriceOf } from "../utils/price";

export type AddToCartResult = "added" | "unauthenticated" | "own" | "exists" | "out_of_stock";

/**
 * How products become cart lines, the same rules as the web's `useAddToCart`:
 * a buyer must be signed in, never buys their own listing, takes a marketplace
 * item once (it is one unit) and a store product up to its stock.
 */
export default function useAddToCart() {
  const addItem = useCartStore((s) => s.addItem);
  const items = useCartStore((s) => s.items);
  const me = useSeller();
  const { navigate } = useAppRouter();

  const guard = (sellerId?: string): AddToCartResult | null => {
    if (!me) {
      showInfo({ title: "Inicia sesión para comprar" });
      navigate("/(auth)" as Href);
      return "unauthenticated";
    }
    if (sellerId && sellerId === me.id) return "own";
    return null;
  };

  const addMarketplaceProduct = (product: Product): AddToCartResult => {
    const sellerId = product.sellerId ?? product.seller?.id;
    const blocked = guard(sellerId);
    if (blocked) return blocked;
    if (!sellerId) {
      showError({ title: "No pudimos agregar este producto" });
      return "out_of_stock";
    }
    const productId = Number(product.id);
    if (items.some((i) => i.source === "marketplace" && i.productId === productId)) {
      showInfo({ title: "Ya está en tu carro" });
      return "exists";
    }
    addItem({
      source: "marketplace",
      productId,
      name: product.name,
      image: product.images?.[0],
      unitPrice: product.price,
      currency: "CLP",
      sellerId,
      sellerName: product.seller ? displaySellerName(product.seller) : undefined,
    });
    showSuccess({ title: "Agregado al carro" });
    return "added";
  };

  const addStoreProduct = (product: StoreProductDetail, quantity = 1): AddToCartResult => {
    const blocked = guard(product.sellerId);
    if (blocked) return blocked;
    const stock = product.stock ?? 0;
    if (stock <= 0) {
      showError({ title: "Sin stock" });
      return "out_of_stock";
    }
    addItem({
      source: "store",
      productId: Number(product.id),
      name: product.name,
      image: product.images?.[0],
      unitPrice: unitPriceOf(product),
      currency: "CLP",
      sellerId: product.sellerId,
      sellerName: product.seller ? displaySellerName(product.seller as Seller) : undefined,
      quantity,
      // The store clamps to the stock, so asking for more is safe.
      maxStock: stock,
    });
    showSuccess({ title: "Agregado al carro" });
    return "added";
  };

  return { addMarketplaceProduct, addStoreProduct };
}
