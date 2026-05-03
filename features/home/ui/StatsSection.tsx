import { Text } from "@/components/shared/Text/Text";
import { Title } from "@/components/shared/Title/Title";
import { colors } from "@/design/tokens";
import { LinearGradient } from "expo-linear-gradient";
import {
  Package2,
  ScanBarcode,
  Store,
  TrendingUp,
  UsersRound,
} from "lucide-react-native";
import { ScrollView, StyleSheet, View } from "react-native";

const STATS = [
  { label: "Active Users", value: "1,234", Icon: UsersRound },
  { label: "Products Listed", value: "567", Icon: Package2 },
  { label: "Eco Stores", value: "89", Icon: Store },
  { label: "Eco Services", value: "45", Icon: ScanBarcode },
  { label: "Active Initiatives", value: "12", Icon: TrendingUp },
];

export default function StatsSection() {
  return (
    <View style={styles.container}>
      <Title level="h4" align="center">This is already happening</Title>
      <Text size="sm" color="secondary" align="center" style={{ marginTop: 6 }}>
        An active community changing the way we consume.
      </Text>

      <View style={styles.track}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          scrollEnabled={false}
          contentContainerStyle={styles.ticker}
        >
          {STATS.map((stat, i) => (
            <StatItem
              key={i}
              label={stat.label}
              value={stat.value}
              Icon={stat.Icon}
            />
          ))}
        </ScrollView>

        <LinearGradient
          colors={["#ffffff", "transparent"]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.fadeLeft}
          pointerEvents="none"
        />
        <LinearGradient
          colors={["transparent", "#ffffff"]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.fadeRight}
          pointerEvents="none"
        />
      </View>

      <Text variant="small" color="tertiary" align="center">
        Products, stores, and services already part of the circular economy.
      </Text>
    </View>
  );
}

function StatItem({
  label,
  value,
  Icon,
}: {
  label: string;
  value: string;
  Icon: any;
}) {
  return (
    <View style={styles.item}>
      <Icon size={14} color={colors.primary} strokeWidth={2} />
      <Text size="lg" weight="bold">{value}</Text>
      <Text size="sm" color="secondary">{label}</Text>
      <View style={styles.dot} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 0,
    marginBottom: 0,
  },
  track: {
    marginTop: 20,
    marginBottom: 12,
    overflow: "hidden",
    paddingVertical: 14,
    borderColor: colors.borderStrong,
  },
  ticker: {
    flexDirection: "row",
    alignItems: "center",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 20,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginLeft: 8,
    opacity: 0.6,
  },
  fadeLeft: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 48,
  },
  fadeRight: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: 48,
  },
});
