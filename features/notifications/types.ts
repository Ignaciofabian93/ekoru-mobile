/**
 * Mirrors the users subgraph's `NotificationType`. Only the values the platform
 * actually emits today are listed; anything else arrives as a plain string and
 * falls through to the generic icon/route, so a new backend type can never
 * break this screen.
 */
export type NotificationType =
  | "SALE_PROPOSAL"
  | "EXCHANGE_PROPOSAL"
  | "EXCHANGE_ACCEPTED"
  | "EXCHANGE_DECLINED"
  | "EXCHANGE_COMPLETED"
  | "ORDER_RECEIVED"
  | "ORDER_CONFIRMED"
  | "ORDER_SHIPPED"
  | "ORDER_DELIVERED"
  | "ORDER_CANCELLED"
  | "PAYMENT_RECEIVED"
  | "PAYMENT_FAILED"
  | "PAYMENT_REFUNDED"
  | "QUOTATION_REQUEST"
  | "QUOTATION_RECEIVED"
  | "QUOTATION_ACCEPTED"
  | "QUOTATION_DECLINED"
  | "QUOTATION_COMPLETED"
  | "BOOKING_REQUEST"
  | "BOOKING_CONFIRMED"
  | "BOOKING_CANCELLED"
  | "BOOKING_COMPLETED"
  | "SECURITY_LOGIN_ALERT"
  | (string & {});

export type NotificationPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface AppNotification {
  id: number;
  type: NotificationType;
  /** Rendered server-side from the admin-editable template. */
  title: string;
  message: string;
  isRead: boolean;
  priority: NotificationPriority;
  /** Id of the order/deal this refers to. */
  relatedId?: string | null;
  actionUrl?: string | null;
  createdAt: string;
  readAt?: string | null;
}

export interface NotificationPageInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
}

export interface NotificationConnection {
  nodes: AppNotification[];
  pageInfo: NotificationPageInfo;
}
