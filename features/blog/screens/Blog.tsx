import { Text } from "@/components/Primitives/Text/Text";
import { colors } from "@/design/tokens";
import useBlogCatalog from "@/features/blog/hooks/useBlogCatalog";
import { NAMESPACE } from "@/features/blog/i18n";
import type { Language } from "@/features/blog/types";
import BlogCategoryList from "@/features/blog/ui/BlogCategoryList";
import { Search } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";

export default function Blog() {
  const { t, i18n } = useTranslation(NAMESPACE);
  const { categories, loading } = useBlogCatalog(
    i18n.language.toUpperCase() as Language,
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Search size={16} color={colors.foregroundTertiary} strokeWidth={2} />
          <Text size="sm" color="tertiary">
            {t("searchArticles")}
          </Text>
        </View>
      </View>

      <View style={styles.body}>
        {loading && categories.length === 0 ? (
          <ActivityIndicator color={colors.primary} size="large" style={{ marginTop: 40 }} />
        ) : (
          <BlogCategoryList categories={categories} loading={loading} />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: 32 },
  searchRow: { paddingHorizontal: 16, paddingVertical: 14 },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 40,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  body: { paddingHorizontal: 16 },
});
