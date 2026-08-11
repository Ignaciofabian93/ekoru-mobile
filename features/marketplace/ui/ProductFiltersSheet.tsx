import { Text } from "@/components/Primitives/Text/Text";
import { Title } from "@/components/Primitives/Title/Title";
import { colors } from "@/design/tokens";
import type { ProductCondition } from "@/types/enums";
import { X } from "lucide-react-native";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, Pressable, ScrollView, StyleSheet, Switch, TextInput, View } from "react-native";
import { EMPTY_FILTERS, type ProductFilters } from "../types";
import { NAMESPACE } from "../i18n";

const CONDITIONS: ProductCondition[] = [
  "NEW",
  "OPEN_BOX",
  "LIKE_NEW",
  "FAIR",
  "POOR",
  "FOR_PARTS",
  "REFURBISHED",
];

const CONDITION_KEY: Record<ProductCondition, string> = {
  NEW: "conditionNew",
  OPEN_BOX: "conditionOpenBox",
  LIKE_NEW: "conditionLikeNew",
  FAIR: "conditionFair",
  POOR: "conditionPoor",
  FOR_PARTS: "conditionForParts",
  REFURBISHED: "conditionRefurbished",
};

interface Props {
  visible: boolean;
  initialFilters: ProductFilters;
  onApply: (filters: ProductFilters) => void;
  onClose: () => void;
}

export default function ProductFiltersSheet({ visible, initialFilters, onApply, onClose }: Props) {
  const { t } = useTranslation(NAMESPACE);
  const [draft, setDraft] = useState<ProductFilters>(initialFilters);

  useEffect(() => {
    if (visible) setDraft(initialFilters);
  }, [visible]); // eslint-disable-line react-hooks/exhaustive-deps

  // Single-select condition: tapping the active chip clears it.
  const toggleCondition = (c: ProductCondition) => {
    setDraft((prev) => ({ ...prev, condition: prev.condition === c ? "" : c }));
  };

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
        {/* Header */}
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
              placeholder={t("searchPlaceholder")}
              placeholderTextColor={colors.foregroundTertiary}
              value={draft.search}
              onChangeText={(value) => setDraft((prev) => ({ ...prev, search: value }))}
            />
          </View>

          {/* Price Range */}
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

          {/* Condition */}
          <View style={styles.section}>
            <Text size="sm" weight="semibold" style={styles.sectionLabel}>
              {t("condition")}
            </Text>
            <View style={styles.chips}>
              {CONDITIONS.map((c) => {
                const active = draft.condition === c;
                return (
                  <Pressable
                    key={c}
                    onPress={() => toggleCondition(c)}
                    style={[styles.chip, active && styles.chipActive]}
                  >
                    <Text
                      size="xs"
                      weight={active ? "semibold" : "normal"}
                      style={active ? styles.chipTextActive : styles.chipText}
                    >
                      {t(CONDITION_KEY[c])}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Exchangeable */}
          <View style={[styles.section, styles.sectionLast]}>
            <View style={styles.toggleRow}>
              <View style={{ flex: 1 }}>
                <Text size="sm" weight="semibold">
                  {t("exchangeable")}
                </Text>
                <Text size="xs" color="tertiary" style={{ marginTop: 2 }}>
                  {t("exchangeableSubtitle")}
                </Text>
              </View>
              <Switch
                value={draft.isExchangeable}
                onValueChange={(v) => setDraft((prev) => ({ ...prev, isExchangeable: v }))}
                trackColor={{
                  false: colors.backgroundTertiary,
                  true: colors.primary,
                }}
                thumbColor={colors.surface}
              />
            </View>
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <Pressable style={styles.resetBtn} onPress={handleReset}>
            <Text size="sm" weight="medium" style={{ color: colors.foregroundSecondary }}>
              {t("reset")}
            </Text>
          </Pressable>
          <Pressable style={styles.applyBtn} onPress={handleApply}>
            <Text size="sm" weight="semibold" style={{ color: "#fff" }}>
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
    maxHeight: "82%",
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
    marginBottom: 10,
    color: colors.foreground,
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
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.borderLight,
    backgroundColor: colors.backgroundSecondary,
  },
  chipActive: {
    backgroundColor: colors.primaryDark,
    borderColor: colors.primaryDark,
  },
  chipText: {
    color: colors.foreground,
  },
  chipTextActive: {
    color: "#fff",
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  footer: {
    flexDirection: "row",
    gap: 12,
    padding: 16,
    borderTopWidth: 1,
    borderColor: colors.borderLight,
  },
  resetBtn: {
    flex: 1,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  applyBtn: {
    flex: 2,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: colors.primaryDark,
  },
});
