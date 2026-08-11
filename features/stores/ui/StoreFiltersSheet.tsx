import { Text } from "@/components/Primitives/Text/Text";
import { Title } from "@/components/Primitives/Title/Title";
import { colors } from "@/design/tokens";
import { X } from "lucide-react-native";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, Pressable, ScrollView, StyleSheet, Switch, TextInput, View } from "react-native";
import { EMPTY_FILTERS, type StoreFilters } from "../types";
import { NAMESPACE } from "../i18n";

interface Props {
  visible: boolean;
  initialFilters: StoreFilters;
  onApply: (filters: StoreFilters) => void;
  onClose: () => void;
}

export default function StoreFiltersSheet({ visible, initialFilters, onApply, onClose }: Props) {
  const { t } = useTranslation(NAMESPACE);
  const [draft, setDraft] = useState<StoreFilters>(initialFilters);

  useEffect(() => {
    if (visible) setDraft(initialFilters);
  }, [visible]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleApply = () => {
    onApply(draft);
    onClose();
  };

  const handleReset = () => {
    onApply(EMPTY_FILTERS);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent statusBarTranslucent onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.sheet}>
        <View style={styles.sheetHeader}>
          <Title level="h5" weight="semibold">
            {t("filters")}
          </Title>
          <Pressable onPress={onClose} hitSlop={10}>
            <X size={20} color={colors.foreground} strokeWidth={2} />
          </Pressable>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          {/* Search */}
          <View style={styles.section}>
            <Text size="sm" weight="semibold" style={styles.sectionLabel}>
              {t("searchLabel")}
            </Text>
            <TextInput
              style={styles.input}
              placeholder={t("searchStores")}
              placeholderTextColor={colors.foregroundTertiary}
              value={draft.search}
              onChangeText={(value) => setDraft((prev) => ({ ...prev, search: value }))}
            />
          </View>

          {/* Price range */}
          <View style={styles.section}>
            <Text size="sm" weight="semibold" style={styles.sectionLabel}>
              {t("priceRange")}
            </Text>
            <View style={styles.priceRow}>
              <TextInput
                style={[styles.input, styles.priceInput]}
                placeholder={t("min")}
                placeholderTextColor={colors.foregroundTertiary}
                keyboardType="numeric"
                value={draft.minPrice}
                onChangeText={(value) => setDraft((prev) => ({ ...prev, minPrice: value }))}
              />
              <Text size="sm" color="tertiary">
                –
              </Text>
              <TextInput
                style={[styles.input, styles.priceInput]}
                placeholder={t("max")}
                placeholderTextColor={colors.foregroundTertiary}
                keyboardType="numeric"
                value={draft.maxPrice}
                onChangeText={(value) => setDraft((prev) => ({ ...prev, maxPrice: value }))}
              />
            </View>
          </View>

          {/* On offer */}
          <View style={[styles.section, styles.sectionLast]}>
            <View style={styles.toggleRow}>
              <View style={{ flex: 1 }}>
                <Text size="sm" weight="semibold">
                  {t("onOfferOnly")}
                </Text>
                <Text size="xs" color="tertiary" style={{ marginTop: 2 }}>
                  {t("onOfferSubtitle")}
                </Text>
              </View>
              <Switch
                value={draft.onOfferOnly}
                onValueChange={(v) => setDraft((prev) => ({ ...prev, onOfferOnly: v }))}
                trackColor={{ false: colors.backgroundTertiary, true: colors.primary }}
                thumbColor={colors.surface}
              />
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Pressable style={styles.resetBtn} onPress={handleReset}>
            <Text size="sm" weight="semibold" color="secondary">
              {t("reset")}
            </Text>
          </Pressable>
          <Pressable style={styles.applyBtn} onPress={handleApply}>
            <Text size="sm" weight="bold" style={styles.applyLabel}>
              {t("applyFilters")}
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
    paddingBottom: 24,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: colors.borderLight,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  section: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: colors.borderLight,
  },
  sectionLast: {
    borderBottomWidth: 0,
  },
  sectionLabel: {
    marginBottom: 12,
  },
  input: {
    height: 42,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.borderLight,
    paddingHorizontal: 12,
    backgroundColor: colors.backgroundSecondary,
    color: colors.foreground,
    fontSize: 14,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  priceInput: {
    flex: 1,
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  footer: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  resetBtn: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
  applyBtn: {
    flex: 2,
    height: 44,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
  },
  applyLabel: {
    color: "#fff",
  },
});
