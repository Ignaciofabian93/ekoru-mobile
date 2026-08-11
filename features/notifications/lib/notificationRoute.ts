import type { AppNotification, NotificationType } from "../types";

/**
 * Where tapping a notification should take you, as an expo-router path.
 *
 * Routing is derived from the notification `type`, not the `actionUrl` the
 * backend stores: that field describes the *domain* ("the order detail"), and
 * mobile's route table differs from web's, so each client owns its own mapping.
 * This is why the same notification deep-links correctly in both apps without
 * the backend knowing either route table.
 *
 * Unknown types stay on the notifications tab, which is always valid.
 */
const ROUTE_BY_TYPE: Partial<Record<NotificationType, string>> = {
  SALE_PROPOSAL: "/(deals)",
  EXCHANGE_PROPOSAL: "/(deals)",
  EXCHANGE_ACCEPTED: "/(deals)",
  EXCHANGE_DECLINED: "/(deals)",
  EXCHANGE_COMPLETED: "/(deals)",

  ORDER_RECEIVED: "/(profile)/order-history",
  ORDER_CONFIRMED: "/(profile)/order-history",
  ORDER_SHIPPED: "/(profile)/order-history",
  ORDER_DELIVERED: "/(profile)/order-history",
  ORDER_CANCELLED: "/(profile)/order-history",
  PAYMENT_RECEIVED: "/(profile)/order-history",
  PAYMENT_FAILED: "/(profile)/order-history",
  PAYMENT_REFUNDED: "/(profile)/order-history",

  SECURITY_LOGIN_ALERT: "/(profile)/settings",
};

export function notificationRoute(
  notification: Pick<AppNotification, "type">,
): string | null {
  return ROUTE_BY_TYPE[notification.type] ?? null;
}
