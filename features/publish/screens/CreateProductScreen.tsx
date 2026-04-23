import { MainButton } from "@/components/shared/Button/MainButton";
import { Text } from "@/components/shared/Text/Text";
import { colors } from "@/design/tokens";
import { ArrowLeft, PackagePlus } from "lucide-react-native";
import React from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import usePublishProduct, { TOTAL_STEPS } from "../hooks/usePublishProduct";
import StepIndicator from "../ui/StepIndicator";
import BadgesStep from "../ui/steps/BadgesStep";
import CategoryStep from "../ui/steps/CategoryStep";
import DetailsStep from "../ui/steps/DetailsStep";
import PhotosStep from "../ui/steps/PhotosStep";
import PricingStep from "../ui/steps/PricingStep";

const STEP_LABELS = ["Photos", "Details", "Category", "Pricing", "Tags"];

export default function CreateProductScreen() {
  const insets = useSafeAreaInsets();
  const {
    step,
    values,
    errors,
    loading,
    set,
    handleNext,
    handleBack,
    handleSubmit,
  } = usePublishProduct();

  const isLastStep = step === TOTAL_STEPS - 1;

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* ── Top bar ─────────────────────────────────────────────────── */}
      <View style={[styles.topBar, { paddingTop: 12 }]}>
        {step > 0 ? (
          <Pressable onPress={handleBack} style={styles.backBtn} hitSlop={8}>
            <ArrowLeft size={20} color={colors.foreground} strokeWidth={2} />
          </Pressable>
        ) : (
          <View style={styles.backBtn} />
        )}
        <Text size="sm" weight="semibold" color="secondary">
          {STEP_LABELS[step]}
        </Text>
        <View style={styles.backBtn} />
      </View>

      <StepIndicator total={TOTAL_STEPS} current={step} />

      {/* ── Step content ────────────────────────────────────────────── */}
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {step === 0 && (
          <PhotosStep
            images={values.images}
            error={errors.images}
            onChange={(imgs) => set("images", imgs)}
          />
        )}
        {step === 1 && (
          <DetailsStep values={values} errors={errors} set={set} />
        )}
        {step === 2 && (
          <CategoryStep values={values} errors={errors} set={set} />
        )}
        {step === 3 && (
          <PricingStep values={values} errors={errors} set={set} />
        )}
        {step === 4 && <BadgesStep values={values} set={set} />}
      </ScrollView>

      {/* ── Bottom action ────────────────────────────────────────────── */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <MainButton
          text={isLastStep ? "Publish listing" : "Continue"}
          onPress={isLastStep ? handleSubmit : handleNext}
          variant="primary"
          size="lg"
          fullWidth
          loading={loading}
          loadingText="Publishing…"
          leftIcon={isLastStep ? PackagePlus : undefined}
        />
      </View>

      {/* ── Loading overlay ─────────────────────────────────────────── */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingCard}>
            <ActivityIndicator color={colors.primary} size="large" />
            <Text size="sm" color="secondary" style={{ marginTop: 12 }}>
              Uploading photos and publishing…
            </Text>
          </View>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 4,
    backgroundColor: colors.background,
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    flexGrow: 1,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    paddingVertical: 32,
    paddingHorizontal: 40,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 12,
  },
});
