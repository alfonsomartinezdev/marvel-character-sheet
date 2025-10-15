import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Character, DicePoolEntry } from '../types/Character';

interface SpecialtiesScreenProps {
  character: Character;
  onAddDice: (entry: DicePoolEntry) => void;
  selectedSpecialty: DicePoolEntry | null;
}


export const SpecialtiesScreen: React.FC<SpecialtiesScreenProps> = ({
  character,
  onAddDice,
  selectedSpecialty
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
      selectedSpecialty?.source === specialty.name && styles.selectedSpecialty
    ]}
    onPress={() =>
      onAddDice({
        source: specialty.name,
        dice: specialty.dice,
      })
    }
  >
    <Text style={styles.specialtyName}>{specialty.name}</Text>
    <Text style={styles.specialtyDice}>{specialty.dice}</Text>
  </TouchableOpacity>
))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecf0f1',
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 16,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#2c3e50',
    padding: 12,
    marginHorizontal: -16,
    marginTop: -16,
    marginBottom: 16,
  },
  specialtyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  specialtyName: {
    fontSize: 16,
    color: '#2c3e50',
  },
  specialtyDice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  selectedSpecialty: {
  backgroundColor: '#d6eaf8',
  borderLeftWidth: 4,
  borderLeftColor: '#3498db',
},
});