import Colors from "@/constants/Colors";
import { Text } from "@/components/shared/Text/Text";
import {
  Calendar,
  ChevronRight,
  Heart,
  MessageCircle,
  Plus,
  ThumbsUp,
  TreePine,
  Users,
} from "lucide-react-native";
import React from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";

const TABS = ["All", "Events", "Discussions", "Projects", "Q&A"];

const POSTS = [
  {
    id: "1",
    author: "Sarah M.",
    initials: "SM",
    time: "2h ago",
    title: "Started my zero-waste kitchen journey!",
    body: "After 3 months of effort, I finally reduced my household waste by 80%. Here's what worked...",
    likes: 142,
    comments: 38,
    tag: "Inspiration",
  },
  {
    id: "2",
    author: "Ekoru Team",
    initials: "EK",
    time: "5h ago",
    title: "Monthly Beach Cleanup — Join Us!",
    body: "We're hosting our monthly cleanup this Saturday at Sunrise Beach. Bring gloves and a bag!",
    likes: 89,
    comments: 24,
    tag: "Event",
  },
  {
    id: "3",
    author: "Marco R.",
    initials: "MR",
    time: "1d ago",
    title: "Best apps for tracking your carbon footprint?",
    body: "Looking for recommendations on carbon tracking apps that actually work and are free...",
    likes: 57,
    comments: 61,
    tag: "Q&A",
  },
];

const EVENTS = [
  { id: "1", name: "Beach Cleanup Drive", date: "Sat, Feb 22", attending: 47 },
  { id: "2", name: "Eco Film Night", date: "Fri, Feb 28", attending: 31 },
];

export default function CommunityScreen() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Filter tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsRow}
      >
        {TABS.map((tab, i) => (
          <Pressable
            key={tab}
            style={[styles.tab, i === 0 && styles.tabActive]}
          >
            <Text
              size="xs"
              weight={i === 0 ? "semibold" : "normal"}
              style={i === 0 ? styles.tabLabelActive : styles.tabLabel}
            >
              {tab}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Upcoming events */}
      <View style={styles.sectionHeader}>
        <Text size="base" weight="semibold">
          Upcoming Events
        </Text>
        <Pressable>
          <Text size="sm" color="primary" weight="medium">
            See all
          </Text>
        </Pressable>
      </View>
      <View style={styles.eventsRow}>
        {EVENTS.map((event) => (
          <Pressable key={event.id} style={styles.eventCard}>
            <View style={styles.eventIconBox}>
              <Calendar size={20} color={Colors.primary} strokeWidth={1.75} />
            </View>
            <Text size="xs" weight="semibold" numberOfLines={2}>
              {event.name}
            </Text>
            <Text size="xs" color="tertiary">
              {event.date}
            </Text>
            <View style={styles.eventAttending}>
              <Users size={11} color={Colors.foregroundTertiary} strokeWidth={2} />
              <Text size="xs" color="tertiary">
                {event.attending}
              </Text>
            </View>
          </Pressable>
        ))}
        <Pressable style={styles.eventCardNew}>
          <TreePine size={22} color={Colors.primary} strokeWidth={1.5} />
          <Text size="xs" weight="medium" color="primary" align="center">
            Create Event
          </Text>
        </Pressable>
      </View>

      {/* Community posts */}
      <View style={styles.sectionHeader}>
        <Text size="base" weight="semibold">
          Community Feed
        </Text>
      </View>
      <View style={styles.postList}>
        {POSTS.map((post) => (
          <Pressable key={post.id} style={styles.postCard}>
            <View style={styles.postHeader}>
              <View style={styles.avatar}>
                <Text size="xs" weight="bold" style={styles.avatarText}>
                  {post.initials}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text size="xs" weight="semibold">
                  {post.author}
                </Text>
                <Text size="xs" color="tertiary">
                  {post.time}
                </Text>
              </View>
              <View style={styles.postTagBadge}>
                <Text size="xs" weight="semibold" style={styles.postTagLabel}>
                  {post.tag}
                </Text>
              </View>
            </View>
            <Text size="sm" weight="semibold" style={{ marginBottom: 4 }}>
              {post.title}
            </Text>
            <Text size="xs" color="secondary" numberOfLines={2}>
              {post.body}
            </Text>
            <View style={styles.postActions}>
              <Pressable style={styles.actionBtn}>
                <ThumbsUp size={14} color={Colors.foregroundSecondary} strokeWidth={2} />
                <Text size="xs" color="secondary">
                  {post.likes}
                </Text>
              </Pressable>
              <Pressable style={styles.actionBtn}>
                <MessageCircle
                  size={14}
                  color={Colors.foregroundSecondary}
                  strokeWidth={2}
                />
                <Text size="xs" color="secondary">
                  {post.comments}
                </Text>
              </Pressable>
              <Pressable style={styles.actionBtn}>
                <Heart size={14} color={Colors.foregroundSecondary} strokeWidth={2} />
              </Pressable>
            </View>
          </Pressable>
        ))}
      </View>

      {/* Post FAB area */}
      <Pressable style={styles.newPostBtn}>
        <Plus size={18} color="#fff" strokeWidth={2.5} />
        <Text size="sm" weight="semibold" style={{ color: "#fff" }}>
          Share with Community
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { paddingBottom: 32 },
  tabsRow: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: Colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  tabActive: {
    backgroundColor: Colors.primary,
    borderColor: "transparent",
  },
  tabLabel: { color: Colors.foregroundSecondary },
  tabLabelActive: { color: "#fff" },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  eventsRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 10,
  },
  eventCard: {
    flex: 1,
    gap: 6,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  eventCardNew: {
    width: 90,
    gap: 6,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.backgroundPrimaryLight,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.borderFocus,
    borderStyle: "dashed",
  },
  eventIconBox: {
    width: 36,
    height: 36,
    borderRadius: 9,
    backgroundColor: Colors.backgroundPrimaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  eventAttending: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    marginTop: 2,
  },
  postList: {
    paddingHorizontal: 16,
    gap: 12,
  },
  postCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 14,
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: "#fff" },
  postTagBadge: {
    backgroundColor: Colors.backgroundPrimaryLight,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: Colors.borderFocus,
  },
  postTagLabel: { color: Colors.primaryDark, fontSize: 10 },
  postActions: {
    flexDirection: "row",
    gap: 16,
    marginTop: 4,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  newPostBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginHorizontal: 16,
    marginTop: 20,
    paddingVertical: 14,
    backgroundColor: Colors.primary,
    borderRadius: 12,
  },
});
