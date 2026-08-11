import { Text } from "@/components/Primitives/Text/Text";
import { colors } from "@/design/tokens";
import { getImageUrl } from "@/utils/getImageUrl";
import { router, type Href } from "expo-router";
import { Heart, Newspaper } from "lucide-react-native";
import { useState } from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";
import type { BlogPost } from "../types";

function formatDate(value: string | null): string {
  if (!value) return "";
  const date = new Date(value);
  return isNaN(date.getTime()) ? "" : date.toLocaleDateString();
}

export default function BlogPostCard({ post }: { post: BlogPost }) {
  const [imgError, setImgError] = useState(false);
  const tr = post.translation;
  const uri = getImageUrl(post.coverImage ?? undefined);

  return (
    <Pressable
      style={styles.card}
      onPress={() =>
        tr &&
        router.push({
          pathname: "/(blog)/blog-post",
          params: { slug: tr.slug, name: tr.title },
        } as unknown as Href)
      }
    >
      <View style={styles.thumb}>
        {uri && !imgError ? (
          <Image source={{ uri }} style={styles.thumbImg} resizeMode="cover" onError={() => setImgError(true)} />
        ) : (
          <Newspaper size={22} color={colors.primary} strokeWidth={1.5} />
        )}
      </View>
      <View style={styles.info}>
        <Text size="sm" weight="semibold" numberOfLines={2}>
          {tr?.title}
        </Text>
        {tr?.excerpt ? (
          <Text size="xs" color="secondary" numberOfLines={2}>
            {tr.excerpt}
          </Text>
        ) : null}
        <View style={styles.meta}>
          <Text size="xs" color="tertiary">
            {formatDate(post.publishedAt)}
          </Text>
          <View style={styles.likes}>
            <Heart size={11} color={colors.foregroundTertiary} strokeWidth={2} />
            <Text size="xs" color="tertiary">
              {post.likes}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
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
  thumb: {
    width: 64,
    height: 64,
    borderRadius: 10,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.borderFocus,
    overflow: "hidden",
  },
  thumbImg: { width: "100%", height: "100%" },
  info: { flex: 1, gap: 4 },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 2,
  },
  likes: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
});
