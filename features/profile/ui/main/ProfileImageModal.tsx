import { Animated, Modal, Pressable, StyleSheet } from "react-native";

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
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={closeProfileModal}
        />
        <Animated.Image
          source={{ uri: profileImage ?? "" }}
          style={[styles.modalImage, { transform: [{ scale: modalAnim }] }]}
          resizeMode="contain"
        />
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalImage: {
    width: "90%",
    height: "60%",
    borderRadius: 12,
  },
});
