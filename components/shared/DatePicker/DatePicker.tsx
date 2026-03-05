import { MainButton } from "@/components/shared/Button/MainButton";
import Modal from "@/components/shared/Modal/Modal";
import Colors from "@/constants/Colors";
import DateTimePicker, {
  type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Calendar } from "lucide-react-native";
import { useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Parses "YYYY-MM-DD" or ISO strings to a local Date, avoids UTC-shift issues. */
function parseDate(str: string): Date {
  if (!str) return new Date();
  const datePart = str.split("T")[0];
  const parts = datePart.split("-").map(Number);
  if (parts.length === 3 && parts.every((n) => !isNaN(n))) {
    return new Date(parts[0], parts[1] - 1, parts[2]);
  }
  return new Date();
}

/** Formats a Date to "YYYY-MM-DD". */
function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Formats a Date for human-readable display using the device locale. */
function formatDisplay(date: Date): string {
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// ─── Props ────────────────────────────────────────────────────────────────────

export interface DatePickerProps {
  label: string;
  /** ISO date string "YYYY-MM-DD" or empty string */
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  /** Label for the iOS confirm button */
  confirmLabel?: string;
  maximumDate?: Date;
  minimumDate?: Date;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function DatePicker({
  label,
  value,
  onChange,
  placeholder,
  confirmLabel = "Confirm",
  maximumDate,
  minimumDate,
}: DatePickerProps) {
  const [showPicker, setShowPicker] = useState(false);
  /** Temp value while the iOS modal is open — only committed on Confirm */
  const [tempDate, setTempDate] = useState<Date>(parseDate(value));

  const displayValue = value ? formatDisplay(parseDate(value)) : "";

  const handlePress = () => {
    setTempDate(parseDate(value)); // reset to current value each time modal opens
    setShowPicker(true);
  };

  // ── Android ──────────────────────────────────────────────────────────────
  // The native dialog is its own modal; onChange fires on confirm or dismiss.
  const handleAndroidChange = (event: DateTimePickerEvent, date?: Date) => {
    setShowPicker(false);
    if (event.type === "set" && date) {
      onChange(formatDate(date));
    }
  };

  // ── iOS ───────────────────────────────────────────────────────────────────
  // Updates tempDate while the spinner scrolls; committed only via Confirm.
  const handleIOSChange = (_event: DateTimePickerEvent, date?: Date) => {
    if (date) setTempDate(date);
  };

  const handleIOSConfirm = () => {
    onChange(formatDate(tempDate));
    setShowPicker(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      {/* Pressable trigger — styled to match Input */}
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [styles.field, pressed && styles.fieldActive]}
      >
        <Calendar
          size={18}
          color={Colors.foregroundTertiary}
          strokeWidth={2}
        />
        <Text style={[styles.value, !value && styles.placeholder]}>
          {displayValue || placeholder}
        </Text>
      </Pressable>

      {/* Android: renders as a native dialog when showPicker is true */}
      {Platform.OS === "android" && showPicker && (
        <DateTimePicker
          value={tempDate}
          mode="date"
          display="calendar"
          maximumDate={maximumDate}
          minimumDate={minimumDate}
          onChange={handleAndroidChange}
        />
      )}

      {/* iOS: bottom-sheet modal with a spinner picker + Confirm button */}
      {Platform.OS === "ios" && (
        <Modal
          isOpen={showPicker}
          onClose={() => setShowPicker(false)}
          title={label}
          size="sm"
        >
          <DateTimePicker
            value={tempDate}
            mode="date"
            display="spinner"
            maximumDate={maximumDate}
            minimumDate={minimumDate}
            onChange={handleIOSChange}
            style={styles.iosPicker}
          />
          <MainButton
            text={confirmLabel}
            onPress={handleIOSConfirm}
            fullWidth
            style={styles.confirmButton}
          />
        </Modal>
      )}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontFamily: "Cabin_500Medium",
    color: Colors.foreground,
  },
  field: {
    flexDirection: "row",
    alignItems: "center",
    height: 44,
    backgroundColor: Colors.inputBg,
    borderWidth: 2,
    borderColor: Colors.inputBorder,
    borderRadius: 10,
    paddingHorizontal: 12,
    gap: 8,
  },
  fieldActive: {
    borderColor: Colors.inputBorderFocus,
  },
  value: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Cabin_400Regular",
    color: Colors.inputText,
  },
  placeholder: {
    color: Colors.inputPlaceholder,
  },
  iosPicker: {
    width: "100%",
  },
  confirmButton: {
    marginTop: 16,
  },
});
