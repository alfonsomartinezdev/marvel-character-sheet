import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Alert,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import { Character } from "../types/Character";

interface QRExportModalProps {
  visible: boolean;
  character: Character | null;
  onClose: () => void;
}

export const QRExportModal: React.FC<QRExportModalProps> = ({
  visible,
  character,
  onClose,
}) => {
  if (!character) return null;

  const characterJSON = JSON.stringify(character);

  // Check if character data is too large for QR code
  const isTooLarge = characterJSON.length > 2900; // Conservative limit

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>{character.name}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          {isTooLarge ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorTitle}>Character Too Complex</Text>
              <Text style={styles.errorText}>
                This character has too much data to fit in a QR code. Try
                removing some powers, SFX, or milestones.
              </Text>
              <Text style={styles.sizeText}>
                Size: {characterJSON.length} characters (max ~2900)
              </Text>
            </View>
          ) : (
            <View style={styles.qrContainer}>
              <QRCode
                value={characterJSON}
                size={250}
                backgroundColor="white"
              />
              <Text style={styles.instructions}>
                Have your friend scan this QR code with their device
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
    width: "85%",
    maxWidth: 350,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2c3e50",
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  closeText: {
    fontSize: 28,
    color: "#7f8c8d",
    fontWeight: "bold",
  },
  qrContainer: {
    alignItems: "center",
  },
  instructions: {
    marginTop: 20,
    fontSize: 14,
    color: "#7f8c8d",
    textAlign: "center",
  },
  errorContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#e74c3c",
    marginBottom: 12,
  },
  errorText: {
    fontSize: 14,
    color: "#2c3e50",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 12,
  },
  sizeText: {
    fontSize: 12,
    color: "#7f8c8d",
    fontStyle: "italic",
  },
});
