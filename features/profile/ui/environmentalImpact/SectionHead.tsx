import { Text } from "@/components/Primitives/Text/Text";
import { borderRadius, colors, fontFamily, fontSize, spacing } from "@/design/tokens";
import { type LucideIcon } from "lucide-react-native";
import { StyleSheet, View } from "react-native";

interface SectionHeadProps {
  icon: LucideIcon;
  title: string;
  sub?: string;
}

export default function SectionHead({ icon: Icon, title, sub }: SectionHeadProps) {
  return (
    <View style={styles.sectionHead}>
      <View style={styles.iconWrap}>
        <Icon size={14} color={colors.primary} strokeWidth={2} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{title}</Text>
        {sub ? <Text style={styles.sub}>{sub}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionHead: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[2],
    marginBottom: spacing[3.5],
  },
  iconWrap: {
    width: spacing[7],
    height: spacing[7],
    borderRadius: borderRadius.sm,
    backgroundColor: `${colors.primary}18`,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  title: {
    fontSize: fontSize.base,
    fontFamily: fontFamily.bold,
    color: colors.foreground,
  },
  sub: {
    fontSize: fontSize.xs,
    fontFamily: fontFamily.regular,
    color: colors.foregroundTertiary,
    marginTop: spacing.px,
  },
});
