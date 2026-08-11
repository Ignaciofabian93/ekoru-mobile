import { Text } from "@/components/Primitives/Text/Text";
import { colors } from "@/design/tokens";
import useAuthStore from "@/store/useAuthStore";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, FlatList, Pressable, StyleSheet, View } from "react-native";
import useDealActions from "../hooks/useDealActions";
import useDeals from "../hooks/useDeals";
import { NAMESPACE } from "../i18n";
import type { DealPerspective } from "../types";
import DealCard from "../ui/DealCard";

function TabBtn({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable style={[styles.tab, active && styles.tabActive]} onPress={onPress}>
      <Text size="sm" weight={active ? "semibold" : "normal"} style={active ? styles.tabLabelActive : styles.tabLabel}>
        {label}
      </Text>
    </Pressable>
  );
}

export default function Deals() {
  const { t } = useTranslation(NAMESPACE);
  const seller = useAuthStore((s) => s.seller);
  const { buyerDeals, sellerDeals, reputation, loading } = useDeals();
  const actions = useDealActions();
  const [tab, setTab] = useState<DealPerspective>("buyer");

  if (!seller) {
    return (
      <View style={styles.centered}>
        <Text size="sm" color="tertiary">
          {t("signInRequired")}
        </Text>
      </View>
    );
  }

  const deals = tab === "buyer" ? buyerDeals : sellerDeals;
  const blocked =
    reputation?.blockedUntil != null &&
    new Date(reputation.blockedUntil).getTime() > Date.now();

  return (
    <View style={styles.container}>
      {blocked && (
        <View style={styles.blockBanner}>
          <Text size="xs" weight="medium" style={{ color: "#fff" }}>
            {t("blockedBanner")}
          </Text>
        </View>
      )}

      <View style={styles.tabs}>
        <TabBtn label={`${t("myPurchases")} (${buyerDeals.length})`} active={tab === "buyer"} onPress={() => setTab("buyer")} />
        <TabBtn label={`${t("mySales")} (${sellerDeals.length})`} active={tab === "seller"} onPress={() => setTab("seller")} />
      </View>

      {loading && deals.length === 0 ? (
        <ActivityIndicator color={colors.primary} size="large" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={deals}
          keyExtractor={(d) => String(d.id)}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text size="sm" color="tertiary" style={styles.empty}>
              {t("noDeals")}
            </Text>
          }
          renderItem={({ item }) => (
            <DealCard
              deal={item}
              perspective={tab}
              busyId={actions.busyId}
              onAccept={actions.acceptDeal}
              onDecline={actions.declineDeal}
              onConfirm={actions.confirmDeal}
              onCancel={actions.cancelDeal}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
  blockBanner: {
    backgroundColor: colors.danger,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  tabs: {
    flexDirection: "row",
    gap: 8,
    padding: 16,
  },
  tab: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  tabActive: {
    backgroundColor: colors.primary,
    borderColor: "transparent",
  },
  tabLabel: { color: colors.foregroundSecondary },
  tabLabelActive: { color: "#fff" },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    gap: 12,
  },
  empty: {
    textAlign: "center",
    marginTop: 40,
  },
});
