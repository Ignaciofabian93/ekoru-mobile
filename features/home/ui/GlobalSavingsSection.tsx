import { Text as AppText } from "@/components/shared/Text/Text";
import { Title } from "@/components/shared/Title/Title";
import Colors from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import { Droplets, Leaf, Recycle, Users2, ArrowUpRight } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

// ─── Count-up hook ────────────────────────────────────────────────────────────

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function useCountUp(target: number, duration = 1800): number {
  const [value, setValue] = useState(0);
  const rafRef = useRef<ReturnType<typeof requestAnimationFrame> | null>(null);

  useEffect(() => {
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setValue(Math.round(target * easeOutCubic(progress)));
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration]);

  return value;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

// Platform-wide impact stats (dummy data — replace with API)
const PLATFORM = {
  co2Tons: 147.3,
  waterMillionL: 2.84,
  wasteTons: 38.6,
  products: 12400,
  members: 8200,
};

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Large hero card — CO₂ */
function Co2Card() {
  // Count from 0 → 1473 then display as X.Xt
  const raw = useCountUp(Math.round(PLATFORM.co2Tons * 10));
  const display = (raw / 10).toFixed(1);

  return (
    <LinearGradient
      colors={[Colors.primaryDark, Colors.primary, Colors.primaryDark]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.heroBg}
    >
      <View style={styles.heroContent}>
        <View style={styles.metricHeader}>
          <View style={styles.iconBadge}>
            <Leaf size={20} color={Colors.primaryDark} strokeWidth={2} />
          </View>
          <Text style={styles.heroLabel}>CO₂ Saved</Text>
          <ArrowUpRight size={16} color="rgba(255,255,255,0.6)" strokeWidth={2} />
        </View>

        <Text style={styles.heroValue}>
          {display}
          <Text style={styles.heroUnit}> t</Text>
        </Text>

        <View style={styles.heroDivider} />

        <Text style={styles.heroEquivalence}>
          ≈ {Math.round(PLATFORM.co2Tons * 4500).toLocaleString()} km not driven by car
        </Text>
      </View>
    </LinearGradient>
  );
}

/** Small metric card */
function MetricCard({
  icon: Icon,
  label,
  value,
  unit,
  equivalence,
  accentColor,
  bgColor,
}: {
  icon: typeof Leaf;
  label: string;
  value: string;
  unit: string;
  equivalence: string;
  accentColor: string;
  bgColor: string;
}) {
  return (
    <View style={[styles.metricCard, { backgroundColor: bgColor }]}>
      <View style={[styles.metricIconBadge, { backgroundColor: `${accentColor}20` }]}>
        <Icon size={16} color={accentColor} strokeWidth={2} />
      </View>
      <Text style={[styles.metricLabel, { color: accentColor }]}>{label}</Text>
      <Text style={styles.metricValue}>
        {value}
        <Text style={[styles.metricUnit, { color: accentColor }]}> {unit}</Text>
      </Text>
      <Text style={styles.metricEquivalence}>{equivalence}</Text>
    </View>
  );
}

/** Community strip at the bottom */
function CommunityStrip() {
  const products = useCountUp(PLATFORM.products);
  const members  = useCountUp(PLATFORM.members);

  return (
    <View style={styles.strip}>
      <View style={styles.stripItem}>
        <Text style={styles.stripValue}>{products.toLocaleString()}+</Text>
        <Text style={styles.stripLabel}>Products circulated</Text>
      </View>
      <View style={styles.stripDivider} />
      <View style={styles.stripItem}>
        <Users2 size={16} color={Colors.primary} strokeWidth={2} style={styles.stripIcon} />
        <Text style={styles.stripValue}>{members.toLocaleString()}+</Text>
        <Text style={styles.stripLabel}>Community members</Text>
      </View>
    </View>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function GlobalSavingsSection() {
  // Water: count 0 → 284, display as X.XX M L
  const waterRaw = useCountUp(Math.round(PLATFORM.waterMillionL * 100));
  const waterDisplay = (waterRaw / 100).toFixed(2);

  // Waste: count 0 → 386, display as X.X t
  const wasteRaw = useCountUp(Math.round(PLATFORM.wasteTons * 10));
  const wasteDisplay = (wasteRaw / 10).toFixed(1);

  return (
    <Animated.View entering={FadeInDown.duration(500)} style={styles.container}>
      {/* Header */}
      <Title level="h4" align="center">Our Global Impact</Title>
      <AppText size="sm" color="secondary" align="center" style={{ marginTop: 4 }}>
        Together we're making a measurable difference
      </AppText>

      {/* Hero — CO₂ */}
      <Co2Card />

      {/* Water + Waste row */}
      <View style={styles.metricsRow}>
        <MetricCard
          icon={Droplets}
          label="Water Saved"
          value={waterDisplay}
          unit="M L"
          equivalence={`≈ ${Math.round(PLATFORM.waterMillionL * 1e6 / 8).toLocaleString()} showers`}
          accentColor={Colors.info}
          bgColor={`${Colors.info}12`}
        />
        <MetricCard
          icon={Recycle}
          label="Waste Diverted"
          value={wasteDisplay}
          unit="t"
          equivalence="Kept out of landfills"
          accentColor={Colors.accent}
          bgColor={`${Colors.accent}12`}
        />
      </View>

      {/* Community strip */}
      <CommunityStrip />
    </Animated.View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    marginTop: 32,
    marginBottom: 0,
    gap: 12,
  },

  // ── Hero card ──────────────────────────────────────────────────────────────
  heroBg: {
    borderRadius: 16,
    overflow: "hidden",
  },
  heroContent: {
    padding: 20,
    gap: 6,
  },
  metricHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  iconBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.9)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroLabel: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Cabin_600SemiBold",
    color: "rgba(255,255,255,0.85)",
  },
  heroValue: {
    fontSize: 52,
    fontFamily: "Cabin_700Bold",
    color: "#fff",
    letterSpacing: -1,
    lineHeight: 58,
  },
  heroUnit: {
    fontSize: 28,
    fontFamily: "Cabin_600SemiBold",
    color: "rgba(255,255,255,0.75)",
  },
  heroDivider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.2)",
    marginVertical: 4,
  },
  heroEquivalence: {
    fontSize: 13,
    fontFamily: "Cabin_400Regular",
    color: "rgba(255,255,255,0.7)",
  },

  // ── Metric cards row ───────────────────────────────────────────────────────
  metricsRow: {
    flexDirection: "row",
    gap: 12,
  },
  metricCard: {
    flex: 1,
    borderRadius: 14,
    padding: 14,
    gap: 4,
  },
  metricIconBadge: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },
  metricLabel: {
    fontSize: 11,
    fontFamily: "Cabin_600SemiBold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  metricValue: {
    fontSize: 26,
    fontFamily: "Cabin_700Bold",
    color: Colors.foreground,
    letterSpacing: -0.5,
    lineHeight: 32,
  },
  metricUnit: {
    fontSize: 14,
    fontFamily: "Cabin_600SemiBold",
  },
  metricEquivalence: {
    fontSize: 11,
    fontFamily: "Cabin_400Regular",
    color: Colors.foregroundSecondary,
    lineHeight: 15,
  },

  // ── Community strip ────────────────────────────────────────────────────────
  strip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.backgroundPrimaryLight,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: `${Colors.primary}30`,
  },
  stripItem: {
    flex: 1,
    alignItems: "center",
    gap: 2,
  },
  stripIcon: {
    marginBottom: 2,
  },
  stripDivider: {
    width: 1,
    height: 36,
    backgroundColor: `${Colors.primary}30`,
    marginHorizontal: 16,
  },
  stripValue: {
    fontSize: 22,
    fontFamily: "Cabin_700Bold",
    color: Colors.primary,
    letterSpacing: -0.5,
  },
  stripLabel: {
    fontSize: 12,
    fontFamily: "Cabin_400Regular",
    color: Colors.foregroundSecondary,
  },
});
