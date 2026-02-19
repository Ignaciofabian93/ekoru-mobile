import { Text as AppText } from "@/components/shared/Text/Text";
import { Title } from "@/components/shared/Title/Title";
import Colors from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
  ArrowUpRight,
  Package2,
  ScanBarcode,
  Star,
  Store,
} from "lucide-react-native";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  FadeIn,
  LinearTransition,
} from "react-native-reanimated";

type CategoryId = "marketplace" | "stores" | "services";

interface TopItem {
  name: string;
  value: string;
}

interface Category {
  id: CategoryId;
  title: string;
  description: string;
  Icon: any;
  route: string;
  gradient: string[];
  tags: string[];
  topItems: TopItem[];
  meta: string;
}

const CATEGORIES: Record<CategoryId, Category> = {
  marketplace: {
    id: "marketplace",
    title: "Marketplace",
    description: "Buy & sell pre-loved sustainable items",
    Icon: Package2,
    route: "/(tabs)/marketplace",
    gradient: [Colors.primaryDark, "#3f6212", Colors.primary],
    tags: ["Clothing", "Bikes", "Plants", "Electronics"],
    topItems: [
      { name: "Recycled Wool Jacket", value: "$45" },
      { name: "Vintage City Bike", value: "$129" },
      { name: "Handmade Ceramic Set", value: "$18" },
    ],
    meta: "567+ products",
  },
  stores: {
    id: "stores",
    title: "Eco Stores",
    description: "Discover verified sustainable shops near you",
    Icon: Store,
    route: "/(tabs)/stores",
    gradient: [Colors.secondaryDark, Colors.secondary],
    tags: ["Organic", "Zero Waste", "Fair Trade"],
    topItems: [
      { name: "Verde Market", value: "⭐ 4.9" },
      { name: "EcoWear Boutique", value: "⭐ 4.8" },
      { name: "Green Roots", value: "⭐ 4.7" },
    ],
    meta: "89 verified",
  },
  services: {
    id: "services",
    title: "Services",
    description: "Repair, rent & swap — give things a second life",
    Icon: ScanBarcode,
    route: "/(tabs)/services",
    gradient: ["#92400e", Colors.accent],
    tags: ["Repair", "Rental", "Swap", "Upcycle"],
    topItems: [
      { name: "Bike Repair Workshop", value: "⭐ 4.9" },
      { name: "Clothing Alterations", value: "⭐ 4.8" },
      { name: "Tool Rental Hub", value: "⭐ 4.7" },
    ],
    meta: "45 available",
  },
};

const ORDER: CategoryId[] = ["marketplace", "stores", "services"];

export default function CategoriesSection() {
  const [active, setActive] = useState<CategoryId>("marketplace");

  const featured = CATEGORIES[active];
  const small = ORDER.filter((id) => id !== active).map((id) => CATEGORIES[id]);

  return (
    <View style={styles.container}>
      <Title level="h4" align="center">Explore our categories</Title>
      <AppText size="sm" color="secondary" align="center" style={{ marginTop: 4, marginBottom: 16 }}>
        Find what moves you forward.
      </AppText>

      <View style={styles.grid}>
        {/* Featured card — re-mounts on active change, animates in */}
        <Animated.View key={active} entering={FadeIn.duration(250)}>
          <LargeCard
            category={featured}
            onNavigate={() => router.push(featured.route as any)}
          />
        </Animated.View>

        {/* Small cards — animate position when order changes */}
        <View style={styles.row}>
          {small.map((cat) => (
            <Animated.View
              key={cat.id}
              layout={LinearTransition.duration(350).easing(Easing.inOut(Easing.ease))}
              entering={FadeIn.duration(300)}
              style={styles.half}
            >
              <SmallCard
                category={cat}
                onExpand={() => setActive(cat.id)}
                onNavigate={() => router.push(cat.route as any)}
              />
            </Animated.View>
          ))}
        </View>
      </View>
    </View>
  );
}

function LargeCard({
  category,
  onNavigate,
}: {
  category: Category;
  onNavigate: () => void;
}) {
  const { Icon, gradient, title, description, tags, topItems } = category;

  return (
    <View style={styles.shadow}>
      <LinearGradient
        colors={gradient as any}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.card, styles.largeCard]}
      >
        <View style={[styles.circle, styles.circleTopRight]} />
        <View style={[styles.circle, styles.circleBottomLeft]} />

        {/* Header */}
        <View style={styles.cardTop}>
          <View style={styles.iconBadge}>
            <Icon size={22} color="#fff" strokeWidth={1.5} />
          </View>
          <Pressable onPress={onNavigate} hitSlop={10} style={styles.arrowBtn}>
            <ArrowUpRight size={19} color="#fff" strokeWidth={2.5} />
          </Pressable>
        </View>

        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardDesc}>{description}</Text>

        {/* Tags */}
        <View style={styles.tagsRow}>
          {tags.map((tag) => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Top picks */}
        <View style={styles.topPicksHeader}>
          <Star size={12} color="rgba(255,255,255,0.7)" fill="rgba(255,255,255,0.7)" strokeWidth={0} />
          <Text style={styles.topPicksLabel}>Top picks</Text>
        </View>
        {topItems.map((item, i) => (
          <View
            key={item.name}
            style={[
              styles.topItem,
              i < topItems.length - 1 && styles.topItemBorder,
            ]}
          >
            <Text style={styles.topItemName} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.topItemValue}>{item.value}</Text>
          </View>
        ))}
      </LinearGradient>
    </View>
  );
}

function SmallCard({
  category,
  onExpand,
  onNavigate,
}: {
  category: Category;
  onExpand: () => void;
  onNavigate: () => void;
}) {
  const { Icon, gradient, title, meta } = category;

  return (
    <Pressable
      onPress={onExpand}
      style={({ pressed }) => [styles.shadow, { opacity: pressed ? 0.88 : 1 }]}
    >
      <LinearGradient
        colors={gradient as any}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.card, styles.smallCard]}
      >
        <View style={[styles.circle, styles.circleSmallCard]} />

        <View style={styles.smallCardContent}>
          <View style={styles.cardTop}>
            <View style={[styles.iconBadge, styles.iconBadgeSm]}>
              <Icon size={18} color="#fff" strokeWidth={1.5} />
            </View>
            {/* Arrow is the only navigation trigger */}
            <Pressable onPress={onNavigate} hitSlop={10} style={styles.arrowBtn}>
              <ArrowUpRight size={15} color="#fff" strokeWidth={2.5} />
            </Pressable>
          </View>

          <View>
            <Text style={[styles.cardTitle, styles.cardTitleSm]}>{title}</Text>
            <Text style={styles.cardMeta}>{meta}</Text>
          </View>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 32,
    marginBottom: 0,
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
  largeCard: {
    paddingBottom: 20,
  },
  smallCard: {
    minHeight: 148,
  },
  smallCardContent: {
    flex: 1,
    justifyContent: "space-between",
  },
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
    width: 140,
    height: 140,
    top: -48,
    right: -38,
  },
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
  arrowBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
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
    marginBottom: 14,
  },
  cardMeta: {
    fontSize: 13,
    fontFamily: "Cabin_500Medium",
    color: "rgba(255,255,255,0.72)",
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 16,
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
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "rgba(255,255,255,0.25)",
    marginBottom: 14,
  },
  topPicksHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 8,
  },
  topPicksLabel: {
    fontSize: 11,
    fontFamily: "Cabin_600SemiBold",
    color: "rgba(255,255,255,0.65)",
    textTransform: "uppercase",
    letterSpacing: 0.9,
  },
  topItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 9,
  },
  topItemBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(255,255,255,0.18)",
  },
  topItemName: {
    fontSize: 14,
    fontFamily: "Cabin_500Medium",
    color: "#fff",
    flex: 1,
    marginRight: 8,
  },
  topItemValue: {
    fontSize: 14,
    fontFamily: "Cabin_700Bold",
    color: "rgba(255,255,255,0.9)",
  },
});
