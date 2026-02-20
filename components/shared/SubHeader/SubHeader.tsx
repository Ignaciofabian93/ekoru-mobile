import Colors from "@/constants/Colors";
import { useRouter, useSegments } from "expo-router";
import type { LucideIcon } from "lucide-react-native";
import {
  Newspaper,
  Package,
  ScanBarcode,
  Store,
  Users,
} from "lucide-react-native";
import React, { useEffect, useRef } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { Text } from "../Text/Text";

type Item = {
  label: string;
  segment: string;
  icon: LucideIcon;
};

const ITEMS: Item[] = [
  { label: "Marketplace", segment: "(marketplace)", icon: Package },
  { label: "Stores", segment: "(stores)", icon: Store },
  { label: "Services", segment: "(services)", icon: ScanBarcode },
  { label: "Community", segment: "(community)", icon: Users },
  { label: "Blog", segment: "(blog)", icon: Newspaper },
];

export default function SubHeader() {
  const router = useRouter();
  const segments = useSegments();
  const activeSegment = segments[0] as string | undefined;

  const scrollViewRef = useRef<ScrollView>(null);
  const scrollViewWidth = useRef(0);
  const itemLayouts = useRef<Record<number, { x: number; width: number }>>({});

  const scrollToIndex = (index: number) => {
    const layout = itemLayouts.current[index];
    if (!layout || !scrollViewWidth.current) return;
    const x = layout.x - (scrollViewWidth.current - layout.width) / 2;
    scrollViewRef.current?.scrollTo({ x: Math.max(0, x), animated: true });
  };

  // Handles navigation between already-mounted sections
  useEffect(() => {
    const activeIndex = ITEMS.findIndex(
      (item) => item.segment === activeSegment,
    );
    if (activeIndex !== -1) scrollToIndex(activeIndex);
  }, [activeSegment]);

  return (
    <View
      style={styles.wrapper}
      onLayout={(e) => {
        scrollViewWidth.current = e.nativeEvent.layout.width;
      }}
    >
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {ITEMS.map((item, index) => {
          const isActive = activeSegment === item.segment;
          const Icon = item.icon;
          const isLast = index === ITEMS.length - 1;

          return (
            <Pressable
              key={item.segment}
              onLayout={(e) => {
                itemLayouts.current[index] = {
                  x: e.nativeEvent.layout.x,
                  width: e.nativeEvent.layout.width,
                };
                // Handles fresh mount: useEffect already fired but layouts weren't ready yet
                if (isActive) scrollToIndex(index);
              }}
              onPress={() =>
                router.push(
                  `/${item.segment}` as Parameters<typeof router.push>[0],
                )
              }
              style={({ pressed }) => [
                styles.item,
                isActive && styles.itemActive,
                pressed && !isActive && styles.itemPressed,
                isLast && styles.itemLast,
              ]}
            >
              <View style={styles.itemInner}>
                <View style={styles.itemIcon}>
                  <Icon
                    size={16}
                    color={
                      isActive ? Colors.primary : Colors.foregroundSecondary
                    }
                    strokeWidth={2}
                  />
                </View>
                <Text
                  size="sm"
                  weight={isActive ? "semibold" : "normal"}
                  style={isActive ? styles.labelActive : styles.labelInactive}
                  numberOfLines={1}
                >
                  {item.label}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "#fff",
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 6,
  },
  scrollContent: {
    paddingHorizontal: 12,
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
  },
  item: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 6,
    backgroundColor: Colors.backgroundSecondary,
  },
  itemActive: {
    backgroundColor: Colors.primary,
  },
  itemPressed: {
    opacity: 0.7,
  },
  itemLast: {
    marginRight: 0,
  },
  itemInner: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 8,
  },
  itemIcon: {
    marginRight: 5,
  },
  labelInactive: {
    color: Colors.foregroundSecondary,
  },
  labelActive: {
    color: Colors.primary,
  },
});
