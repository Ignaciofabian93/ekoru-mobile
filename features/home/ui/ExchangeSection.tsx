import MainButton from "@/components/shared/Button/MainButton";
import { Text as AppText } from "@/components/shared/Text/Text";
import { Title } from "@/components/shared/Title/Title";
import Colors from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowLeftRight, MapPin } from "lucide-react-native";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ExchangeItem {
  id: string;
  offering: string;
  condition: "like_new" | "good" | "fair";
  wantedFor: string;
  location: string;
  ownerName: string;
  category: string;
}

// ─── Dummy data ───────────────────────────────────────────────────────────────

const CONDITION_LABEL: Record<ExchangeItem["condition"], string> = {
  like_new: "Like new",
  good: "Good",
  fair: "Fair",
};

const CONDITION_COLOR: Record<ExchangeItem["condition"], string> = {
  like_new: Colors.success,
  good: Colors.primary,
  fair: Colors.accent,
};

const EXCHANGE_ITEMS: ExchangeItem[] = [
  {
    id: "e1",
    offering: "Road Bike — 21-speed",
    condition: "good",
    wantedFor: "Mountain bike or similar",
    location: "Santiago Centro",
    ownerName: "Diego R.",
    category: "Sports",
  },
  {
    id: "e2",
    offering: "DSLR Camera Kit",
    condition: "like_new",
    wantedFor: "Mirrorless camera body",
    location: "Providencia",
    ownerName: "Sofía M.",
    category: "Electronics",
  },
  {
    id: "e3",
    offering: "Acoustic Guitar",
    condition: "good",
    wantedFor: "Electric guitar or bass",
    location: "Las Condes",
    ownerName: "Mateo V.",
    category: "Music",
  },
  {
    id: "e4",
    offering: "Stand-up Paddleboard",
    condition: "fair",
    wantedFor: "Surfboard or kayak",
    location: "Vitacura",
    ownerName: "Camila T.",
    category: "Outdoor",
  },
];

// ─── Exchange card ────────────────────────────────────────────────────────────

function ExchangeCard({ item, onPress }: { item: ExchangeItem; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, { opacity: pressed ? 0.92 : 1 }]}
    >
      {/* Gradient header */}
      <LinearGradient
        colors={[Colors.accentHover, Colors.accent]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.cardHeader}
      >
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>
        <ArrowLeftRight size={18} color="#fff" strokeWidth={2} />
      </LinearGradient>

      {/* Body */}
      <View style={styles.cardBody}>
        {/* Offering */}
        <Text style={styles.offeringLabel}>Offering</Text>
        <Text style={styles.offeringName} numberOfLines={1}>
          {item.offering}
        </Text>

        {/* Condition badge */}
        <View style={[styles.conditionBadge, { borderColor: CONDITION_COLOR[item.condition] }]}>
          <Text style={[styles.conditionText, { color: CONDITION_COLOR[item.condition] }]}>
            {CONDITION_LABEL[item.condition]}
          </Text>
        </View>

        {/* Divider + wanted */}
        <View style={styles.divider} />
        <Text style={styles.wantedLabel}>Wants in return</Text>
        <Text style={styles.wantedValue} numberOfLines={2}>
          {item.wantedFor}
        </Text>

        {/* Footer */}
        <View style={styles.cardFooter}>
          <MapPin size={11} color={Colors.foregroundTertiary} strokeWidth={1.5} />
          <Text style={styles.locationText} numberOfLines={1}>
            {item.location}
          </Text>
          <Text style={styles.ownerText}>· {item.ownerName}</Text>
        </View>
      </View>
    </Pressable>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ExchangeSection() {
  return (
    <View style={styles.container}>
      <Title level="h4" align="center">Exchange & Swap</Title>
      <AppText size="sm" color="secondary" align="center" style={{ marginTop: 4 }}>
        Trade what you have for what you need
      </AppText>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {EXCHANGE_ITEMS.map((item) => (
          <ExchangeCard key={item.id} item={item} onPress={() => {}} />
        ))}
      </ScrollView>

      <View style={styles.cta}>
        <MainButton
          text="Propose an Exchange"
          onPress={() => {}}
          variant="primary"
          size="md"
          fullWidth
        />
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    marginTop: 32,
    marginBottom: 0,
  },
  scroll: {
    gap: 10,
    marginVertical: 16,
  },
  cta: {
    paddingHorizontal: 4,
  },
  // Card
  card: {
    width: 200,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.borderLight,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  categoryBadge: {
    backgroundColor: "rgba(255,255,255,0.25)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  categoryText: {
    fontSize: 11,
    fontFamily: "Cabin_600SemiBold",
    color: "#fff",
  },
  cardBody: {
    padding: 12,
    gap: 4,
  },
  offeringLabel: {
    fontSize: 10,
    fontFamily: "Cabin_500Medium",
    color: Colors.foregroundTertiary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  offeringName: {
    fontSize: 14,
    fontFamily: "Cabin_700Bold",
    color: Colors.foreground,
  },
  conditionBadge: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginTop: 2,
  },
  conditionText: {
    fontSize: 10,
    fontFamily: "Cabin_600SemiBold",
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.borderLight,
    marginVertical: 6,
  },
  wantedLabel: {
    fontSize: 10,
    fontFamily: "Cabin_500Medium",
    color: Colors.foregroundTertiary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  wantedValue: {
    fontSize: 12,
    fontFamily: "Cabin_400Regular",
    color: Colors.foregroundSecondary,
    lineHeight: 17,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    marginTop: 6,
  },
  locationText: {
    fontSize: 11,
    fontFamily: "Cabin_400Regular",
    color: Colors.foregroundTertiary,
    flex: 1,
  },
  ownerText: {
    fontSize: 11,
    fontFamily: "Cabin_500Medium",
    color: Colors.foregroundTertiary,
  },
});
