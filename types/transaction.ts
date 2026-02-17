import {
  type ChileanPaymentProvider,
  type ExchangeStatus,
  type PaymentEnvironment,
  type PaymentStatus,
  type PaymentType,
  type RefundStatus,
  type TransactionKind,
} from "./enums";

export type Transaction = {
  id: number;
  kind: TransactionKind;
  pointsCollected: number;
  createdAt: string;
  sellerId: string;
};

export type Exchange = {
  id: number;
  transactionId: number;
  offeredProductId: number;
  requestedProductId: number;
  status: ExchangeStatus;
  notes?: string;
  createdAt: string;
  completedAt?: string;
};

export type Payment = {
  id: string;
  paymentType: PaymentType;
  amount: number;
  currency: string;
  status: PaymentStatus;
  payerId: string;
  receiverId: string;
  orderId?: number;
  quotationId?: number;
  provider: string;
  providerTransactionId?: string;
  providerPaymentUrl?: string;
  metadata?: Record<string, unknown>;
  expiresAt?: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type PaymentRefund = {
  id: string;
  paymentId: string;
  amount: number;
  reason?: string;
  status: RefundStatus;
  providerRefundId?: string;
  processedAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type PaymentTransaction = {
  id: string;
  paymentId: string;
  transactionType: string;
  amount: number;
  providerResponse?: Record<string, unknown>;
  status: string;
  createdAt: string;
};

export type ChileanPaymentConfig = {
  id: number;
  sellerId: string;
  provider: ChileanPaymentProvider;
  environment: PaymentEnvironment;
  isActive: boolean;
  credentials?: Record<string, unknown>;
  webhookSecret?: string;
  createdAt: string;
  updatedAt: string;
};

export type PaymentWebhook = {
  id: string;
  provider: string;
  eventType: string;
  payload: Record<string, unknown>;
  processed: boolean;
  paymentId?: string;
  error?: string;
  createdAt: string;
  processedAt?: string;
};
