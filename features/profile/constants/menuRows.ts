import {
  Gem,
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
import { useHasSellerType } from "@/store/useAuthStore";
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
  return [
    { label: t("account.editProfile"), icon: UserPen, route: "/(profile)/edit-profile" },
    { label: t("password.changePassword"), icon: KeyRound, route: "/(profile)/change-password" },
    {
      label: unread > 0 ? `${tRoot("chat.title")} (${unread})` : tRoot("chat.title"),
      icon: MessageCircle,
      route: "/(profile)/messages",
    },
    { label: t("orders.title"), icon: PackageSearch, route: "/(profile)/order-history" },
    // Free for every approved business: where buyers' payments land (MOB-6).
    ...(isBusiness ? [{ label: t("payouts.title"), icon: Wallet, route: "/(profile)/payments" }] : []),
    { label: t("favorites.title"), icon: Heart, route: "/(profile)/favorites" },
    { label: t("impact.title"), icon: Leaf, route: "/(profile)/environmental-impact" },
    { label: t("subscription.title"), icon: Gem, route: "/(profile)/subscription" },
    { label: t("settings.title"), icon: Settings, route: "/(profile)/settings" },
  ];
}
