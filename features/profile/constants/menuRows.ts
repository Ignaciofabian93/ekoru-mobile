import {
  Gem,
  Heart,
  KeyRound,
  Leaf,
  type LucideIcon,
  PackageSearch,
  Settings,
  ShieldCheck,
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
    { label: t("editProfile"),        icon: UserPen,       route: "/(profile)/edit-profile" },
    { label: t("changePassword"),     icon: KeyRound,      route: "/(profile)/change-password" },
    { label: t("twoFaTitle"),         icon: ShieldCheck,   route: "/(profile)/two-factor-auth" },
    { label: t("orderHistory"),       icon: PackageSearch, route: "/(profile)/order-history" },
    { label: t("favorites"),          icon: Heart,         route: "/(profile)/favorites" },
    { label: t("environmentalImpact"),icon: Leaf,          route: "/(profile)/environmental-impact" },
    { label: t("subscription"),       icon: Gem,           route: "/(profile)/subscription" },
    { label: t("settings"),           icon: Settings,      route: "/(profile)/settings" },
  ];
}
