import { notificationRoute } from "@/features/notifications/lib/notificationRoute";
import type { ChatMessage } from "../types";
import { conversationIdFrom, conversationItem, mergeMessages, threadRoute } from "../utils";

const message = (id: number): ChatMessage => ({
  id,
  conversationId: 7,
  senderId: "s1",
  kind: "TEXT",
  body: `m${id}`,
  masked: false,
  mine: false,
  createdAt: "2026-10-13T10:00:00Z",
});

describe("chat routing (MOB-5)", () => {
  it("opens a message notification's own thread", () => {
    expect(notificationRoute({ type: "MESSAGE_RECEIVED", relatedId: "conversation:7" })).toBe(
      threadRoute(7),
    );
    expect(notificationRoute({ type: "MESSAGE_RECEIVED", relatedId: null })).toBe(
      "/(profile)/messages",
    );
  });

  it("reads a conversation id only from a well-formed relatedId", () => {
    expect(conversationIdFrom("conversation:12")).toBe(12);
    expect(conversationIdFrom("deal:12x")).toBeNull();
    expect(conversationIdFrom(undefined)).toBeNull();
  });

  it("links only marketplace products, which have a screen", () => {
    const item = { id: 3, name: "Silla", images: [] as string[] };
    expect(
      conversationItem({ itemType: "PRODUCT", product: item, storeProduct: null, service: null })
        ?.route,
    ).toBe("/product/3");
    expect(
      conversationItem({ itemType: "SERVICE", product: null, storeProduct: null, service: item })
        ?.route,
    ).toBeNull();
  });

  it("keeps each message once, oldest first", () => {
    expect(mergeMessages([message(2)], [message(1), message(2)]).map((m) => m.id)).toEqual([1, 2]);
  });
});
