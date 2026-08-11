import { Text } from "@/components/Primitives/Text/Text";
import { colors } from "@/design/tokens";
import { ChevronRight, Users } from "lucide-react-native";
import { Pressable, StyleSheet, View } from "react-native";

export interface CommunityListItem {
  id: number;
  title: string;
  description?: string | null;
  slug: string;
}

interface Props {
  items: CommunityListItem[];
  onPressItem: (item: CommunityListItem) => void;
}

export default function CommunityList({ items, onPressItem }: Props) {
  return (
    <View style={styles.list}>
      {items.map((item) => (
        <Pressable
          key={item.id}
          style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
          onPress={() => onPressItem(item)}
        >
          <View style={styles.icon}>
            <Users size={20} color={colors.primary} strokeWidth={1.8} />
          </View>
          <View style={styles.info}>
            <Text size="sm" weight="semibold" numberOfLines={1}>
              {item.title}
            </Text>
            {item.description ? (
              <Text size="xs" color="tertiary" numberOfLines={2}>
                {item.description}
              </Text>
            ) : null}
          </View>
          <ChevronRight size={18} color={colors.foregroundTertiary} strokeWidth={2} />
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: 10 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  cardPressed: { opacity: 0.85 },
  icon: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.borderFocus,
  },
  info: { flex: 1, gap: 2 },
});
