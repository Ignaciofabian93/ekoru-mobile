import MainButton from "@/components/shared/Button/MainButton";
import useAuthStore, {
  useCoverImage,
  useInitials,
  useProfileImage,
  useSeller,
} from "@/store/useAuthStore";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Animated, View } from "react-native";
import { AVATAR_PROTRUDE, COVER_HEIGHT } from "../constants/imageSize";
import { NAMESPACE } from "../i18n";
import { OuterContainer, ScrollContainer } from "../ui/layout/Container";
import CoverImage from "../ui/main/CoverImage";
import Identity from "../ui/main/Identity";
import NavigationMenu from "../ui/main/NavigationMenu";
import PhotoPicker from "../ui/main/PhotoPicker";
import ProfileDetails from "../ui/main/ProfileDetails";
import ProfileImage from "../ui/main/ProfileImage";
import ProfileImageModal from "../ui/main/ProfileImageModal";

export default function ProfileScreen() {
  const router = useRouter();
  const seller = useSeller();
  const profileImage = useProfileImage();
  const coverImage = useCoverImage();
  const initials = useInitials();
  const logout = useAuthStore((s) => s.logout);
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

  if (!seller) return null;

  return (
    <OuterContainer>
      <ScrollContainer>
        {/* ── Cover + overlapping avatar ─────────────────────────────────── */}
        <View
          style={{ height: COVER_HEIGHT, marginBottom: AVATAR_PROTRUDE + 16 }}
        >
          {/* Cover — tap anywhere to change */}
          <CoverImage
            coverImage={coverImage}
            uploadingCover={uploadingCover}
            openPickerSheet={openPickerSheet}
          />

          {/* Avatar — tap to expand full-size; camera button to change */}
          <ProfileImage
            profileImage={profileImage}
            initials={initials}
            uploadingProfile={uploadingProfile}
            openPickerSheet={openPickerSheet}
            openProfileModal={openProfileModal}
          />
        </View>

        {/* ── Identity ─────────────────────────────────────────────────────── */}
        <Identity />

        {/* ── Details ───────────────────────────────────────────────────────── */}
        <ProfileDetails />

        {/* ── Navigation menu ───────────────────────────────────────────────── */}
        <NavigationMenu />

        <MainButton
          variant="error"
          style={{ marginHorizontal: 20, marginBottom: 20, marginTop: 40 }}
          text={t("logOut")}
          onPress={async () => {
            await logout();
            router.replace("/(tabs)");
          }}
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
