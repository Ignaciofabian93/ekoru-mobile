import { Text } from "@/components/Primitives/Text/Text";
import { Title } from "@/components/Primitives/Title/Title";
import { colors } from "@/design/tokens";
import useBlogPosts from "@/features/blog/hooks/useBlogPosts";
import { NAMESPACE } from "@/features/blog/i18n";
import BlogPostCard from "@/features/blog/ui/BlogPostCard";
import { useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";

export default function BlogCategory() {
  const { t, i18n } = useTranslation(NAMESPACE);
  const { slug, name } = useLocalSearchParams<{ slug: string; name: string }>();
  const { posts, loading } = useBlogPosts({
    categorySlug: slug ?? "",
    language: i18n.language,
  });

  if (loading && posts.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.body}>
        <Title level="h4" weight="bold">
          {name ?? t("articles")}
        </Title>
        <Text size="sm" color="secondary" style={{ marginTop: 2, marginBottom: 16 }}>
          {t("blogCategorySubtitle")}
        </Text>

        {posts.length === 0 ? (
          <Text size="sm" color="tertiary">
            {t("noArticles")}
          </Text>
        ) : (
          <View style={styles.list}>
            {posts.map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: 32 },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
  body: { paddingHorizontal: 16, paddingTop: 16 },
  list: { gap: 10 },
});
