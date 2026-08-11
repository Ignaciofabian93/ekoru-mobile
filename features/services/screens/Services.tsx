import { Text } from "@/components/Primitives/Text/Text";
import { colors } from "@/design/tokens";
import useServicesCatalog from "@/features/services/hooks/useServicesCatalog";
import { NAMESPACE } from "@/features/services/i18n";
import type { Language } from "@/features/services/types";
import ServiceCategoryList from "@/features/services/ui/ServiceCategoryList";
import { ChevronRight, Search, Wrench } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from "react-native";

export default function Services() {
  const { t, i18n } = useTranslation(NAMESPACE);
  const { categories, loading } = useServicesCatalog(
    i18n.language.toUpperCase() as Language,
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Search (static entry point) */}
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Search size={16} color={colors.foregroundTertiary} strokeWidth={2} />
          <Text size="sm" color="tertiary">
            {t("searchServices")}
          </Text>
        </View>
      </View>

      <View style={styles.body}>
        {loading && categories.length === 0 ? (
          <ActivityIndicator color={colors.primary} size="large" style={{ marginTop: 40 }} />
        ) : (
          <ServiceCategoryList categories={categories} loading={loading} />
        )}

        {/* CTA */}
        <Pressable style={styles.ctaBanner}>
          <Wrench size={20} color={colors.primaryDark} strokeWidth={1.75} />
          <Text size="sm" weight="semibold" style={styles.ctaText}>
            {t("offerService")}
          </Text>
          <ChevronRight size={18} color={colors.primaryDark} strokeWidth={2} />
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: 32 },
  searchRow: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
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
  body: {
    paddingHorizontal: 16,
  },
  ctaBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 24,
    padding: 16,
    backgroundColor: colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderFocus,
  },
  ctaText: { flex: 1, color: colors.primaryDark },
});
