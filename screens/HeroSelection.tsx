import React, { useState } from "react";
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
  onDeleteHero: (hero: Character) => void;
  onExportHero: (hero: Character) => void;
  onScanCharacter: () => void;
  defaultHeroes: Character[];
}

export const HeroSelection: React.FC<HeroSelectionProps> = ({
  heroes,
  onSelectHero,
  heroStates,
  onCreateNew,
  onEditHero,
  onDeleteHero,
  onExportHero,
  onScanCharacter,
  defaultHeroes,
}) => {
  const [expandedHero, setExpandedHero] = useState<string | null>(null);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Select Your Hero</Text>
        <Text style={styles.subtitle}>Long press to show options</Text>
      </View>

      <ScrollView style={styles.heroList}>
        {heroes.map((hero, index) => {
          const heroState = heroStates.get(hero.name);
          const currentPP = heroState?.pp ?? hero.pp;
          const currentXP = heroState?.xp ?? hero.xp;
          const isDefault = defaultHeroes.some((h) => h.name === hero.name);
          const isExpanded = expandedHero === hero.name;

          return (
            <View key={index} style={styles.heroCardContainer}>
              <TouchableOpacity
                style={styles.heroCard}
                onPress={() => {
                  if (isExpanded) {
                    setExpandedHero(null);
                  } else {
                    onSelectHero(hero);
                  }
                }}
                onLongPress={() => {
                  setExpandedHero(isExpanded ? null : hero.name);
                }}
                delayLongPress={500}
              >
                <View style={styles.heroInfo}>
                  <Text style={styles.heroName}>{hero.name}</Text>
                  <View style={styles.heroStats}>
                    <Text style={styles.statText}>PP: {currentPP}</Text>
                    <Text style={styles.statText}>XP: {currentXP}</Text>
                  </View>
                  <View style={styles.affiliations}>
                    <Text style={styles.affiliationText}>
                      Solo {hero.affiliations.solo} - Buddy{" "}
                      {hero.affiliations.buddy} - Team {hero.affiliations.team}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>

              {isExpanded && (
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => {
                      setExpandedHero(null);
                      onEditHero(hero);
                    }}
                  >
                    <Text style={styles.editButtonText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.exportButton}
                    onPress={() => {
                      setExpandedHero(null);
                      onExportHero(hero);
                    }}
                  >
                    <Text style={styles.exportButtonText}>Export</Text>
                  </TouchableOpacity>
                  {!isDefault && (
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => {
                        setExpandedHero(null);
                        onDeleteHero(hero);
                      }}
                    >
                      <Text style={styles.deleteButtonText}>Delete</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
          );
        })}
        <TouchableOpacity style={styles.scanButton} onPress={onScanCharacter}>
          <Text style={styles.scanButtonText}>Scan Character QR Code</Text>
        </TouchableOpacity>
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
    backgroundColor: "#1A1A1A",
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  subtitle: {
    fontSize: 12,
    color: "#95a5a6",
    marginTop: 4,
  },
  heroList: {
    flex: 1,
    padding: 16,
  },
  heroCardContainer: {
    marginBottom: 12,
  },
  heroCard: {
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
    color: "#1A1A1A",
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
  actionButtons: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
  editButton: {
    flex: 1,
    backgroundColor: "#2c3e50",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  deleteButton: {
    flex: 1,
    backgroundColor: "#ff3300",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  editButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  addButton: {
    backgroundColor: "#2c3e50",
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
  exportButton: {
    flex: 1,
    backgroundColor: "#7f8c8d",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  exportButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  scanButton: {
    backgroundColor: "#7f8c8d",
    borderRadius: 8,
    padding: 20,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 8,
  },
  scanButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
});

export default HeroSelection;
