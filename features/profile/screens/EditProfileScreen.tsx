import MainButton from "@/components/shared/Button/MainButton";
import { Save } from "lucide-react-native";
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Animated, View } from "react-native";
import "../i18n";
import { NAMESPACE } from "../i18n";
import { AVATAR_PROTRUDE, COVER_HEIGHT } from "../constants/imageSize";
import { OuterContainer, ScrollContainer } from "../ui/layout/Container";
import CoverImage from "../ui/main/CoverImage";
import PhotoPicker from "../ui/main/PhotoPicker";
import ProfileImage from "../ui/main/ProfileImage";
import ProfileImageModal from "../ui/main/ProfileImageModal";
import BusinessInfoForm from "../ui/editProfile/BusinessInfoForm";
import ContactForm from "../ui/editProfile/ContactForm";
import LocationForm from "../ui/editProfile/LocationForm";
import PersonInfoForm from "../ui/editProfile/PersonInfoForm";
import useProfileData from "../hooks/useProfileData";

export default function EditProfileScreen() {
  const {
    seller,
    profileImage,
    coverImage,
    initials,
    personProfile,
    bizProfile,
    personValues,
    bizValues,
    contactValues,
    locationValues,
    isSaving,
    setPersonValues,
    setBizValues,
    setContactValues,
    handleLocationChange,
    handleSave,
  } = useProfileData();
  const { t } = useTranslation(NAMESPACE);

  // ── Photo upload state ──────────────────────────────────────────────────────
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [pickerSheetVisible, setPickerSheetVisible] = useState(false);
  const [pickerTarget, setPickerTarget] = useState<"profile" | "cover">(
    "profile",
  );
  const [uploadingProfile, setUploadingProfile] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const modalAnim = useRef(new Animated.Value(0)).current;

  // ── Profile image modal ─────────────────────────────────────────────────────
  const openProfileModal = () => {
    if (!profileImage) return;
    setProfileModalVisible(true);
    Animated.spring(modalAnim, {
      toValue: 1,
      damping: 20,
      stiffness: 200,
      useNativeDriver: true,
    }).start();
  };

  const closeProfileModal = () => {
    Animated.timing(modalAnim, {
      toValue: 0,
      duration: 180,
      useNativeDriver: true,
    }).start(() => setProfileModalVisible(false));
  };

  // ── Picker sheet ────────────────────────────────────────────────────────────
  const openPickerSheet = (target: "profile" | "cover") => {
    setPickerTarget(target);
    setPickerSheetVisible(true);
  };

  return (
    <OuterContainer enableBottomInset>
      <ScrollContainer>
        {/* ── Cover + overlapping avatar ─────────────────────────────────── */}
        <View
          style={{ height: COVER_HEIGHT, marginBottom: AVATAR_PROTRUDE + 16 }}
        >
          <CoverImage
            coverImage={coverImage}
            uploadingCover={uploadingCover}
            openPickerSheet={openPickerSheet}
          />
          <ProfileImage
            profileImage={profileImage}
            initials={initials}
            uploadingProfile={uploadingProfile}
            openPickerSheet={openPickerSheet}
            openProfileModal={openProfileModal}
          />
        </View>

        {/* ── Person fields ───────────────────────────────────────────────── */}
        {personProfile && (
          <PersonInfoForm
            values={personValues}
            onChange={(key, value) =>
              setPersonValues((prev) => ({ ...prev, [key]: value }))
            }
          />
        )}

        {/* ── Business fields ─────────────────────────────────────────────── */}
        {bizProfile && (
          <BusinessInfoForm
            values={bizValues}
            onChange={(key, value) =>
              setBizValues((prev) => ({ ...prev, [key]: value }))
            }
          />
        )}

        {/* ── Location ────────────────────────────────────────────────────── */}
        <LocationForm
          values={locationValues}
          onChange={handleLocationChange}
          fallback={{
            country: seller?.country,
            region: seller?.region,
            city: seller?.city,
            county: seller?.county,
          }}
        />

        {/* ── Contact ─────────────────────────────────────────────────────── */}
        <ContactForm
          values={contactValues}
          onChange={(key, value) =>
            setContactValues((prev) => ({ ...prev, [key]: value }))
          }
        />

        <MainButton
          text={t("saveChanges")}
          loadingText={t("saving")}
          onPress={handleSave}
          rightIcon={Save}
          loading={isSaving}
          style={{ marginHorizontal: 20, marginBottom: 20, marginTop: 20 }}
        />
      </ScrollContainer>

      {/* ── Profile image fullscreen modal ─────────────────────────────────── */}
      <ProfileImageModal
        profileModalVisible={profileModalVisible}
        closeProfileModal={closeProfileModal}
        modalAnim={modalAnim}
        profileImage={profileImage}
      />

      {/* ── Photo picker bottom sheet ──────────────────────────────────────── */}
      <PhotoPicker
        pickerSheetVisible={pickerSheetVisible}
        setPickerSheetVisible={setPickerSheetVisible}
        pickerTarget={pickerTarget}
        setUploadingCover={setUploadingCover}
        setUploadingProfile={setUploadingProfile}
      />
    </OuterContainer>
  );
}
