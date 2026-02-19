import Colors from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import {
  ArrowRight,
  Footprints,
  Globe,
  Leaf,
  Store,
  type LucideIcon,
} from "lucide-react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type ViewToken,
} from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

// ─── Constants ────────────────────────────────────────────────────────────────

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const SLIDE_HEIGHT = Math.round(SCREEN_HEIGHT * 0.4);
const AUTO_PLAY_INTERVAL = 4500;

// ─── Data ─────────────────────────────────────────────────────────────────────

interface SlideData {
  id: string;
  label: string;
  title: string;
  subtitle: string;
  gradient: readonly [string, string, string];
  Icon: LucideIcon;
  cta: string;
}

const SLIDES: SlideData[] = [
  {
    id: "1",
    label: "Marketplace",
    title: "Shop Sustainably",
    subtitle: "Discover pre-loved products that care for the planet",
    gradient: [Colors.primaryDark, "#2d6a0f", Colors.primary],
    Icon: Leaf,
    cta: "Explore Now",
  },
  {
    id: "2",
    label: "Eco Stores",
    title: "Local & Verified",
    subtitle: "Shop from sustainable businesses in your community",
    gradient: [Colors.secondaryDark, "#0c7b95", "#14b8a6"],
    Icon: Store,
    cta: "Find Stores",
  },
  {
    id: "3",
    label: "Impact",
    title: "Make It Count",
    subtitle: "Every eco-conscious purchase reduces your footprint",
    gradient: ["#134e4a", "#065f46", "#059669"],
    Icon: Globe,
    cta: "See Impact",
  },
  {
    id: "4",
    label: "Circular",
    title: "Close the Loop",
    subtitle: "Sell, swap & repair — give your items a second life",
    gradient: [Colors.primaryDark, "#1e4d10", Colors.secondaryDark],
    Icon: Footprints,
    cta: "Join Now",
  },
];

// ─── Dot indicator (expanding pill) ──────────────────────────────────────────

function Dot({
  index,
  scrollX,
}: {
  index: number;
  scrollX: ReturnType<typeof useSharedValue<number>>;
}) {
  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * SCREEN_WIDTH,
      index * SCREEN_WIDTH,
      (index + 1) * SCREEN_WIDTH,
    ];
    const width = interpolate(scrollX.value, inputRange, [6, 20, 6], "clamp");
    const opacity = interpolate(scrollX.value, inputRange, [0.4, 1, 0.4], "clamp");
    return { width, opacity };
  });

  return <Animated.View style={[styles.dot, animatedStyle]} />;
}

// ─── Slide ────────────────────────────────────────────────────────────────────

function SlideItem({ item }: { item: SlideData }) {
  const { Icon } = item;

  return (
    <View style={styles.slideWrapper}>
      {/* Real 3-stop diagonal gradient */}
      <LinearGradient
        colors={item.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Decorative translucent circles for depth */}
      <View style={[styles.circle, styles.circleTR]} />
      <View style={[styles.circle, styles.circleBL]} />
      <View style={[styles.circle, styles.circleMid]} />

      {/* Bottom scrim — ensures text is always readable */}
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.52)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.scrim}
        pointerEvents="none"
      />

      {/* Slide content */}
      <View style={styles.slideContent}>
        {/* Top row: icon badge + label pill */}
        <View style={styles.topRow}>
          <View style={styles.iconBadge}>
            <Icon size={18} color="#fff" strokeWidth={1.5} />
          </View>
          <View style={styles.labelPill}>
            <Text style={styles.labelText}>{item.label}</Text>
          </View>
        </View>

        {/* Bottom text block — anchored by space-between */}
        <View style={styles.textBlock}>
          <Text style={styles.slideTitle}>{item.title}</Text>
          <Text style={styles.slideSubtitle} numberOfLines={2}>
            {item.subtitle}
          </Text>
          <Pressable style={styles.ctaBtn} hitSlop={8} onPress={() => {}}>
            <Text style={styles.ctaText}>{item.cta}</Text>
            <ArrowRight size={13} color="#fff" strokeWidth={2.5} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

// ─── HeroCarousel ─────────────────────────────────────────────────────────────

export default function HeroCarousel() {
  const flatListRef = useRef<FlatList<SlideData>>(null);
  const scrollX = useSharedValue(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isUserScrolling = useRef(false);

  const startAutoPlay = useCallback(() => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    autoPlayRef.current = setInterval(() => {
      if (isUserScrolling.current) return;
      const nextIndex = (currentIndex + 1) % SLIDES.length;
      flatListRef.current?.scrollToOffset({
        offset: nextIndex * SCREEN_WIDTH,
        animated: true,
      });
    }, AUTO_PLAY_INTERVAL);
  }, [currentIndex]);

  useEffect(() => {
    startAutoPlay();
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [startAutoPlay]);

  const onScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      scrollX.value = event.nativeEvent.contentOffset.x;
    },
    [scrollX],
  );

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index != null) {
        setCurrentIndex(viewableItems[0].index);
      }
    },
  ).current;

  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;

  const onScrollBeginDrag = useCallback(() => {
    isUserScrolling.current = true;
  }, []);

  const onScrollEndDrag = useCallback(() => {
    isUserScrolling.current = false;
    startAutoPlay();
  }, [startAutoPlay]);

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <SlideItem item={item} />}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        onScrollBeginDrag={onScrollBeginDrag}
        onScrollEndDrag={onScrollEndDrag}
        decelerationRate="fast"
        getItemLayout={(_, index) => ({
          length: SCREEN_WIDTH,
          offset: SCREEN_WIDTH * index,
          index,
        })}
      />

      {/* Pill dots — bottom-right for modern look */}
      <View style={styles.dotsContainer} pointerEvents="none">
        {SLIDES.map((_, index) => (
          <Dot key={index} index={index} scrollX={scrollX} />
        ))}
      </View>

    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    height: SLIDE_HEIGHT,
  },

  // ── Slide ─────────────────────────────────────────────────────────────────
  slideWrapper: {
    width: SCREEN_WIDTH,
    height: SLIDE_HEIGHT,
    overflow: "hidden",
  },

  // ── Decorative circles ────────────────────────────────────────────────────
  circle: {
    position: "absolute",
    borderRadius: 9999,
    backgroundColor: "rgba(255,255,255,0.07)",
  },
  circleTR: {
    width: 300,
    height: 300,
    top: -100,
    right: -80,
  },
  circleBL: {
    width: 220,
    height: 220,
    bottom: -70,
    left: -70,
  },
  circleMid: {
    width: 100,
    height: 100,
    top: "28%",
    right: "22%",
    opacity: 0.5,
  },

  // ── Scrim ─────────────────────────────────────────────────────────────────
  scrim: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "65%",
  },

  // ── Content ───────────────────────────────────────────────────────────────
  slideContent: {
    flex: 1,
    padding: 20,
    paddingBottom: 46,
    justifyContent: "space-between",
  },

  // Top row
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconBadge: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
  },
  labelPill: {
    backgroundColor: "rgba(255,255,255,0.18)",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  labelText: {
    fontSize: 12,
    fontFamily: "Cabin_600SemiBold",
    color: "#fff",
    letterSpacing: 0.3,
  },

  // Text block
  textBlock: {
    gap: 6,
  },
  slideTitle: {
    fontSize: 30,
    fontFamily: "Cabin_700Bold",
    color: "#fff",
    letterSpacing: -0.5,
    lineHeight: 34,
  },
  slideSubtitle: {
    fontSize: 14,
    fontFamily: "Cabin_400Regular",
    color: "rgba(255,255,255,0.82)",
    lineHeight: 20,
  },

  // CTA
  ctaBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.18)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 2,
  },
  ctaText: {
    fontSize: 13,
    fontFamily: "Cabin_600SemiBold",
    color: "#fff",
  },

  // ── Dots ──────────────────────────────────────────────────────────────────
  dotsContainer: {
    position: "absolute",
    bottom: 16,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  dot: {
    height: 4,
    borderRadius: 2,
    backgroundColor: "#fff",
  },

});
