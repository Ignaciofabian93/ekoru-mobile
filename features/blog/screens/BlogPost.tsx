import { Text } from "@/components/Primitives/Text/Text";
import { Title } from "@/components/Primitives/Title/Title";
import { colors } from "@/design/tokens";
import useBlogPost from "@/features/blog/hooks/useBlogPost";
import { NAMESPACE } from "@/features/blog/i18n";
import { getImageUrl } from "@/utils/getImageUrl";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Image, ScrollView, StyleSheet, View } from "react-native";

function formatDate(value: string | null): string {
  if (!value) return "";
  const date = new Date(value);
  return isNaN(date.getTime()) ? "" : date.toLocaleDateString();
}

export default function BlogPost() {
  const { t, i18n } = useTranslation(NAMESPACE);
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { post, loading } = useBlogPost(slug ?? "", i18n.language);
  const [imgError, setImgError] = useState(false);

  if (loading && !post) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  if (!post) {
    return (
      <View style={styles.centered}>
        <Text size="sm" color="tertiary">
          {t("noArticles")}
        </Text>
      </View>
    );
  }

  const tr = post.translation;
  const uri = getImageUrl(post.coverImage ?? undefined);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      {uri && !imgError ? (
        <Image source={{ uri }} style={styles.hero} resizeMode="cover" onError={() => setImgError(true)} />
      ) : null}
      <View style={styles.body}>
        <Title level="h3" weight="bold">
          {tr?.title}
        </Title>
        <Text size="xs" color="tertiary" style={{ marginTop: 6, marginBottom: 16 }}>
          {formatDate(post.publishedAt)}
        </Text>
        {tr?.content ? (
          <Text size="base" style={styles.content}>
            {tr.content}
          </Text>
        ) : tr?.excerpt ? (
          <Text size="base" style={styles.content}>
            {tr.excerpt}
          </Text>
        ) : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
  hero: {
    width: "100%",
    height: 200,
    backgroundColor: colors.backgroundTertiary,
  },
  body: { paddingHorizontal: 16, paddingTop: 20 },
  content: {
    lineHeight: 24,
    color: colors.foregroundSecondary,
  },
});
