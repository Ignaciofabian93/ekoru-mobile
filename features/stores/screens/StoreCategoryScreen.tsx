import Breadcrumb from "@/components/shared/BreadCrumbs/Breadcrumb";
import { Text } from "@/components/shared/Text/Text";
import { Title } from "@/components/shared/Title/Title";
import Colors from "@/constants/Colors";
import CategoryProductsSection from "@/features/marketplace/ui/CategoryProductsSection";
import Header from "@/features/marketplace/ui/header/Header";
import {
  ContentContainer,
  OuterContainer,
  ScrollContainer,
} from "@/features/marketplace/ui/layout/Container";
import useStore from "@/features/stores/hooks/useStore";
import { NAMESPACE } from "@/features/stores/i18n";
import { router, useLocalSearchParams } from "expo-router";
import { Store } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";

const wallpaperImage = require("@/assets/images/wallpaper-3.jpg");

export default function StoreCategoryScreen() {
  const { t } = useTranslation(NAMESPACE);
  const { storeId, storeName } = useLocalSearchParams<{
    storeId: string;
    storeName: string;
  }>();

  const { store, loading, error } = useStore(storeId ?? "");

  if (loading) {
    return (
      <OuterContainer>
        <View style={styles.centered}>
          <ActivityIndicator color={Colors.primary} size="large" />
        </View>
      </OuterContainer>
    );
  }

  if (error || !store) {
    return (
      <OuterContainer>
        <View style={styles.centered}>
          <View style={styles.emptyIcon}>
            <Store
              size={40}
              color={Colors.foregroundTertiary}
              strokeWidth={1.5}
            />
          </View>
          <Title level="h5" weight="semibold" align="center" color="tertiary">
            {t("storeNotFound")}
          </Title>
        </View>
      </OuterContainer>
    );
  }

  const displayName = storeName ?? store.storeName;

  return (
    <OuterContainer enableBottomInset>
      <ScrollContainer>
        <Header
          wallpaperImage={wallpaperImage}
          title={displayName}
          subtitle={t("storeCategorySubtitle")}
        />
        <ContentContainer>
          {/* ── Breadcrumb ─────────────────────────────────────────── */}
          <Breadcrumb
            items={[
              {
                label: t("stores"),
                onPress: () => router.push("/(stores)"),
              },
              { label: displayName },
            ]}
          />

          {/* ── Category chips ────────────────────────────────────── */}
          {store.storeCategories.length > 0 && (
            <View style={styles.catsSection}>
              <Text
                size="xs"
                weight="semibold"
                color="tertiary"
                style={styles.catsLabel}
              >
                {t("categories")}
              </Text>
              <View style={styles.chips}>
                {store.storeCategories.map((cat) => (
                  <Pressable
                    key={cat.id}
                    style={({ pressed }) => [
                      styles.chip,
                      pressed && styles.chipPressed,
                    ]}
                    onPress={() =>
                      router.push({
                        pathname: "/(stores)/store-subcategory",
                        params: {
                          storeId: store.id,
                          storeName: displayName,
                          categoryId: cat.id,
                          categoryName: cat.name,
                        },
                      })
                    }
                  >
                    <Text size="sm" weight="medium" style={styles.chipText}>
                      {cat.name}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          {/* ── Products ──────────────────────────────────────────── */}
          <CategoryProductsSection categoryName={displayName} />
        </ContentContainer>
      </ScrollContainer>
    </OuterContainer>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.backgroundTertiary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  catsSection: {
    marginBottom: 28,
  },
  catsLabel: {
    letterSpacing: 0.6,
    marginBottom: 10,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  chipPressed: {
    opacity: 0.75,
  },
  chipText: {
    color: Colors.foreground,
  },
});
