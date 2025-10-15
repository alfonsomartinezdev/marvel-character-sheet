import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Character } from "../types/Character";

interface HeroSelectionProps {
  heroes: Character[];
  onSelectHero: (hero: Character) => void;
  heroStates: Map<string, any>;
  onCreateNew: () => void;
  onEditHero: (hero: Character) => void;
}

export const HeroSelection: React.FC<HeroSelectionProps> = ({
  heroes,
  onSelectHero,
  heroStates,
  onCreateNew,
  onEditHero,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Select Your Hero</Text>
      </View>

      <ScrollView style={styles.heroList}>
        {heroes.map((hero, index) => {
          const heroState = heroStates.get(hero.name);
          const currentPP = heroState?.pp ?? hero.pp;
          const currentXP = heroState?.xp ?? hero.xp;

          return (
            <View key={index} style={styles.heroCardContainer}>
              <TouchableOpacity
                style={styles.heroCard}
                onPress={() => onSelectHero(hero)}
              >
                <View style={styles.heroInfo}>
                  <Text style={styles.heroName}>{hero.name}</Text>
                  <View style={styles.heroStats}>
                    <Text style={styles.statText}>PP: {currentPP}</Text>
                    <Text style={styles.statText}>XP: {currentXP}</Text>
                  </View>
                  <View style={styles.affiliations}>
                    <Text style={styles.affiliationText}>
                      Solo {hero.affiliations.solo} • Buddy{" "}
                      {hero.affiliations.buddy} • Team {hero.affiliations.team}
                    </Text>
                  </View>
                </View>
                <Text style={styles.arrow}>›</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => onEditHero(hero)}
              >
                <Text style={styles.editButtonText}>✎</Text>
              </TouchableOpacity>
            </View>
          );
        })}

        <TouchableOpacity style={styles.addButton} onPress={onCreateNew}>
          <Text style={styles.addButtonText}>+ Create New Hero</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ecf0f1",
  },
  header: {
    backgroundColor: "#2c3e50",
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  heroList: {
    flex: 1,
    padding: 16,
  },
  heroCardContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  heroCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  heroInfo: {
    flex: 1,
  },
  heroName: {
    fontSize: 24,
    fontWeight: "bold",
    fontStyle: "italic",
    color: "#2c3e50",
    marginBottom: 8,
  },
  heroStats: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 8,
  },
  statText: {
    fontSize: 14,
    color: "#7f8c8d",
    fontWeight: "600",
  },
  affiliations: {
    marginTop: 4,
  },
  affiliationText: {
    fontSize: 12,
    color: "#95a5a6",
  },
  arrow: {
    fontSize: 32,
    color: "#bdc3c7",
    marginLeft: 16,
  },
  editButton: {
    backgroundColor: "#3498db",
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
  },
  editButtonText: {
    fontSize: 24,
    color: "#fff",
  },
  addButton: {
    backgroundColor: "#3498db",
    borderRadius: 8,
    padding: 20,
    alignItems: "center",
    marginTop: 8,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
});

export default HeroSelection;
