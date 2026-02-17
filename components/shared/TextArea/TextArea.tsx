import Colors from "@/constants/Colors";
import { useState } from "react";
import { StyleSheet, Text, TextInput, View, type TextInputProps } from "react-native";

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
        placeholderTextColor="#9ca3af"
        style={[styles.input, focused && styles.inputFocused]}
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
    fontSize: 14,
    fontFamily: "Cabin_500Medium",
    color: "#374151",
  },
  input: {
    fontFamily: "Cabin_400Regular",
    fontSize: 16,
    color: "#111827",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 12,
    height: 128,
  },
  inputFocused: {
    borderColor: Colors.primary,
    borderWidth: 1.5,
  },
});
