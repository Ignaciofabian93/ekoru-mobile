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
import Select from "../Select/Select";

export interface PaginationProps extends ViewProps {
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
  /** Label preceding the items-per-page selector */
  rowsLabel?: string;
  /** Max page buttons to show (excluding chevrons) */
  maxPageButtons?: number;
}

// ─── Page number generation ────────────────────────────────────────────────

function getPageNumbers(
  current: number,
  total: number,
  max: number,
): (number | "...")[] {
  if (total <= max) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const half = Math.floor(max / 2);
  let start = Math.max(2, current - half);
  let end = Math.min(total - 1, start + max - 3);

  if (end - start < max - 3) {
    start = Math.max(2, end - (max - 3));
  }

  const pages: (number | "...")[] = [1];
  if (start > 2) pages.push("...");
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < total - 1) pages.push("...");
  pages.push(total);

  return pages;
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
      rowsLabel = "Items per page",
      maxPageButtons = 5,
      ...props
    },
    ref,
  ) => {
    const pages = getPageNumbers(currentPage, totalPages, maxPageButtons);

    return (
      <View ref={ref} style={styles.container} {...props}>
        {/* Items per page selector */}
        {showItemsPerPage && onItemsPerPageChange && (
          <View style={styles.rowsRow}>
            <Text style={styles.rowsLabel}>{rowsLabel}</Text>
            <Select
              size="sm"
              width="sm"
              value={itemsPerPage}
              searchEnabled={false}
              dropdownDirection="up"
              options={itemsPerPageOptions.map((op) => ({
                label: op.toString(),
                value: op,
              }))}
              onChange={() => {}}
            />
          </View>
        )}

        {/* Nav row */}
        <View style={styles.navRow}>
          {/* Prev chevron */}
          <Pressable
            onPress={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            style={[
              styles.chevronBtn,
              currentPage === 1 && styles.chevronBtnDisabled,
            ]}
          >
            <ChevronLeft size={20} color={Colors.foreground} strokeWidth={2} />
          </Pressable>

          {/* Page number buttons — horizontal scroll handles overflow */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.pagesScroll}
            contentContainerStyle={styles.pagesContent}
          >
            {pages.map((page, i) =>
              page === "..." ? (
                <Text key={`ellipsis-${i}`} style={styles.ellipsis}>
                  …
                </Text>
              ) : (
                <Pressable
                  key={String(page)}
                  onPress={() => onPageChange(page)}
                  style={[
                    styles.pageBtn,
                    page === currentPage && styles.pageBtnActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.pageBtnText,
                      page === currentPage && styles.pageBtnTextActive,
                    ]}
                  >
                    {page}
                  </Text>
                </Pressable>
              ),
            )}
          </ScrollView>

          {/* Next chevron */}
          <Pressable
            onPress={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            style={[
              styles.chevronBtn,
              currentPage === totalPages && styles.chevronBtnDisabled,
            ]}
          >
            <ChevronRight size={20} color={Colors.foreground} strokeWidth={2} />
          </Pressable>
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
    marginVertical: 32,
    borderTopWidth: 1,
    borderColor: Colors.borderStrong,
    paddingTop: 8,
  },
  // Items-per-page row
  rowsRow: {
    gap: 8,
    marginVertical: 12,
    flexDirection: "column",
    alignItems: "flex-end",
  },
  rowsLabel: {
    fontSize: 14,
    fontFamily: "Cabin_500Medium",
    color: Colors.foregroundSecondary,
    textTransform: "capitalize",
    letterSpacing: 0.6,
  },
  // Nav row
  navRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginVertical: 12,
  },
  chevronBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: Colors.backgroundSecondary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  chevronBtnDisabled: {
    opacity: 0.35,
  },
  pagesScroll: {
    flex: 1,
  },
  pagesContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    flexGrow: 1,
  },
  pageBtn: {
    minWidth: 36,
    height: 36,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  pageBtnActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  pageBtnText: {
    fontSize: 14,
    fontFamily: "Cabin_600SemiBold",
    color: "#000",
  },
  pageBtnTextActive: {
    color: "#fff",
  },
  ellipsis: {
    fontSize: 14,
    color: Colors.foregroundTertiary,
    paddingHorizontal: 4,
    lineHeight: 36,
  },
});

export { Pagination };
