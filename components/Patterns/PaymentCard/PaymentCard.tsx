import { borderRadius, colors, fontFamily, fontSize } from "@/design/tokens";
import { LinearGradient } from "expo-linear-gradient";
import { Lock } from "lucide-react-native";
import React, { useRef, useState } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export interface CardData {
  number: string;
  holder: string;
  expiry: string;
  cvv: string;
}

interface PaymentCardProps {
  initialData?: Partial<CardData>;
  onSave?: (data: CardData) => void;
}

// ── Card type detection ────────────────────────────────────────────────────────

type CardType = "visa" | "mastercard" | "amex" | "discover" | "unknown";

function detectCardType(number: string): CardType {
  const n = number.replace(/\D/g, "");
  if (/^4/.test(n)) return "visa";
  if (/^(5[1-5]|2[2-7])/.test(n)) return "mastercard";
  if (/^3[47]/.test(n)) return "amex";
  if (/^(6011|65|64[4-9]|622)/.test(n)) return "discover";
  return "unknown";
}

// ── Themes ────────────────────────────────────────────────────────────────────

type GradientTuple = [string, string, string];

const CARD_THEMES: Record<CardType, { front: GradientTuple; back: GradientTuple }> = {
  visa: {
    front: ["#1a1f71", "#1565c0", "#1976d2"],
    back:  ["#0d1245", "#0d3d7a", "#0f4a8c"],
  },
  mastercard: {
    front: ["#1a1a2e", "#16213e", "#0f3460"],
    back:  ["#0d0d1a", "#0a1225", "#08203e"],
  },
  amex: {
    front: ["#006747", "#007a55", "#00a878"],
    back:  ["#004a33", "#005a3d", "#006747"],
  },
  discover: {
    front: ["#7c3a00", "#b05400", "#d97706"],
    back:  ["#4a2200", "#6b3300", "#8b4500"],
  },
  unknown: {
    front: ["#0c4a6e", "#0369a1", "#06b6d4"],
    back:  ["#1e3a5f", "#0c4a6e", "#075985"],
  },
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatExpiry(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 4);
  if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return digits;
}

function buildMaskedDisplay(raw: string, type: CardType): string {
  const isAmex = type === "amex";
  const maxLen = isAmex ? 15 : 16;
  const digits = raw.replace(/\D/g, "").slice(0, maxLen);
  const padded = digits.padEnd(maxLen, "•");
  const masked = padded.split("").map((ch, i) => (i < maxLen - 4 ? "•" : ch)).join("");
  if (isAmex) {
    return `${masked.slice(0, 4)}  ${masked.slice(4, 10)}  ${masked.slice(10)}`;
  }
  return masked.match(/.{1,4}/g)?.join("  ") ?? "••••  ••••  ••••  ••••";
}

function formatCardNumberInput(digits: string, type: CardType): string {
  if (type === "amex") {
    const d = digits.slice(0, 15);
    if (d.length <= 4) return d;
    if (d.length <= 10) return `${d.slice(0, 4)} ${d.slice(4)}`;
    return `${d.slice(0, 4)} ${d.slice(4, 10)} ${d.slice(10)}`;
  }
  return digits.slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
}

// ── Network badge ─────────────────────────────────────────────────────────────

function NetworkBadge({ type }: { type: CardType }) {
  if (type === "visa") {
    return (
      <View>
        <Text style={badgeStyles.visaText}>VISA</Text>
      </View>
    );
  }
  if (type === "mastercard") {
    return (
      <View style={badgeStyles.circles}>
        <View style={[badgeStyles.circle, { backgroundColor: "#eb001b" }]} />
        <View style={[badgeStyles.circle, { backgroundColor: "#f79e1b", marginLeft: -10 }]} />
      </View>
    );
  }
  if (type === "amex") {
    return (
      <View style={badgeStyles.amexBox}>
        <Text style={badgeStyles.amexText}>AMEX</Text>
      </View>
    );
  }
  if (type === "discover") {
    return (
      <View style={badgeStyles.discoverBox}>
        <Text style={badgeStyles.discoverText}>DISC</Text>
        <View style={badgeStyles.discoverDot} />
        <Text style={badgeStyles.discoverText}>VER</Text>
      </View>
    );
  }
  return null;
}

const badgeStyles = StyleSheet.create({
  visaText: {
    fontFamily: fontFamily.bold,
    fontSize: 22,
    color: "#fff",
    fontStyle: "italic",
    letterSpacing: 1,
  },
  circles: {
    flexDirection: "row",
    alignItems: "center",
  },
  circle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    opacity: 0.9,
  },
  amexBox: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  amexText: {
    fontFamily: fontFamily.bold,
    fontSize: 12,
    color: "#fff",
    letterSpacing: 2,
  },
  discoverBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  discoverText: {
    fontFamily: fontFamily.bold,
    fontSize: 11,
    color: "#fbbf24",
    letterSpacing: 0.5,
  },
  discoverDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#f59e0b",
  },
});

// ── Component ─────────────────────────────────────────────────────────────────

export default function PaymentCard({ initialData, onSave }: PaymentCardProps) {
  const [card, setCard] = useState<CardData>({
    number: initialData?.number ?? "",
    holder: initialData?.holder ?? "",
    expiry: initialData?.expiry ?? "",
    cvv: initialData?.cvv ?? "",
  });
  const [isFlipped, setIsFlipped] = useState(false);
  const flipAnim = useRef(new Animated.Value(0)).current;

  const cardType = detectCardType(card.number);
  const theme = CARD_THEMES[cardType];
  const isAmex = cardType === "amex";
  const numberMaxLen = isAmex ? 17 : 19; // includes spaces
  const cvvMaxLen = isAmex ? 4 : 3;

  const animateTo = (toBack: boolean) => {
    if (toBack === isFlipped) return;
    setIsFlipped(toBack);
    Animated.spring(flipAnim, {
      toValue: toBack ? 180 : 0,
      useNativeDriver: true,
      tension: 55,
      friction: 9,
    }).start();
  };

  const frontRotateY = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ["0deg", "180deg"],
  });
  const backRotateY = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ["180deg", "360deg"],
  });
  const frontOpacity = flipAnim.interpolate({
    inputRange: [89, 91],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });
  const backOpacity = flipAnim.interpolate({
    inputRange: [89, 91],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const maskedNumber = buildMaskedDisplay(card.number, cardType);
  const displayExpiry = card.expiry || "MM/YY";
  const displayHolder = card.holder || "FULL NAME";

  return (
    <View style={styles.wrapper}>
      {/* ── Card Preview ─────────────────────────────────────────────── */}
      <View style={styles.cardContainer}>
        {/* Front */}
        <Animated.View
          style={[
            styles.card,
            {
              opacity: frontOpacity,
              transform: [{ perspective: 1200 }, { rotateY: frontRotateY }],
            },
          ]}
        >
          <LinearGradient
            colors={theme.front}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.decorCircle1} />
          <View style={styles.decorCircle2} />

          <View style={styles.chip}>
            <View style={styles.chipInner} />
          </View>

          <Text style={styles.cardNumber}>{maskedNumber}</Text>

          <View style={styles.cardBottom}>
            <View>
              <Text style={styles.cardSmallLabel}>CARD HOLDER</Text>
              <Text style={styles.cardValue}>{displayHolder}</Text>
            </View>
            <View>
              <Text style={styles.cardSmallLabel}>EXPIRES</Text>
              <Text style={styles.cardValue}>{displayExpiry}</Text>
            </View>
            <NetworkBadge type={cardType} />
          </View>
        </Animated.View>

        {/* Back */}
        <Animated.View
          style={[
            styles.card,
            styles.cardAbsolute,
            {
              opacity: backOpacity,
              transform: [{ perspective: 1200 }, { rotateY: backRotateY }],
            },
          ]}
        >
          <LinearGradient
            colors={theme.back}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.decorCircle1} />
          <View style={styles.decorCircle2} />

          <View style={styles.magStripe} />

          <View style={styles.cvvRow}>
            <View style={styles.signatureStrip}>
              <Text style={styles.cvvValue}>
                {card.cvv ? "•".repeat(card.cvv.length) : "•••"}
              </Text>
            </View>
            <View style={styles.cvvLabelBox}>
              <Text style={styles.cvvLabel}>CVV</Text>
            </View>
          </View>

          <Text style={styles.backNote}>
            This card is issued subject to the conditions of the cardholder agreement.
          </Text>
        </Animated.View>
      </View>

      {/* ── Inputs ──────────────────────────────────────────────────── */}
      <View style={styles.form}>
        <Text style={styles.inputLabel}>Card Number</Text>
        <TextInput
          style={styles.input}
          placeholder="1234 5678 9012 3456"
          placeholderTextColor={colors.inputPlaceholder}
          keyboardType="numeric"
          maxLength={numberMaxLen}
          value={
            card.number
              ? formatCardNumberInput(card.number.replace(/\D/g, ""), cardType)
              : ""
          }
          onChangeText={(v) =>
            setCard((c) => ({ ...c, number: v.replace(/\D/g, "") }))
          }
          onFocus={() => animateTo(false)}
        />

        <Text style={styles.inputLabel}>Cardholder Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor={colors.inputPlaceholder}
          autoCapitalize="characters"
          value={card.holder}
          onChangeText={(v) =>
            setCard((c) => ({ ...c, holder: v.toUpperCase() }))
          }
          onFocus={() => animateTo(false)}
        />

        <View style={styles.inputRow}>
          <View style={styles.inputRowItem}>
            <Text style={styles.inputLabel}>Expiry Date</Text>
            <TextInput
              style={styles.input}
              placeholder="MM/YY"
              placeholderTextColor={colors.inputPlaceholder}
              keyboardType="numeric"
              maxLength={5}
              value={formatExpiry(card.expiry.replace(/\D/g, ""))}
              onChangeText={(v) =>
                setCard((c) => ({ ...c, expiry: v.replace(/[^\d/]/g, "") }))
              }
              onFocus={() => animateTo(false)}
            />
          </View>

          <View style={styles.inputRowItem}>
            <Text style={styles.inputLabel}>CVV</Text>
            <TextInput
              style={styles.input}
              placeholder={isAmex ? "••••" : "•••"}
              placeholderTextColor={colors.inputPlaceholder}
              keyboardType="numeric"
              maxLength={cvvMaxLen}
              secureTextEntry
              value={card.cvv}
              onChangeText={(v) =>
                setCard((c) => ({ ...c, cvv: v.replace(/\D/g, "") }))
              }
              onFocus={() => animateTo(true)}
              onBlur={() => animateTo(false)}
            />
          </View>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.saveButton,
            pressed && styles.saveButtonPressed,
          ]}
          onPress={() => onSave?.(card)}
        >
          <Lock size={15} color={colors.onPrimary} strokeWidth={2.5} />
          <Text style={styles.saveButtonText}>Save Card</Text>
        </Pressable>
      </View>
    </View>
  );
}

const CARD_WIDTH = "100%";
const CARD_HEIGHT = 200;

const styles = StyleSheet.create({
  wrapper: {
    gap: 24,
  },

  // ── Card ──────────────────────────────────────────────────────────────────
  cardContainer: {
    height: CARD_HEIGHT,
    width: CARD_WIDTH,
  },
  card: {
    width: "100%",
    height: CARD_HEIGHT,
    borderRadius: borderRadius["2xl"],
    padding: 22,
    overflow: "hidden",
    justifyContent: "space-between",
  },
  cardAbsolute: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },

  decorCircle1: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: borderRadius.full,
    backgroundColor: "rgba(255,255,255,0.05)",
    top: -60,
    right: -60,
  },
  decorCircle2: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: borderRadius.full,
    backgroundColor: "rgba(255,255,255,0.05)",
    bottom: -50,
    left: -30,
  },

  chip: {
    width: 42,
    height: 32,
    borderRadius: borderRadius.sm,
    backgroundColor: "#d4a843",
    justifyContent: "center",
    alignItems: "center",
  },
  chipInner: {
    width: 28,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#b8922d",
  },

  cardNumber: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.xl,
    letterSpacing: 3,
    color: colors.onPrimary,
    marginTop: 14,
  },

  cardBottom: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  cardSmallLabel: {
    fontSize: fontSize.xs,
    fontFamily: fontFamily.semibold,
    color: "rgba(255,255,255,0.6)",
    letterSpacing: 1.2,
    marginBottom: 3,
  },
  cardValue: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.semibold,
    color: colors.onPrimary,
    letterSpacing: 0.5,
  },

  // Back face
  magStripe: {
    height: 44,
    backgroundColor: "#111",
    marginHorizontal: -22,
    marginTop: 4,
  },
  cvvRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 16,
  },
  signatureStrip: {
    flex: 1,
    height: 36,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "flex-end",
    paddingHorizontal: 12,
  },
  cvvValue: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.base,
    color: colors.foreground,
    letterSpacing: 3,
  },
  cvvLabelBox: {
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: borderRadius.sm,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  cvvLabel: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.xs,
    color: colors.onPrimary,
    letterSpacing: 1,
  },
  backNote: {
    fontSize: fontSize.xs,
    fontFamily: fontFamily.regular,
    color: "rgba(255,255,255,0.4)",
    textAlign: "center",
    lineHeight: 12,
  },

  // ── Form ──────────────────────────────────────────────────────────────────
  form: {
    gap: 4,
  },
  inputLabel: {
    fontSize: fontSize.xs,
    fontFamily: fontFamily.semibold,
    color: colors.foregroundSecondary,
    marginBottom: 6,
    marginTop: 12,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  input: {
    height: 48,
    borderWidth: 1.5,
    borderColor: colors.inputBorder,
    borderRadius: borderRadius.md,
    paddingHorizontal: 14,
    fontFamily: fontFamily.medium,
    fontSize: fontSize.base,
    color: colors.inputText,
    backgroundColor: colors.inputBg,
  },
  inputRow: {
    flexDirection: "row",
    gap: 12,
  },
  inputRowItem: {
    flex: 1,
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.primary,
  },
  saveButtonPressed: {
    backgroundColor: colors.primaryActive,
  },
  saveButtonText: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.base,
    color: colors.onPrimary,
  },
});
