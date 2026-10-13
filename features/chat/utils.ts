import { resolveImageUrl } from "@/features/profile/utils/resolveImage";
import type { ChatConversation, ChatMessage } from "./types";

/**
 * The item a thread is about. Only marketplace products have a detail screen
 * in the app, so the others carry no route.
 */
export function conversationItem(
  conversation: Pick<ChatConversation, "itemType" | "product" | "storeProduct" | "service">,
): { name: string; image?: string; route: string | null } | null {
  const item = conversation.product ?? conversation.storeProduct ?? conversation.service;
  if (!item) return null;
  return {
    name: item.name,
    image: resolveImageUrl(item.images?.[0]),
    route: conversation.itemType === "PRODUCT" ? `/product/${item.id}` : null,
  };
}

/** Freshly polled or sent messages added to those on screen: oldest first, each id once. */
export function mergeMessages(
  current: readonly ChatMessage[],
  incoming: readonly ChatMessage[],
): ChatMessage[] {
  const byId = new Map<number, ChatMessage>();
  for (const message of [...current, ...incoming]) byId.set(message.id, message);
  return [...byId.values()].sort((a, b) => a.id - b.id);
}

/** The thread for a conversation id, as an expo-router path. */
export const threadRoute = (conversationId: number | string) =>
  `/(profile)/messages/${conversationId}`;

/** "conversation:7" (a notification's relatedId) → 7. */
export function conversationIdFrom(relatedId: string | null | undefined): number | null {
  const id = Number(relatedId?.replace(/^conversation:/, ""));
  return Number.isInteger(id) && id > 0 ? id : null;
}
