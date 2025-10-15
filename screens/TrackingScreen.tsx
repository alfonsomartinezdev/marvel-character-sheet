import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Character, DieType } from "../types/Character";

interface StressState {
  stress: DieType | null;
  trauma: DieType | null;
  max: DieType;
}

interface TrackingScreenProps {
  character: Character;
  stress: {
    physical: StressState;
    mental: StressState;
    emotional: StressState;
  };
  onUpdateStress: (
    type: "physical" | "mental" | "emotional",
    level: DieType | null,
  ) => void;
  onUpdateTrauma: (
    type: "physical" | "mental" | "emotional",
    level: DieType | null,
  ) => void;
}

export const TrackingScreen: React.FC<TrackingScreenProps> = ({
  character,
  stress,
  onUpdateStress,
  onUpdateTrauma,
}) => {
  const renderStressTrack = (
    label: string,
    type: "physical" | "mental" | "emotional",
    stressState: StressState,
  ) => {
    const levels: DieType[] = ["d6", "d8", "d10", "d12"];
    const maxIndex = levels.indexOf(stressState.max);
    const stressIndex = stressState.stress
      ? levels.indexOf(stressState.stress)
      : -1;
    const traumaIndex = stressState.trauma
      ? levels.indexOf(stressState.trauma)
      : -1;

    return (
      <View style={styles.stressTrack}>
        <Text style={styles.stressLabel}>{label}</Text>

        {/* Stress Levels */}
        <View style={styles.stressRow}>
          <Text style={styles.stressSubLabel}>Stress</Text>
          <View style={styles.stressBoxes}>
            {levels.slice(0, maxIndex + 1).map((level, index) => (
              <TouchableOpacity
                key={`stress-${index}`}
                style={[
                  styles.stressBox,
                  index === stressIndex && styles.stressBoxActive,
                ]}
                onPress={() => {
                  // Toggle: if clicking current level, clear it; otherwise set it
                  if (index === stressIndex) {
                    onUpdateStress(type, null);
                  } else {
                    onUpdateStress(type, level);
                  }
                }}
              >
                <Text
                  style={[
                    styles.stressText,
                    index === stressIndex && styles.stressTextActive,
                  ]}
                >
                  {level}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Trauma Levels */}
        <View style={styles.stressRow}>
          <Text style={styles.stressSubLabel}>Trauma</Text>
          <View style={styles.stressBoxes}>
            {levels.slice(0, maxIndex + 1).map((level, index) => (
              <TouchableOpacity
                key={`trauma-${index}`}
                style={[
                  styles.stressBox,
                  index === traumaIndex && styles.traumaBoxActive,
                ]}
                onPress={() => {
                  // Toggle: if clicking current level, clear it; otherwise set it
                  if (index === traumaIndex) {
                    onUpdateTrauma(type, null);
                  } else {
                    onUpdateTrauma(type, level);
                  }
                }}
              >
                <Text
                  style={[
                    styles.stressText,
                    index === traumaIndex && styles.traumaTextActive,
                  ]}
                >
                  {level}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Milestones */}
      {character.milestones.map((milestone, index) => (
        <View key={index} style={styles.section}>
          <Text style={styles.sectionTitle}>{milestone.name}</Text>
          {milestone.rewards.map((reward, rewardIndex) => (
            <View key={rewardIndex} style={styles.milestoneItem}>
              <Text style={styles.xpBadge}>{reward.xp}XP</Text>
              <Text style={styles.milestoneText}>{reward.description}</Text>
            </View>
          ))}
        </View>
      ))}

      {/* Stress & Trauma */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Stress & Trauma</Text>
        <Text style={styles.helperText}>
          Tap to mark/unmark stress and trauma
        </Text>
        {renderStressTrack("Physical", "physical", stress.physical)}
        {renderStressTrack("Mental", "mental", stress.mental)}
        {renderStressTrack("Emotional", "emotional", stress.emotional)}
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
  helperText: {
    fontSize: 12,
    color: "#7f8c8d",
    fontStyle: "italic",
    marginBottom: 12,
    textAlign: "center",
  },
  milestoneItem: {
    flexDirection: "row",
    marginBottom: 12,
    alignItems: "flex-start",
  },
  xpBadge: {
    backgroundColor: "#2c3e50",
    color: "#fff",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 12,
    minWidth: 45,
    textAlign: "center",
  },
  milestoneText: {
    flex: 1,
    fontSize: 14,
    color: "#1A1A1A",
    lineHeight: 20,
  },
  stressTrack: {
    marginBottom: 20,
  },
  stressLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 8,
  },
  stressRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  stressSubLabel: {
    fontSize: 12,
    color: "#7f8c8d",
    width: 60,
  },
  stressBoxes: {
    flexDirection: "row",
    flex: 1,
  },
  stressBox: {
    borderWidth: 3,
    borderColor: "#bdc3c7",
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 4,
  },
  stressBoxActive: {
    backgroundColor: "#2c3e50",
    borderColor: "#2c3e50",
  },
  traumaBoxActive: {
    backgroundColor: "#e74c3c",
    borderColor: "#e74c3c",
  },
  stressText: {
    fontSize: 14,
    color: "#1A1A1A",
  },
  stressTextActive: {
    color: "#fff",
  },
  traumaTextActive: {
    color: "#fff",
  },
});
