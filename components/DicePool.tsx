import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from "react-native";
import { DicePoolEntry, DieType } from "../types/Character";

interface DicePoolProps {
  dicePool: DicePoolEntry[];
  onRemoveDice: (entry: DicePoolEntry) => void;
  onClearPool: () => void;
  onAddCustomDice: (dice: DieType) => void;
}

export const DicePool: React.FC<DicePoolProps> = ({
  dicePool,
  onRemoveDice,
  onClearPool,
  onAddCustomDice,
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const diceTypes: DieType[] = ["d4", "d6", "d8", "d10", "d12"];

  const handleAddDice = (dice: DieType) => {
    onAddCustomDice(dice);
    setShowPicker(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Dice Pool ({dicePool.length})</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            onPress={() => setShowPicker(true)}
            style={styles.addButton}
          >
            <Text style={styles.addButtonText}>+ Add</Text>
          </TouchableOpacity>
          {dicePool.length > 0 && (
            <TouchableOpacity onPress={onClearPool} style={styles.clearButton}>
              <Text style={styles.clearText}>Clear</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {dicePool.length === 0 ? (
        <Text style={styles.emptyText}>
          Tap attributes to build your dice pool
        </Text>
      ) : (
        <View style={styles.diceGrid}>
          {dicePool.map((entry, index) => (
            <TouchableOpacity
              key={index}
              style={styles.diceItem}
              onPress={() => onRemoveDice(entry)}
            >
              <Text style={styles.diceValue}>{entry.dice}</Text>
              <Text style={styles.diceSource}>{entry.source}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Dice Picker Modal */}
      <Modal
        visible={showPicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowPicker(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowPicker(false)}
        >
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerTitle}>Add Custom Die</Text>
            <View style={styles.diceOptions}>
              {diceTypes.map((dice) => (
                <TouchableOpacity
                  key={dice}
                  style={styles.diceOption}
                  onPress={() => handleAddDice(dice)}
                >
                  <Text style={styles.diceOptionText}>{dice}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowPicker(false)}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1A1A1A",
    padding: 16,
    borderTopWidth: 2,
    borderTopColor: "#34495e",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    color: "#ecf0f1",
    fontSize: 18,
    fontWeight: "bold",
  },
  headerButtons: {
    flexDirection: "row",
    gap: 8,
  },
  addButton: {
    backgroundColor: "#7f8c8d",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 4,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  clearButton: {
    backgroundColor: "#95a5a6",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 4,
  },
  clearText: {
    color: "#fff",
    fontWeight: "600",
  },
  scrollView: {
    flexDirection: "row",
  },
  diceValue: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  diceSource: {
    color: "#95a5a6",
    fontSize: 10,
  },
  emptyText: {
    color: "#95a5a6",
    textAlign: "center",
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  pickerContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
    width: "80%",
    maxWidth: 300,
  },
  pickerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 20,
    textAlign: "center",
  },
  diceOptions: {
    gap: 12,
  },
  diceOption: {
    backgroundColor: "#2c3e50",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  diceOptionText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  cancelButton: {
    marginTop: 16,
    padding: 12,
    alignItems: "center",
  },
  cancelText: {
    color: "#7f8c8d",
    fontSize: 16,
  },
  diceGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  diceItem: {
    backgroundColor: "#34495e",
    borderWidth: 3,
    borderColor: "#FDB913",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    minWidth: 70,
  },
});
