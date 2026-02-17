import {
  type NotificationPriority,
  type NotificationType,
  type ShippingStage,
} from "./enums";

export type Order = {
  id: number;
  sellerId: string; // Buyer
  createdAt: string;
  shippingStatusId: number;
};

export type OrderItem = {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
};

export type ShippingStatus = {
  id: number;
  status: ShippingStage;
};

export type Notification = {
  id: string;
  sellerId: string;
  type: NotificationType;
  title: string;
  message: string;
  priority: NotificationPriority;
  isRead: boolean;
  actionUrl?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  readAt?: string;
};

export type NotificationTemplate = {
  id: number;
  type: NotificationType;
  title: string;
  messageTemplate: string;
  priority: NotificationPriority;
  actionUrlTemplate?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};
