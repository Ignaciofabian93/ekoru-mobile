export type ShippingStage = "PREPARING" | "SHIPPED" | "DELIVERED" | "RETURNED" | "CANCELED";

/** Shipping stages plus the one order state that has no stage yet. */
export type OrderStage = ShippingStage | "PENDING_PAYMENT";

export interface OrderLine {
  id: string;
  quantity: number;
  price: number;
  product?: { id: number; name: string; images: string[] } | null;
  storeProduct?: { id: number; name: string; images: string[] } | null;
}

export interface BuyerOrder {
  id: string;
  status: "PENDING_PAYMENT" | "PAID" | "CANCELED" | "REFUNDED";
  subtotal: number;
  shippingCost: number;
  total: number;
  currency: string;
  createdAt: string;
  shippingMethod: string;
  shippingStatus?: { id: string; status: ShippingStage; trackingInfo?: string | null } | null;
  orderItems?: OrderLine[] | null;
}

/**
 * An order carries a payment state and a shipping stage, and the buyer sees one
 * badge, as on the web: cancelled or refunded wins, an unpaid order shows as
 * such, and everything else follows the shipment.
 */
export function orderStage(order: BuyerOrder): OrderStage {
  if (order.status === "CANCELED" || order.status === "REFUNDED") return "CANCELED";
  if (order.status === "PENDING_PAYMENT") return "PENDING_PAYMENT";
  return order.shippingStatus?.status ?? "PREPARING";
}

/** Name of a line: whichever catalogue the item came from. */
export function lineName(line: OrderLine): string | null {
  return line.product?.name ?? line.storeProduct?.name ?? null;
}
