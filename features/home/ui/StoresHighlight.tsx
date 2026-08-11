import { Text } from "@/components/Primitives/Text/Text";
import { Title } from "@/components/Primitives/Title/Title";
import { colors } from "@/design/tokens";
import useStoreCatalog from "@/features/stores/hooks/useStoreCatalog";
import type { Language } from "@/features/stores/types";
import { router } from "expo-router";
import { Store } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";

export default function StoresHighlight() {
  const { i18n } = useTranslation();
  const { categories } = useStoreCatalog(i18n.language.toUpperCase() as Language);

  if (categories.length === 0) return null;

  return (
    <View style={styles.container}>
      <Title level="h4" align="center">
        Outstanding Stores
      </Title>
      <Text size="sm" color="secondary" align="center" style={{ marginTop: 4 }}>
        Explore eco-friendly store categories
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {categories.slice(0, 8).map((cat) => (
          <Pressable
            key={cat.id}
            style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
            onPress={() =>
              router.push({
                pathname: "/(stores)/store-category",
                params: { slug: cat.slug, name: cat.name },
              })
            }
          >
            <View style={styles.icon}>
              <Store size={24} color={colors.primary} strokeWidth={1.8} />
            </View>
            <Text size="sm" weight="semibold" numberOfLines={2} align="center">
              {cat.name}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 32,
    marginBottom: 0,
  },
  scroll: {
    gap: 10,
    marginVertical: 16,
    paddingHorizontal: 2,
  },
  card: {
    width: 120,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderLight,
    alignItems: "center",
    gap: 8,
  },
  cardPressed: {
    opacity: 0.85,
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.borderFocus,
  },
});
