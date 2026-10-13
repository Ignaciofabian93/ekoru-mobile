import { gql } from "@apollo/client";
import { CONVERSATION_FIELDS, CONVERSATION_MESSAGE_FIELDS } from "./fragments";

/**
 * Opens (or reopens) the thread about an item. The item's owner passes
 * `counterpartId` to open it from a deal or booking with that person.
 */
export const START_CONVERSATION = gql`
  mutation StartConversation(
    $itemType: ConversationItemType!
    $itemId: Int!
    $counterpartId: ID
    $message: String
  ) {
    startConversation(
      itemType: $itemType
      itemId: $itemId
      counterpartId: $counterpartId
      message: $message
    ) {
      id
    }
  }
`;

export const SEND_MESSAGE = gql`
  ${CONVERSATION_MESSAGE_FIELDS}
  mutation SendMessage($conversationId: Int!, $body: String!) {
    sendMessage(conversationId: $conversationId, body: $body) {
      ...ConversationMessageFields
    }
  }
`;

export const MARK_CONVERSATION_READ = gql`
  mutation MarkConversationRead($conversationId: Int!) {
    markConversationRead(conversationId: $conversationId)
  }
`;

export const REPORT_MESSAGE = gql`
  mutation ReportMessage($messageId: Int!, $reason: String) {
    reportMessage(messageId: $messageId, reason: $reason)
  }
`;

export const BLOCK_CONVERSATION = gql`
  ${CONVERSATION_FIELDS}
  mutation BlockConversation($conversationId: Int!) {
    blockConversation(conversationId: $conversationId) {
      ...ConversationFields
      contactAllowed
    }
  }
`;

export const UNBLOCK_CONVERSATION = gql`
  ${CONVERSATION_FIELDS}
  mutation UnblockConversation($conversationId: Int!) {
    unblockConversation(conversationId: $conversationId) {
      ...ConversationFields
      contactAllowed
    }
  }
`;
