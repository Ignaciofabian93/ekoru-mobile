import { Text } from "@/components/Primitives/Text/Text";
import { Title } from "@/components/Primitives/Title/Title";
import { colors } from "@/design/tokens";
import useCommunitySubcategory from "@/features/community/hooks/useCommunitySubcategory";
import { NAMESPACE } from "@/features/community/i18n";
import { useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";

export default function CommunitySubcategory() {
  const { t, i18n } = useTranslation(NAMESPACE);
  const { slug, name } = useLocalSearchParams<{ slug: string; name: string }>();
  const { subcategory, loading } = useCommunitySubcategory(slug ?? "", i18n.language);

  if (loading && !subcategory) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  const subName = name ?? subcategory?.translation?.subCategory ?? t("community");
  const description =
    subcategory?.translation?.description ?? t("communitySubcategorySubtitle");

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.body}>
        <Title level="h4" weight="bold">
          {subName}
        </Title>
        <Text size="sm" color="secondary" style={{ marginTop: 2 }}>
          {description}
        </Text>

        <View style={styles.comingSoon}>
          <Text size="sm" color="tertiary">
            {t("comingSoon")}
          </Text>
        </View>
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
  comingSoon: {
    marginTop: 32,
    padding: 24,
    borderRadius: 12,
    backgroundColor: colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: colors.borderLight,
    alignItems: "center",
  },
});
