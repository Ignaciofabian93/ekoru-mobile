import Colors from "@/constants/Colors";
import { ChevronDown, Circle } from "lucide-react-native";
import type { LucideIcon } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

// ─── Types ────────────────────────────────────────────────────────────────────

export type Option = {
  label: string;
  value: string | number;
  iconColor?: string;
};

type Variant = "default" | "filled" | "outline";
type Size = "sm" | "md" | "lg";
type Width = "sm" | "md" | "lg" | "full";

// ─── Props ────────────────────────────────────────────────────────────────────

export interface SelectProps {
  options?: Option[];
  value?: string | number;
  name?: string;
  label?: string;
  placeholder?: string;
  onChange: (value: string | number) => void;
  variant?: Variant;
  /** Controls trigger height */
  size?: Size;
  /** Controls container width */
  width?: Width;
  disabled?: boolean;
  readOnly?: boolean;
  leftIcon?: LucideIcon;
  errorMessage?: string;
  showColorIcon?: boolean;
  renderOption?: (option: Option, selected: boolean) => React.ReactNode;
  searchEnabled?: boolean;
  dropdownDirection?: "up" | "down";
  noResultsText?: string;
}

// ─── Maps ─────────────────────────────────────────────────────────────────────

const SCREEN_HEIGHT = Dimensions.get("window").height;

const SIZE_MAP: Record<Size, { height: number; fontSize: number; px: number; iconSize: number }> = {
  sm: { height: 36, fontSize: 14, px: 10, iconSize: 16 },
  md: { height: 44, fontSize: 16, px: 12, iconSize: 18 },
  lg: { height: 56, fontSize: 18, px: 14, iconSize: 20 },
};

const WIDTH_MAP: Record<Width, `${number}%` | "100%"> = {
  sm:   "33%",
  md:   "50%",
  lg:   "66%",
  full: "100%",
};

interface VariantStyle {
  bg: string;
  borderColor: string;
  borderWidth: number;
  focusedBorderColor: string;
  errorBorderColor: string;
}

const VARIANT_MAP: Record<Variant, VariantStyle> = {
  default: {
    bg: Colors.inputBg,
    borderColor: Colors.inputBorder,
    borderWidth: 2,
    focusedBorderColor: Colors.inputBorderFocus,
    errorBorderColor: Colors.danger,
  },
  filled: {
    bg: Colors.backgroundSecondary,
    borderColor: "transparent",
    borderWidth: 2,
    focusedBorderColor: Colors.inputBorderFocus,
    errorBorderColor: Colors.danger,
  },
  outline: {
    bg: "transparent",
    borderColor: Colors.primary,
    borderWidth: 2,
    focusedBorderColor: Colors.primaryActive,
    errorBorderColor: Colors.danger,
  },
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// ─── Component ────────────────────────────────────────────────────────────────

const Select = React.forwardRef<View, SelectProps>(
  (
    {
      options = [],
      value,
      name: _name,
      label,
      placeholder = "Select...",
      onChange,
      variant = "default",
      size = "md",
      width = "full",
      disabled = false,
      readOnly = false,
      leftIcon: LeftIcon,
      errorMessage,
      showColorIcon = false,
      renderOption,
      searchEnabled = true,
      dropdownDirection = "down",
      noResultsText = "No results found",
    },
    ref,
  ) => {
    const s = SIZE_MAP[size];
    const v = VARIANT_MAP[variant];
    const hasError = !!errorMessage;

    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const triggerRef = useRef<View>(null);
    const [dropdownPos, setDropdownPos] = useState({ x: 0, y: 0, width: 0, triggerY: 0 });

    const selectedOption = options.find((o) => o.value === value);
    const filteredOptions = options.filter((o) =>
      o.label.toLowerCase().includes(search.toLowerCase()),
    );

    // ── Chevron rotation ────────────────────────────────────────────────────
    const chevronRot = useSharedValue(0);
    const chevronStyle = useAnimatedStyle(() => ({
      transform: [{ rotate: `${chevronRot.value}deg` }],
    }));

    useEffect(() => {
      chevronRot.value = withTiming(isOpen ? 180 : 0, { duration: 200 });
    }, [isOpen]);

    // ── Open / close ────────────────────────────────────────────────────────
    const handleOpen = () => {
      if (disabled || readOnly) return;
      (triggerRef.current as View | null)?.measureInWindow((x, y, width, height) => {
        setDropdownPos({
          x,
          width,
          y: y + height + 4,   // bottom of trigger + gap (for "down")
          triggerY: y - 4,     // top of trigger - gap (for "up")
        });
        setIsOpen(true);
      });
    };

    const handleClose = () => {
      setIsOpen(false);
      setSearch("");
    };

    const handleSelect = (optionValue: string | number) => {
      onChange(optionValue);
      handleClose();
    };

    // ── Dropdown position ───────────────────────────────────────────────────
    const dropdownStyle =
      dropdownDirection === "up"
        ? {
            bottom: SCREEN_HEIGHT - dropdownPos.triggerY,
            left: dropdownPos.x,
            width: dropdownPos.width,
          }
        : {
            top: dropdownPos.y,
            left: dropdownPos.x,
            width: dropdownPos.width,
          };

    // ── Trigger border ──────────────────────────────────────────────────────
    const borderColor = hasError
      ? v.errorBorderColor
      : isOpen
        ? v.focusedBorderColor
        : v.borderColor;

    // ── Color circle helper ─────────────────────────────────────────────────
    const renderColorCircle = (option?: Option) => {
      if (!showColorIcon || !option?.iconColor) return null;
      return (
        <Circle
          size={16}
          color={option.iconColor}
          fill={option.iconColor}
          strokeWidth={option.iconColor === "#FFFFFF" ? 1 : 0}
          stroke={option.iconColor === "#FFFFFF" ? "#888" : option.iconColor}
        />
      );
    };

    const DropdownEntering = dropdownDirection === "up" ? FadeInUp : FadeInDown;

    return (
      <View ref={ref} style={[styles.container, { width: WIDTH_MAP[width] as any }]}>
        {/* Label */}
        {label && (
          <Text style={styles.label}>{label}</Text>
        )}

        {/* Trigger */}
        <Pressable
          ref={triggerRef}
          onPress={handleOpen}
          disabled={disabled || readOnly}
          style={[
            styles.trigger,
            {
              height: s.height,
              paddingHorizontal: s.px,
              backgroundColor: v.bg,
              borderWidth: v.borderWidth,
              borderColor,
            },
            (disabled || readOnly) && styles.disabled,
          ]}
        >
          {LeftIcon && (
            <View style={styles.leftIconWrap}>
              <LeftIcon
                size={s.iconSize}
                color={isOpen ? Colors.primary : Colors.foregroundTertiary}
                strokeWidth={2}
              />
            </View>
          )}

          <View style={[styles.triggerContent, LeftIcon && { paddingLeft: s.iconSize + 8 }]}>
            {renderColorCircle(selectedOption)}
            <Text
              style={[
                styles.triggerText,
                { fontSize: s.fontSize },
                !selectedOption && styles.placeholder,
              ]}
              numberOfLines={1}
            >
              {selectedOption?.label ?? placeholder}
            </Text>
          </View>

          <Animated.View style={chevronStyle}>
            <ChevronDown
              size={s.iconSize}
              color={hasError ? Colors.danger : isOpen ? Colors.primary : Colors.foregroundTertiary}
              strokeWidth={2}
            />
          </Animated.View>
        </Pressable>

        {/* Error message */}
        {errorMessage && (
          <Animated.View entering={FadeInDown.duration(200)}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </Animated.View>
        )}

        {/* Dropdown modal */}
        <Modal
          visible={isOpen}
          transparent
          animationType="none"
          statusBarTranslucent
          onRequestClose={handleClose}
        >
          {/* Backdrop */}
          <AnimatedPressable
            entering={FadeIn.duration(150)}
            exiting={FadeOut.duration(150)}
            style={styles.backdrop}
            onPress={handleClose}
          >
            {/* Dropdown sheet */}
            <Animated.View
              entering={DropdownEntering.duration(180)}
              style={[styles.dropdown, dropdownStyle]}
            >
              <Pressable onPress={(e) => e.stopPropagation()}>
                {searchEnabled && (
                  <TextInput
                    placeholder="Search..."
                    placeholderTextColor={Colors.inputPlaceholder}
                    value={search}
                    onChangeText={setSearch}
                    style={styles.searchInput}
                    autoFocus
                  />
                )}
                <FlatList
                  data={filteredOptions}
                  keyExtractor={(item) => String(item.value)}
                  style={styles.list}
                  keyboardShouldPersistTaps="handled"
                  ListEmptyComponent={
                    <Text style={styles.emptyText}>{noResultsText}</Text>
                  }
                  renderItem={({ item }) => {
                    const isSelected = item.value === value;
                    return (
                      <Pressable
                        onPress={() => handleSelect(item.value)}
                        style={({ pressed }) => [
                          styles.option,
                          isSelected && styles.optionSelected,
                          pressed && styles.optionPressed,
                        ]}
                      >
                        {renderOption ? (
                          renderOption(item, isSelected)
                        ) : (
                          <View style={styles.optionContent}>
                            {renderColorCircle(item)}
                            <Text
                              style={[
                                styles.optionText,
                                { fontSize: s.fontSize },
                                isSelected && styles.optionTextSelected,
                              ]}
                            >
                              {item.label}
                            </Text>
                          </View>
                        )}
                      </Pressable>
                    );
                  }}
                />
              </Pressable>
            </Animated.View>
          </AnimatedPressable>
        </Modal>
      </View>
    );
  },
);

Select.displayName = "Select";

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontFamily: "Cabin_500Medium",
    color: Colors.foreground,
  },
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    gap: 8,
  },
  disabled: {
    opacity: 0.5,
  },
  leftIconWrap: {
    position: "absolute",
    left: 12,
    zIndex: 1,
  },
  triggerContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  triggerText: {
    fontFamily: "Cabin_400Regular",
    color: Colors.inputText,
    flex: 1,
  },
  placeholder: {
    color: Colors.inputPlaceholder,
  },
  errorText: {
    fontSize: 12,
    fontFamily: "Cabin_400Regular",
    color: Colors.danger,
  },
  // Dropdown
  backdrop: {
    flex: 1,
  },
  dropdown: {
    position: "absolute",
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: 12,
    overflow: "hidden",
    maxHeight: 280,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  searchInput: {
    fontFamily: "Cabin_400Regular",
    fontSize: 15,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    color: Colors.inputText,
  },
  list: {
    maxHeight: 230,
  },
  option: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  optionSelected: {
    backgroundColor: `${Colors.primary}1A`,
  },
  optionPressed: {
    backgroundColor: `${Colors.primary}0D`,
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  optionText: {
    fontFamily: "Cabin_400Regular",
    color: Colors.foreground,
    flex: 1,
  },
  optionTextSelected: {
    fontFamily: "Cabin_600SemiBold",
    color: Colors.primary,
  },
  emptyText: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    fontFamily: "Cabin_400Regular",
    color: Colors.foregroundSecondary,
    fontStyle: "italic",
  },
});

export default Select;
export { Select };
