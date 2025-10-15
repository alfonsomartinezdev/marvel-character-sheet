import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Character, DicePoolEntry } from "../types/Character";

interface OverviewScreenProps {
  character: Character;
  onAddAffiliation: (entry: DicePoolEntry) => void;
  onAddDistinction: (entry: DicePoolEntry) => void;
  selectedAffiliation: DicePoolEntry | null;
  selectedDistinction: DicePoolEntry | null;
  pp: number;
  xp: number;
  onUpdatePP: (amount: number) => void;
  onUpdateXP: (amount: number) => void;
}

export const OverviewScreen: React.FC<OverviewScreenProps> = ({
  character,
  onAddAffiliation,
  onAddDistinction,
  selectedAffiliation,
  selectedDistinction,
  pp,
  xp,
  onUpdatePP,
  onUpdateXP,
}) => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.characterName}>{character.name}</Text>
        <View style={styles.stats}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>PP</Text>
            <View style={styles.statControls}>
              <TouchableOpacity
                onPress={() => onUpdatePP(-1)}
                style={styles.minusButton}
              >
                <Text style={styles.buttonText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.statValue}>{pp}</Text>
              <TouchableOpacity
                onPress={() => onUpdatePP(1)}
                style={styles.plusButton}
              >
                <Text style={styles.buttonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>XP</Text>
            <View style={styles.statControls}>
              <TouchableOpacity
                onPress={() => onUpdateXP(-1)}
                style={styles.minusButton}
              >
                <Text style={styles.buttonText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.statValue}>{xp}</Text>
              <TouchableOpacity
                onPress={() => onUpdateXP(1)}
                style={styles.plusButton}
              >
                <Text style={styles.buttonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>AFFILIATIONS</Text>
        <View style={styles.affiliationsContainer}>
          <TouchableOpacity
            style={styles.affiliationItem}
            onPress={() =>
              onAddAffiliation({
                source: "Solo",
                dice: character.affiliations.solo,
              })
            }
          >
            <Text style={styles.affiliationLabel}>Solo</Text>
            <View
              style={[
                styles.diceButton,
                selectedAffiliation?.source === "Solo" && styles.selectedDice,
              ]}
            >
              <Text style={styles.diceText}>{character.affiliations.solo}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.affiliationItem}
            onPress={() =>
              onAddAffiliation({
                source: "Buddy",
                dice: character.affiliations.buddy,
              })
            }
          >
            <Text style={styles.affiliationLabel}>Buddy</Text>
            <View
              style={[
                styles.diceButton,
                selectedAffiliation?.source === "Buddy" && styles.selectedDice,
              ]}
            >
              <Text style={styles.diceText}>
                {character.affiliations.buddy}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.affiliationItem}
            onPress={() =>
              onAddAffiliation({
                source: "Team",
                dice: character.affiliations.team,
              })
            }
          >
            <Text style={styles.affiliationLabel}>Team</Text>
            <View
              style={[
                styles.diceButton,
                selectedAffiliation?.source === "Team" && styles.selectedDice,
              ]}
            >
              <Text style={styles.diceText}>{character.affiliations.team}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>DISTINCTIONS</Text>
        {character.distinctions.map((distinction, index) => (
          <View key={index} style={styles.distinctionItem}>
            <Text style={styles.distinctionName}>{distinction.name}</Text>
            <View style={styles.diceOptions}>
              <TouchableOpacity
                style={[
                  styles.diceButton,
                  selectedDistinction?.source === distinction.name &&
                    styles.selectedDice,
                ]}
                onPress={() =>
                  onAddDistinction({ source: distinction.name, dice: "d8" })
                }
              >
                <Text style={styles.diceText}>d8</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.diceButton,
                  styles.d4Button,
                  selectedDistinction?.source === `${distinction.name} (d4)` &&
                    styles.selectedDice,
                ]}
                onPress={() =>
                  onAddDistinction({
                    source: `${distinction.name} (d4)`,
                    dice: "d4",
                  })
                }
              >
                <Text style={styles.diceText}>d4</Text>
                <Text style={styles.ppText}>+1 PP</Text>
              </TouchableOpacity>
            </View>
          </View>
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
  header: {
    backgroundColor: "#fff",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#bdc3c7",
  },
  characterName: {
    fontSize: 32,
    fontWeight: "bold",
    fontStyle: "italic",
    color: "#1A1A1A",
    marginBottom: 12,
  },
  stats: {
    flexDirection: "row",
    gap: 16,
  },
  statBox: {
    backgroundColor: "#f8f9fa",
    padding: 12,
    borderRadius: 8,
    minWidth: 80,
    alignItems: "center",
  },
  statLabel: {
    fontSize: 12,
    color: "#7f8c8d",
    fontWeight: "600",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1A1A1A",
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
  affiliationsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  affiliationItem: {
    alignItems: "center",
  },
  affiliationLabel: {
    fontSize: 14,
    color: "#1A1A1A",
    marginBottom: 8,
    fontWeight: "600",
  },
  distinctionItem: {
    backgroundColor: "#ecf0f1",
    padding: 16,
    marginBottom: 12,
    borderRadius: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  distinctionName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    flex: 1,
  },
  diceOptions: {
    flexDirection: "row",
    gap: 8,
  },
  diceButton: {
    backgroundColor: "#fff",
    borderWidth: 3,
    borderColor: "#95a5a6",
    borderRadius: 4,
    padding: 12,
    minWidth: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  d4Button: {
    borderColor: "#bdc3c7",
  },
  diceText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1A1A1A",
  },
  ppText: {
    fontSize: 10,
    color: "#7f8c8d",
    marginTop: 2,
  },
  selectedDice: {
    backgroundColor: "#fff",
    borderColor: "#FDB913",
    borderWidth: 3,
  },
  statControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  minusButton: {
    backgroundColor: "#7f8c8d",
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  plusButton: {
    backgroundColor: "#2c3e50",
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
