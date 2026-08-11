import { Text } from "@/components/Primitives/Text/Text";
import { Title } from "@/components/Primitives/Title/Title";
import { colors } from "@/design/tokens";
import useServicesByCategory from "@/features/services/hooks/useServicesByCategory";
import { NAMESPACE } from "@/features/services/i18n";
import ServiceList from "@/features/services/ui/ServiceList";
import { router, useLocalSearchParams, type Href } from "expo-router";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from "react-native";

export default function ServiceCategory() {
  const { t, i18n } = useTranslation(NAMESPACE);
  const { slug, name } = useLocalSearchParams<{ slug: string; name: string }>();
  const { serviceCategory, services, loading } = useServicesByCategory({
    slug: slug ?? "",
    language: i18n.language,
  });

  if (loading && services.length === 0 && !serviceCategory) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  const catName =
    name ?? serviceCategory?.translation?.category ?? serviceCategory?.category ?? t("services");
  const subs = serviceCategory?.subcategories ?? [];

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
          {t("serviceCategorySubtitle")}
        </Text>

        {subs.length > 0 && (
          <View style={styles.chips}>
            {subs.map((sc) => {
              const label = sc.translation?.subCategory ?? sc.subCategory;
              const scSlug = sc.translation?.slug ?? sc.href ?? "";
              return (
                <Pressable
                  key={sc.id}
                  style={({ pressed }) => [styles.chip, pressed && styles.chipPressed]}
                  onPress={() =>
                    router.push({
                      pathname: "/(services)/service-subcategory",
                      params: { slug: scSlug, name: label },
                    } as unknown as Href)
                  }
                >
                  <Text size="sm" weight="medium" style={styles.chipText}>
                    {label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        )}

        <Title level="h5" weight="semibold" style={{ marginBottom: 12 }}>
          {t("services")}
        </Title>
        <ServiceList services={services} />
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
  body: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 24,
  },
  chip: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  chipPressed: {
    backgroundColor: colors.background,
    borderColor: colors.borderFocus,
  },
  chipText: {
    color: colors.foreground,
  },
});
