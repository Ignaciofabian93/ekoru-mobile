import { Animated, Modal, Pressable, StyleSheet, View } from "react-native";
import { X } from "lucide-react-native";
import { BlurView } from "expo-blur";

export interface ProfileImageModalProps {
  profileModalVisible: boolean;
  closeProfileModal: () => void;
  modalAnim: Animated.Value;
  profileImage: string | null | undefined;
}

export default function ProfileImageModal({
  profileModalVisible,
  closeProfileModal,
  modalAnim,
  profileImage,
}: ProfileImageModalProps) {
  return (
    <Modal
      transparent
      visible={profileModalVisible}
      onRequestClose={closeProfileModal}
      statusBarTranslucent
      animationType="none"
    >
      <Animated.View style={[styles.modalBackdrop, { opacity: modalAnim }]}>
        <BlurView intensity={100} style={StyleSheet.absoluteFill} tint="systemMaterialDark" />
        <View style={styles.container}>
          <Animated.View
            style={[styles.closeButton, { opacity: modalAnim, transform: [{ scale: modalAnim }] }]}
          >
            <Pressable
              onPress={closeProfileModal}
              style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
            >
              <X color={"#fff"} size={24} />
            </Pressable>
          </Animated.View>
          <Animated.Image
            source={{ uri: profileImage ?? "" }}
            style={[styles.modalImage, { transform: [{ scale: modalAnim }] }]}
            resizeMode="cover"
          />
        </View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    position: "relative",
    width: "70%",
    height: "40%",
  },
  modalImage: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
  },
  closeButton: {
    position: "absolute",
    top: "5%",
    right: "5%",
    zIndex: 999,
    backgroundColor: "#222",
    borderRadius: "50%",
    padding: 3,
  },
});
