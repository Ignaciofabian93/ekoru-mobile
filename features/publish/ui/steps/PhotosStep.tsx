import { Text } from "@/components/shared/Text/Text";
import { Title } from "@/components/shared/Title/Title";
import UploadImageCard from "@/components/shared/UploadImageCard/UploadImageCard";
import { colors } from "@/design/tokens";
import * as ImagePicker from "expo-image-picker";
import { Camera, Image as ImageIcon, X } from "lucide-react-native";
import { Image, Pressable, ScrollView, StyleSheet, View } from "react-native";

const MAX_IMAGES = 4;

interface Props {
  images: string[];
  error?: string;
  onChange: (images: string[]) => void;
}

export default function PhotosStep({ images, error, onChange }: Props) {
  const pickFromGallery = async () => {
    if (images.length >= MAX_IMAGES) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsMultipleSelection: true,
      selectionLimit: MAX_IMAGES - images.length,
      quality: 0.85,
    });
    if (!result.canceled) {
      const uris = result.assets.map((a) => a.uri);
      onChange([...images, ...uris].slice(0, MAX_IMAGES));
    }
  };

  const pickFromCamera = async () => {
    if (images.length >= MAX_IMAGES) return;
    const result = await ImagePicker.launchCameraAsync({
      quality: 0.85,
    });
    if (!result.canceled) {
      onChange([...images, result.assets[0].uri].slice(0, MAX_IMAGES));
    }
  };

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Title level="h5" weight="semibold">
          Product photos
        </Title>
        <Text size="sm" color="tertiary">
          {images.length}/{MAX_IMAGES}
        </Text>
      </View>
      <Text size="sm" color="secondary" style={styles.subtitle}>
        Add up to {MAX_IMAGES} photos. The first one will be used as the cover.
      </Text>

      {/* ── Upload options ──────────────────────────────────── */}
      <View style={styles.uploadSection}>
        <View style={styles.uploadRow}>
          <UploadImageCard
            onPress={pickFromGallery}
            title="Photo Library"
            description="Browse and select from your gallery"
            icon={ImageIcon}
            iconStyle={styles.uploadIconGallery}
            iconColor={colors.primary}
            disabled={images.length >= MAX_IMAGES}
          />
          <UploadImageCard
            onPress={pickFromCamera}
            title="Take a Photo"
            description="Capture a new image with your camera"
            icon={Camera}
            iconStyle={styles.uploadIconCamera}
            iconColor={colors.secondaryDark}
            disabled={images.length >= MAX_IMAGES}
          />
        </View>
      </View>

      {/* ── Thumbnail strip ─────────────────────────────────── */}
      {images.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.strip}
        >
          {images.map((uri, i) => (
            <View key={uri} style={styles.thumb}>
              <Image source={{ uri }} style={styles.thumbImg} />
              {i === 0 && (
                <View style={styles.coverBadge}>
                  <Text size="xs" weight="semibold" style={styles.coverText}>
                    Cover
                  </Text>
                </View>
              )}
              <Pressable
                style={styles.removeBtn}
                onPress={() => removeImage(i)}
                hitSlop={6}
              >
                <X size={12} color="#fff" strokeWidth={2.5} />
              </Pressable>
            </View>
          ))}
        </ScrollView>
      )}

      {error && (
        <Text size="sm" style={styles.error}>
          {error}
        </Text>
      )}
    </View>
  );
}

const THUMB_SIZE = 100;

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  subtitle: {
    lineHeight: 20,
    marginTop: -4,
  },
  strip: {
    gap: 10,
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
  },
  thumbImg: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
  },
  coverBadge: {
    position: "absolute",
    bottom: 6,
    left: 6,
    backgroundColor: colors.primary,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  coverText: {
    color: "#fff",
    fontSize: 10,
  },
  removeBtn: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "rgba(0,0,0,0.55)",
    alignItems: "center",
    justifyContent: "center",
  },
  uploadSection: {
    // marginTop: 4,
    // gap: 8,
  },
  uploadLabel: {
    letterSpacing: 0.6,
    marginBottom: 2,
  },
  uploadRow: {
    flexDirection: "row",
    gap: 10,
  },
  uploadCard: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 12,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
  },
  uploadCardPressed: {
    backgroundColor: colors.backgroundTertiary,
  },
  uploadIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },
  uploadIconGallery: {
    backgroundColor: colors.backgroundPrimaryLight,
    borderWidth: 1,
    borderColor: colors.borderFocus,
  },
  uploadIconCamera: {
    backgroundColor: "#ecfeff",
    borderWidth: 1,
    borderColor: "#a5f3fc",
  },
  error: {
    color: colors.danger,
  },
});
