import { colors, fontFamily, fontSize } from "@/design/tokens";
import { Bean, Sprout, TreePalm, TreePine } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import { NAMESPACE } from "./i18n";

function computeLevel(password: string): 0 | 1 | 2 | 3 | 4 {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score === 0) return 1;
  if (score <= 2) return 2;
  if (score <= 3) return 3;
  return 4;
}

const SEGMENT_COLORS = [
  colors.danger, // level 1 — red
  "#f97316", // level 2 — orange
  colors.accent, // level 3 — amber
  colors.primary, // level 4 — lime
];

const LABEL_KEYS = ["strength_seed", "strength_sprout", "strength_sapling", "strength_tree"] as const;

function NatureIcon({ level, color }: { level: 0 | 1 | 2 | 3 | 4; color: string }) {
  if (level === 4) return <TreePine size={22} color={color} strokeWidth={1.5} />;
  if (level === 3) return <TreePalm size={20} color={color} strokeWidth={1.5} />;
  if (level === 2) return <Sprout size={18} color={color} strokeWidth={1.5} />;
  return <Bean size={14} color={color} strokeWidth={1.5} />;
}

export default function PasswordStrengthMeter({ password }: { password: string }) {
  const { t } = useTranslation(NAMESPACE);
  const level = computeLevel(password);
  // if (level === 0) return null;

  const color = SEGMENT_COLORS[level - 1];
  const labelKey = LABEL_KEYS[level - 1];

  return (
    <View style={styles.container}>
      <View style={styles.bars}>
        {([1, 2, 3, 4] as const).map((seg) => (
          <View key={seg} style={[styles.segment, { backgroundColor: seg <= level ? color : "#e5e7eb" }]} />
        ))}
      </View>
      <View style={styles.row}>
        {level !== 0 && <NatureIcon level={level} color={color} />}
        <Text style={[styles.label, { color }]}>{t(labelKey)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 6,
    marginTop: 2,
  },
  bars: {
    flexDirection: "row",
    gap: 4,
  },
  segment: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  label: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.sm,
  },
});
