import { Text } from "@/components/shared/Text/Text";
import { Title } from "@/components/shared/Title/Title";
import { colors } from "@/design/tokens";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { ChevronRight, SlidersHorizontal } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { NAMESPACE } from "../i18n";
import type { Department } from "../types/Department";
import DepartmentsSectionSkeleton from "./skeletons/DepartmentsSectionSkeleton";

// Gradient palettes cycling for department cards
const GRADIENTS: [string, string][] = [
  [colors.primaryDark, colors.primary],
  [colors.secondaryDark, colors.secondary],
  ["#92400e", colors.accent],
  ["#1e3a5f", "#3b82f6"],
  ["#4a044e", "#a21caf"],
  ["#064e3b", "#10b981"],
];

const CARD_WIDTH = 140;
const CARD_HEIGHT = 108;

interface Props {
  departments: Department[];
  loading: boolean;
  setFiltersVisible?: (v: boolean) => void;
}

export default function DepartmentsSection({
  departments,
  loading,
  setFiltersVisible,
}: Props) {
  const { t } = useTranslation(NAMESPACE);
  if (loading) return <DepartmentsSectionSkeleton />;

  if (departments.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <View>
          <Title level="h5" weight="semibold">
            {t("browseDepartments")}
          </Title>
          <Text size="sm" color="tertiary" style={{ marginTop: 2 }}>
            {departments.length} {t("available")}
          </Text>
        </View>
        <Pressable
          style={[styles.filterBtn]}
          onPress={() => setFiltersVisible?.(true)}
        >
          <SlidersHorizontal size={18} color={colors.primary} strokeWidth={2} />
        </Pressable>
      </View>

      {/* ── Horizontal scroll row ──────────────────────────────────── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {departments.map((dept, idx) => {
          const gradient = GRADIENTS[idx % GRADIENTS.length];
          const categoryCount = dept.departmentCategory?.length ?? 0;

          return (
            <Pressable
              key={dept.id}
              onPress={() =>
                router.push({
                  pathname: "/(marketplace)/department",
                  params: {
                    slug: dept.translation.slug,
                    name: dept.translation.name,
                  },
                })
              }
              style={({ pressed }) => [
                styles.card,
                pressed && styles.cardPressed,
              ]}
            >
              <LinearGradient
                colors={gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
              >
                {/* Name */}
                <View style={{ flex: 1, justifyContent: "flex-end" }}>
                  <Text
                    size="sm"
                    weight="semibold"
                    numberOfLines={2}
                    style={styles.deptName}
                  >
                    {dept.translation.name}
                  </Text>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                  <Text size="xs" style={styles.countLabel}>
                    {categoryCount} {t("category", { count: categoryCount })}
                  </Text>
                  <ChevronRight
                    size={12}
                    color="rgba(255,255,255,0.7)"
                    strokeWidth={2}
                  />
                </View>
              </LinearGradient>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },
  sectionHeader: {
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  scroll: {
    gap: 10,
    paddingBottom: 4,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 14,
    overflow: "hidden",
  },
  cardPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },
  gradient: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 14,
    justifyContent: "space-between",
  },
  badge: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: "#fff",
  },
  deptName: {
    color: "#fff",
    lineHeight: 18,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  countLabel: {
    color: "rgba(255,255,255,0.75)",
  },
  filterBtn: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: colors.backgroundPrimaryLight,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.borderFocus,
  },
  filterBtnActive: {
    backgroundColor: colors.primaryDark,
    borderColor: colors.primaryDark,
  },
});
