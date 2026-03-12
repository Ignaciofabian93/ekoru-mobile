import { Text } from "@/components/shared/Text/Text";
import { Title } from "@/components/shared/Title/Title";
import Colors from "@/constants/Colors";
import { X } from "lucide-react-native";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  TextInput,
  View,
} from "react-native";
import type { ProductFilters } from "../hooks/useProductFilters";
import { DEFAULT_FILTERS } from "../hooks/useProductFilters";
import { NAMESPACE } from "../i18n";
import type { ProductCondition } from "../types/Product";

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

export default function ProductFiltersSheet({
  visible,
  initialFilters,
  onApply,
  onClose,
}: Props) {
  const { t } = useTranslation(NAMESPACE);
  const [draft, setDraft] = useState<ProductFilters>(initialFilters);

  useEffect(() => {
    if (visible) setDraft(initialFilters);
  }, [visible]);

  const toggleCondition = (c: ProductCondition) => {
    setDraft((prev) => ({
      ...prev,
      conditions: prev.conditions.includes(c)
        ? prev.conditions.filter((x) => x !== c)
        : [...prev.conditions, c],
    }));
  };

  const handleApply = () => {
    onApply(draft);
    onClose();
  };

  const handleReset = () => {
    onApply(DEFAULT_FILTERS);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.sheet}>
        {/* Header */}
        <View style={styles.sheetHeader}>
          <Title level="h5" weight="semibold">
            {t("filters")}
          </Title>
          <Pressable onPress={onClose} hitSlop={10}>
            <X size={20} color={Colors.foreground} strokeWidth={2} />
          </Pressable>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          {/* Brand */}
          <View style={styles.section}>
            <Text size="sm" weight="semibold" style={styles.sectionLabel}>
              {t("brand")}
            </Text>
            <TextInput
              style={styles.input}
              placeholder={t("brandPlaceholder")}
              placeholderTextColor={Colors.foregroundTertiary}
              value={draft.brand}
              onChangeText={(t) => setDraft((prev) => ({ ...prev, brand: t }))}
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
                placeholderTextColor={Colors.foregroundTertiary}
                keyboardType="numeric"
                value={draft.minPrice}
                onChangeText={(t) =>
                  setDraft((prev) => ({ ...prev, minPrice: t }))
                }
              />
              <Text size="sm" color="tertiary">
                –
              </Text>
              <TextInput
                style={[styles.input, styles.priceInput]}
                placeholder={t("max")}
                placeholderTextColor={Colors.foregroundTertiary}
                keyboardType="numeric"
                value={draft.maxPrice}
                onChangeText={(t) =>
                  setDraft((prev) => ({ ...prev, maxPrice: t }))
                }
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
                const active = draft.conditions.includes(c);
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
                value={draft.isExchangeable === true}
                onValueChange={(v) =>
                  setDraft((prev) => ({
                    ...prev,
                    isExchangeable: v ? true : null,
                  }))
                }
                trackColor={{
                  false: Colors.backgroundTertiary,
                  true: Colors.primary,
                }}
                thumbColor={Colors.surface}
              />
            </View>
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <Pressable style={styles.resetBtn} onPress={handleReset}>
            <Text
              size="sm"
              weight="medium"
              style={{ color: Colors.foregroundSecondary }}
            >
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
    backgroundColor: Colors.surface,
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
    borderColor: Colors.borderLight,
  },
  content: {
    paddingHorizontal: 20,
  },
  section: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: Colors.borderLight,
  },
  sectionLast: {
    borderBottomWidth: 0,
  },
  sectionLabel: {
    marginBottom: 10,
    color: Colors.foreground,
  },
  input: {
    height: 42,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    paddingHorizontal: 12,
    backgroundColor: Colors.backgroundSecondary,
    color: Colors.foreground,
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
    borderColor: Colors.borderLight,
    backgroundColor: Colors.backgroundSecondary,
  },
  chipActive: {
    backgroundColor: Colors.primaryDark,
    borderColor: Colors.primaryDark,
  },
  chipText: {
    color: Colors.foreground,
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
    borderColor: Colors.borderLight,
  },
  resetBtn: {
    flex: 1,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  applyBtn: {
    flex: 2,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: Colors.primaryDark,
  },
});
