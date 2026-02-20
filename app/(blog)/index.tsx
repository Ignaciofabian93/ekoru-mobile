import Colors from "@/constants/Colors";
import { Text } from "@/components/shared/Text/Text";
import {
  Bookmark,
  ChevronRight,
  Clock,
  Leaf,
  Newspaper,
  Search,
  Share2,
  TreePine,
  TrendingUp,
} from "lucide-react-native";
import React from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";

const TOPICS = ["All", "Climate", "Lifestyle", "Tech", "Policy", "Tips"];

const FEATURED_POST = {
  title: "How Ekoru is Planting Trees with Every Purchase",
  author: "Ekoru Team",
  date: "Feb 18, 2026",
  readTime: "5 min read",
  excerpt:
    "Every transaction on Ekoru contributes directly to reforestation projects around the world. Here's how our model works and the impact so far.",
};

const POSTS = [
  {
    id: "1",
    title: "10 Easy Swaps for a Zero-Waste Kitchen",
    author: "Maria G.",
    date: "Feb 15, 2026",
    readTime: "4 min read",
    tag: "Lifestyle",
  },
  {
    id: "2",
    title: "The Future of Renewable Energy in Latin America",
    author: "Carlos V.",
    date: "Feb 12, 2026",
    readTime: "7 min read",
    tag: "Policy",
  },
  {
    id: "3",
    title: "Circular Economy: What It Means for Consumers",
    author: "Ana P.",
    date: "Feb 10, 2026",
    readTime: "6 min read",
    tag: "Tech",
  },
  {
    id: "4",
    title: "5 Apps That Help You Live More Sustainably",
    author: "Ekoru Team",
    date: "Feb 8, 2026",
    readTime: "3 min read",
    tag: "Tips",
  },
];

const TAG_COLORS: Record<string, string> = {
  Lifestyle: "#10b981",
  Policy: "#6366f1",
  Tech: "#3b82f6",
  Tips: Colors.primary,
  Climate: "#f59e0b",
};

export default function BlogScreen() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Search */}
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Search size={16} color={Colors.foregroundTertiary} strokeWidth={2} />
          <Text size="sm" color="tertiary">
            Search articles...
          </Text>
        </View>
      </View>

      {/* Topic pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.topicsRow}
      >
        {TOPICS.map((topic, i) => (
          <Pressable
            key={topic}
            style={[styles.topicChip, i === 0 && styles.topicChipActive]}
          >
            <Text
              size="xs"
              weight={i === 0 ? "semibold" : "normal"}
              style={i === 0 ? styles.chipLabelActive : styles.chipLabel}
            >
              {topic}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Featured article */}
      <View style={styles.sectionHeader}>
        <Text size="base" weight="semibold">
          Featured
        </Text>
      </View>
      <Pressable style={styles.featuredCard}>
        {/* Image placeholder */}
        <View style={styles.featuredImage}>
          <TreePine size={48} color={Colors.primary} strokeWidth={1} />
        </View>
        <View style={styles.featuredBody}>
          <View style={styles.featuredTag}>
            <Leaf size={11} color={Colors.primaryDark} strokeWidth={2} />
            <Text size="xs" weight="semibold" style={styles.featuredTagLabel}>
              Editor's Pick
            </Text>
          </View>
          <Text size="base" weight="bold" numberOfLines={3}>
            {FEATURED_POST.title}
          </Text>
          <Text size="xs" color="secondary" numberOfLines={2}>
            {FEATURED_POST.excerpt}
          </Text>
          <View style={styles.postMeta}>
            <Text size="xs" weight="medium" color="tertiary">
              {FEATURED_POST.author}
            </Text>
            <View style={styles.metaDot} />
            <Clock size={11} color={Colors.foregroundTertiary} strokeWidth={2} />
            <Text size="xs" color="tertiary">
              {FEATURED_POST.readTime}
            </Text>
          </View>
        </View>
      </Pressable>

      {/* Latest articles */}
      <View style={styles.sectionHeader}>
        <Text size="base" weight="semibold">
          Latest Articles
        </Text>
        <Pressable style={styles.trendingBtn}>
          <TrendingUp size={13} color={Colors.primary} strokeWidth={2} />
          <Text size="xs" color="primary" weight="medium">
            Trending
          </Text>
        </Pressable>
      </View>
      <View style={styles.postList}>
        {POSTS.map((post) => (
          <Pressable key={post.id} style={styles.postCard}>
            {/* Thumbnail */}
            <View style={styles.postThumb}>
              <Newspaper size={20} color={Colors.primary} strokeWidth={1.5} />
            </View>
            <View style={styles.postInfo}>
              <View
                style={[
                  styles.postTag,
                  { backgroundColor: `${TAG_COLORS[post.tag] ?? Colors.primary}18` },
                ]}
              >
                <Text
                  size="xs"
                  weight="semibold"
                  style={{ color: TAG_COLORS[post.tag] ?? Colors.primary, fontSize: 10 }}
                >
                  {post.tag}
                </Text>
              </View>
              <Text size="sm" weight="semibold" numberOfLines={2}>
                {post.title}
              </Text>
              <View style={styles.postMeta}>
                <Text size="xs" color="tertiary">
                  {post.date}
                </Text>
                <View style={styles.metaDot} />
                <Clock size={11} color={Colors.foregroundTertiary} strokeWidth={2} />
                <Text size="xs" color="tertiary">
                  {post.readTime}
                </Text>
              </View>
            </View>
            <View style={styles.postActions}>
              <Pressable hitSlop={8}>
                <Bookmark size={16} color={Colors.foregroundTertiary} strokeWidth={1.75} />
              </Pressable>
              <Pressable hitSlop={8}>
                <Share2 size={16} color={Colors.foregroundTertiary} strokeWidth={1.75} />
              </Pressable>
            </View>
          </Pressable>
        ))}
      </View>

      {/* Newsletter CTA */}
      <Pressable style={styles.newsletterCard}>
        <Leaf size={20} color={Colors.primaryDark} strokeWidth={1.5} />
        <View style={{ flex: 1 }}>
          <Text size="sm" weight="bold" style={{ color: Colors.primaryDark }}>
            Weekly Eco Digest
          </Text>
          <Text size="xs" style={{ color: Colors.primaryDark, opacity: 0.8 }}>
            Get the latest green news in your inbox
          </Text>
        </View>
        <ChevronRight size={18} color={Colors.primaryDark} strokeWidth={2} />
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { paddingBottom: 32 },
  searchRow: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 40,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  topicsRow: {
    paddingHorizontal: 16,
    gap: 8,
    paddingBottom: 4,
  },
  topicChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: Colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  topicChipActive: {
    backgroundColor: Colors.primary,
    borderColor: "transparent",
  },
  chipLabel: { color: Colors.foregroundSecondary },
  chipLabelActive: { color: "#fff" },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 12,
  },
  trendingBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  featuredCard: {
    marginHorizontal: 16,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  featuredImage: {
    height: 160,
    backgroundColor: Colors.backgroundPrimaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  featuredBody: {
    padding: 14,
    gap: 8,
  },
  featuredTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    alignSelf: "flex-start",
    backgroundColor: Colors.backgroundPrimaryLight,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: Colors.borderFocus,
  },
  featuredTagLabel: { color: Colors.primaryDark, fontSize: 10 },
  postMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 2,
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: Colors.foregroundTertiary,
  },
  postList: {
    paddingHorizontal: 16,
    gap: 10,
  },
  postCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  postThumb: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: Colors.backgroundPrimaryLight,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.borderFocus,
  },
  postInfo: { flex: 1, gap: 5 },
  postTag: {
    alignSelf: "flex-start",
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  postActions: {
    gap: 10,
    alignItems: "center",
  },
  newsletterCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginHorizontal: 16,
    marginTop: 24,
    padding: 16,
    backgroundColor: Colors.backgroundPrimaryLight,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.borderFocus,
  },
});
