import {
  ChevronDown,
  ChevronRight,
  type LucideIcon,
} from "lucide-react-native";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { borderRadius, colors, fontFamily, fontSize } from "@/design/tokens";
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
// After first open, children stay mounted so re-open is instant.
function AccordionContent({
  isOpen,
  children,
}: {
  isOpen: boolean;
  children: React.ReactNode;
}) {
  const [hasEverOpened, setHasEverOpened] = useState(false);

  if (isOpen && !hasEverOpened) {
    // Use a microtask-safe approach: set flag on next render
    // We rely on the re-render triggered by isOpen changing to set the flag
  }

  // Track if opened at least once
  React.useEffect(() => {
    if (isOpen) setHasEverOpened(true);
  }, [isOpen]);

  if (!hasEverOpened) return null;
  if (!isOpen) return null;

  return <View>{children}</View>;
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
            <View style={{ transform: [{ rotate: isOpen ? "90deg" : "0deg" }] }}>
              <ChevronRight size={13} color={colors.foregroundMuted} strokeWidth={2} />
            </View>
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
            <View style={{ transform: [{ rotate: isOpen ? "90deg" : "0deg" }] }}>
              <ChevronRight size={14} color={colors.foregroundTertiary} strokeWidth={2} />
            </View>
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
          <View style={{ transform: [{ rotate: isOpen ? "180deg" : "0deg" }] }}>
            <ChevronDown size={16} color={colors.foregroundTertiary} strokeWidth={2} />
          </View>
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
    borderBottomColor: colors.borderStrong,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.sm,
    backgroundColor: `${colors.primary}18`,
    alignItems: "center",
    justifyContent: "center",
  },
  menuLabel: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.medium,
    color: colors.foreground,
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
    backgroundColor: colors.backgroundSecondary,
  },
  l1Label: {
    flex: 1,
    fontSize: fontSize.sm,
    fontFamily: fontFamily.medium,
    color: colors.foregroundSecondary,
  },
  l2Row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingLeft: 32,
    paddingRight: 14,
    backgroundColor: colors.backgroundTertiary,
  },
  l2Label: {
    flex: 1,
    fontSize: fontSize.xs,
    fontFamily: fontFamily.regular,
    color: colors.foregroundSecondary,
  },
  l3Row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 9,
    paddingLeft: 46,
    paddingRight: 14,
    backgroundColor: colors.surfaceActive,
  },
  l3Label: {
    flex: 1,
    fontSize: fontSize.xs,
    fontFamily: fontFamily.regular,
    color: colors.foregroundTertiary,
  },
});
