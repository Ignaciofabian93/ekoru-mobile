import MainButton from "@/components/shared/Button/MainButton";
import { Text as AppText } from "@/components/shared/Text/Text";
import { Title } from "@/components/shared/Title/Title";
import Colors from "@/constants/Colors";
import type { CommunityEvent, CommunityEventType } from "@/types/community";
import { LinearGradient } from "expo-linear-gradient";
import {
  BookOpen,
  Calendar,
  MapPin,
  Mic2,
  ShoppingBag,
  Users,
  Wifi,
  Wrench,
} from "lucide-react-native";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

// ─── Event type config ────────────────────────────────────────────────────────

const TYPE_CONFIG: Record<
  CommunityEventType,
  { label: string; icon: typeof Mic2; gradient: [string, string] }
> = {
  talk:     { label: "Talk",     icon: Mic2,        gradient: [Colors.secondaryDark, Colors.secondary] },
  workshop: { label: "Workshop", icon: Wrench,      gradient: [Colors.primaryDark,   Colors.primary]   },
  tutorial: { label: "Tutorial", icon: BookOpen,    gradient: [Colors.accentHover,   Colors.accent]    },
  fair:     { label: "Fair",     icon: ShoppingBag, gradient: ["#2563eb",            Colors.info]      },
};

// ─── Dummy data ───────────────────────────────────────────────────────────────

const EVENTS: CommunityEvent[] = [
  {
    id: "ev1",
    title: "Circular Economy 101",
    description: "Learn the fundamentals of the circular economy and how small actions create big impact.",
    type: "talk",
    date: "Mar 8, 2026",
    time: "18:00 – 19:30",
    location: "Online",
    isOnline: true,
    organizer: "Ekoru Team",
    attendees: 142,
    capacity: 200,
    tags: ["Sustainability", "Economy"],
    isFree: true,
  },
  {
    id: "ev2",
    title: "Upcycling Textile Workshop",
    description: "Hands-on session: transform old clothes into new accessories with zero waste.",
    type: "workshop",
    date: "Mar 14, 2026",
    time: "10:00 – 13:00",
    location: "Centro Cultural G. Mistral",
    isOnline: false,
    organizer: "EcoMakers Santiago",
    attendees: 28,
    capacity: 30,
    tags: ["Textiles", "DIY"],
    isFree: false,
    price: 8990,
  },
  {
    id: "ev3",
    title: "How to Repair Your Electronics",
    description: "Step-by-step tutorial covering the most common household device repairs.",
    type: "tutorial",
    date: "Mar 20, 2026",
    time: "17:00 – 18:30",
    location: "Online",
    isOnline: true,
    organizer: "RepairCafé Chile",
    attendees: 87,
    capacity: 150,
    tags: ["Electronics", "Repair"],
    isFree: true,
  },
  {
    id: "ev4",
    title: "Sustainable Goods Fair",
    description: "Curated marketplace fair with eco-friendly vendors and live demos.",
    type: "fair",
    date: "Mar 28, 2026",
    time: "09:00 – 18:00",
    location: "Parque Bustamante",
    isOnline: false,
    organizer: "Ekoru Community",
    attendees: 310,
    capacity: 500,
    tags: ["Marketplace", "Local"],
    isFree: true,
  },
];

// ─── Event card ───────────────────────────────────────────────────────────────

function EventCard({ event, onPress }: { event: CommunityEvent; onPress: () => void }) {
  const cfg = TYPE_CONFIG[event.type];
  const TypeIcon = cfg.icon;
  const spotsLeft = event.capacity - event.attendees;
  const fillPct = Math.round((event.attendees / event.capacity) * 100);
  const almostFull = fillPct >= 85;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, { opacity: pressed ? 0.93 : 1 }]}
    >
      {/* Gradient header */}
      <LinearGradient
        colors={cfg.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.cardHeader}
      >
        <View style={styles.typeBadge}>
          <TypeIcon size={12} color={cfg.gradient[1]} strokeWidth={2.5} />
          <Text style={[styles.typeBadgeText, { color: cfg.gradient[1] }]}>
            {cfg.label}
          </Text>
        </View>

        <View style={styles.priceBadge}>
          <Text style={styles.priceText}>
            {event.isFree ? "Free" : `$${event.price!.toLocaleString("es-CL")}`}
          </Text>
        </View>
      </LinearGradient>

      {/* Body */}
      <View style={styles.cardBody}>
        <Text style={styles.title} numberOfLines={2}>{event.title}</Text>

        {/* Date */}
        <View style={styles.infoRow}>
          <Calendar size={13} color={Colors.foregroundSecondary} strokeWidth={1.75} />
          <Text style={styles.infoText}>{event.date}</Text>
          <Text style={styles.infoSep}>·</Text>
          <Text style={styles.infoText}>{event.time}</Text>
        </View>

        {/* Location */}
        <View style={styles.infoRow}>
          {event.isOnline
            ? <Wifi size={13} color={Colors.foregroundSecondary} strokeWidth={1.75} />
            : <MapPin size={13} color={Colors.foregroundSecondary} strokeWidth={1.75} />
          }
          <Text style={styles.infoText} numberOfLines={1}>{event.location}</Text>
        </View>

        <Text style={styles.organizer}>by {event.organizer}</Text>

        {/* Capacity bar */}
        <View style={styles.capacityRow}>
          <Users
            size={12}
            color={almostFull ? Colors.danger : Colors.foregroundTertiary}
            strokeWidth={1.75}
          />
          <Text style={[styles.capacityText, almostFull && styles.capacityDanger]}>
            {spotsLeft > 0 ? `${spotsLeft} spots left` : "Full"}
          </Text>
          <View style={styles.barTrack}>
            <View
              style={[
                styles.barFill,
                {
                  width: `${fillPct}%` as any,
                  backgroundColor: almostFull ? Colors.danger : cfg.gradient[1],
                },
              ]}
            />
          </View>
        </View>

        {/* Tags */}
        <View style={styles.tagsRow}>
          {event.tags.slice(0, 2).map((tag) => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>
    </Pressable>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function EventsSection() {
  return (
    <View style={styles.container}>
      <Title level="h4" align="center">Community Events</Title>
      <AppText size="sm" color="secondary" align="center" style={{ marginTop: 4 }}>
        Talks, workshops & tutorials — join the conversation
      </AppText>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {EVENTS.map((event) => (
          <EventCard key={event.id} event={event} onPress={() => {}} />
        ))}
      </ScrollView>

      <View style={styles.cta}>
        <MainButton
          text="See all events"
          onPress={() => {}}
          variant="secondary"
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

  // ── Card ──────────────────────────────────────────────────────────────────
  card: {
    width: 240,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.borderLight,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  typeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(255,255,255,0.92)",
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 20,
  },
  typeBadgeText: {
    fontSize: 11,
    fontFamily: "Cabin_700Bold",
  },
  priceBadge: {
    backgroundColor: "rgba(0,0,0,0.18)",
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 20,
  },
  priceText: {
    fontSize: 11,
    fontFamily: "Cabin_600SemiBold",
    color: "#fff",
  },

  // ── Body ──────────────────────────────────────────────────────────────────
  cardBody: {
    padding: 14,
    gap: 6,
  },
  title: {
    fontSize: 15,
    fontFamily: "Cabin_700Bold",
    color: Colors.foreground,
    lineHeight: 20,
    marginBottom: 2,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  infoText: {
    fontSize: 12,
    fontFamily: "Cabin_400Regular",
    color: Colors.foregroundSecondary,
    flexShrink: 1,
  },
  infoSep: {
    fontSize: 12,
    color: Colors.foregroundTertiary,
  },
  organizer: {
    fontSize: 11,
    fontFamily: "Cabin_500Medium",
    color: Colors.foregroundTertiary,
    marginTop: 2,
  },

  // ── Capacity ──────────────────────────────────────────────────────────────
  capacityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 2,
  },
  capacityText: {
    fontSize: 11,
    fontFamily: "Cabin_500Medium",
    color: Colors.foregroundTertiary,
    minWidth: 72,
  },
  capacityDanger: {
    color: Colors.danger,
  },
  barTrack: {
    flex: 1,
    height: 4,
    backgroundColor: Colors.borderLight,
    borderRadius: 99,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 99,
  },

  // ── Tags ──────────────────────────────────────────────────────────────────
  tagsRow: {
    flexDirection: "row",
    gap: 5,
    marginTop: 2,
  },
  tag: {
    backgroundColor: Colors.backgroundSecondary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  tagText: {
    fontSize: 10,
    fontFamily: "Cabin_500Medium",
    color: Colors.foregroundSecondary,
  },
});
