import Colors from "@/constants/Colors";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type ViewProps,
} from "react-native";

// ─── Variant types (mirrors the web API) ─────────────────────────────────────

type Variant = "default" | "primary" | "outline";
type Size = "sm" | "md" | "lg";

// ─── Props ────────────────────────────────────────────────────────────────────

export interface PaginationProps extends Omit<ViewProps, "style"> {
  /** Current active page (1-indexed) */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Called when the page changes */
  onPageChange: (page: number) => void;
  /** Currently selected items per page */
  itemsPerPage?: number;
  /** Called when items per page changes */
  onItemsPerPageChange?: (pageSize: number) => void;
  /** Show the items-per-page selector */
  showItemsPerPage?: boolean;
  /** Available items-per-page options */
  itemsPerPageOptions?: number[];
  /** Show "Page X of Y" info text */
  showPageInfo?: boolean;
  /** Template for the page info text */
  pageInfoTemplate?: string;
  /** Show chevron icons in buttons */
  showIcons?: boolean;
  /** Label for the previous button */
  previousLabel?: string;
  /** Label for the next button */
  nextLabel?: string;
  /** Label preceding the items-per-page selector */
  rowsLabel?: string;
  /** Button style variant */
  variant?: Variant;
  /** Button size */
  size?: Size;
}

// ─── Maps ─────────────────────────────────────────────────────────────────────

const SIZE_MAP = {
  sm: { height: 32, paddingHorizontal: 12, fontSize: 13, iconSize: 14, gap: 4 },
  md: { height: 40, paddingHorizontal: 16, fontSize: 15, iconSize: 16, gap: 6 },
  lg: { height: 48, paddingHorizontal: 20, fontSize: 17, iconSize: 18, gap: 8 },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function NavButton({
  label,
  onPress,
  disabled,
  showIcon,
  iconSide,
  variant = "default",
  size = "md",
}: {
  label: string;
  onPress: () => void;
  disabled: boolean;
  showIcon: boolean;
  iconSide: "left" | "right";
  variant?: Variant;
  size?: Size;
}) {
  const s = SIZE_MAP[size];
  const Icon = iconSide === "left" ? ChevronLeft : ChevronRight;

  const bg =
    variant === "primary"
      ? Colors.primary
      : variant === "outline"
        ? "transparent"
        : Colors.backgroundSecondary;

  const textColor =
    variant === "primary" ? "#fff" : Colors.foreground;

  const borderStyle =
    variant === "outline"
      ? { borderWidth: 1.5, borderColor: Colors.primary }
      : {};

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        {
          height: s.height,
          paddingHorizontal: s.paddingHorizontal,
          gap: s.gap,
          backgroundColor: bg,
          opacity: disabled ? 0.4 : pressed ? 0.75 : 1,
        },
        borderStyle,
      ]}
    >
      {showIcon && iconSide === "left" && (
        <Icon size={s.iconSize} color={textColor} strokeWidth={2} />
      )}
      <Text style={[styles.buttonText, { fontSize: s.fontSize, color: textColor }]}>
        {label}
      </Text>
      {showIcon && iconSide === "right" && (
        <Icon size={s.iconSize} color={textColor} strokeWidth={2} />
      )}
    </Pressable>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

const Pagination = React.forwardRef<View, PaginationProps>(
  (
    {
      currentPage,
      totalPages,
      onPageChange,
      itemsPerPage = 10,
      onItemsPerPageChange,
      showItemsPerPage = true,
      itemsPerPageOptions = [10, 25, 50, 100],
      showPageInfo = true,
      pageInfoTemplate = "Page {current} of {total}",
      showIcons = true,
      previousLabel = "Previous",
      nextLabel = "Next",
      rowsLabel = "Rows",
      variant = "default",
      size = "md",
      ...props
    },
    ref,
  ) => {
    const pageInfo = pageInfoTemplate
      .replace("{current}", currentPage.toString())
      .replace("{total}", totalPages.toString());

    const handlePrevious = () => {
      if (currentPage > 1) onPageChange(currentPage - 1);
    };

    const handleNext = () => {
      if (currentPage < totalPages) onPageChange(currentPage + 1);
    };

    return (
      <View ref={ref} style={styles.container} {...props}>
        {/* Items per page selector */}
        {showItemsPerPage && onItemsPerPageChange && (
          <View style={styles.rowsRow}>
            <Text style={styles.rowsLabel}>{rowsLabel}</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.rowsOptions}
            >
              {itemsPerPageOptions.map((opt) => {
                const active = opt === itemsPerPage;
                return (
                  <Pressable
                    key={opt}
                    onPress={() => onItemsPerPageChange(opt)}
                    style={({ pressed }) => [
                      styles.rowsChip,
                      active && styles.rowsChipActive,
                      { opacity: pressed ? 0.7 : 1 },
                    ]}
                  >
                    <Text
                      style={[
                        styles.rowsChipText,
                        active && styles.rowsChipTextActive,
                      ]}
                    >
                      {opt}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        )}

        {/* Nav row */}
        <View style={styles.navRow}>
          <NavButton
            label={previousLabel}
            onPress={handlePrevious}
            disabled={currentPage === 1}
            showIcon={showIcons}
            iconSide="left"
            variant={variant}
            size={size}
          />

          {showPageInfo && (
            <Text style={styles.pageInfo}>{pageInfo}</Text>
          )}

          <NavButton
            label={nextLabel}
            onPress={handleNext}
            disabled={currentPage === totalPages}
            showIcon={showIcons}
            iconSide="right"
            variant={variant}
            size={size}
          />
        </View>
      </View>
    );
  },
);

Pagination.displayName = "Pagination";

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  // Items-per-page row
  rowsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  rowsLabel: {
    fontSize: 13,
    fontFamily: "Cabin_500Medium",
    color: Colors.foregroundSecondary,
  },
  rowsOptions: {
    flexDirection: "row",
    gap: 6,
  },
  rowsChip: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: Colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  rowsChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  rowsChipText: {
    fontSize: 13,
    fontFamily: "Cabin_500Medium",
    color: Colors.foregroundSecondary,
  },
  rowsChipTextActive: {
    color: "#fff",
  },
  // Nav row
  navRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  pageInfo: {
    fontSize: 14,
    fontFamily: "Cabin_500Medium",
    color: Colors.foreground,
    flex: 1,
    textAlign: "center",
  },
  // Buttons
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    minWidth: 100,
  },
  buttonText: {
    fontFamily: "Cabin_600SemiBold",
  },
});

export { Pagination };
