import { Text } from "@/components/shared/Text/Text";
import { Camera } from "lucide-react-native";
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { AVATAR_PROTRUDE, AVATAR_SIZE } from "../../constants/imageSize";
import Colors from "@/constants/Colors";

export interface ProfileImageProps {
  profileImage: string | undefined;
  initials: string;
  uploadingProfile: boolean;
  openPickerSheet: (type: "profile" | "cover") => void;
  openProfileModal: () => void;
}

export default function ProfileImage({
  profileImage,
  initials,
  uploadingProfile,
  openPickerSheet,
  openProfileModal,
}: ProfileImageProps) {
  return (
    <View style={styles.avatarAbsolute}>
      <Pressable onPress={openProfileModal} style={styles.avatarPressable}>
        {uploadingProfile ? (
          <View style={[styles.avatarFallback, styles.avatarUploading]}>
            <ActivityIndicator color="#fff" size="small" />
          </View>
        ) : profileImage ? (
          <Image
            source={{ uri: profileImage }}
            style={styles.avatarImage}
            onError={(e) =>
              console.error(
                "[Avatar] load error:",
                profileImage,
                e.nativeEvent.error,
              )
            }
          />
        ) : (
          <View style={styles.avatarFallback}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
        )}
      </Pressable>
      <Pressable
        style={styles.avatarCameraButton}
        onPress={() => openPickerSheet("profile")}
      >
        <Camera size={12} color="#fff" strokeWidth={2.5} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  avatarAbsolute: {
    position: "absolute",
    bottom: -AVATAR_PROTRUDE,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  avatarPressable: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
  },
  avatarImage: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    borderWidth: 3,
    borderColor: "#fff",
  },
  avatarFallback: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: Colors.primary,
    borderWidth: 3,
    borderColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarUploading: { backgroundColor: Colors.primary + "99" },
  avatarText: {
    fontSize: 28,
    fontFamily: "Cabin_700Bold",
    color: "#fff",
  },
  avatarCameraButton: {
    position: "absolute",
    bottom: 4,
    // right edge of the avatar circle
    left: "50%",
    marginLeft: AVATAR_SIZE / 2 - 22,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.primary,
    borderWidth: 2,
    borderColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
