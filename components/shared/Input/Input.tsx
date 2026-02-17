import Colors from "@/constants/Colors";
import type { LucideIcon } from "lucide-react-native";
import { Eye, EyeOff } from "lucide-react-native";
import { forwardRef, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from "react-native";

type Size = "sm" | "md" | "lg" | "full";

interface InputProps extends Omit<TextInputProps, "onChange"> {
  label?: string;
  name?: string;
  value: string;
  onChangeText: (text: string) => void;
  type?: "text" | "email" | "password" | "number" | "search";
  icon?: LucideIcon;
  hasIcon?: boolean;
  size?: Size;
  isInvalid?: boolean;
  errorMessage?: string;
}

const sizeStyles: Record<Size, { width: string }> = {
  sm: { width: "33%" },
  md: { width: "50%" },
  lg: { width: "66%" },
  full: { width: "100%" },
};

const Input = forwardRef<TextInput, InputProps>(function Input(
  {
    label,
    name,
    value,
    onChangeText,
    type = "text",
    icon: Icon,
    hasIcon = true,
    size = "full",
    isInvalid = false,
    errorMessage,
    placeholder,
    maxLength = 50,
    ...rest
  },
  ref
) {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const keyboardType: TextInputProps["keyboardType"] =
    type === "email"
      ? "email-address"
      : type === "number"
        ? "numeric"
        : "default";

  return (
    <View style={[styles.container, { width: sizeStyles[size].width as any }]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputWrapper}>
        {hasIcon && Icon && (
          <View style={styles.leftIcon}>
            <Icon
              size={20}
              color={focused ? Colors.primary : "#9ca3af"}
              strokeWidth={2}
            />
          </View>
        )}
        <TextInput
          ref={ref}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          secureTextEntry={type === "password" && !showPassword}
          keyboardType={keyboardType}
          autoCapitalize={type === "email" ? "none" : "sentences"}
          autoCorrect={type !== "email" && type !== "password"}
          maxLength={maxLength}
          placeholder={placeholder}
          placeholderTextColor="#9ca3af"
          style={[
            styles.input,
            hasIcon && Icon && styles.inputWithLeftIcon,
            type === "password" && styles.inputWithRightIcon,
            focused && styles.inputFocused,
            isInvalid && styles.inputInvalid,
          ]}
          {...rest}
        />
        {type === "password" && (
          <Pressable
            onPress={() => setShowPassword((prev) => !prev)}
            style={styles.rightIcon}
          >
            {showPassword ? (
              <EyeOff size={20} color="#9ca3af" strokeWidth={2} />
            ) : (
              <Eye size={20} color="#9ca3af" strokeWidth={2} />
            )}
          </Pressable>
        )}
      </View>
      {isInvalid && errorMessage && (
        <Text style={styles.error}>{errorMessage}</Text>
      )}
    </View>
  );
});

export default Input;

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontFamily: "Cabin_500Medium",
    color: "#374151",
  },
  inputWrapper: {
    position: "relative",
    justifyContent: "center",
  },
  leftIcon: {
    position: "absolute",
    left: 12,
    zIndex: 1,
  },
  rightIcon: {
    position: "absolute",
    right: 12,
    zIndex: 1,
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
  },
  inputWithLeftIcon: {
    paddingLeft: 40,
  },
  inputWithRightIcon: {
    paddingRight: 40,
  },
  inputFocused: {
    borderColor: Colors.primary,
    borderWidth: 1.5,
  },
  inputInvalid: {
    borderColor: "#dc2626",
  },
  error: {
    fontSize: 12,
    fontFamily: "Cabin_400Regular",
    color: "#dc2626",
  },
});
