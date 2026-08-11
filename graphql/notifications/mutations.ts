import { gql } from "@apollo/client";

export const MARK_NOTIFICATION_READ = gql`
  mutation MarkNotificationRead($id: Int!) {
    markNotificationRead(id: $id)
  }
`;

/** Returns how many rows changed. */
export const MARK_ALL_NOTIFICATIONS_READ = gql`
  mutation MarkAllNotificationsRead {
    markAllNotificationsRead
  }
`;

/**
 * Push registration. Mobile-only — web has no push channel, so these live here
 * rather than in the shared document set.
 *
 * The push *preference* is not here: `UPDATE_SELLER_PREFERENCES` already exists
 * in `graphql/auth/profile.ts` and is reused, so there is one document for it.
 */
export const REGISTER_DEVICE = gql`
  mutation RegisterDevice($input: RegisterDeviceInput!) {
    registerDevice(input: $input) {
      id
      platform
      isActive
    }
  }
`;

export const UNREGISTER_DEVICE = gql`
  mutation UnregisterDevice($pushToken: String!) {
    unregisterDevice(pushToken: $pushToken)
  }
`;
