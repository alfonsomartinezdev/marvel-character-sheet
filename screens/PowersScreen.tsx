import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Character, DicePoolEntry } from "../types/Character";

interface PowersScreenProps {
  character: Character;
  onAddDice: (entries: DicePoolEntry[]) => void; // Changed to accept array
  selectedPowers: DicePoolEntry[];
}

export const PowersScreen: React.FC<PowersScreenProps> = ({
  character,
  onAddDice,
  selectedPowers,
}) => {
  const isPowerSelected = (powerName: string) => {
    return selectedPowers.some((p) => p.source === powerName);
  };

  return (
    <ScrollView style={styles.container}>
      {character.powerSets.map((powerSet, psIndex) => (
        <View key={psIndex} style={styles.section}>
          <Text style={styles.sectionTitle}>{powerSet.name}</Text>

          {/* Powers */}
          {powerSet.powers.map((power, pIndex) => (
            <TouchableOpacity
              key={pIndex}
              style={[
                styles.item,
                isPowerSelected(power.name) && styles.itemSelected,
              ]}
              onPress={() => {
                // Create entries for all dice in the power
                const entries = power.dice.map((die) => ({
                  source: power.name,
                  dice: die,
                }));
                onAddDice(entries);
              }}
            >
              <View style={styles.itemContent}>
                <Text style={styles.itemName}>{power.name}</Text>
                <View style={styles.diceList}>
                  {power.dice.map((die, dIndex) => (
                    <Text key={dIndex} style={styles.diceValue}>
                      {die}
                    </Text>
                  ))}
                </View>
              </View>
            </TouchableOpacity>
          ))}

          {/* SFX */}
          {powerSet.sfx.length > 0 && (
            <>
              <Text style={styles.subTitle}>SFX</Text>
              {powerSet.sfx.map((sfx, sIndex) => (
                <View key={sIndex} style={styles.sfxItem}>
                  <Text style={styles.sfxName}>{sfx.name}</Text>
                  <Text style={styles.sfxDescription}>{sfx.description}</Text>
                </View>
              ))}
            </>
          )}
          {/* Limits */}
          {powerSet?.limits.length > 0 && (
            <>
              <Text style={styles.subTitle}>Limits</Text>
              {powerSet.limits.map((limit, lIndex) => (
                <View key={lIndex} style={styles.limitItem}>
                  <Text style={styles.limitName}>{limit.name}</Text>
                  <Text style={styles.limitDescription}>
                    {limit.description}
                  </Text>
                </View>
              ))}
            </>
          )}
        </View>
      ))}
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
  subTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#7f8c8d",
    marginTop: 16,
    marginBottom: 8,
  },
  item: {
    backgroundColor: "#f8f9fa",
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 3,
    borderColor: "#bdc3c7",
  },
  itemSelected: {
    backgroundColor: "#fff",
    borderColor: "#FDB913",
    borderWidth: 3,
  },
  itemContent: {
    gap: 8,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  diceList: {
    flexDirection: "row",
    gap: 8,
  },
  diceValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1A1A1A",
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#bdc3c7",
  },
  sfxItem: {
    backgroundColor: "#f8f9fa",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  sfxName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  sfxDescription: {
    fontSize: 13,
    color: "#7f8c8d",
    lineHeight: 18,
  },
  limitItem: {
    backgroundColor: "#fff3cd",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#f39c12",
  },
  limitName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#856404",
    marginBottom: 4,
  },
  limitDescription: {
    fontSize: 13,
    color: "#856404",
    lineHeight: 18,
  },
});
