import Colors from "@/constants/Colors";
import { Text } from "@/components/shared/Text/Text";
import { Camera, FileText, Leaf, PackagePlus, Tag } from "lucide-react-native";
import React from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";

const STEPS = [
  { icon: Camera, label: "Add photos", desc: "Up to 10 clear images" },
  { icon: FileText, label: "Describe it", desc: "Title, condition, details" },
  { icon: Tag, label: "Set a price", desc: "Or offer it for free" },
  { icon: Leaf, label: "Choose eco tags", desc: "Recycled, organic, upcycled…" },
];

export default function UploadScreen() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero */}
      <View style={styles.heroBox}>
        <View style={styles.heroIcon}>
          <PackagePlus size={36} color={Colors.primary} strokeWidth={1.5} />
        </View>
        <Text size="xl" weight="bold" align="center" style={styles.heroTitle}>
          List a product
        </Text>
        <Text size="sm" color="secondary" align="center" style={styles.heroSubtitle}>
          Turn unused items into impact. Every listing helps reduce waste.
        </Text>
      </View>

      {/* Steps */}
      <View style={styles.stepsCard}>
        <Text size="sm" weight="semibold" color="secondary" style={styles.stepsLabel}>
          How it works
        </Text>
        {STEPS.map((step, i) => {
          const Icon = step.icon;
          return (
            <View key={step.label} style={styles.step}>
              <View style={styles.stepNumber}>
                <Text size="xs" weight="bold" style={{ color: Colors.primaryDark }}>
                  {i + 1}
                </Text>
              </View>
              <View style={styles.stepIconBox}>
                <Icon size={18} color={Colors.primary} strokeWidth={1.75} />
              </View>
              <View style={styles.stepText}>
                <Text size="sm" weight="semibold">
                  {step.label}
                </Text>
                <Text size="xs" color="secondary">
                  {step.desc}
                </Text>
              </View>
            </View>
          );
        })}
      </View>

      {/* CTA */}
      <View style={styles.actions}>
        <Pressable style={styles.primaryBtn}>
          <PackagePlus size={18} color="#fff" strokeWidth={2} />
          <Text weight="bold" style={styles.primaryBtnLabel}>
            Start listing
          </Text>
        </Pressable>
        <Text size="xs" color="tertiary" align="center">
          Free to list. We only earn when you sell.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingBottom: 40,
  },
  heroBox: {
    alignItems: "center",
    paddingHorizontal: 32,
    paddingTop: 36,
    paddingBottom: 20,
  },
  heroIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.backgroundPrimaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
    borderWidth: 1,
    borderColor: Colors.borderFocus,
  },
  heroTitle: {
    marginBottom: 8,
  },
  heroSubtitle: {
    lineHeight: 20,
  },
  stepsCard: {
    marginHorizontal: 20,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    gap: 14,
  },
  stepsLabel: {
    marginBottom: 2,
  },
  step: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  stepNumber: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.backgroundPrimaryLight,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.borderFocus,
  },
  stepIconBox: {
    width: 36,
    height: 36,
    borderRadius: 9,
    backgroundColor: Colors.backgroundPrimaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  stepText: {
    flex: 1,
    gap: 1,
  },
  actions: {
    paddingHorizontal: 20,
    paddingTop: 24,
    gap: 12,
    alignItems: "center",
  },
  primaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 32,
    alignSelf: "stretch",
    justifyContent: "center",
  },
  primaryBtnLabel: {
    color: "#fff",
    fontSize: 15,
  },
});
