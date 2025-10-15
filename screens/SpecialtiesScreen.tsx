import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Character, DicePoolEntry } from "../types/Character";

interface SpecialtiesScreenProps {
  character: Character;
  onAddDice: (entry: DicePoolEntry) => void;
  selectedSpecialty: DicePoolEntry | null;
}

export const SpecialtiesScreen: React.FC<SpecialtiesScreenProps> = ({
  character,
  onAddDice,
  selectedSpecialty,
}) => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>SPECIALTIES</Text>
        {character.specialties.map((specialty, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.specialtyItem,
              selectedSpecialty?.source === specialty.name &&
                styles.selectedSpecialty,
            ]}
            onPress={() =>
              onAddDice({
                source: specialty.name,
                dice: specialty.dice,
              })
            }
          >
            <Text style={styles.specialtyName}>{specialty.name}</Text>
            <View style={styles.diceChip}>
              <Text style={styles.specialtyDice}>{specialty.dice}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ecf0f1",
  },
  section: {
    backgroundColor: "#fff",
    marginTop: 16,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    backgroundColor: "#1A1A1A",
    padding: 12,
    marginHorizontal: -16,
    marginTop: -16,
    marginBottom: 16,
  },
  specialtyItem: {
    backgroundColor: "#f8f9fa",
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 3,
    borderColor: "#bdc3c7",
  },
  specialtyName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 8,
  },
  specialtyDice: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1A1A1A",
  },
  diceChip: {
    backgroundColor: "#fff",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#bdc3c7",
  },
  selectedSpecialty: {
    backgroundColor: "#fff",
    borderColor: "#FDB913",
    borderWidth: 3,
  },
});
