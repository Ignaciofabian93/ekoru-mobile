import { Text } from "@/components/shared/Text/Text";
import Colors from "@/constants/Colors";
import { ChevronRight } from "lucide-react-native";
import { Pressable, StyleSheet, View } from "react-native";

export interface BreadcrumbItem {
  label: string;
  onPress?: () => void;
}

interface Props {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: Props) {
  return (
    <View style={styles.row}>
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <View key={idx} style={styles.segment}>
            {idx > 0 && (
              <ChevronRight
                size={12}
                color={Colors.foregroundTertiary}
                strokeWidth={2}
              />
            )}
            {!isLast && item.onPress ? (
              <Pressable onPress={item.onPress} style={styles.linkWrap}>
                <Text size="sm" style={styles.link}>
                  {item.label}
                </Text>
              </Pressable>
            ) : (
              <Text
                size="sm"
                weight={isLast ? "semibold" : "normal"}
                style={isLast ? styles.current : styles.muted}
              >
                {item.label}
              </Text>
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    rowGap: 4,
    columnGap: 2,
    marginBottom: 20,
    paddingVertical: 2,
  },
  segment: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  linkWrap: {
    paddingVertical: 2,
  },
  link: {
    color: Colors.foregroundSecondary,
    textDecorationLine: "underline",
  },
  muted: {
    color: Colors.foregroundTertiary,
  },
  current: {
    color: Colors.foreground,
  },
});
