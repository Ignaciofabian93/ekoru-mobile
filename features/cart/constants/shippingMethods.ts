import type { ShippingMethod } from "@/types/checkout";
import { Home, MapPin, Store, Truck, type LucideIcon } from "lucide-react-native";

export type ShippingMethodMeta = {
  id: ShippingMethod;
  label: string;
  description: string;
  icon: LucideIcon;
  /** Whether the buyer has to fill in a delivery address. */
  requiresAddress: boolean;
  /** Whether the price has to be quoted by a courier rather than known up front. */
  isQuoted: boolean;
  /** Whether the method goes through the online-payment flow at all. */
  payable: boolean;
};

/**
 * Mirrors `ekoru-web-app/features/cart/constants/shippingMethods.ts`; the
 * backend accepts the same four `ShippingMethod` values. Copy carries labels
 * inline because the cart screens are Spanish-only for now.
 */
export const SHIPPING_METHODS: ShippingMethodMeta[] = [
  {
    id: "DELIVERED_TO_HOME",
    label: "Despacho a domicilio",
    description: "El vendedor lleva el producto a tu dirección",
    icon: Home,
    requiresAddress: true,
    isQuoted: false,
    payable: true,
  },
  {
    id: "IN_HOUSE_PICKUP",
    label: "Retiro con el vendedor",
    description: "Coordinas el retiro directamente con el vendedor",
    icon: Store,
    requiresAddress: false,
    isQuoted: false,
    payable: true,
  },
  {
    id: "IN_MID_POINT_PICKUP",
    label: "Punto intermedio",
    description: "Se acuerda por mensaje; no se paga en línea",
    icon: MapPin,
    requiresAddress: false,
    isQuoted: false,
    payable: false,
  },
  {
    id: "CARRIER",
    label: "Envío por courier",
    description: "Cotización de courier aún no disponible",
    icon: Truck,
    requiresAddress: true,
    isQuoted: true,
    payable: true,
  },
];

export const shippingMethodById = (id: ShippingMethod): ShippingMethodMeta =>
  SHIPPING_METHODS.find((m) => m.id === id) ?? SHIPPING_METHODS[0];

/** Flat rate applied to home delivery until the seller's policy is exposed. */
export const HOME_DELIVERY_FLAT_RATE_CLP = 3990;

export type PaymentProviderMeta = {
  id: "WEBPAY" | "KHIPU" | "MERCADOPAGO";
  label: string;
  description: string;
};

export const PAYMENT_PROVIDERS: PaymentProviderMeta[] = [
  { id: "WEBPAY", label: "Webpay", description: "Tarjetas de crédito y débito" },
  { id: "KHIPU", label: "Khipu", description: "Transferencia bancaria" },
  { id: "MERCADOPAGO", label: "MercadoPago", description: "Saldo y tarjetas" },
];
