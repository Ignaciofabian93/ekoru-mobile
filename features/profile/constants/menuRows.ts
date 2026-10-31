import {
  CalendarClock,
  Gem,
  Handshake,
  Heart,
  KeyRound,
  MessageCircle,
  Leaf,
  type LucideIcon,
  PackageSearch,
  Settings,
  UserPen,
  Wallet,
} from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { useUnreadConversations } from "@/features/chat/hooks/useChatQueries";
import { useBusinessProfile, useHasSellerType } from "@/store/useAuthStore";
import { NAMESPACE } from "../i18n";

export interface MenuRow {
  label: string;
  icon: LucideIcon;
  route: string;
}

export function useMenuRows(): MenuRow[] {
  const { t } = useTranslation(NAMESPACE);
  const { t: tRoot } = useTranslation();
  const unread = useUnreadConversations();
  const isBusiness = useHasSellerType("STARTUP", "COMPANY");
  const businessType = useBusinessProfile()?.businessType;
  // Businesses offering services receive bookings; one whose type hasn't
  // loaded counts as mixed, as on the web.
  const providesServices = isBusiness && businessType !== "RETAIL";
  return [
    { label: t("account.editProfile"), icon: UserPen, route: "/(profile)/edit-profile" },
    { label: t("password.changePassword"), icon: KeyRound, route: "/(profile)/change-password" },
    {
      label: unread > 0 ? `${tRoot("chat.title")} (${unread})` : tRoot("chat.title"),
      icon: MessageCircle,
      route: "/(profile)/messages",
    },
    { label: t("orders.title"), icon: PackageSearch, route: "/(profile)/order-history" },
    // A provider's side of bookings, opened on the received tab (WEB-22).
    ...(providesServices
      ? [
          {
            label: t("bookings.servicesProvided"),
            icon: Handshake,
            route: "/(profile)/bookings?tab=received",
          },
        ]
      : []),
    // Bookings made as a client, paid on site (MOB-3).
    { label: t("bookings.title"), icon: CalendarClock, route: "/(profile)/bookings" },
    // Free for every approved business: where buyers' payments land (MOB-6).
    ...(isBusiness ? [{ label: t("payouts.title"), icon: Wallet, route: "/(profile)/payments" }] : []),
    { label: t("favorites.title"), icon: Heart, route: "/(profile)/favorites" },
    { label: t("impact.title"), icon: Leaf, route: "/(profile)/environmental-impact" },
    { label: t("subscription.title"), icon: Gem, route: "/(profile)/subscription" },
    { label: t("settings.title"), icon: Settings, route: "/(profile)/settings" },
  ];
}
