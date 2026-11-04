import { orderCartGroup, type BuyerOrder } from "@/features/profile/utils/orders";
import { isPayable } from "@/features/profile/utils/quotations";
import useCartStore, { cartGroupId, clampQuantity, groupItems, type CartItem } from "@/store/useCartStore";
import { unitPriceOf } from "../utils/price";

const line = (over: Partial<CartItem> = {}): CartItem => ({
  productId: 1,
  source: "store",
  name: "Polera",
  unitPrice: 5000,
  quantity: 1,
  currency: "CLP",
  sellerId: "s1",
  ...over,
});

describe("cart groups", () => {
  it("splits lines into one group per seller and source, in the order first added", () => {
    const groups = groupItems([
      line({ productId: 1, quantity: 2 }),
      line({ productId: 7, source: "marketplace", sellerId: "p1", unitPrice: 3000 }),
      line({ productId: 2, unitPrice: 1000 }),
    ]);
    expect(groups.map((g) => g.id)).toEqual(["store:s1", "marketplace:p1"]);
    expect(groups[0]).toMatchObject({ subtotal: 11000, count: 3 });
    expect(groups[1]).toMatchObject({ subtotal: 3000, count: 1 });
  });

  it("never merges a person and a store that share an id", () => {
    const groups = groupItems([line({ sellerId: "x" }), line({ source: "marketplace", sellerId: "x" })]);
    expect(groups).toHaveLength(2);
  });
});

describe("clampQuantity", () => {
  it("keeps a marketplace item at one unit", () => {
    expect(clampQuantity("marketplace", 3)).toBe(1);
  });

  it("bounds a store line by its stock, and never below one", () => {
    expect(clampQuantity("store", 9, 4)).toBe(4);
    expect(clampQuantity("store", 0, 4)).toBe(1);
    expect(clampQuantity("store", 9)).toBe(9);
  });
});

describe("cart store", () => {
  beforeEach(() => useCartStore.getState().clearCart());

  it("adds to an existing line up to the stock", () => {
    const { addItem } = useCartStore.getState();
    addItem({ ...line(), quantity: 3, maxStock: 4 });
    addItem({ ...line(), quantity: 3, maxStock: 4 });
    expect(useCartStore.getState().items).toEqual([expect.objectContaining({ quantity: 4 })]);
  });

  it("removes a line when its quantity drops to zero", () => {
    useCartStore.getState().addItem(line());
    useCartStore.getState().updateQuantity(1, "store", 0);
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it("drops only the paid seller's lines", () => {
    const { addItem, clearGroup } = useCartStore.getState();
    addItem(line({ productId: 1, sellerId: "s1" }));
    addItem(line({ productId: 2, sellerId: "s2" }));
    clearGroup(cartGroupId("store", "s1"));
    expect(useCartStore.getState().items.map((i) => i.sellerId)).toEqual(["s2"]);
  });
});

describe("unitPriceOf", () => {
  it("charges the offer price only when there is a real one", () => {
    expect(unitPriceOf({ price: 5000, hasOffer: true, offerPrice: 4000 })).toBe(4000);
    expect(unitPriceOf({ price: 5000, hasOffer: true, offerPrice: 0 })).toBe(5000);
    expect(unitPriceOf({ price: 5000, hasOffer: false, offerPrice: 4000 })).toBe(5000);
  });
});

describe("orderCartGroup", () => {
  const order = (over: Partial<BuyerOrder>): BuyerOrder => ({
    id: "9",
    sellerId: "s1",
    status: "PENDING_PAYMENT",
    subtotal: 0,
    shippingCost: 0,
    total: 0,
    currency: "CLP",
    createdAt: "2026-11-04T12:00:00Z",
    shippingMethod: "IN_HOUSE_PICKUP",
    ...over,
  });

  it("names the cart group an order was bought from", () => {
    const storeLine = { id: "1", quantity: 1, price: 1, storeProduct: { id: 3, name: "x", images: [] } };
    const marketLine = { id: "2", quantity: 1, price: 1, product: { id: 4, name: "y", images: [] } };
    expect(orderCartGroup(order({ orderItems: [storeLine] }))).toBe("store:s1");
    expect(orderCartGroup(order({ orderItems: [marketLine] }))).toBe("marketplace:s1");
    expect(orderCartGroup(order({ sellerId: undefined }))).toBeUndefined();
  });
});

describe("isPayable", () => {
  it("lets the client pay only an accepted, unpaid quote with a price", () => {
    const quote = { status: "ACCEPTED" as const, paidAt: null, finalPrice: null, estimatedPrice: 20000 };
    expect(isPayable(quote)).toBe(true);
    expect(isPayable({ ...quote, status: "PENDING" })).toBe(false);
    expect(isPayable({ ...quote, paidAt: "2026-11-04T12:00:00Z" })).toBe(false);
    expect(isPayable({ ...quote, estimatedPrice: null })).toBe(false);
  });
});
