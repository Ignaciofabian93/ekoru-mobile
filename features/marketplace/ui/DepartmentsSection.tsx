import { Text } from "@/components/shared/Text/Text";
import { Title } from "@/components/shared/Title/Title";
import Colors from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import {
  ActivityIndicator,
  Dimensions,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import type { Department } from "../types/Department";

// Gradient palettes cycling for department cards
const GRADIENTS: [string, string][] = [
  [Colors.primaryDark, Colors.primary],
  [Colors.secondaryDark, Colors.secondary],
  ["#92400e", Colors.accent],
  ["#1e3a5f", "#3b82f6"],
  ["#4a044e", "#a21caf"],
  ["#064e3b", "#10b981"],
];

const GAP = 10;
const H_PADDING = 32; // 16px on each side (Container padding)
const CARD_WIDTH = (Dimensions.get("window").width - H_PADDING - GAP) / 2;
const CARD_HEIGHT = 108;

interface Props {
  departments: Department[];
  loading: boolean;
}

export default function DepartmentsSection({ departments, loading }: Props) {
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={Colors.primary} size="small" />
      </View>
    );
  }

  if (departments.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Title level="h5" weight="semibold">
          Browse Departments
        </Title>
        <Text size="sm" color="tertiary" style={{ marginTop: 2 }}>
          {departments.length} available
        </Text>
      </View>

      {/* ── 2-column equal-size grid ──────────────────────────────── */}
      <View style={styles.grid}>
        {departments.map((dept, idx) => {
          const gradient = GRADIENTS[idx % GRADIENTS.length];
          const categoryCount = dept.departmentCategory?.length ?? 0;
          const initials = dept.translation.name
            .split(" ")
            .slice(0, 2)
            .map((w) => w[0] ?? "")
            .join("")
            .toUpperCase();

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
                {/* Initial badge */}
                <View style={styles.badge}>
                  <Text size="sm" weight="bold" style={styles.badgeText}>
                    {initials}
                  </Text>
                </View>

                {/* Name */}
                <Text
                  size="sm"
                  weight="semibold"
                  numberOfLines={2}
                  style={styles.deptName}
                >
                  {dept.translation.name}
                </Text>

                {/* Footer */}
                <View style={styles.footer}>
                  <Text size="xs" style={styles.countLabel}>
                    {categoryCount} {categoryCount === 1 ? "cat." : "cats."}
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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: GAP,
  },
  loadingContainer: {
    marginTop: 24,
    height: 120,
    alignItems: "center",
    justifyContent: "center",
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
    padding: 12,
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
    flex: 1,
    marginTop: 4,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  countLabel: {
    color: "rgba(255,255,255,0.75)",
  },
});
