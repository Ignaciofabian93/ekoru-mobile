import type { Seller } from "@/types/user";

export type ConversationItemType = "PRODUCT" | "STORE_PRODUCT" | "SERVICE";

export interface ChatMessage {
  id: number;
  conversationId: number;
  /** Null for SYSTEM messages. */
  senderId: string | null;
  kind: "TEXT" | "SYSTEM";
  body: string;
  /** Contact details were hidden before saving (TRX-19). */
  masked: boolean;
  mine: boolean;
  createdAt: string;
}

export interface ChatItem {
  id: number;
  name: string;
  images: string[];
}

export interface ChatConversation {
  id: number;
  itemType: ConversationItemType;
  myRole: "BUYER" | "SELLER";
  status: "OPEN" | "BLOCKED";
  blockedByMe: boolean;
  unreadCount: number;
  lastMessageAt: string;
  createdAt: string;
  lastMessage: ChatMessage | null;
  /** Email and phone stay null unless the two have traded (USR-10). */
  counterpart: Seller;
  product: ChatItem | null;
  storeProduct: ChatItem | null;
  service: ChatItem | null;
  /** Only on the single-thread query. */
  contactAllowed?: boolean;
}
