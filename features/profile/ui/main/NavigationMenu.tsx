import { Text } from "@/components/shared/Text/Text";
import { Pressable, StyleSheet, View } from "react-native";
import { useMenuRows } from "../../constants/menuRows";
import { ChevronRight } from "lucide-react-native";
import { colors } from "@/design/tokens";
import { useTranslation } from "react-i18next";
import { NAMESPACE } from "./i18n";
import { useRouter } from "expo-router";
import { Title } from "@/components/shared/Title/Title";

export default function NavigationMenu() {
  const router = useRouter();
  const { t } = useTranslation(NAMESPACE);
  const menuRows = useMenuRows();

  return (
    <>
      <Title level="h6" weight="semibold" style={styles.sectionTitle}>
        {t("account")}
      </Title>
      <View style={styles.menuCard}>
        {menuRows.map((row, index) => {
          const Icon = row.icon;
          return (
            <Pressable
              key={row.route}
              style={[
                styles.menuRow,
                index < menuRows.length - 1 && styles.menuRowBorder,
              ]}
              onPress={() => router.push(row.route as any)}
            >
              <View style={styles.menuRowLeft}>
                <View style={styles.iconWrap}>
                  <Icon size={18} strokeWidth={1.5} color={colors.primary} />
                </View>
                <Text style={styles.menuRowLabel}>{row.label}</Text>
              </View>
              <ChevronRight size={18} color="#9ca3af" strokeWidth={1.5} />
            </Pressable>
          );
        })}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    marginBottom: 8,
    marginHorizontal: 20,
  },
  menuCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    marginHorizontal: 20,
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 16,
  },
  menuRowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#e5e7eb",
  },
  menuRowLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: `${colors.primary}18`,
    alignItems: "center",
    justifyContent: "center",
  },
  menuRowLabel: {
    fontSize: 15,
    fontFamily: "Cabin_500Medium",
    color: "#1f2937",
  },
});
