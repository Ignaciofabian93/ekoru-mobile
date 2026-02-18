import Colors from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
  ArrowUpRight,
  Package2,
  ScanBarcode,
  Store,
} from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

const MARKETPLACE_TAGS = [
  "Clothing",
  "Bikes",
  "Plants",
  "Electronics",
  "Books",
];

export default function CategoriesSection() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Explore our categories</Text>
      <Text style={styles.subtitle}>Find what moves you forward.</Text>

      <View style={styles.grid}>
        <Animated.View entering={FadeInDown.delay(80).springify()}>
          <MarketplaceCard />
        </Animated.View>

        <View style={styles.row}>
          <Animated.View
            entering={FadeInDown.delay(180).springify()}
            style={styles.half}
          >
            <StoresCard />
          </Animated.View>
          <Animated.View
            entering={FadeInDown.delay(280).springify()}
            style={styles.half}
          >
            <ServicesCard />
          </Animated.View>
        </View>
      </View>
    </View>
  );
}

function MarketplaceCard() {
  return (
    <Pressable
      style={({ pressed }) => [styles.shadow, { opacity: pressed ? 0.93 : 1 }]}
      onPress={() => router.push("/(tabs)/marketplace")}
    >
      <LinearGradient
        colors={[Colors.primaryDark, "#3f6212", Colors.primary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.card, styles.marketplaceCard]}
      >
        {/* Decorative circles */}
        <View style={[styles.circle, styles.circleTopRight]} />
        <View style={[styles.circle, styles.circleBottomLeft]} />

        <View style={styles.cardTop}>
          <View style={styles.iconBadge}>
            <Package2 size={22} color="#fff" strokeWidth={1.5} />
          </View>
          <ArrowUpRight
            size={20}
            color="rgba(255,255,255,0.65)"
            strokeWidth={2}
          />
        </View>

        <Text style={styles.cardTitle}>Marketplace</Text>
        <Text style={styles.cardDesc}>
          Buy &amp; sell pre-loved sustainable items
        </Text>

        <View style={styles.tagsRow}>
          {MARKETPLACE_TAGS.map((tag) => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>
    </Pressable>
  );
}

function StoresCard() {
  return (
    <Pressable
      style={({ pressed }) => [styles.shadow, { opacity: pressed ? 0.93 : 1 }]}
      onPress={() => router.push("/(tabs)/stores")}
    >
      <LinearGradient
        colors={[Colors.secondaryDark, Colors.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.card, styles.smallCard]}
      >
        <View style={[styles.circle, styles.circleSmallCard]} />

        <View style={styles.smallCardContent}>
          <View style={styles.cardTop}>
            <View style={[styles.iconBadge, styles.iconBadgeSm]}>
              <Store size={18} color="#fff" strokeWidth={1.5} />
            </View>
            <ArrowUpRight
              size={16}
              color="rgba(255,255,255,0.65)"
              strokeWidth={2}
            />
          </View>

          <View>
            <Text style={[styles.cardTitle, styles.cardTitleSm]}>
              Eco Stores
            </Text>
            <Text style={styles.cardMeta}>89 verified</Text>
          </View>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

function ServicesCard() {
  return (
    <Pressable
      style={({ pressed }) => [styles.shadow, { opacity: pressed ? 0.93 : 1 }]}
      onPress={() => router.push("/(tabs)/services")}
    >
      <LinearGradient
        colors={["#92400e", Colors.accent]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.card, styles.smallCard]}
      >
        <View style={[styles.circle, styles.circleSmallCard]} />

        <View style={styles.smallCardContent}>
          <View style={styles.cardTop}>
            <View style={[styles.iconBadge, styles.iconBadgeSm]}>
              <ScanBarcode size={18} color="#fff" strokeWidth={1.5} />
            </View>
            <ArrowUpRight
              size={16}
              color="rgba(255,255,255,0.65)"
              strokeWidth={2}
            />
          </View>

          <View>
            <Text style={[styles.cardTitle, styles.cardTitleSm]}>Services</Text>
            <Text style={styles.cardMeta}>45 available</Text>
          </View>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 32,
    marginTop: 24,
  },
  heading: {
    fontSize: 22,
    fontFamily: "Cabin_700Bold",
    color: Colors.foreground,
    marginBottom: 2,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Cabin_400Regular",
    color: Colors.foregroundSecondary,
    marginBottom: 16,
    textAlign: "center",
  },
  grid: {
    gap: 10,
  },
  row: {
    flexDirection: "row",
    gap: 10,
  },
  half: {
    flex: 1,
  },
  shadow: {
    borderRadius: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 5,
  },
  card: {
    borderRadius: 18,
    overflow: "hidden",
    padding: 16,
  },
  marketplaceCard: {
    paddingBottom: 20,
    minHeight: 175,
  },
  smallCard: {
    minHeight: 150,
  },
  smallCardContent: {
    flex: 1,
    justifyContent: "space-between",
  },
  // Decorative background circles
  circle: {
    position: "absolute",
    borderRadius: 9999,
    backgroundColor: "rgba(255,255,255,0.09)",
  },
  circleTopRight: {
    width: 220,
    height: 220,
    top: -70,
    right: -70,
  },
  circleBottomLeft: {
    width: 130,
    height: 130,
    bottom: -40,
    left: -40,
  },
  circleSmallCard: {
    width: 130,
    height: 130,
    top: -45,
    right: -35,
  },
  // Top row: icon + arrow
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  iconBadge: {
    width: 46,
    height: 46,
    borderRadius: 13,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  iconBadgeSm: {
    width: 38,
    height: 38,
    borderRadius: 11,
  },
  // Text
  cardTitle: {
    fontSize: 21,
    fontFamily: "Cabin_700Bold",
    color: "#fff",
    marginBottom: 4,
  },
  cardTitleSm: {
    fontSize: 17,
  },
  cardDesc: {
    fontSize: 13,
    fontFamily: "Cabin_400Regular",
    color: "rgba(255,255,255,0.78)",
    lineHeight: 19,
    marginBottom: 18,
  },
  cardMeta: {
    fontSize: 13,
    fontFamily: "Cabin_500Medium",
    color: "rgba(255,255,255,0.72)",
  },
  // Subcategory chips
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  tag: {
    backgroundColor: "rgba(255,255,255,0.18)",
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: 20,
  },
  tagText: {
    fontSize: 12,
    fontFamily: "Cabin_500Medium",
    color: "#fff",
  },
});
