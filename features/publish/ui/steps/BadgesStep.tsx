import { Text } from "@/components/shared/Text/Text";
import { Title } from "@/components/shared/Title/Title";
import Colors from "@/constants/Colors";
import type { Badge } from "@/types/enums";
import { Check } from "lucide-react-native";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import type { PublishFormValues } from "../../types/PublishForm";

const ECO_BADGES: { value: Badge; label: string; emoji: string }[] = [
  { value: "SUSTAINABLE", label: "Sustainable", emoji: "🌱" },
  { value: "HANDMADE", label: "Handmade", emoji: "🤝" },
  { value: "CRUELTY_FREE", label: "Cruelty-free", emoji: "🐰" },
  { value: "REFURBISHED", label: "Refurbished", emoji: "🔧" },
  { value: "FOR_REPAIR", label: "For repair", emoji: "🛠️" },
  { value: "EXCHANGEABLE", label: "Exchangeable", emoji: "🔄" },
  { value: "FREE_SHIPPING", label: "Free shipping", emoji: "📦" },
  { value: "OPEN_TO_OFFERS", label: "Open to offers", emoji: "💬" },
  { value: "FAMILY_BUSINESS", label: "Family business", emoji: "🏠" },
  { value: "WOMAN_OWNED", label: "Woman-owned", emoji: "👩" },
  { value: "SUPPORTS_CAUSE", label: "Supports a cause", emoji: "❤️" },
  { value: "CHARITY_SUPPORT", label: "Charity support", emoji: "🎗️" },
  { value: "IN_HOUSE_PICKUP", label: "Pickup available", emoji: "📍" },
  { value: "DELIVERED_TO_HOME", label: "Home delivery", emoji: "🚚" },
];

interface Props {
  values: PublishFormValues;
  set: <K extends keyof PublishFormValues>(
    key: K,
    value: PublishFormValues[K],
  ) => void;
}

export default function BadgesStep({ values, set }: Props) {
  const toggle = (badge: Badge) => {
    const current = values.badges;
    if (current.includes(badge)) {
      set(
        "badges",
        current.filter((b) => b !== badge),
      );
    } else {
      set("badges", [...current, badge]);
    }
  };

  return (
    <View style={styles.container}>
      <Title level="h5" weight="semibold" style={styles.title}>
        Eco & listing tags
      </Title>
      <Text size="sm" color="secondary" style={styles.subtitle}>
        Optional — help buyers discover your listing.
      </Text>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.grid}
      >
        {ECO_BADGES.map((b) => {
          const selected = values.badges.includes(b.value);
          return (
            <Pressable
              key={b.value}
              onPress={() => toggle(b.value)}
              style={[styles.pill, selected && styles.pillSelected]}
            >
              <Text style={styles.emoji}>{b.emoji}</Text>
              <Text
                size="sm"
                weight={selected ? "semibold" : "regular"}
                style={[styles.label, selected && styles.labelSelected]}
                numberOfLines={1}
              >
                {b.label}
              </Text>
              {selected && (
                <Check size={14} color={Colors.primary} strokeWidth={2.5} />
              )}
            </Pressable>
          );
        })}
      </ScrollView>

      {values.badges.length > 0 && (
        <Text size="xs" color="secondary" align="center">
          {values.badges.length} tag{values.badges.length > 1 ? "s" : ""}{" "}
          selected
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
    flex: 1,
  },
  title: {
    marginBottom: 2,
  },
  subtitle: {
    lineHeight: 20,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingBottom: 8,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.borderLight,
  },
  pillSelected: {
    backgroundColor: Colors.backgroundPrimaryLight,
    borderColor: Colors.primary,
  },
  emoji: {
    fontSize: 14,
  },
  label: {
    color: Colors.foreground,
  },
  labelSelected: {
    color: Colors.primary,
  },
});
