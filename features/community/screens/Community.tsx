import { Text } from "@/components/Primitives/Text/Text";
import { Title } from "@/components/Primitives/Title/Title";
import { colors } from "@/design/tokens";
import useCommunityCatalog from "@/features/community/hooks/useCommunityCatalog";
import { NAMESPACE } from "@/features/community/i18n";
import type { Language } from "@/features/community/types";
import CommunityList from "@/features/community/ui/CommunityList";
import { router, type Href } from "expo-router";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";

export default function Community() {
  const { t, i18n } = useTranslation(NAMESPACE);
  const { categories, loading } = useCommunityCatalog(
    i18n.language.toUpperCase() as Language,
  );

  const items = categories.map((c) => ({
    id: c.id,
    title: c.category,
    description: c.description,
    slug: c.slug,
  }));

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.body}>
        <Text size="sm" color="secondary" style={{ marginBottom: 8 }}>
          {t("headerSubtitle")}
        </Text>

        {loading && categories.length === 0 ? (
          <ActivityIndicator color={colors.primary} size="large" style={{ marginTop: 40 }} />
        ) : (
          <>
            <Title level="h5" weight="semibold" style={{ marginTop: 8, marginBottom: 12 }}>
              {t("browseCategories")}
            </Title>
            <CommunityList
              items={items}
              onPressItem={(item) =>
                router.push({
                  pathname: "/(community)/community-category",
                  params: { slug: item.slug, name: item.title },
                } as unknown as Href)
              }
            />
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: 32 },
  body: { paddingHorizontal: 16, paddingTop: 16 },
});
