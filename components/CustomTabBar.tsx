import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import React, { useEffect } from "react";
import { Dimensions, Pressable, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import Colors from "@/constants/Colors";

const INDICATOR_WIDTH = 54;
const INDICATOR_HEIGHT = 50;
const SPRING_CONFIG = {
  damping: 18,
  stiffness: 200,
  mass: 0.8,
};

export default function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const tabCount = state.routes.length;
  const screenWidth = Dimensions.get("window").width;
  const horizontalPadding = 8;
  const tabWidth = (screenWidth - horizontalPadding * 2) / tabCount;

  const translateX = useSharedValue(
    state.index * tabWidth + (tabWidth - INDICATOR_WIDTH) / 2,
  );

  useEffect(() => {
    translateX.value = withSpring(
      state.index * tabWidth + (tabWidth - INDICATOR_WIDTH) / 2,
      SPRING_CONFIG,
    );
  }, [state.index, tabWidth, translateX]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.indicator, { left: horizontalPadding }, indicatorStyle]}
      />

      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          typeof options.tabBarLabel === "string"
            ? options.tabBarLabel
            : (options.title ?? route.name);
        const isFocused = state.index === index;
        const color = isFocused ? Colors.primary : "#fff";

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            onLongPress={onLongPress}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={label}
            style={styles.tabItem}
          >
            {options.tabBarIcon!({ focused: isFocused, color, size: 28 })}
            <Animated.Text style={[styles.label, { color }]} numberOfLines={1}>
              {label}
            </Animated.Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: Colors.primary,
    paddingBottom: 50,
    paddingTop: 16,
    paddingHorizontal: 8,
  },
  indicator: {
    position: "absolute",
    top: 13,
    width: INDICATOR_WIDTH,
    height: INDICATOR_HEIGHT,
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 2,
    paddingHorizontal: 2,
  },
  label: {
    fontSize: 10,
    fontWeight: "700",
    marginTop: 1,
  },
});
