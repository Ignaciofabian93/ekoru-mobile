import { gql } from "@apollo/client";

export const CONVERSATION_MESSAGE_FIELDS = gql`
  fragment ConversationMessageFields on ConversationMessage {
    id
    conversationId
    senderId
    kind
    body
    masked
    mine
    createdAt
  }
`;

/**
 * A thread as the inbox and the thread header show it: the other person, the
 * item it is about and the last message. Served by ekoru-transactions
 * (TRX-18); the seller and the item resolve from their own subgraphs, and the
 * counterpart's email and phone stay hidden unless the two have traded.
 */
export const CONVERSATION_FIELDS = gql`
  ${CONVERSATION_MESSAGE_FIELDS}
  fragment ConversationFields on Conversation {
    id
    itemType
    myRole
    status
    blockedByMe
    unreadCount
    lastMessageAt
    createdAt
    lastMessage {
      ...ConversationMessageFields
    }
    counterpart {
      id
      sellerType
      profile {
        ... on PersonProfile {
          id
          firstName
          lastName
          displayName
          profileImage
        }
        ... on BusinessProfile {
          id
          businessName
          logo
        }
      }
    }
    product {
      id
      name
      images
      price
    }
    storeProduct {
      id
      name
      images
      price
    }
    service {
      id
      name
      images
      basePrice
    }
  }
`;
