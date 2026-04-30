import { borderRadius, colors, fontFamily, fontSize, spacing } from "@/design/tokens";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from "react-native";

interface TextAreaProps extends Omit<TextInputProps, "onChange"> {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  maxLength?: number;
  minLength?: number;
}

export default function TextArea({
  label,
  placeholder,
  value,
  onChangeText,
  maxLength,
  style,
  ...rest
}: TextAreaProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        multiline
        textAlignVertical="top"
        maxLength={maxLength}
        placeholder={placeholder}
        placeholderTextColor={colors.inputPlaceholder}
        style={[styles.input, focused && styles.inputFocused, style]}
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: 6,
  },
  label: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.medium,
    color: colors.foregroundSecondary,
  },
  input: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.base,
    color: colors.foreground,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.inputBorder,
    borderRadius: borderRadius.md,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    height: 128,
  },
  inputFocused: {
    borderColor: colors.primary,
    borderWidth: 1.5,
  },
});
