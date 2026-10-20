import { type BuyerOrder, lineName, orderStage } from "../utils/orders";

const order = (over: Partial<BuyerOrder> = {}): BuyerOrder => ({
  id: "1",
  status: "PAID",
  subtotal: 10000,
  shippingCost: 0,
  total: 10000,
  currency: "CLP",
  createdAt: "2026-10-20T12:00:00Z",
  shippingMethod: "PICKUP",
  shippingStatus: null,
  orderItems: [],
  ...over,
});

describe("orderStage", () => {
  it("shows cancelled and refunded orders as cancelled, whatever the shipment says", () => {
    const shipped = { id: "s", status: "SHIPPED" as const };
    expect(orderStage(order({ status: "CANCELED", shippingStatus: shipped }))).toBe("CANCELED");
    expect(orderStage(order({ status: "REFUNDED", shippingStatus: shipped }))).toBe("CANCELED");
  });

  it("shows an unpaid order as awaiting payment", () => {
    expect(orderStage(order({ status: "PENDING_PAYMENT" }))).toBe("PENDING_PAYMENT");
  });

  it("follows the shipment once paid, and starts at preparing", () => {
    expect(orderStage(order())).toBe("PREPARING");
    expect(orderStage(order({ shippingStatus: { id: "s", status: "DELIVERED" } }))).toBe("DELIVERED");
  });
});

describe("lineName", () => {
  it("takes the name from whichever catalogue the line came from", () => {
    const base = { id: "l", quantity: 1, price: 1000 };
    expect(lineName({ ...base, product: { id: 1, name: "Silla", images: [] } })).toBe("Silla");
    expect(lineName({ ...base, storeProduct: { id: 2, name: "Mesa", images: [] } })).toBe("Mesa");
    expect(lineName(base)).toBeNull();
  });
});
