import { useMutation, useQuery } from "@apollo/client/react";
import { type Href } from "expo-router";
import { useTranslation } from "react-i18next";

import { START_CONVERSATION } from "@/graphql/chat/mutations";
import { MY_CONVERSATIONS, UNREAD_CONVERSATION_COUNT } from "@/graphql/chat/queries";
import useAppRouter from "@/hooks/useAppRouter";
import { showError } from "@/lib/toast";
import useAuthStore from "@/store/useAuthStore";
import type { ChatConversation, ConversationItemType } from "../types";
import { threadRoute } from "../utils";

/** Conversations with unread messages, for the badges. Polls once a minute (MOB-5). */
export function useUnreadConversations(): number {
  const seller = useAuthStore((s) => s.seller);
  const { data } = useQuery<{ myUnreadConversationCount: number }>(UNREAD_CONVERSATION_COUNT, {
    skip: !seller,
    fetchPolicy: "cache-and-network",
    pollInterval: 60000,
  });
  return data?.myUnreadConversationCount ?? 0;
}

/** The inbox, most recent first. */
export function useConversations() {
  const seller = useAuthStore((s) => s.seller);
  const { data, loading, refetch } = useQuery<{
    myConversations: { nodes: ChatConversation[] };
  }>(MY_CONVERSATIONS, {
    variables: { page: 1, pageSize: 30 },
    skip: !seller,
    fetchPolicy: "cache-and-network",
    pollInterval: 15000,
  });
  return {
    conversations: data?.myConversations.nodes ?? [],
    loading: loading && !data,
    refetch,
  };
}

/**
 * Opens the thread about an item and goes to it. Guests go to sign in first.
 * The item's owner passes `counterpartId` to write from a deal or booking.
 */
export function useStartConversation() {
  const { t } = useTranslation();
  const seller = useAuthStore((s) => s.seller);
  const { navigate } = useAppRouter();
  const [mutate, { loading }] = useMutation<{ startConversation: { id: number } }>(
    START_CONVERSATION,
  );

  const start = async (args: {
    itemType: ConversationItemType;
    itemId: number;
    counterpartId?: string | null;
  }) => {
    if (!seller) {
      navigate("/(auth)" as Href);
      return;
    }
    try {
      const { data } = await mutate({
        variables: { ...args, counterpartId: args.counterpartId ?? null },
      });
      const id = data?.startConversation.id;
      if (id) navigate(threadRoute(id) as Href);
    } catch (error) {
      showError({
        title: t("chat.startFailed"),
        message: error instanceof Error ? error.message : "",
      });
    }
  };

  return { start, loading };
}
