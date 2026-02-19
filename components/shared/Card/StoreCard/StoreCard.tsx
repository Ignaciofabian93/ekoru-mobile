import Colors from "@/constants/Colors";
import type { Store } from "@/features/marketplace/types/Store";
import { sellerTypeTranslate } from "@/utils/sellerTypeTranslate";
import { LinearGradient } from "expo-linear-gradient";
import { MapPin, Star } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface Props {
  store: Store;
  onPress?: () => void;
}

function getInitials(store: Store): string {
  const words = store.storeName.trim().split(/\s+/);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

export default function StoreCard({ store, onPress }: Props) {
  const initials = getInitials(store);
  const county = store.seller.county?.county;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, { opacity: pressed ? 0.92 : 1 }]}
    >
      {/* Gradient header band */}
      <LinearGradient
        colors={[Colors.secondaryDark, Colors.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      />

      {/* Floating initials avatar */}
      <View style={styles.avatarWrapper}>
        <LinearGradient
          colors={[Colors.secondaryDark, Colors.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.avatar}
        >
          <Text style={styles.avatarText}>{initials}</Text>
        </LinearGradient>
      </View>

      {/* Body */}
      <View style={styles.body}>
        {/* Name + type badge */}
        <View style={styles.nameRow}>
          <Text style={styles.storeName} numberOfLines={1}>
            {store.storeName}
          </Text>
          <View style={styles.typeBadge}>
            <Text style={styles.typeBadgeText}>
              {sellerTypeTranslate(store.seller.sellerType)}
            </Text>
          </View>
        </View>

        {/* Rating */}
        <View style={styles.ratingRow}>
          <Star size={13} color={Colors.accent} fill={Colors.accent} strokeWidth={0} />
          <Text style={styles.ratingValue}>{store.rating.toFixed(1)}</Text>
          <Text style={styles.ratingCount}>({store.reviewCount})</Text>
          <Text style={styles.dot}>·</Text>
          <Text style={styles.productCount}>{store.productCount} productos</Text>
        </View>

        {/* Location */}
        {county && (
          <View style={styles.locationRow}>
            <MapPin size={12} color={Colors.foregroundTertiary} strokeWidth={1.5} />
            <Text style={styles.locationText} numberOfLines={1}>
              {county}
            </Text>
          </View>
        )}

        {/* Tags */}
        {store.tags.length > 0 && (
          <View style={styles.tagsRow}>
            {store.tags.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 210,
    backgroundColor: "#fff",
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
  },
  header: {
    height: 56,
  },
  avatarWrapper: {
    position: "absolute",
    top: 28,
    left: 16,
    // Elevation so avatar sits above the header gradient
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  avatarText: {
    fontSize: 18,
    fontFamily: "Cabin_700Bold",
    color: "#fff",
    letterSpacing: 0.5,
  },
  body: {
    paddingTop: 34,
    paddingHorizontal: 14,
    paddingBottom: 14,
    gap: 6,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 6,
  },
  storeName: {
    fontSize: 15,
    fontFamily: "Cabin_700Bold",
    color: Colors.foreground,
    flex: 1,
  },
  typeBadge: {
    backgroundColor: Colors.backgroundSecondary,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  typeBadgeText: {
    fontSize: 10,
    fontFamily: "Cabin_500Medium",
    color: Colors.foregroundSecondary,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  ratingValue: {
    fontSize: 13,
    fontFamily: "Cabin_700Bold",
    color: Colors.foreground,
  },
  ratingCount: {
    fontSize: 12,
    fontFamily: "Cabin_400Regular",
    color: Colors.foregroundSecondary,
  },
  dot: {
    fontSize: 12,
    color: Colors.foregroundTertiary,
    marginHorizontal: 2,
  },
  productCount: {
    fontSize: 12,
    fontFamily: "Cabin_400Regular",
    color: Colors.foregroundSecondary,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  locationText: {
    fontSize: 12,
    fontFamily: "Cabin_400Regular",
    color: Colors.foregroundSecondary,
    flex: 1,
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
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
    fontSize: 11,
    fontFamily: "Cabin_500Medium",
    color: Colors.foregroundSecondary,
  },
});
