import MainButton from "@/components/shared/Button/MainButton";
import Input from "@/components/shared/Input/Input";
import { showError } from "@/lib/toast";
import { KeyRound } from "lucide-react-native";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function ChangePasswordScreen() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      showError({ title: "Error", message: "Please fill in all fields" });
      return;
    }
    if (newPassword !== confirmPassword) {
      showError({ title: "Error", message: "New passwords do not match" });
      return;
    }
    setLoading(true);
    try {
      // TODO: wire to real API
      await new Promise((r) => setTimeout(r, 1000));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <View style={styles.iconWrap}>
        <KeyRound size={40} color="#6b7280" strokeWidth={1.5} />
      </View>
      <Text style={styles.hint}>
        Choose a strong password that you haven't used before.
      </Text>

      <View style={styles.card}>
        <Input
          label="Current Password"
          value={currentPassword}
          onChangeText={setCurrentPassword}
          placeholder="Enter current password"
          type="password"
        />
        <Input
          label="New Password"
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder="Enter new password"
          type="password"
        />
        <Input
          label="Confirm New Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirm new password"
          type="password"
        />
      </View>

      <MainButton
        text="Update Password"
        onPress={handleSubmit}
        loading={loading}
        style={styles.button}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    padding: 20,
    paddingBottom: 40,
    alignItems: "center",
  },
  iconWrap: {
    marginTop: 16,
    marginBottom: 12,
  },
  hint: {
    fontSize: 14,
    fontFamily: "Cabin_400Regular",
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    gap: 16,
    width: "100%",
  },
  button: {
    marginTop: 20,
    width: "100%",
  },
});
