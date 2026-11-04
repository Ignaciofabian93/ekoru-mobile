import { storage } from "@/lib/storage";
import { useMemo } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

/**
 * Where a cart line came from, as on the web (`ekoru-web-app/store/useCartStore.ts`):
 * - "marketplace": a person's single used item, so the quantity is always 1;
 * - "store": a business's stock-managed product, bounded by `maxStock`.
 */
export type CartItemSource = "marketplace" | "store";

export interface CartItem {
  /** The id in its own catalogue; marketplace and store ids can collide. */
  productId: number;
  source: CartItemSource;
  name: string;
  image?: string;
  unitPrice: number;
  quantity: number;
  currency: "CLP";
  sellerId: string;
  sellerName?: string;
  /** Units available, for store lines. */
  maxStock?: number;
}

/**
 * One order is one seller (transactions refuses an order that spans two), so
 * the cart is split into per-seller groups and each is ordered and paid on its
 * own. The source is part of the key so a person and a store never merge.
 */
export interface CartGroup {
  id: string;
  source: CartItemSource;
  sellerId: string;
  sellerName?: string;
  items: CartItem[];
  subtotal: number;
  count: number;
}

export const cartGroupId = (source: CartItemSource, sellerId: string): string => `${source}:${sellerId}`;

const sameLine = (item: CartItem, productId: number, source: CartItemSource) =>
  item.productId === productId && item.source === source;

/** Clamps a wanted quantity to what the source allows. */
export function clampQuantity(source: CartItemSource, wanted: number, maxStock?: number): number {
  if (source === "marketplace") return 1;
  const upper = typeof maxStock === "number" ? maxStock : Infinity;
  return Math.min(Math.max(wanted, 1), upper);
}

/** Splits the lines into per-seller groups, in the order they were first added. */
export function groupItems(items: CartItem[]): CartGroup[] {
  const groups = new Map<string, CartGroup>();
  for (const item of items) {
    const id = cartGroupId(item.source, item.sellerId);
    const group = groups.get(id);
    if (group) {
      group.items.push(item);
      group.subtotal += item.unitPrice * item.quantity;
      group.count += item.quantity;
      if (!group.sellerName && item.sellerName) group.sellerName = item.sellerName;
    } else {
      groups.set(id, {
        id,
        source: item.source,
        sellerId: item.sellerId,
        sellerName: item.sellerName,
        items: [item],
        subtotal: item.unitPrice * item.quantity,
        count: item.quantity,
      });
    }
  }
  return Array.from(groups.values());
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (productId: number, source: CartItemSource) => void;
  updateQuantity: (productId: number, source: CartItemSource, quantity: number) => void;
  /** Removes one seller's lines, once that seller's order is paid. */
  clearGroup: (groupId: string) => void;
  clearCart: () => void;
}

// The cart survives closing the app, as the web's survives closing the tab.
const cartStorage = createJSONStorage(() => ({
  getItem: (key: string) => storage.getString(key) ?? null,
  setItem: (key: string, value: string) => storage.set(key, value),
  removeItem: (key: string) => {
    storage.remove(key);
  },
}));

const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],

      addItem: ({ quantity = 1, ...line }) =>
        set((state) => {
          const existing = state.items.find((i) => sameLine(i, line.productId, line.source));
          if (existing) {
            // Stock may have changed since the line was added.
            const maxStock = line.maxStock ?? existing.maxStock;
            return {
              items: state.items.map((i) =>
                sameLine(i, line.productId, line.source)
                  ? { ...i, maxStock, quantity: clampQuantity(i.source, i.quantity + quantity, maxStock) }
                  : i,
              ),
            };
          }
          return {
            items: [...state.items, { ...line, quantity: clampQuantity(line.source, quantity, line.maxStock) }],
          };
        }),

      removeItem: (productId, source) =>
        set((state) => ({ items: state.items.filter((i) => !sameLine(i, productId, source)) })),

      updateQuantity: (productId, source, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => !sameLine(i, productId, source))
              : state.items.map((i) =>
                  sameLine(i, productId, source)
                    ? { ...i, quantity: clampQuantity(i.source, quantity, i.maxStock) }
                    : i,
                ),
        })),

      clearGroup: (groupId) =>
        set((state) => ({
          items: state.items.filter((i) => cartGroupId(i.source, i.sellerId) !== groupId),
        })),

      clearCart: () => set({ items: [] }),
    }),
    { name: "ekoru_cart", storage: cartStorage, partialize: (state) => ({ items: state.items }) },
  ),
);

/** The cart as per-seller groups, recomputed only when the lines change. */
export const useCartGroups = (): CartGroup[] => {
  const items = useCartStore((s) => s.items);
  return useMemo(() => groupItems(items), [items]);
};

export const useCartCount = () => useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0));

export const useIsInCart = (source: CartItemSource, productId: number) =>
  useCartStore((s) => s.items.some((i) => sameLine(i, productId, source)));

export default useCartStore;
