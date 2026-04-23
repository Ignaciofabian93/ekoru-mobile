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
  View,
} from "react-native";
import { DEFAULT_FILTERS, type StoreFilters } from "../hooks/useStoreFilters";
import { NAMESPACE } from "../i18n";

const RATING_OPTIONS = [3, 3.5, 4, 4.5, 5];
const ALL_TAGS = [
  "Organic",
  "Zero Waste",
  "Fair Trade",
  "Clothing",
  "Tech",
  "Plants",
  "Home",
  "Energy",
];

interface Props {
  visible: boolean;
  initialFilters: StoreFilters;
  onApply: (filters: StoreFilters) => void;
  onClose: () => void;
}

export default function StoreFiltersSheet({
  visible,
  initialFilters,
  onApply,
  onClose,
}: Props) {
  const { t } = useTranslation(NAMESPACE);
  const [draft, setDraft] = useState<StoreFilters>(initialFilters);

  useEffect(() => {
    if (visible) setDraft(initialFilters);
  }, [visible]);

  const toggleTag = (tag: string) => {
    setDraft((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
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
          {/* Verified */}
          <View style={[styles.section, styles.toggleRow]}>
            <View style={{ flex: 1 }}>
              <Text size="sm" weight="semibold">
                {t("filterVerified")}
              </Text>
              <Text size="xs" color="tertiary" style={{ marginTop: 2 }}>
                {t("filterVerifiedSubtitle")}
              </Text>
            </View>
            <Switch
              value={draft.verified === true}
              onValueChange={(v) =>
                setDraft((prev) => ({ ...prev, verified: v ? true : null }))
              }
              trackColor={{
                false: Colors.backgroundTertiary,
                true: Colors.primary,
              }}
              thumbColor={Colors.surface}
            />
          </View>

          {/* Minimum rating */}
          <View style={styles.section}>
            <Text size="sm" weight="semibold" style={styles.sectionLabel}>
              {t("filterMinRating")}
            </Text>
            <View style={styles.chips}>
              {RATING_OPTIONS.map((r) => {
                const active = draft.minRating === r;
                return (
                  <Pressable
                    key={r}
                    onPress={() =>
                      setDraft((prev) => ({
                        ...prev,
                        minRating: active ? null : r,
                      }))
                    }
                    style={[styles.chip, active && styles.chipActive]}
                  >
                    <Text
                      size="xs"
                      weight={active ? "semibold" : "normal"}
                      style={active ? styles.chipTextActive : styles.chipText}
                    >
                      ★ {r}+
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Tags */}
          <View style={[styles.section, styles.sectionLast]}>
            <Text size="sm" weight="semibold" style={styles.sectionLabel}>
              {t("filterTags")}
            </Text>
            <View style={styles.chips}>
              {ALL_TAGS.map((tag) => {
                const active = draft.tags.includes(tag);
                return (
                  <Pressable
                    key={tag}
                    onPress={() => toggleTag(tag)}
                    style={[styles.chip, active && styles.chipActive]}
                  >
                    <Text
                      size="xs"
                      weight={active ? "semibold" : "normal"}
                      style={active ? styles.chipTextActive : styles.chipText}
                    >
                      {tag}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </ScrollView>

        {/* Footer */}
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
    backgroundColor: Colors.surface,
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
    borderColor: Colors.borderLight,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 8,
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
    marginBottom: 12,
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  chipActive: {
    backgroundColor: Colors.primary,
    borderColor: "transparent",
  },
  chipText: {
    color: Colors.foregroundSecondary,
  },
  chipTextActive: {
    color: "#fff",
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
    borderColor: Colors.borderStrong,
  },
  applyBtn: {
    flex: 2,
    height: 44,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary,
  },
  applyLabel: {
    color: "#fff",
  },
});
