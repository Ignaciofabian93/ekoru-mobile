import { Text } from "@/components/Primitives/Text/Text";
import { Title } from "@/components/Primitives/Title/Title";
import { colors } from "@/design/tokens";
import useServicesBySubcategory from "@/features/services/hooks/useServicesBySubcategory";
import { NAMESPACE } from "@/features/services/i18n";
import ServiceList from "@/features/services/ui/ServiceList";
import { useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";

export default function ServiceSubcategory() {
  const { t, i18n } = useTranslation(NAMESPACE);
  const { slug, name } = useLocalSearchParams<{ slug: string; name: string }>();
  const { serviceSubCategory, services, loading } = useServicesBySubcategory({
    slug: slug ?? "",
    language: i18n.language,
  });

  if (loading && services.length === 0 && !serviceSubCategory) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  const subName =
    name ??
    serviceSubCategory?.translation?.subCategory ??
    serviceSubCategory?.subCategory ??
    t("services");

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
        <Text size="sm" color="secondary" style={{ marginTop: 2, marginBottom: 16 }}>
          {t("serviceSubcategorySubtitle")}
        </Text>
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
});
