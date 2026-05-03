import {
  Gem,
  Heart,
  KeyRound,
  Leaf,
  type LucideIcon,
  PackageSearch,
  Settings,
  UserPen,
} from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { NAMESPACE } from "../i18n";

export interface MenuRow {
  label: string;
  icon: LucideIcon;
  route: string;
}

export function useMenuRows(): MenuRow[] {
  const { t } = useTranslation(NAMESPACE);
  return [
    { label: t("account.editProfile"), icon: UserPen, route: "/(profile)/edit-profile" },
    { label: t("password.changePassword"), icon: KeyRound, route: "/(profile)/change-password" },
    { label: t("orders.title"), icon: PackageSearch, route: "/(profile)/order-history" },
    { label: t("favorites.title"), icon: Heart, route: "/(profile)/favorites" },
    { label: t("impact.title"), icon: Leaf, route: "/(profile)/environmental-impact" },
    { label: t("subscription.title"), icon: Gem, route: "/(profile)/subscription" },
    { label: t("settings.title"), icon: Settings, route: "/(profile)/settings" },
  ];
}
