import Colors from "@/constants/Colors";
import { ChevronDown, Circle } from "lucide-react-native";
import type { LucideIcon } from "lucide-react-native";
import { useState, useRef } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type Option = {
  label: string;
  value: string | number;
  iconColor?: string;
};

type Size = "sm" | "md" | "lg" | "full";

interface SelectProps {
  options?: Option[];
  value?: string | number;
  name?: string;
  label?: string;
  placeholder?: string;
  onChange: (value: string | number) => void;
  size?: Size;
  disabled?: boolean;
  isRenderingColorIcon?: boolean;
  renderOption?: (option: Option, selected: boolean) => React.ReactNode;
  icon?: LucideIcon;
  hasIcon?: boolean;
  searchEnabled?: boolean;
  readOnly?: boolean;
}

const sizeWidths: Record<Size, string> = {
  sm: "33%",
  md: "50%",
  lg: "66%",
  full: "100%",
};

export default function Select({
  label,
  placeholder = "Seleccione...",
  value,
  onChange,
  options = [],
  size = "full",
  disabled = false,
  isRenderingColorIcon = false,
  renderOption,
  icon: Icon,
  hasIcon = true,
  searchEnabled = true,
  readOnly = false,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const buttonRef = useRef<View>(null);
  const [dropdownLayout, setDropdownLayout] = useState({ x: 0, y: 0, width: 0 });

  const selectedOption = options.find((o) => o.value === value);
  const filteredOptions = options.filter((o) =>
    o.label.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpen = () => {
    if (disabled || readOnly) return;
    buttonRef.current?.measureInWindow((x, y, width, height) => {
      setDropdownLayout({ x, y: y + height + 4, width });
      setIsOpen(true);
    });
  };

  const handleSelect = (optionValue: string | number) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearch("");
  };

  const renderColorIcon = (option?: Option) => {
    if (!isRenderingColorIcon || !option?.iconColor) return null;
    return (
      <Circle
        size={18}
        color={option.iconColor}
        fill={option.iconColor}
        strokeWidth={option.iconColor === "#FFFFFF" ? 1 : 0}
        stroke={option.iconColor === "#FFFFFF" ? "#888" : option.iconColor}
      />
    );
  };

  return (
    <View style={[styles.container, { width: sizeWidths[size] as any }]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <Pressable
        ref={buttonRef}
        onPress={handleOpen}
        style={[
          styles.trigger,
          isOpen && styles.triggerFocused,
          (disabled || readOnly) && styles.triggerDisabled,
        ]}
      >
        {hasIcon && Icon && (
          <View style={styles.leftIcon}>
            <Icon
              size={20}
              color={isOpen ? Colors.primary : "#9ca3af"}
              strokeWidth={2}
            />
          </View>
        )}

        <View
          style={[
            styles.triggerContent,
            hasIcon && Icon && { paddingLeft: 40 },
          ]}
        >
          {renderColorIcon(selectedOption)}
          <Text
            style={[
              styles.triggerText,
              !selectedOption && styles.placeholderText,
            ]}
            numberOfLines={1}
          >
            {selectedOption?.label || placeholder}
          </Text>
        </View>

        <View style={styles.chevron}>
          <ChevronDown
            size={18}
            color={isOpen ? Colors.primary : "#9ca3af"}
            strokeWidth={2}
          />
        </View>
      </Pressable>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setIsOpen(false)}>
          <View
            style={[
              styles.dropdown,
              {
                top: dropdownLayout.y,
                left: dropdownLayout.x,
                width: dropdownLayout.width,
              },
            ]}
          >
            {searchEnabled && (
              <TextInput
                placeholder="Buscar..."
                placeholderTextColor="#9ca3af"
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
                <Text style={styles.emptyText}>
                  No se encuentran resultados
                </Text>
              }
              renderItem={({ item }) => {
                const isSelected = item.value === value;
                return (
                  <Pressable
                    onPress={() => handleSelect(item.value)}
                    style={[
                      styles.option,
                      isSelected && styles.optionSelected,
                    ]}
                  >
                    {renderOption ? (
                      renderOption(item, isSelected)
                    ) : (
                      <View style={styles.optionContent}>
                        {renderColorIcon(item)}
                        <Text
                          style={[
                            styles.optionText,
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
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontFamily: "Cabin_500Medium",
    color: "#374151",
  },
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 12,
    position: "relative",
  },
  triggerFocused: {
    borderColor: Colors.primary,
    borderWidth: 1.5,
  },
  triggerDisabled: {
    opacity: 0.5,
  },
  leftIcon: {
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
    fontSize: 16,
    fontFamily: "Cabin_400Regular",
    color: "#111827",
    flex: 1,
  },
  placeholderText: {
    color: "#9ca3af",
  },
  chevron: {
    marginLeft: 8,
  },
  overlay: {
    flex: 1,
  },
  dropdown: {
    position: "absolute",
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    maxHeight: 280,
  },
  searchInput: {
    fontFamily: "Cabin_400Regular",
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.primary,
    color: "#111827",
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
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  optionText: {
    fontSize: 16,
    fontFamily: "Cabin_400Regular",
    color: "#111827",
  },
  optionTextSelected: {
    fontFamily: "Cabin_600SemiBold",
  },
  emptyText: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    fontFamily: "Cabin_400Regular",
    color: "#6b7280",
    fontStyle: "italic",
  },
});
