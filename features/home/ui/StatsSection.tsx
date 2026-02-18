import Colors from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import {
  Package2,
  ScanBarcode,
  Store,
  TrendingUp,
  UsersRound,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import { PixelRatio, StyleSheet, Text, View } from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

// px/ms — adjust to taste
const SPEED = 0.038;

const STATS = [
  { label: "Active Users", value: "1,234", Icon: UsersRound },
  { label: "Products Listed", value: "567", Icon: Package2 },
  { label: "Eco Stores", value: "89", Icon: Store },
  { label: "Eco Services", value: "45", Icon: ScanBarcode },
  { label: "Active Initiatives", value: "12", Icon: TrendingUp },
];

export default function StatsSection() {
  const translateX = useSharedValue(0);
  const [setWidth, setSetWidth] = useState(0);

  useEffect(() => {
    if (setWidth === 0) return;
    cancelAnimation(translateX);
    // Animate from 0 → -setWidth so withRepeat always resets to 0,
    // which is visually identical to -setWidth (copy 2 takes copy 1's place).
    translateX.value = withRepeat(
      withTiming(-setWidth, {
        duration: setWidth / SPEED,
        easing: Easing.linear,
      }),
      -1,
      false,
    );
  }, [setWidth]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>This is already happening</Text>
      <Text style={styles.subtitle}>
        An active community changing the way we consume.
      </Text>

      <View style={styles.track}>
        <Animated.View style={[styles.ticker, animStyle]}>
          {/* First copy — wrapped so onLayout measures exactly one set's width */}
          <View
            style={styles.copy}
            onLayout={(e) => {
              if (setWidth !== 0) return;
              setSetWidth(
                PixelRatio.roundToNearestPixel(e.nativeEvent.layout.width),
              );
            }}
          >
            {STATS.map((stat, i) => (
              <StatItem
                key={`a${i}`}
                label={stat.label}
                value={stat.value}
                Icon={stat.Icon}
              />
            ))}
          </View>
          {/* Second copy — seamless continuation */}
          <View style={styles.copy}>
            {STATS.map((stat, i) => (
              <StatItem
                key={`b${i}`}
                label={stat.label}
                value={stat.value}
                Icon={stat.Icon}
              />
            ))}
          </View>
        </Animated.View>

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

      <Text style={styles.caption}>
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
      <Icon size={14} color={Colors.primary} strokeWidth={2} />
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.dot} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 48,
    marginBottom: 24,
  },
  heading: {
    fontSize: 20,
    fontFamily: "Cabin_700Bold",
    color: Colors.foreground,
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    fontSize: 14,
    fontFamily: "Cabin_400Regular",
    color: Colors.foregroundSecondary,
    marginTop: 6,
  },
  track: {
    marginVertical: 20,
    overflow: "hidden",
    paddingVertical: 14,
    // borderTopWidth: StyleSheet.hairlineWidth,
    // borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.borderStrong,
  },
  ticker: {
    flexDirection: "row",
    alignItems: "center",
  },
  copy: {
    flexDirection: "row",
    alignItems: "center",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 20,
  },
  value: {
    fontSize: 17,
    fontFamily: "Cabin_700Bold",
    color: Colors.foreground,
  },
  label: {
    fontSize: 13,
    fontFamily: "Cabin_400Regular",
    color: Colors.foregroundSecondary,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: Colors.primary,
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
  caption: {
    textAlign: "center",
    fontSize: 11,
    fontFamily: "Cabin_400Regular",
    color: Colors.foregroundTertiary,
  },
});
