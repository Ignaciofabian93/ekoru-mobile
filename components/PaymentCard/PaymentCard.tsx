import Colors from "@/constants/Colors";
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

function formatExpiry(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 4);
  if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return digits;
}

function buildMaskedDisplay(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 16);
  const displayed = digits.padEnd(16, "•");
  // mask all but last 4
  const masked = displayed
    .split("")
    .map((ch, i) => (i < 12 ? (ch === "•" ? "•" : "•") : ch))
    .join("");
  return masked.match(/.{1,4}/g)?.join("  ") ?? "••••  ••••  ••••  ••••";
}

export default function PaymentCard({ initialData, onSave }: PaymentCardProps) {
  const [card, setCard] = useState<CardData>({
    number: initialData?.number ?? "",
    holder: initialData?.holder ?? "",
    expiry: initialData?.expiry ?? "",
    cvv: initialData?.cvv ?? "",
  });
  const [isFlipped, setIsFlipped] = useState(false);
  const flipAnim = useRef(new Animated.Value(0)).current;

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

  const maskedNumber = buildMaskedDisplay(card.number);
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
            colors={["#0c4a6e", "#0369a1", "#06b6d4"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          {/* Decorative circles */}
          <View style={styles.decorCircle1} />
          <View style={styles.decorCircle2} />

          {/* Chip */}
          <View style={styles.chip}>
            <View style={styles.chipInner} />
          </View>

          {/* Number */}
          <Text style={styles.cardNumber}>{maskedNumber}</Text>

          {/* Bottom row */}
          <View style={styles.cardBottom}>
            <View>
              <Text style={styles.cardSmallLabel}>CARD HOLDER</Text>
              <Text style={styles.cardValue}>{displayHolder}</Text>
            </View>
            <View>
              <Text style={styles.cardSmallLabel}>EXPIRES</Text>
              <Text style={styles.cardValue}>{displayExpiry}</Text>
            </View>
            {/* Network placeholder */}
            <View style={styles.networkCircles}>
              <View style={[styles.networkCircle, { backgroundColor: "#ef4444" }]} />
              <View style={[styles.networkCircle, { backgroundColor: "#f97316", marginLeft: -10 }]} />
            </View>
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
            colors={["#1e3a5f", "#0c4a6e", "#075985"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.decorCircle1} />
          <View style={styles.decorCircle2} />

          {/* Magnetic stripe */}
          <View style={styles.magStripe} />

          {/* CVV strip */}
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
          placeholderTextColor={Colors.inputPlaceholder}
          keyboardType="numeric"
          maxLength={19}
          value={
            card.number
              ? card.number
                  .replace(/\D/g, "")
                  .slice(0, 16)
                  .replace(/(.{4})/g, "$1 ")
                  .trim()
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
          placeholderTextColor={Colors.inputPlaceholder}
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
              placeholderTextColor={Colors.inputPlaceholder}
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
              placeholder="•••"
              placeholderTextColor={Colors.inputPlaceholder}
              keyboardType="numeric"
              maxLength={4}
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
          <Lock size={15} color="#fff" strokeWidth={2.5} />
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
    borderRadius: 16,
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

  // Decorative circles
  decorCircle1: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(255,255,255,0.05)",
    top: -60,
    right: -60,
  },
  decorCircle2: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "rgba(255,255,255,0.05)",
    bottom: -50,
    left: -30,
  },

  // Chip
  chip: {
    width: 42,
    height: 32,
    borderRadius: 6,
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

  // Number
  cardNumber: {
    fontFamily: "Cabin_500Medium",
    fontSize: 19,
    letterSpacing: 3,
    color: "#fff",
    marginTop: 14,
  },

  // Bottom
  cardBottom: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  cardSmallLabel: {
    fontSize: 9,
    fontFamily: "Cabin_600SemiBold",
    color: "rgba(255,255,255,0.6)",
    letterSpacing: 1.2,
    marginBottom: 3,
  },
  cardValue: {
    fontSize: 13,
    fontFamily: "Cabin_600SemiBold",
    color: "#fff",
    letterSpacing: 0.5,
  },
  networkCircles: {
    flexDirection: "row",
    alignItems: "center",
  },
  networkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    opacity: 0.85,
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
    fontFamily: "Cabin_700Bold",
    fontSize: 16,
    color: "#1f2937",
    letterSpacing: 3,
  },
  cvvLabelBox: {
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  cvvLabel: {
    fontFamily: "Cabin_700Bold",
    fontSize: 12,
    color: "#fff",
    letterSpacing: 1,
  },
  backNote: {
    fontSize: 8,
    fontFamily: "Cabin_400Regular",
    color: "rgba(255,255,255,0.4)",
    textAlign: "center",
    lineHeight: 12,
  },

  // ── Form ──────────────────────────────────────────────────────────────────
  form: {
    gap: 4,
  },
  inputLabel: {
    fontSize: 12,
    fontFamily: "Cabin_600SemiBold",
    color: "#6b7280",
    marginBottom: 6,
    marginTop: 12,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  input: {
    height: 48,
    borderWidth: 1.5,
    borderColor: Colors.inputBorder,
    borderRadius: 10,
    paddingHorizontal: 14,
    fontFamily: "Cabin_500Medium",
    fontSize: 15,
    color: Colors.inputText,
    backgroundColor: Colors.inputBg,
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
    borderRadius: 12,
    backgroundColor: Colors.primary,
  },
  saveButtonPressed: {
    backgroundColor: Colors.primaryActive,
  },
  saveButtonText: {
    fontFamily: "Cabin_700Bold",
    fontSize: 15,
    color: "#fff",
  },
});
