import useAuthStore, {
  useCoverImage,
  useInitials,
  useProfileImage,
  useSeller,
} from "@/store/useAuthStore";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { Animated, ScrollView, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import "../i18n";
import { NAMESPACE } from "../i18n";
import PhotoPicker from "../ui/main/PhotoPicker";
import ProfileImageModal from "../ui/main/ProfileImageModal";
import MainButton from "@/components/shared/Button/MainButton";
import { AVATAR_PROTRUDE, COVER_HEIGHT } from "../constants/imageSize";
import ProfileImage from "../ui/main/ProfileImage";
import CoverImage from "../ui/main/CoverImage";
import Identity from "../ui/main/Identity";
import ProfileDetails from "../ui/main/ProfileDetails";
import NavigationMenu from "../ui/main/NavigationMenu";

export default function ProfileScreen() {
  const router = useRouter();
  const seller = useSeller();
  const profileImage = useProfileImage();
  const coverImage = useCoverImage();
  const initials = useInitials();
  const logout = useAuthStore((s) => s.logout);
  const { bottom } = useSafeAreaInsets();
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
    <View style={[styles.outerContainer, { paddingBottom: bottom }]}>
      <ScrollView style={styles.scroll}>
        {/* ── Cover + overlapping avatar ─────────────────────────────────── */}
        <View style={styles.headerContainer}>
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
      </ScrollView>

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
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: { flex: 1, backgroundColor: "#fff" },
  scroll: { flex: 1 },
  // ── Cover ──────────────────────────────────────────────────────────────────
  headerContainer: {
    height: COVER_HEIGHT,
    marginBottom: AVATAR_PROTRUDE + 16,
  },
});
