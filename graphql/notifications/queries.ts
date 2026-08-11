import { gql } from "@apollo/client";

export const NOTIFICATION_FIELDS = gql`
  fragment NotificationFields on Notification {
    id
    type
    title
    message
    isRead
    priority
    relatedId
    actionUrl
    createdAt
    readAt
  }
`;

export const MY_NOTIFICATIONS = gql`
  ${NOTIFICATION_FIELDS}
  query MyNotifications($page: Int, $pageSize: Int, $onlyUnread: Boolean) {
    myNotifications(page: $page, pageSize: $pageSize, onlyUnread: $onlyUnread) {
      nodes {
        ...NotificationFields
      }
      pageInfo {
        currentPage
        totalPages
        totalCount
        hasNextPage
      }
    }
  }
`;

/**
 * Just the badge number. Kept separate from `MY_NOTIFICATIONS` so the bell can
 * poll something cheap on every page without pulling a page of rows.
 */
export const UNREAD_NOTIFICATION_COUNT = gql`
  query UnreadNotificationCount {
    unreadNotificationCount
  }
`;
