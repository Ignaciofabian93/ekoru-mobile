import { Text } from "@/components/Primitives/Text/Text";
import { colors } from "@/design/tokens";
import Header from "@/features/marketplace/ui/header/Header";
import {
  ContentContainer,
  OuterContainer,
  ScrollContainer,
} from "@/features/marketplace/ui/layout/Container";
import useStoreCatalog from "@/features/stores/hooks/useStoreCatalog";
import { NAMESPACE } from "@/features/stores/i18n";
import type { Language } from "@/features/stores/types";
import StoreCategoryList from "@/features/stores/ui/StoreCategoryList";
import { Leaf } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View } from "react-native";

const wallpaperImage = require("@/assets/images/wallpaper-2.jpg");

export default function StoresScreen() {
  const { t, i18n } = useTranslation(NAMESPACE);
  const { categories, loading } = useStoreCatalog(
    i18n.language.toUpperCase() as Language,
  );

  return (
    <OuterContainer enableBottomInset>
      <ScrollContainer>
        <Header wallpaperImage={wallpaperImage} title={t("stores")} subtitle={t("headerSubtitle")} />
        <ContentContainer>
          {/* ── Store categories (live) ────────────────────────────── */}
          <StoreCategoryList categories={categories} loading={loading} />

          {/* ── Sell banner ────────────────────────────────────────── */}
          <View style={styles.banner}>
            <View style={styles.bannerIcon}>
              <Leaf size={20} color={colors.primary} strokeWidth={2} />
            </View>
            <Text size="sm" weight="medium" style={styles.bannerText} numberOfLines={2}>
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
    </OuterContainer>
  );
}

const styles = StyleSheet.create({
  banner: {
    marginTop: 32,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.borderFocus,
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
    color: colors.primaryDark,
  },
  openBtn: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: colors.primaryDark,
    borderRadius: 8,
  },
  openLabel: {
    color: "#fff",
  },
});
