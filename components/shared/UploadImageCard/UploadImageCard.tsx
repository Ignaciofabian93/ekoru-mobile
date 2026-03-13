import Colors from "@/constants/Colors";
import { LucideIcon } from "lucide-react-native";
import { Pressable, View } from "react-native";
import { Text } from "../Text/Text";

export default function UploadImageCard({
  onPress,
  title,
  description,
  icon: Icon,
  iconColor,
  disabled = false,
}: {
  onPress: () => void;
  title: string;
  description: string;
  icon: LucideIcon;
  iconStyle?: object;
  iconColor: string;
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{ flex: 1, alignItems: "center" }}
      hitSlop={6}
      disabled={disabled}
    >
      <View
        style={{
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          backgroundColor: Colors.surface,
          borderRadius: 16,
          paddingVertical: 20,
          paddingHorizontal: 12,
          borderWidth: 1.5,
          borderColor: `${iconColor}33`,
          elevation: disabled ? 0 : 3,
          opacity: disabled ? 0.4 : 1,
          filter: disabled ? "grayscale(100%)" : "none",
        }}
      >
        <Icon size={40} color={iconColor} strokeWidth={1.75} />
        <Text size="sm" weight="semibold" align="center">
          {title}
        </Text>
        <Text size="xs" color="secondary" align="center">
          {description}
        </Text>
      </View>
    </Pressable>
  );
}
