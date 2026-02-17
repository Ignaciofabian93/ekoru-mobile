import {
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
  StyleSheet,
  Text,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type ViewToken,
} from "react-native";
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

import Colors from "@/constants/Colors";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const SLIDE_HEIGHT = SCREEN_HEIGHT / 3;
const AUTO_PLAY_INTERVAL = 4000;

interface SlideData {
  id: string;
  title: string;
  subtitle: string;
  colors: [string, string];
  Icon: LucideIcon;
}

const slides: SlideData[] = [
  {
    id: "1",
    title: "Sustainable Shopping",
    subtitle: "Discover products that care for the planet",
    colors: ["#166534", "#0d9488"],
    Icon: Leaf,
  },
  {
    id: "2",
    title: "Eco-Friendly Products",
    subtitle: "Certified green alternatives for everyday life",
    colors: ["#65a30d", "#059669"],
    Icon: Globe,
  },
  {
    id: "3",
    title: "Support Local Stores",
    subtitle: "Shop from sustainable local businesses near you",
    colors: ["#0d9488", "#0891b2"],
    Icon: Store,
  },
  {
    id: "4",
    title: "Reduce Your Footprint",
    subtitle: "Every purchase makes a difference",
    colors: ["#059669", "#166534"],
    Icon: Footprints,
  },
];

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

    const scale = interpolate(scrollX.value, inputRange, [1, 1.4, 1], "clamp");
    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0.4, 1, 0.4],
      "clamp",
    );
    const backgroundColor = interpolateColor(scrollX.value, inputRange, [
      "#ffffff80",
      Colors.primary,
      "#ffffff80",
    ]);

    return {
      transform: [{ scale }],
      opacity,
      backgroundColor,
    };
  });

  return <Animated.View style={[styles.dot, animatedStyle]} />;
}

function SlideItem({ item }: { item: SlideData }) {
  const { Icon } = item;

  return (
    <View style={[styles.slideWrapper, { backgroundColor: item.colors[0] }]}>
      <View style={styles.gradientOverlay}>
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: item.colors[1],
              opacity: 0.5,
            },
          ]}
        />
      </View>

      <View style={styles.slideContent}>
        <View style={styles.iconContainer}>
          <Icon size={48} color="#ffffffcc" strokeWidth={1.2} />
        </View>
        <Text style={styles.slideTitle}>{item.title}</Text>
        <Text style={styles.slideSubtitle}>{item.subtitle}</Text>
      </View>
    </View>
  );
}

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
      const nextIndex = (currentIndex + 1) % slides.length;
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
    <View>
      <FlatList
        ref={flatListRef}
        data={slides}
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

      <View style={styles.dotsContainer}>
        {slides.map((_, index) => (
          <Dot key={index} index={index} scrollX={scrollX} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  slideWrapper: {
    width: SCREEN_WIDTH,
    height: SLIDE_HEIGHT,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  slideContent: {
    padding: 24,
    paddingBottom: 40,
    zIndex: 1,
  },
  iconContainer: {
    marginBottom: 12,
  },
  slideTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 6,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  slideSubtitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "#ffffffcc",
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  dotsContainer: {
    position: "absolute",
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
