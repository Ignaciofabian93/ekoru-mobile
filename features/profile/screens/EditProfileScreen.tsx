import MainButton from "@/components/shared/Button/MainButton";
import Input from "@/components/shared/Input/Input";
import Colors from "@/constants/Colors";
import { useSeller } from "@/store/useAuthStore";
import { useRouter } from "expo-router";
import { Save } from "lucide-react-native";
import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export default function EditProfileScreen() {
  const router = useRouter();
  const seller = useSeller();

  if (!seller) {
    router.replace("/(auth)");
    return null;
  }

  const isPerson = seller.profile?.__typename === "PersonProfile";
  const isBusiness = seller.profile?.__typename === "BusinessProfile";

  // Person fields
  const personProfile = isPerson ? seller.profile : null;
  const [firstName, setFirstName] = useState(
    personProfile?.__typename === "PersonProfile"
      ? personProfile.firstName
      : "",
  );
  const [lastName, setLastName] = useState(
    personProfile?.__typename === "PersonProfile"
      ? (personProfile.lastName ?? "")
      : "",
  );
  const [displayName, setDisplayName] = useState(
    personProfile?.__typename === "PersonProfile"
      ? (personProfile.displayName ?? "")
      : "",
  );
  const [bio, setBio] = useState(
    personProfile?.__typename === "PersonProfile"
      ? (personProfile.bio ?? "")
      : "",
  );

  // Business fields
  const bizProfile = isBusiness ? seller.profile : null;
  const [businessName, setBusinessName] = useState(
    bizProfile?.__typename === "BusinessProfile" ? bizProfile.businessName : "",
  );
  const [description, setDescription] = useState(
    bizProfile?.__typename === "BusinessProfile"
      ? (bizProfile.description ?? "")
      : "",
  );
  const [legalBusinessName, setLegalBusinessName] = useState(
    bizProfile?.__typename === "BusinessProfile"
      ? (bizProfile.legalBusinessName ?? "")
      : "",
  );
  const [taxId, setTaxId] = useState(
    bizProfile?.__typename === "BusinessProfile"
      ? (bizProfile.taxId ?? "")
      : "",
  );
  const [phone, setPhone] = useState(seller.phone ?? "");
  const [website, setWebsite] = useState(seller.website ?? "");

  const initials = isPerson
    ? `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase()
    : (businessName[0] ?? "?").toUpperCase();

  const handleSave = () => {
    // TODO: wire to real API
  };

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      {/* Avatar */}
      <View style={styles.avatarSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials || "?"}</Text>
        </View>
        <Pressable>
          <Text style={styles.changePhoto}>Change Photo</Text>
        </Pressable>
      </View>

      {/* Person fields */}
      {isPerson && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <View style={styles.form}>
            <Input
              label="First Name"
              value={firstName}
              onChangeText={setFirstName}
              placeholder="Your first name"
            />
            <Input
              label="Last Name(s)"
              value={lastName}
              onChangeText={setLastName}
              placeholder="Your last name(s)"
            />
            <Input
              label="Display Name"
              value={displayName}
              onChangeText={setDisplayName}
              placeholder="How others will see you"
            />
            <Input
              label="Bio"
              value={bio}
              onChangeText={setBio}
              placeholder="Tell us about yourself"
              multiline
              numberOfLines={4}
              style={styles.textArea}
            />
          </View>
        </View>
      )}

      {/* Business fields */}
      {isBusiness && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Business Information</Text>
          <View style={styles.form}>
            <Input
              label="Business Name"
              value={businessName}
              onChangeText={setBusinessName}
              placeholder="Your business name"
            />
            <Input
              label="Description"
              value={description}
              onChangeText={setDescription}
              placeholder="Describe your business"
              multiline
              numberOfLines={4}
              style={styles.textArea}
            />
            <Input
              label="Legal Business Name"
              value={legalBusinessName}
              onChangeText={setLegalBusinessName}
              placeholder="Official registered name"
            />
            <Input
              label="Tax ID (RUT)"
              value={taxId}
              onChangeText={setTaxId}
              placeholder="e.g. 12.345.678-9"
            />
          </View>
        </View>
      )}

      {/* Contact — shared */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact</Text>
        <View style={styles.form}>
          <Input
            label="Phone"
            value={phone}
            onChangeText={setPhone}
            placeholder="+56 9 1234 5678"
            type="number"
          />
          <Input
            label="Website"
            value={website}
            onChangeText={setWebsite}
            placeholder="https://your-site.com"
          />
        </View>
      </View>

      <MainButton
        text="Save Changes"
        onPress={handleSave}
        rightIcon={Save}
        style={styles.saveButton}
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
    gap: 8,
  },
  avatarSection: {
    alignItems: "center",
    paddingVertical: 20,
    gap: 8,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 30,
    fontFamily: "Cabin_700Bold",
    color: "#fff",
  },
  changePhoto: {
    fontSize: 14,
    fontFamily: "Cabin_600SemiBold",
    color: Colors.primary,
  },
  section: {
    gap: 10,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: "Cabin_600SemiBold",
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginLeft: 4,
    marginTop: 8,
  },
  form: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    gap: 16,
  },
  textArea: {
    minHeight: 96,
    textAlignVertical: "top",
  },
  saveButton: {
    marginTop: 16,
  },
});
