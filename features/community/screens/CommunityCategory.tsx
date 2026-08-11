import { Text } from "@/components/Primitives/Text/Text";
import { Title } from "@/components/Primitives/Title/Title";
import { colors } from "@/design/tokens";
import useCommunityCategory from "@/features/community/hooks/useCommunityCategory";
import { NAMESPACE } from "@/features/community/i18n";
import CommunityList from "@/features/community/ui/CommunityList";
import { router, useLocalSearchParams, type Href } from "expo-router";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";

export default function CommunityCategory() {
  const { t, i18n } = useTranslation(NAMESPACE);
  const { slug, name } = useLocalSearchParams<{ slug: string; name: string }>();
  const { category, loading } = useCommunityCategory(slug ?? "", i18n.language);

  if (loading && !category) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  const catName = name ?? category?.translation?.category ?? t("community");
  const subs = (category?.subcategories ?? []).map((s) => ({
    id: s.id,
    title: s.translation?.subCategory ?? "",
    description: s.translation?.description,
    slug: s.translation?.slug ?? "",
  }));

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.body}>
        <Title level="h4" weight="bold">
          {catName}
        </Title>
        <Text size="sm" color="secondary" style={{ marginTop: 2, marginBottom: 16 }}>
          {t("communityCategorySubtitle")}
        </Text>

        {subs.length === 0 ? (
          <Text size="sm" color="tertiary">
            {t("noSubcategories")}
          </Text>
        ) : (
          <>
            <Title level="h5" weight="semibold" style={{ marginBottom: 12 }}>
              {t("subcategories")}
            </Title>
            <CommunityList
              items={subs}
              onPressItem={(item) =>
                router.push({
                  pathname: "/(community)/community-subcategory",
                  params: { slug: item.slug, name: item.title },
                } as unknown as Href)
              }
            />
          </>
        )}

        <Text size="xs" color="tertiary" style={{ marginTop: 24 }}>
          {t("comingSoon")}
        </Text>
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
});
