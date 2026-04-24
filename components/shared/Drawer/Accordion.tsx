import {
  ChevronDown,
  ChevronRight,
  type LucideIcon,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { colors } from "@/design/tokens";
import { NAMESPACE } from "./i18n";

// ── Types ─────────────────────────────────────────────────────────────────────
export type L3Item = { label: string; route: string };
export type L2Item = { label: string; route: string; children?: L3Item[] };
export type L1Item = { label: string; route: string; children?: L2Item[] };

export type AccordionSectionDef = {
  key: string;
  tKey: string;
  icon: LucideIcon;
  baseRoute: string;
  items: L1Item[];
};

// ── AccordionContent ──────────────────────────────────────────────────────────
// Children are NOT mounted until the accordion is opened for the first time.
// This avoids rendering all nested rows (each with their own Reanimated shared
// values) while the section is still collapsed, which was the main render cost.
// After first open, children stay mounted so re-open is instant.
function AccordionContent({
  isOpen,
  children,
}: {
  isOpen: boolean;
  children: React.ReactNode;
}) {
  const [hasEverOpened, setHasEverOpened] = useState(false);
  const height = useSharedValue(0);

  useEffect(() => {
    if (isOpen) setHasEverOpened(true);
    height.value = withTiming(isOpen ? 800 : 0, {
      duration: 220,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
    return () => cancelAnimation(height);
  }, [isOpen, height]);

  const animStyle = useAnimatedStyle(() => ({
    maxHeight: height.value,
    overflow: "hidden",
  }));

  if (!hasEverOpened) return null;

  return <Animated.View style={animStyle}>{children}</Animated.View>;
}

// ── AccordionL2Row (DepartmentCategory / StoreSubCategory / etc.) ─────────────
function AccordionL2Row({
  item,
  isLast,
  onNavigate,
}: {
  item: L2Item;
  isLast: boolean;
  onNavigate: (route: string) => void;
}) {
  const hasChildren = !!item.children?.length;
  const [isOpen, setIsOpen] = useState(false);
  const chevron = useSharedValue(0);

  useEffect(() => {
    chevron.value = withTiming(isOpen ? 1 : 0, { duration: 200 });
    return () => cancelAnimation(chevron);
  }, [isOpen, chevron]);

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${interpolate(chevron.value, [0, 1], [0, 90])}deg` },
    ],
  }));

  return (
    <View>
      <View
        style={[styles.l2Row, (!isLast || isOpen) && styles.menuItemBorder]}
      >
        <Pressable
          style={styles.rowMain}
          onPress={() => onNavigate(item.route)}
        >
          <Text style={styles.l2Label}>{item.label}</Text>
        </Pressable>
        {hasChildren && (
          <Pressable
            onPress={() => setIsOpen((v) => !v)}
            hitSlop={8}
            style={styles.chevronBtn}
          >
            <Animated.View style={chevronStyle}>
              <ChevronRight size={13} color="#b0b8c4" strokeWidth={2} />
            </Animated.View>
          </Pressable>
        )}
      </View>

      {hasChildren && (
        <AccordionContent isOpen={isOpen}>
          {item.children!.map((l3, i) => (
            <Pressable
              key={l3.route}
              style={[
                styles.l3Row,
                i < item.children!.length - 1 && styles.menuItemBorder,
              ]}
              onPress={() => onNavigate(l3.route)}
            >
              <Text style={styles.l3Label}>{l3.label}</Text>
            </Pressable>
          ))}
        </AccordionContent>
      )}
    </View>
  );
}

// ── AccordionL1Row (Department / StoreCategory / etc.) ───────────────────────
function AccordionL1Row({
  item,
  isLast,
  onNavigate,
}: {
  item: L1Item;
  isLast: boolean;
  onNavigate: (route: string) => void;
}) {
  const hasChildren = !!item.children?.length;
  const [isOpen, setIsOpen] = useState(false);
  const chevron = useSharedValue(0);

  useEffect(() => {
    chevron.value = withTiming(isOpen ? 1 : 0, { duration: 200 });
    return () => cancelAnimation(chevron);
  }, [isOpen, chevron]);

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${interpolate(chevron.value, [0, 1], [0, 90])}deg` },
    ],
  }));

  return (
    <View>
      <View
        style={[styles.l1Row, (!isLast || isOpen) && styles.menuItemBorder]}
      >
        <Pressable
          style={styles.rowMain}
          onPress={() => onNavigate(item.route)}
        >
          <Text style={styles.l1Label}>{item.label}</Text>
        </Pressable>
        {hasChildren && (
          <Pressable
            onPress={() => setIsOpen((v) => !v)}
            hitSlop={8}
            style={styles.chevronBtn}
          >
            <Animated.View style={chevronStyle}>
              <ChevronRight size={14} color="#9ca3af" strokeWidth={2} />
            </Animated.View>
          </Pressable>
        )}
      </View>

      {hasChildren && (
        <AccordionContent isOpen={isOpen}>
          {item.children!.map((l2, i) => (
            <AccordionL2Row
              key={l2.route}
              item={l2}
              isLast={i === item.children!.length - 1}
              onNavigate={onNavigate}
            />
          ))}
        </AccordionContent>
      )}
    </View>
  );
}

// ── AccordionSection (top-level with icon) ────────────────────────────────────
function AccordionSection({
  section,
  onNavigate,
}: {
  section: AccordionSectionDef;
  onNavigate: (route: string) => void;
}) {
  const { t } = useTranslation(NAMESPACE);
  const [isOpen, setIsOpen] = useState(false);
  const Icon = section.icon;
  const chevron = useSharedValue(0);

  useEffect(() => {
    chevron.value = withTiming(isOpen ? 1 : 0, { duration: 200 });
    return () => cancelAnimation(chevron);
  }, [isOpen, chevron]);

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${interpolate(chevron.value, [0, 1], [0, 180])}deg` },
    ],
  }));

  return (
    <View>
      <View style={[styles.menuItem, styles.menuItemBorder]}>
        <Pressable
          style={styles.rowMain}
          onPress={() => onNavigate(section.baseRoute)}
        >
          <View style={styles.iconWrap}>
            <Icon size={18} strokeWidth={1.5} color={colors.primary} />
          </View>
          <Text style={styles.menuLabel}>{t(section.tKey)}</Text>
        </Pressable>
        <Pressable
          onPress={() => setIsOpen((v) => !v)}
          hitSlop={8}
          style={styles.chevronBtn}
        >
          <Animated.View style={chevronStyle}>
            <ChevronDown size={16} color="#9ca3af" strokeWidth={2} />
          </Animated.View>
        </Pressable>
      </View>

      <AccordionContent isOpen={isOpen}>
        {section.items.map((item, i) => (
          <AccordionL1Row
            key={item.route}
            item={item}
            isLast={i === section.items.length - 1}
            onNavigate={onNavigate}
          />
        ))}
      </AccordionContent>
    </View>
  );
}

// ── Compound export ───────────────────────────────────────────────────────────
// Use as <Accordion.Section /> for the top-level entry point.
// Sub-components are accessible for targeted use: Accordion.L1Row, etc.
export const Accordion = Object.assign(AccordionSection, {
  Content: AccordionContent,
  L1Row: AccordionL1Row,
  L2Row: AccordionL2Row,
});

const styles = StyleSheet.create({
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 13,
    paddingHorizontal: 14,
    gap: 12,
  },
  menuItemBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#e5e7eb",
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: `${colors.primary}18`,
    alignItems: "center",
    justifyContent: "center",
  },
  menuLabel: {
    fontSize: 14,
    fontFamily: "Cabin_500Medium",
    color: "#1f2937",
  },
  rowMain: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  chevronBtn: {
    paddingHorizontal: 6,
    paddingVertical: 10,
  },
  l1Row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 11,
    paddingLeft: 18,
    paddingRight: 14,
    backgroundColor: "#f9fafb",
  },
  l1Label: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Cabin_500Medium",
    color: "#374151",
  },
  l2Row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingLeft: 32,
    paddingRight: 14,
    backgroundColor: "#f3f4f6",
  },
  l2Label: {
    flex: 1,
    fontSize: 12,
    fontFamily: "Cabin_400Regular",
    color: "#4b5563",
  },
  l3Row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 9,
    paddingLeft: 46,
    paddingRight: 14,
    backgroundColor: "#eef0f3",
  },
  l3Label: {
    flex: 1,
    fontSize: 11,
    fontFamily: "Cabin_400Regular",
    color: "#6b7280",
  },
});
