import { Text } from "@/components/shared/Text/Text";
import Colors from "@/constants/Colors";
import Header from "@/features/marketplace/ui/header/Header";
import {
  ContentContainer,
  OuterContainer,
  ScrollContainer,
} from "@/features/marketplace/ui/layout/Container";
import { DUMMY_STORES } from "@/features/stores/data/dummyStores";
import useStoreFilters from "@/features/stores/hooks/useStoreFilters";
import { NAMESPACE } from "@/features/stores/i18n";
import FeaturedStoresSection from "@/features/stores/ui/FeaturedStoresSection";
import StoreFiltersSheet from "@/features/stores/ui/StoreFiltersSheet";
import { Leaf, Search, SlidersHorizontal } from "lucide-react-native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View } from "react-native";

const wallpaperImage = require("@/assets/images/wallpaper-2.jpg");

export default function StoresScreen() {
  const { t } = useTranslation(NAMESPACE);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const {
    filters,
    applyFilters,
    hasActiveFilters,
    filteredCount,
    paginated,
    page,
    totalPages,
    itemsPerPage,
    changeItemsPerPage,
    goToPage,
  } = useStoreFilters(DUMMY_STORES);

  return (
    <OuterContainer enableBottomInset>
      <ScrollContainer>
        <Header
          wallpaperImage={wallpaperImage}
          title={t("stores")}
          subtitle={t("headerSubtitle")}
        />
        <ContentContainer>
          {/* ── Search + filter ────────────────────────────────────────── */}
          <View style={styles.searchRow}>
            <View style={styles.searchBox}>
              <Search
                size={16}
                color={Colors.foregroundTertiary}
                strokeWidth={2}
              />
              <Text size="sm" color="tertiary">
                {t("searchStores")}
              </Text>
            </View>
            <Pressable
              style={[
                styles.filterBtn,
                hasActiveFilters && styles.filterBtnActive,
              ]}
              onPress={() => setFiltersVisible(true)}
            >
              <SlidersHorizontal
                size={18}
                color={hasActiveFilters ? "#fff" : Colors.primary}
                strokeWidth={2}
              />
            </Pressable>
          </View>

          {/* ── Featured stores ────────────────────────────────────────── */}
          <FeaturedStoresSection
            stores={paginated}
            filteredCount={filteredCount}
            page={page}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            onGoToPage={goToPage}
            onChangeItemsPerPage={changeItemsPerPage}
          />

          {/* ── Sell banner ────────────────────────────────────────────── */}
          <View style={styles.banner}>
            <View style={styles.bannerIcon}>
              <Leaf size={20} color={Colors.primary} strokeWidth={2} />
            </View>
            <Text
              size="sm"
              weight="medium"
              style={styles.bannerText}
              numberOfLines={2}
            >
              {t("sellSustainably")}
            </Text>
            <Pressable style={styles.openBtn}>
              <Text size="xs" weight="semibold" style={styles.openLabel}>
                {t("openStore")}
              </Text>
            </Pressable>
          </View>
        </ContentContainer>
      </ScrollContainer>

      <StoreFiltersSheet
        visible={filtersVisible}
        initialFilters={filters}
        onApply={applyFilters}
        onClose={() => setFiltersVisible(false)}
      />
    </OuterContainer>
  );
}

const styles = StyleSheet.create({
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 16,
  },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 42,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  filterBtn: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: Colors.backgroundPrimaryLight,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.borderFocus,
  },
  filterBtnActive: {
    backgroundColor: Colors.primaryDark,
    borderColor: Colors.primaryDark,
  },
  banner: {
    marginTop: 32,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: Colors.backgroundPrimaryLight,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.borderFocus,
  },
  bannerIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  bannerText: {
    flex: 1,
    color: Colors.primaryDark,
  },
  openBtn: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: Colors.primaryDark,
    borderRadius: 8,
  },
  openLabel: {
    color: "#fff",
  },
});
