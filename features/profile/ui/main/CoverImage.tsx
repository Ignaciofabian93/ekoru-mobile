import { LinearGradient } from "expo-linear-gradient";
import { Camera } from "lucide-react-native";
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { COVER_HEIGHT } from "../../constants/imageSize";

export interface CoverImageProps {
  coverImage: string | undefined;
  uploadingCover: boolean;
  openPickerSheet: (type: "profile" | "cover") => void;
}

export default function CoverImage({
  coverImage,
  uploadingCover,
  openPickerSheet,
}: CoverImageProps) {
  return (
    <Pressable
      onPress={() => openPickerSheet("cover")}
      style={styles.coverPressable}
    >
      {coverImage ? (
        <Image
          source={{ uri: coverImage }}
          style={styles.cover}
          resizeMode="cover"
          onError={(e) =>
            console.error(
              "[Cover] load error:",
              coverImage,
              e.nativeEvent.error,
            )
          }
        />
      ) : (
        <LinearGradient
          colors={["#0c4a6e", "#0369a1", "#0891b2", "#67e8f9"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.coverFallback}
        >
          <Image
            source={require("@/assets/images/logo.png")}
            style={styles.coverLogo}
            resizeMode="contain"
          />
        </LinearGradient>
      )}
      {uploadingCover ? (
        <View style={styles.coverOverlay}>
          <ActivityIndicator color="#fff" size="small" />
        </View>
      ) : (
        <View style={styles.coverCameraButton}>
          <Camera size={16} color="#fff" strokeWidth={2} />
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  coverPressable: { width: "100%", height: COVER_HEIGHT },
  cover: { width: "100%", height: COVER_HEIGHT },
  coverFallback: {
    height: COVER_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  coverLogo: { width: 120, height: 60, opacity: 0.25 },
  coverOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  coverCameraButton: {
    position: "absolute",
    bottom: 10,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
  },
});
