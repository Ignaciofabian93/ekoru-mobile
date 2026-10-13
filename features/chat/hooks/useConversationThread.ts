import { useApolloClient, useMutation, useQuery } from "@apollo/client/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { AppState } from "react-native";

import {
  BLOCK_CONVERSATION,
  MARK_CONVERSATION_READ,
  REPORT_MESSAGE,
  SEND_MESSAGE,
  UNBLOCK_CONVERSATION,
} from "@/graphql/chat/mutations";
import { CONVERSATION, CONVERSATION_MESSAGES } from "@/graphql/chat/queries";
import { showError, showSuccess } from "@/lib/toast";
import type { ChatConversation, ChatMessage } from "../types";
import { mergeMessages } from "../utils";

/** How often an open thread asks for new messages. */
const POLL_MS = 4000;
const PAGE = 30;
const READ_REFETCH = ["UnreadConversationCount", "MyConversations"];

interface MessagesResponse {
  conversationMessages: { nodes: ChatMessage[]; hasMore: boolean };
}

/**
 * One open conversation (MOB-5), the same contract as the web's hook: header,
 * messages oldest first, and the actions. New messages arrive by polling with
 * `after` while the app is in the foreground; opening the thread and every
 * poll that brings someone else's message marks it read.
 */
export function useConversationThread(conversationId: number) {
  const client = useApolloClient();
  const { t } = useTranslation();

  const { data, error } = useQuery<{ conversation: ChatConversation }>(CONVERSATION, {
    variables: { id: conversationId },
    fetchPolicy: "cache-and-network",
    pollInterval: 15000,
  });

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const newestId = useRef<number | null>(null);

  const [markReadMutation] = useMutation(MARK_CONVERSATION_READ, {
    refetchQueries: READ_REFETCH,
  });
  const [sendMutation, { loading: sending }] = useMutation<{ sendMessage: ChatMessage }>(
    SEND_MESSAGE,
  );
  const [reportMutation] = useMutation(REPORT_MESSAGE);
  const [blockMutation] = useMutation(BLOCK_CONVERSATION);
  const [unblockMutation] = useMutation(UNBLOCK_CONVERSATION);

  const markRead = useCallback(() => {
    void markReadMutation({ variables: { conversationId } }).catch(() => undefined);
  }, [markReadMutation, conversationId]);

  const fetchMessages = useCallback(
    async (variables: { before?: number; after?: number }) => {
      const result = await client.query<MessagesResponse>({
        query: CONVERSATION_MESSAGES,
        variables: { conversationId, limit: PAGE, ...variables },
        fetchPolicy: "network-only",
      });
      return result.data?.conversationMessages ?? { nodes: [], hasMore: false };
    },
    [client, conversationId],
  );

  const add = useCallback((incoming: ChatMessage[]) => {
    if (!incoming.length) return;
    setMessages((current) => {
      const merged = mergeMessages(current, incoming);
      newestId.current = merged[merged.length - 1]?.id ?? newestId.current;
      return merged;
    });
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetchMessages({})
      .then((page) => {
        if (cancelled) return;
        add(page.nodes);
        setHasMore(page.hasMore);
        setLoaded(true);
        markRead();
      })
      .catch(() => {
        if (!cancelled) setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, [fetchMessages, add, markRead]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (AppState.currentState !== "active" || newestId.current === null) return;
      fetchMessages({ after: newestId.current })
        .then((page) => {
          add(page.nodes);
          if (page.nodes.some((message) => !message.mine)) markRead();
        })
        .catch(() => undefined);
    }, POLL_MS);
    return () => clearInterval(timer);
  }, [fetchMessages, add, markRead]);

  const loadOlder = async () => {
    const oldest = messages[0]?.id;
    if (!oldest) return;
    const page = await fetchMessages({ before: oldest });
    add(page.nodes);
    setHasMore(page.hasMore);
  };

  const send = async (body: string): Promise<boolean> => {
    try {
      const { data: sent } = await sendMutation({ variables: { conversationId, body } });
      if (sent?.sendMessage) add([sent.sendMessage]);
      return true;
    } catch (err) {
      showError({
        title: t("chat.sendFailed"),
        message: err instanceof Error ? err.message : "",
      });
      return false;
    }
  };

  const report = async (messageId: number) => {
    try {
      await reportMutation({ variables: { messageId } });
      showSuccess({ title: t("chat.reported"), message: "" });
    } catch (err) {
      showError({ title: t("chat.actionFailed"), message: err instanceof Error ? err.message : "" });
    }
  };

  const setBlocked = async (blocked: boolean) => {
    try {
      await (blocked ? blockMutation : unblockMutation)({ variables: { conversationId } });
    } catch (err) {
      showError({ title: t("chat.actionFailed"), message: err instanceof Error ? err.message : "" });
    }
  };

  return {
    conversation: data?.conversation ?? null,
    error,
    messages,
    hasMore,
    loaded,
    sending,
    send,
    loadOlder,
    report,
    setBlocked,
  };
}
