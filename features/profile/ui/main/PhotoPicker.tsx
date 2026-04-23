import { Text } from "@/components/shared/Text/Text";
import {
  Modal,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useTranslation } from "react-i18next";
import { NAMESPACE } from "./i18n";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { showError } from "@/lib/toast";
import { uploadCoverImage, uploadProfileImage } from "@/api/profile/images";
import useAuthStore from "@/store/useAuthStore";
import { GET_ME } from "@/graphql/auth/login";
import { useApolloClient } from "@apollo/client/react";
import type { Seller } from "@/types/user";

export interface PhotoPickerProps {
  pickerTarget: "profile" | "cover";
  setUploadingProfile: React.Dispatch<React.SetStateAction<boolean>>;
  setUploadingCover: React.Dispatch<React.SetStateAction<boolean>>;
  pickerSheetVisible: boolean;
  setPickerSheetVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function PhotoPicker({
  pickerTarget,
  setUploadingCover,
  setUploadingProfile,
  pickerSheetVisible,
  setPickerSheetVisible,
}: PhotoPickerProps) {
  const { t } = useTranslation(NAMESPACE);
  const { bottom } = useSafeAreaInsets();
  const apolloClient = useApolloClient();

  const updateProfileImageFn = useAuthStore((s) => s.updateProfileImage);
  const updateCoverImageFn = useAuthStore((s) => s.updateCoverImage);
  const refreshSellerFn = useAuthStore((s) => s.refreshSeller);

  const handleUpload = async (uri: string) => {
    if (pickerTarget === "cover") setUploadingCover(true);
    else setUploadingProfile(true);
    try {
      if (pickerTarget === "profile") {
        const result = await uploadProfileImage(uri);
        await updateProfileImageFn(result.imageUrl);
        // If profile was null in the local store the update was skipped —
        // re-fetch the seller so the new image is reflected immediately.
        if (!useAuthStore.getState().seller?.profile) {
          const { data } = await apolloClient.query<{ me: Seller }>({
            query: GET_ME,
            fetchPolicy: "no-cache",
          });
          if (data?.me) await refreshSellerFn(data.me);
        }
      } else {
        const result = await uploadCoverImage(uri);
        await updateCoverImageFn(result.imageUrl);
        if (!useAuthStore.getState().seller?.profile) {
          const { data } = await apolloClient.query<{ me: Seller }>({
            query: GET_ME,
            fetchPolicy: "no-cache",
          });
          if (data?.me) await refreshSellerFn(data.me);
        }
      }
    } catch (err) {
      const detail = err instanceof Error ? err.message : "";
      showError({ title: t("uploadError"), message: detail });
    } finally {
      if (pickerTarget === "cover") setUploadingCover(false);
      else setUploadingProfile(false);
    }
  };

  const pickFromGallery = async () => {
    setPickerSheetVisible(false);
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      showError({
        title: t("permissionDenied"),
        message: t("galleryPermission"),
      });
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: pickerTarget === "cover" ? [3, 1] : [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) await handleUpload(result.assets[0].uri);
  };

  const pickFromCamera = async () => {
    setPickerSheetVisible(false);
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      showError({
        title: t("permissionDenied"),
        message: t("cameraPermission"),
      });
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: pickerTarget === "cover" ? [3, 1] : [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) await handleUpload(result.assets[0].uri);
  };

  return (
    <Modal
      transparent
      visible={pickerSheetVisible}
      onRequestClose={() => setPickerSheetVisible(false)}
      statusBarTranslucent
      animationType="slide"
    >
      <Pressable
        style={styles.sheetBackdrop}
        onPress={() => setPickerSheetVisible(false)}
      >
        <View style={[styles.sheet, { paddingBottom: bottom + 8 }]}>
          <View style={styles.sheetHandle} />
          <TouchableOpacity
            style={styles.sheetOption}
            onPress={pickFromGallery}
          >
            <Text style={styles.sheetOptionText}>{t("chooseFromLibrary")}</Text>
          </TouchableOpacity>
          <View style={styles.sheetDivider} />
          <TouchableOpacity style={styles.sheetOption} onPress={pickFromCamera}>
            <Text style={styles.sheetOptionText}>{t("takePhoto")}</Text>
          </TouchableOpacity>
          <View style={styles.sheetDividerWide} />
          <TouchableOpacity
            style={styles.sheetOption}
            onPress={() => setPickerSheetVisible(false)}
          >
            <Text style={[styles.sheetOptionText, styles.sheetCancel]}>
              {t("cancel")}
            </Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  sheetBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 12,
    overflow: "hidden",
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#d1d5db",
    alignSelf: "center",
    marginBottom: 12,
  },
  sheetOption: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  sheetOptionText: {
    fontSize: 16,
    fontFamily: "Cabin_500Medium",
    color: "#1f2937",
  },
  sheetDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#e5e7eb",
  },
  sheetDividerWide: {
    height: 8,
    backgroundColor: "#f3f4f6",
  },
  sheetCancel: {
    color: "#ef4444",
    fontFamily: "Cabin_600SemiBold",
  },
});
