import {
  Bell,
  BadgeCheck,
  CalendarCheck,
  CalendarClock,
  CalendarX,
  FileText,
  Handshake,
  PackageCheck,
  ShieldAlert,
  Truck,
  XCircle,
  RotateCcw,
  type LucideIcon,
} from "lucide-react-native";

import { colors } from "@/design/tokens";

import type { NotificationType } from "../types";

/**
 * Icon + accent per notification type. The accent is a Tailwind text colour;
 * it carries tone (a cancellation reads differently from a delivery) but is
 * never the only signal — the title says what happened.
 */
interface IconSpec {
  icon: LucideIcon;
  /** Colour value — React Native has no utility classes. */
  accent: string;
}

const DEFAULT_SPEC: IconSpec = {
  icon: Bell,
  accent: colors.foregroundSecondary,
};

const SPEC_BY_TYPE: Partial<Record<NotificationType, IconSpec>> = {
  SALE_PROPOSAL: { icon: Handshake, accent: colors.primary },
  EXCHANGE_PROPOSAL: { icon: Handshake, accent: colors.primary },
  EXCHANGE_ACCEPTED: { icon: BadgeCheck, accent: colors.primary },
  EXCHANGE_COMPLETED: { icon: BadgeCheck, accent: colors.primary },
  EXCHANGE_DECLINED: { icon: XCircle, accent: "#ef4444" },

  ORDER_RECEIVED: { icon: PackageCheck, accent: colors.primary },
  ORDER_CONFIRMED: { icon: BadgeCheck, accent: colors.primary },
  ORDER_SHIPPED: { icon: Truck, accent: colors.secondaryDark },
  ORDER_DELIVERED: { icon: PackageCheck, accent: colors.primary },
  ORDER_CANCELLED: { icon: XCircle, accent: "#ef4444" },

  PAYMENT_RECEIVED: { icon: BadgeCheck, accent: colors.primary },
  PAYMENT_FAILED: { icon: XCircle, accent: "#ef4444" },
  PAYMENT_REFUNDED: { icon: RotateCcw, accent: colors.secondaryDark },

  QUOTATION_REQUEST: { icon: FileText, accent: colors.primary },
  QUOTATION_RECEIVED: { icon: FileText, accent: colors.primary },
  QUOTATION_ACCEPTED: { icon: BadgeCheck, accent: colors.primary },
  QUOTATION_DECLINED: { icon: XCircle, accent: "#ef4444" },
  QUOTATION_COMPLETED: { icon: BadgeCheck, accent: colors.primary },

  BOOKING_REQUEST: { icon: CalendarClock, accent: colors.primary },
  BOOKING_CONFIRMED: { icon: CalendarCheck, accent: colors.primary },
  BOOKING_CANCELLED: { icon: CalendarX, accent: "#ef4444" },
  BOOKING_COMPLETED: { icon: BadgeCheck, accent: colors.primary },

  SECURITY_LOGIN_ALERT: { icon: ShieldAlert, accent: colors.accent },
};

export function notificationIcon(type: NotificationType): IconSpec {
  return SPEC_BY_TYPE[type] ?? DEFAULT_SPEC;
}
