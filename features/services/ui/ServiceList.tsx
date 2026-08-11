import { Text } from "@/components/Primitives/Text/Text";
import { Title } from "@/components/Primitives/Title/Title";
import { colors } from "@/design/tokens";
import { formatPrice } from "@/utils/formatPrice";
import { ChevronRight, Leaf, Star, Wrench } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View } from "react-native";
import { NAMESPACE } from "../i18n";
import type { ServiceNode } from "../types";

interface Props {
  services: ServiceNode[];
  onPressService?: (service: ServiceNode) => void;
  emptyMessage?: string;
}

export default function ServiceList({ services, onPressService, emptyMessage }: Props) {
  const { t } = useTranslation(NAMESPACE);

  if (services.length === 0) {
    return (
      <View style={styles.empty}>
        <View style={styles.emptyIcon}>
          <Leaf size={30} color={colors.primary} strokeWidth={1.5} />
        </View>
        <Title level="h5" weight="semibold" align="center">
          {emptyMessage ?? t("noServices")}
        </Title>
      </View>
    );
  }

  return (
    <View style={styles.list}>
      {services.map((svc) => {
        const provider = svc.seller?.profile?.businessName ?? t("provider");
        const price = svc.basePrice != null ? formatPrice(svc.basePrice) : t("quotation");
        return (
          <Pressable key={svc.id} style={styles.card} onPress={() => onPressService?.(svc)}>
            <View style={styles.iconBox}>
              <Wrench size={22} color={colors.primary} strokeWidth={1.75} />
            </View>
            <View style={styles.info}>
              <Text size="sm" weight="semibold" numberOfLines={1}>
                {svc.name}
              </Text>
              <Text size="xs" color="secondary" numberOfLines={1}>
                {provider}
              </Text>
              <View style={styles.meta}>
                {svc.serviceCategory?.subCategory ? (
                  <View style={styles.tag}>
                    <Text size="xs" weight="semibold" style={styles.tagLabel}>
                      {svc.serviceCategory.subCategory}
                    </Text>
                  </View>
                ) : null}
                {svc.averageRating != null && svc.averageRating > 0 ? (
                  <View style={styles.ratingRow}>
                    <Star size={11} color={colors.accent} fill={colors.accent} strokeWidth={0} />
                    <Text size="xs" weight="medium">
                      {svc.averageRating.toFixed(1)}
                    </Text>
                  </View>
                ) : null}
                <Text size="xs" weight="bold" color="primary">
                  {price}
                </Text>
              </View>
            </View>
            <ChevronRight size={18} color={colors.foregroundTertiary} strokeWidth={1.5} />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 10,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.borderFocus,
  },
  info: { flex: 1, gap: 3 },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 2,
  },
  tag: {
    backgroundColor: colors.background,
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: colors.borderFocus,
  },
  tagLabel: { color: colors.primaryDark, fontSize: 10 },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  empty: {
    marginTop: 48,
    alignItems: "center",
    paddingHorizontal: 40,
    gap: 8,
  },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
});
