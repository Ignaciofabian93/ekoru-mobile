import MainButton from "@/components/shared/Button/MainButton";
import Input from "@/components/shared/Input/Input";
import Colors from "@/constants/Colors";
import { useSeller } from "@/store/useAuthStore";
import { useRouter } from "expo-router";
import { Save } from "lucide-react-native";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import "../i18n";
import { NAMESPACE } from "../i18n";

export default function EditProfileScreen() {
  const router = useRouter();
  const seller = useSeller();
  const { t } = useTranslation(NAMESPACE);

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
          <Text style={styles.changePhoto}>{t("changePhoto")}</Text>
        </Pressable>
      </View>

      {/* Person fields */}
      {isPerson && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("personalInformation")}</Text>
          <View style={styles.form}>
            <Input
              label={t("firstName")}
              value={firstName}
              onChangeText={setFirstName}
              placeholder={t("firstNamePlaceholder")}
            />
            <Input
              label={t("lastName")}
              value={lastName}
              onChangeText={setLastName}
              placeholder={t("lastNamePlaceholder")}
            />
            <Input
              label={t("displayName")}
              value={displayName}
              onChangeText={setDisplayName}
              placeholder={t("displayNamePlaceholder")}
            />
            <Input
              label={t("bio")}
              value={bio}
              onChangeText={setBio}
              placeholder={t("bioPlaceholder")}
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
          <Text style={styles.sectionTitle}>{t("businessInformation")}</Text>
          <View style={styles.form}>
            <Input
              label={t("businessName")}
              value={businessName}
              onChangeText={setBusinessName}
              placeholder={t("businessNamePlaceholder")}
            />
            <Input
              label={t("description")}
              value={description}
              onChangeText={setDescription}
              placeholder={t("descriptionPlaceholder")}
              multiline
              numberOfLines={4}
              style={styles.textArea}
            />
            <Input
              label={t("legalBusinessName")}
              value={legalBusinessName}
              onChangeText={setLegalBusinessName}
              placeholder={t("legalNamePlaceholder")}
            />
            <Input
              label={t("taxId")}
              value={taxId}
              onChangeText={setTaxId}
              placeholder={t("taxIdPlaceholder")}
            />
          </View>
        </View>
      )}

      {/* Contact — shared */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t("contact")}</Text>
        <View style={styles.form}>
          <Input
            label={t("phone")}
            value={phone}
            onChangeText={setPhone}
            placeholder="+56 9 1234 5678"
            type="number"
          />
          <Input
            label={t("website")}
            value={website}
            onChangeText={setWebsite}
            placeholder="https://your-site.com"
          />
        </View>
      </View>

      <MainButton
        text={t("saveChanges")}
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
