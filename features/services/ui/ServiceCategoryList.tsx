import { Text } from "@/components/Primitives/Text/Text";
import { Title } from "@/components/Primitives/Title/Title";
import { colors } from "@/design/tokens";
import { router, type Href } from "expo-router";
import { ChevronRight, Wrench } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View } from "react-native";
import { NAMESPACE } from "../i18n";
import type { ServiceCatalogItem } from "../types";

interface Props {
  categories: ServiceCatalogItem[];
  loading: boolean;
}

export default function ServiceCategoryList({ categories, loading }: Props) {
  const { t } = useTranslation(NAMESPACE);

  if (loading || categories.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Title level="h5" weight="semibold">
          {t("browseCategories")}
        </Title>
        <Text size="sm" color="tertiary" style={{ marginTop: 2 }}>
          {categories.length} {t("available")}
        </Text>
      </View>

      <View style={styles.list}>
        {categories.map((cat) => (
          <Pressable
            key={cat.id}
            style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
            onPress={() =>
              router.push({
                pathname: "/(services)/service-category",
                params: { slug: cat.slug, name: cat.name },
              } as unknown as Href)
            }
          >
            <View style={styles.avatar}>
              <Wrench size={22} color={colors.primary} strokeWidth={1.8} />
            </View>
            <View style={styles.info}>
              <Text size="sm" weight="semibold" numberOfLines={1}>
                {cat.name}
              </Text>
              <Text size="xs" color="tertiary">
                {cat.subCategoryItems.length} {t("subcategories").toLowerCase()}
              </Text>
            </View>
            <ChevronRight size={18} color={colors.foregroundTertiary} strokeWidth={2} />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  list: {
    gap: 10,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  cardPressed: {
    opacity: 0.85,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.borderFocus,
  },
  info: {
    flex: 1,
    gap: 2,
  },
});
