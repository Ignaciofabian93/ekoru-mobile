import { gql } from "@apollo/client";
import { CONVERSATION_FIELDS, CONVERSATION_MESSAGE_FIELDS } from "./fragments";

export const MY_CONVERSATIONS = gql`
  ${CONVERSATION_FIELDS}
  query MyConversations($page: Int, $pageSize: Int) {
    myConversations(page: $page, pageSize: $pageSize) {
      nodes {
        ...ConversationFields
      }
      pageInfo {
        totalCount
        hasNextPage
      }
    }
  }
`;

export const CONVERSATION = gql`
  ${CONVERSATION_FIELDS}
  query Conversation($id: Int!) {
    conversation(id: $id) {
      ...ConversationFields
      contactAllowed
    }
  }
`;

/** Newest first. `after` polls for what arrived; `before` pages back. */
export const CONVERSATION_MESSAGES = gql`
  ${CONVERSATION_MESSAGE_FIELDS}
  query ConversationMessages(
    $conversationId: Int!
    $before: Int
    $after: Int
    $limit: Int
  ) {
    conversationMessages(
      conversationId: $conversationId
      before: $before
      after: $after
      limit: $limit
    ) {
      nodes {
        ...ConversationMessageFields
      }
      hasMore
    }
  }
`;

export const UNREAD_CONVERSATION_COUNT = gql`
  query UnreadConversationCount {
    myUnreadConversationCount
  }
`;
