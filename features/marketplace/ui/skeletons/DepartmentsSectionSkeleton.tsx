import Colors from "@/constants/Colors";
import { useEffect } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

const CARD_WIDTH = 140;
const CARD_HEIGHT = 52;
const CARD_COUNT = 4;

const SHIMMER_DURATION = 900;

function usePulse(delay = 0) {
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: delay }),
        withTiming(0.4, { duration: SHIMMER_DURATION }),
        withTiming(1, { duration: SHIMMER_DURATION }),
      ),
      -1,
      false,
    );
  }, []);

  return useAnimatedStyle(() => ({ opacity: opacity.value }));
}

function SkeletonBox({
  width,
  height,
  borderRadius = 8,
  delay = 0,
  style,
}: {
  width: number | string;
  height: number;
  borderRadius?: number;
  delay?: number;
  style?: object;
}) {
  const animatedStyle = usePulse(delay);
  return (
    <Animated.View
      style={[
        { width, height, borderRadius, backgroundColor: Colors.borderLight },
        animatedStyle,
        style,
      ]}
    />
  );
}

export default function DepartmentsSectionSkeleton() {
  return (
    <View style={styles.container}>
      {/* ── Section header ─────────────────────────────────────────── */}
      <View style={styles.sectionHeader}>
        <View style={styles.titleGroup}>
          {/* Title placeholder */}
          <SkeletonBox width={140} height={24} borderRadius={6} delay={0} />
          {/* "X available" placeholder */}
          <SkeletonBox
            width={80}
            height={12}
            borderRadius={5}
            delay={80}
            style={{ marginTop: 6 }}
          />
        </View>
        {/* Filter button placeholder */}
        <SkeletonBox width={42} height={42} borderRadius={10} delay={160} />
      </View>

      {/* ── Horizontal cards ───────────────────────────────────────── */}
      <ScrollView
        horizontal
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {Array.from({ length: CARD_COUNT }).map((_, i) => (
          <View key={i} style={styles.card}>
            <SkeletonBox
              width={CARD_WIDTH}
              height={CARD_HEIGHT}
              borderRadius={14}
              delay={i * 80}
            />
            {/* Name line */}
            <SkeletonBox
              width={CARD_WIDTH * 0.65}
              height={11}
              borderRadius={5}
              delay={i * 80 + 40}
              style={styles.cardNameLine}
            />
            {/* Category count line */}
            <SkeletonBox
              width={CARD_WIDTH * 0.45}
              height={9}
              borderRadius={4}
              delay={i * 80 + 80}
              style={styles.cardCountLine}
            />
          </View>
        ))}
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
  titleGroup: {
    gap: 0,
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
    position: "relative",
  },
  cardNameLine: {
    position: "absolute",
    bottom: 28,
    left: 12,
  },
  cardCountLine: {
    position: "absolute",
    bottom: 12,
    left: 12,
  },
});
