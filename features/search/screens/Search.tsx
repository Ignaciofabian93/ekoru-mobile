import { Text } from "@/components/Primitives/Text/Text";
import { colors } from "@/design/tokens";
import useSearch from "@/features/search/hooks/useSearch";
import { NAMESPACE } from "@/features/search/i18n";
import SearchResultCard from "@/features/search/ui/SearchResultCard";
import { Search as SearchIcon } from "lucide-react-native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, FlatList, StyleSheet, TextInput, View } from "react-native";

export default function Search() {
  const { t, i18n } = useTranslation(NAMESPACE);
  const [query, setQuery] = useState("");
  const { items, total, loading } = useSearch(query, i18n.language);
  const trimmed = query.trim();

  return (
    <View style={styles.container}>
      <View style={styles.searchRow}>
        <SearchIcon size={18} color={colors.foregroundTertiary} strokeWidth={2} />
        <TextInput
          style={styles.input}
          placeholder={t("placeholder")}
          placeholderTextColor={colors.foregroundTertiary}
          value={query}
          onChangeText={setQuery}
          autoFocus
          returnKeyType="search"
        />
      </View>

      {trimmed.length === 0 ? (
        <View style={styles.centered}>
          <Text size="sm" color="tertiary">
            {t("startTyping")}
          </Text>
        </View>
      ) : loading && items.length === 0 ? (
        <ActivityIndicator color={colors.primary} size="large" style={{ marginTop: 40 }} />
      ) : items.length === 0 ? (
        <View style={styles.centered}>
          <Text size="sm" color="tertiary">
            {t("noResults", { query: trimmed })}
          </Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(it) => `${it.type}-${it.id}`}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <Text size="xs" color="tertiary" style={{ marginBottom: 8 }}>
              {total} {t("results")}
            </Text>
          }
          renderItem={({ item }) => <SearchResultCard item={item} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    margin: 16,
    paddingHorizontal: 12,
    height: 44,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: colors.foreground,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    gap: 10,
  },
});
