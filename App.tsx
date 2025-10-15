import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  StatusBar,
  View,
  TouchableOpacity,
  Text,
  Alert,
  BackHandler,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Character, DicePoolEntry, DieType } from "./types/Character";
import HeroSelection from "./screens/HeroSelection";
import { heroes } from "./data/SampleHeroes";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { DicePool } from "./components/DicePool";

import { OverviewScreen } from "./screens/OverviewScreen";
import { PowersScreen } from "./screens/PowersScreen";
import { SpecialtiesScreen } from "./screens/SpecialtiesScreen";
import { TrackingScreen } from "./screens/TrackingScreen";
import { CharacterCreator } from "./screens/CharacterCreator";

import { QRExportModal } from "./components/QRExportModal";
import { QRScannerModal } from "./components/QRScannerModal";

const Tab = createMaterialTopTabNavigator();

interface HeroState {
  pp: number;
  xp: number;
  stress: {
    physical: { stress: DieType | null; trauma: DieType | null; max: DieType };
    mental: { stress: DieType | null; trauma: DieType | null; max: DieType };
    emotional: { stress: DieType | null; trauma: DieType | null; max: DieType };
  };
  selectedAffiliation: DicePoolEntry | null;
  selectedDistinction: DicePoolEntry | null;
  selectedSpecialty: DicePoolEntry | null;
  selectedPowers: DicePoolEntry[];
  customDice: DicePoolEntry[];
}

export default function App() {
  const [customHeroes, setCustomHeroes] = useState<Character[]>([]);
  const [showCreator, setShowCreator] = useState(false);
  const [editingHero, setEditingHero] = useState<Character | null>(null);

  const [selectedHero, setSelectedHero] = useState<Character | null>(null);
  const [heroStates, setHeroStates] = useState<Map<string, HeroState>>(
    new Map(),
  );

  const [showQRExport, setShowQRExport] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [exportingHero, setExportingHero] = useState<Character | null>(null);

  // Load saved hero states when app starts
  useEffect(() => {
    const loadHeroStates = async () => {
      try {
        const savedStates = await AsyncStorage.getItem("heroStates");
        if (savedStates) {
          const parsed = JSON.parse(savedStates);
          // Convert plain object back to Map with proper typing
          const statesMap = new Map<string, HeroState>(Object.entries(parsed));
          setHeroStates(statesMap);
        }
      } catch (error) {
        console.error("Error loading hero states:", error);
      }
    };

    loadHeroStates();
  }, []);

  // Save hero states whenever they change
  useEffect(() => {
    const saveHeroStates = async () => {
      try {
        // Convert Map to plain object for JSON storage
        const statesObject = Object.fromEntries(heroStates);
        await AsyncStorage.setItem("heroStates", JSON.stringify(statesObject));
      } catch (error) {
        console.error("Error saving hero states:", error);
      }
    };

    // Only save if we have states
    if (heroStates.size > 0) {
      saveHeroStates();
    }
  }, [heroStates]);

  // Load custom heroes when app starts
  useEffect(() => {
    const loadCustomHeroes = async () => {
      try {
        const saved = await AsyncStorage.getItem("customHeroes");
        if (saved) {
          setCustomHeroes(JSON.parse(saved));
        }
      } catch (error) {
        console.error("Error loading custom heroes:", error);
      }
    };

    loadCustomHeroes();
  }, []);

  // Handle back button/gesture when hero is selected
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (selectedHero) {
          // If a hero is selected, go back to hero selection instead of exiting
          setSelectedHero(null);
          return true; // Prevent default behavior (exiting app)
        }
        return false; // Allow default behavior (exit app)
      },
    );

    return () => backHandler.remove();
  }, [selectedHero]);

  const handleSaveCharacter = (character: Character) => {
    const updatedCustomHeroes = editingHero
      ? customHeroes.map((h) => (h.name === editingHero.name ? character : h))
      : [...customHeroes, character];

    setCustomHeroes(updatedCustomHeroes);
    setShowCreator(false);
    setEditingHero(null);

    // Save to AsyncStorage
    AsyncStorage.setItem("customHeroes", JSON.stringify(updatedCustomHeroes));
  };

  const handleCreateNewHero = () => {
    setEditingHero(null);
    setShowCreator(true);
  };

  const handleEditHero = (hero: Character) => {
    setEditingHero(hero);
    setShowCreator(true);
  };

  const handleDeleteHero = (hero: Character) => {
    Alert.alert(
      "Delete Character",
      `Are you sure you want to delete ${hero.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            const updatedCustomHeroes = customHeroes.filter(
              (h) => h.name !== hero.name,
            );
            setCustomHeroes(updatedCustomHeroes);

            // Remove from heroStates as well
            const newHeroStates = new Map(heroStates);
            newHeroStates.delete(hero.name);
            setHeroStates(newHeroStates);

            // Save both to AsyncStorage
            AsyncStorage.setItem(
              "customHeroes",
              JSON.stringify(updatedCustomHeroes),
            );
            AsyncStorage.setItem(
              "heroStates",
              JSON.stringify(Object.fromEntries(newHeroStates)),
            );
          },
        },
      ],
    );
  };

  const handleExportHero = (hero: Character) => {
    setExportingHero(hero);
    setShowQRExport(true);
  };

  const handleScanCharacter = () => {
    setShowQRScanner(true);
  };

  const handleCharacterScanned = (character: Character) => {
    // Check if character with same name already exists
    const exists = allHeroes.some((h) => h.name === character.name);

    if (exists) {
      // Add a number suffix
      let counter = 2;
      let newName = `${character.name} (${counter})`;
      while (allHeroes.some((h) => h.name === newName)) {
        counter++;
        newName = `${character.name} (${counter})`;
      }
      character.name = newName;
    }

    // Add to custom heroes
    const updatedCustomHeroes = [...customHeroes, character];
    setCustomHeroes(updatedCustomHeroes);
    AsyncStorage.setItem("customHeroes", JSON.stringify(updatedCustomHeroes));

    Alert.alert("Success", `${character.name} has been imported!`);
  };

  // Initialize state for a hero if it doesn't exist
  const initializeHeroState = (hero: Character): HeroState => {
    return {
      pp: hero.pp,
      xp: hero.xp,
      stress: {
        physical: {
          stress: hero.stress.physical.current,
          trauma: null,
          max: hero.stress.physical.max,
        },
        mental: {
          stress: hero.stress.mental.current,
          trauma: null,
          max: hero.stress.mental.max,
        },
        emotional: {
          stress: hero.stress.emotional.current,
          trauma: null,
          max: hero.stress.emotional.max,
        },
      },
      selectedAffiliation: null,
      selectedDistinction: null,
      selectedSpecialty: null,
      selectedPowers: [],
      customDice: [],
    };
  };

  // Get current hero's state
  const getCurrentHeroState = (): HeroState | null => {
    if (!selectedHero) return null;
    return (
      heroStates.get(selectedHero.name) || initializeHeroState(selectedHero)
    );
  };

  // Update current hero's state
  const updateHeroState = (updates: Partial<HeroState>) => {
    if (!selectedHero) return;

    const currentState =
      getCurrentHeroState() || initializeHeroState(selectedHero);
    const newState = { ...currentState, ...updates };

    const newHeroStates = new Map(heroStates);
    newHeroStates.set(selectedHero.name, newState);
    setHeroStates(newHeroStates);
  };

  const handleSelectHero = (hero: Character) => {
    setSelectedHero(hero);
    // Initialize state for this hero if it doesn't exist
    if (!heroStates.has(hero.name)) {
      const newHeroStates = new Map(heroStates);
      newHeroStates.set(hero.name, initializeHeroState(hero));
      setHeroStates(newHeroStates);
    }
  };

  // All the update functions now use updateHeroState
  const addAffiliation = (entry: DicePoolEntry) => {
    const currentState = getCurrentHeroState();
    if (!currentState) return;

    const newAffiliation =
      currentState.selectedAffiliation?.source === entry.source ? null : entry;
    updateHeroState({ selectedAffiliation: newAffiliation });
  };

  const addDistinction = (entry: DicePoolEntry) => {
    const currentState = getCurrentHeroState();
    if (!currentState) return;

    const newDistinction =
      currentState.selectedDistinction?.source === entry.source ? null : entry;
    updateHeroState({ selectedDistinction: newDistinction });
  };

  const addSpecialty = (entry: DicePoolEntry) => {
    const currentState = getCurrentHeroState();
    if (!currentState) return;

    const newSpecialty =
      currentState.selectedSpecialty?.source === entry.source ? null : entry;
    updateHeroState({ selectedSpecialty: newSpecialty });
  };

  const addPower = (entries: DicePoolEntry[]) => {
    const currentState = getCurrentHeroState();
    if (!currentState) return;

    // entries will be all the dice from one power, they all share the same source name
    const powerName = entries[0]?.source;
    if (!powerName) return;

    // Check if this power is already selected
    const alreadySelected = currentState.selectedPowers.some(
      (p) => p.source === powerName,
    );

    if (alreadySelected) {
      // Remove ALL dice from this power
      updateHeroState({
        selectedPowers: currentState.selectedPowers.filter(
          (p) => p.source !== powerName,
        ),
      });
    } else {
      // Add ALL dice from this power
      updateHeroState({
        selectedPowers: [...currentState.selectedPowers, ...entries],
      });
    }
  };

  const addCustomDice = (dice: DieType) => {
    const currentState = getCurrentHeroState();
    if (!currentState) return;

    const entry: DicePoolEntry = { source: "Custom", dice };
    updateHeroState({ customDice: [...currentState.customDice, entry] });
  };

  const removeDice = (entry: DicePoolEntry) => {
    const currentState = getCurrentHeroState();
    if (!currentState) return;

    if (currentState.selectedAffiliation?.source === entry.source) {
      updateHeroState({ selectedAffiliation: null });
    } else if (currentState.selectedDistinction?.source === entry.source) {
      updateHeroState({ selectedDistinction: null });
    } else if (currentState.selectedSpecialty?.source === entry.source) {
      updateHeroState({ selectedSpecialty: null });
    } else if (
      currentState.selectedPowers.some((p) => p.source === entry.source)
    ) {
      // Remove ALL dice from this power (not just one)
      updateHeroState({
        selectedPowers: currentState.selectedPowers.filter(
          (p) => p.source !== entry.source,
        ),
      });
    } else {
      const index = currentState.customDice.findIndex((d) => d === entry);
      if (index !== -1) {
        updateHeroState({
          customDice: currentState.customDice.filter((_, i) => i !== index),
        });
      }
    }
  };

  const clearPool = () => {
    updateHeroState({
      selectedAffiliation: null,
      selectedDistinction: null,
      selectedSpecialty: null,
      selectedPowers: [],
      customDice: [],
    });
  };

  const updatePP = (amount: number) => {
    const currentState = getCurrentHeroState();
    if (!currentState) return;
    updateHeroState({ pp: Math.max(0, currentState.pp + amount) });
  };

  const updateXP = (amount: number) => {
    const currentState = getCurrentHeroState();
    if (!currentState) return;
    updateHeroState({ xp: Math.max(0, currentState.xp + amount) });
  };

  const updateStress = (
    type: "physical" | "mental" | "emotional",
    level: DieType | null,
  ) => {
    const currentState = getCurrentHeroState();
    if (!currentState) return;

    updateHeroState({
      stress: {
        ...currentState.stress,
        [type]: {
          ...currentState.stress[type],
          stress: level,
        },
      },
    });
  };

  const updateTrauma = (
    type: "physical" | "mental" | "emotional",
    level: DieType | null,
  ) => {
    const currentState = getCurrentHeroState();
    if (!currentState) return;

    updateHeroState({
      stress: {
        ...currentState.stress,
        [type]: {
          ...currentState.stress[type],
          trauma: level,
        },
      },
    });
  };

  // Compute values from current hero state
  const currentState = getCurrentHeroState();
  const dicePool = currentState
    ? [
        currentState.selectedAffiliation,
        currentState.selectedDistinction,
        currentState.selectedSpecialty,
        ...currentState.selectedPowers,
        ...currentState.customDice,
      ].filter((entry): entry is DicePoolEntry => entry !== null)
    : [];

  // Combine default heroes with custom heroes
  const allHeroes = [...heroes, ...customHeroes];

  if (!selectedHero) {
    if (showCreator) {
      return (
        <SafeAreaView style={styles.container}>
          <StatusBar barStyle="light-content" backgroundColor="#1A1A1A" />
          <CharacterCreator
            onSave={handleSaveCharacter}
            onCancel={() => {
              setShowCreator(false);
              setEditingHero(null);
            }}
            existingCharacter={editingHero || undefined}
          />
        </SafeAreaView>
      );
    }

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#1A1A1A" />
        <HeroSelection
          heroes={allHeroes}
          onSelectHero={handleSelectHero}
          heroStates={heroStates}
          onCreateNew={handleCreateNewHero}
          onEditHero={handleEditHero}
          onDeleteHero={handleDeleteHero}
          onExportHero={handleExportHero}
          onScanCharacter={handleScanCharacter}
          defaultHeroes={heroes}
        />
        <QRExportModal
          visible={showQRExport}
          character={exportingHero}
          onClose={() => {
            setShowQRExport(false);
            setExportingHero(null);
          }}
        />
        <QRScannerModal
          visible={showQRScanner}
          onClose={() => setShowQRScanner(false)}
          onCharacterScanned={handleCharacterScanned}
        />
      </SafeAreaView>
    );
  }

  // Show character sheet for selected hero
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1A1A1A" />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setSelectedHero(null)}
        >
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{selectedHero.name}</Text>
      </View>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            tabBarStyle: styles.tabBar,
            tabBarLabelStyle: styles.tabLabel,
            tabBarIndicatorStyle: styles.tabIndicator,
            tabBarActiveTintColor: "#fff",
            tabBarInactiveTintColor: "#95a5a6",
          }}
        >
          <Tab.Screen name="Overview">
            {() => (
              <OverviewScreen
                character={selectedHero}
                onAddAffiliation={addAffiliation}
                onAddDistinction={addDistinction}
                selectedAffiliation={currentState?.selectedAffiliation || null}
                selectedDistinction={currentState?.selectedDistinction || null}
                pp={currentState?.pp || 0}
                xp={currentState?.xp || 0}
                onUpdatePP={updatePP}
                onUpdateXP={updateXP}
              />
            )}
          </Tab.Screen>
          <Tab.Screen name="Powers">
            {() => (
              <PowersScreen
                character={selectedHero}
                onAddDice={addPower}
                selectedPowers={currentState?.selectedPowers || []}
              />
            )}
          </Tab.Screen>
          <Tab.Screen name="Specialties">
            {() => (
              <SpecialtiesScreen
                character={selectedHero}
                onAddDice={addSpecialty}
                selectedSpecialty={currentState?.selectedSpecialty || null}
              />
            )}
          </Tab.Screen>
          <Tab.Screen name="Tracking">
            {() => (
              <TrackingScreen
                character={selectedHero}
                stress={
                  currentState?.stress || {
                    physical: { stress: null, trauma: null, max: "d12" },
                    mental: { stress: null, trauma: null, max: "d12" },
                    emotional: { stress: null, trauma: null, max: "d12" },
                  }
                }
                onUpdateStress={updateStress}
                onUpdateTrauma={updateTrauma}
              />
            )}
          </Tab.Screen>
        </Tab.Navigator>
      </NavigationContainer>
      <DicePool
        dicePool={dicePool}
        onRemoveDice={removeDice}
        onClearPool={clearPool}
        onAddCustomDice={addCustomDice}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1A",
  },
  tabBar: {
    backgroundColor: "#1A1A1A",
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  tabIndicator: {
    backgroundColor: "#FDB913",
    height: 3,
  },
  header: {
    backgroundColor: "#1A1A1A",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#34495e",
  },
  backButton: {
    marginRight: 12,
  },
  backArrow: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "bold",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    fontStyle: "italic",
  },
});
