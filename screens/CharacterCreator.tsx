import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import {
  Character,
  DieType,
  PowerSet,
  Specialty,
  Milestone,
} from "../types/Character";

interface CharacterCreatorProps {
  onSave: (character: Character) => void;
  onCancel: () => void;
  existingCharacter?: Character;
}

export const CharacterCreator: React.FC<CharacterCreatorProps> = ({
  onSave,
  onCancel,
  existingCharacter,
}) => {
  const [name, setName] = useState(existingCharacter?.name || "");

  // Affiliations
  const [soloAffiliation, setSoloAffiliation] = useState<DieType>(
    existingCharacter?.affiliations.solo || "d8"
  );
  const [buddyAffiliation, setBuddyAffiliation] = useState<DieType>(
    existingCharacter?.affiliations.buddy || "d8"
  );
  const [teamAffiliation, setTeamAffiliation] = useState<DieType>(
    existingCharacter?.affiliations.team || "d8"
  );

  // Distinctions
  const [distinction1, setDistinction1] = useState(
    existingCharacter?.distinctions[0]?.name || ""
  );
  const [distinction2, setDistinction2] = useState(
    existingCharacter?.distinctions[1]?.name || ""
  );
  const [distinction3, setDistinction3] = useState(
    existingCharacter?.distinctions[2]?.name || ""
  );

  // Power Sets
  const [powerSets, setPowerSets] = useState<PowerSet[]>(
    existingCharacter?.powerSets || []
  );

  // Specialties
  const [specialties, setSpecialties] = useState<Specialty[]>(
    existingCharacter?.specialties || []
  );

  // Milestones
  const [milestones, setMilestones] = useState<Milestone[]>(
    existingCharacter?.milestones || []
  );

  const defaultDiceOptions: DieType[] = ["d4", "d6", "d8", "d10", "d12"];
  const affiliationDiceOptions: DieType[] = ["d8", "d10", "d12"];

  const handleSave = () => {
  // Validate character name
  if (!name.trim()) {
    Alert.alert("Error", "Please enter a character name");
    return;
  }

  // Validate power sets
  const validatedPowerSets = powerSets.filter(ps => {
    if (!ps.name.trim()) {
      Alert.alert("Error", "All power sets must have a name");
      return false;
    }
    
    // Check that all powers have names and at least one die
    for (const power of ps.powers) {
      if (!power.name.trim()) {
        Alert.alert("Error", `Power set "${ps.name}" has a power without a name`);
        return false;
      }
      if (!power.dice || power.dice.length === 0) {
        Alert.alert("Error", `Power "${power.name}" must have at least one die`);
        return false;
      }
    }
    
    // Check that all SFX have names
    for (const sfx of ps.sfx) {
      if (!sfx.name.trim()) {
        Alert.alert("Error", `Power set "${ps.name}" has an SFX without a name`);
        return false;
      }
    }
    
    // Check that all limits have names
    for (const limit of ps.limits) {
      if (!limit.name.trim()) {
        Alert.alert("Error", `Power set "${ps.name}" has a limit without a name`);
        return false;
      }
    }
    
    return true;
  });

  // Validate specialties
  const validatedSpecialties = specialties.filter(spec => {
    if (!spec.name.trim()) {
      Alert.alert("Error", "All specialties must have a name");
      return false;
    }
    return true;
  });

  // Validate milestones
  const validatedMilestones = milestones.filter(milestone => {
    if (!milestone.name.trim()) {
      Alert.alert("Error", "All milestones must have a name");
      return false;
    }
    
    // Check that all rewards have descriptions
    for (const reward of milestone.rewards) {
      if (!reward.description.trim()) {
        Alert.alert("Error", `Milestone "${milestone.name}" has a reward without a description`);
        return false;
      }
    }
    
    return true;
  });

  const character: Character = {
    name: name.trim(),
    pp: existingCharacter?.pp || 1,
    xp: existingCharacter?.xp || 0,
    affiliations: {
      solo: soloAffiliation,
      buddy: buddyAffiliation,
      team: teamAffiliation,
    },
    distinctions: [
      { name: distinction1 || "Distinction 1", dice: "d8" },
      { name: distinction2 || "Distinction 2", dice: "d8" },
      { name: distinction3 || "Distinction 3", dice: "d8" },
    ],
    powerSets: validatedPowerSets,
    specialties: validatedSpecialties,
    milestones: validatedMilestones,
    stress: existingCharacter?.stress || {
      physical: { current: null, max: "d12" },
      mental: { current: null, max: "d12" },
      emotional: { current: null, max: "d12" },
    },
  };

  onSave(character);
};

  // Power Set functions
  const addPowerSet = () => {
    setPowerSets([...powerSets, { name: "", powers: [], sfx: [], limits: [] }]);
  };

  const updatePowerSetName = (index: number, name: string) => {
    const updated = [...powerSets];
    updated[index].name = name;
    setPowerSets(updated);
  };

  const removePowerSet = (index: number) => {
    setPowerSets(powerSets.filter((_, i) => i !== index));
  };

  const addPowerToPowerSet = (powerSetIndex: number) => {
    const updated = [...powerSets];
    updated[powerSetIndex].powers.push({ name: "", dice: ["d6"] });
    setPowerSets(updated);
  };

  const updatePower = (
    powerSetIndex: number,
    powerIndex: number,
    field: "name",
    value: string
  ) => {
    const updated = [...powerSets];
    updated[powerSetIndex].powers[powerIndex].name = value;
    setPowerSets(updated);
  };

  const addDieToPower = (
    powerSetIndex: number,
    powerIndex: number,
    die: DieType
  ) => {
    const updated = [...powerSets];
    updated[powerSetIndex].powers[powerIndex].dice.push(die);
    setPowerSets(updated);
  };

  const removeDieFromPower = (
    powerSetIndex: number,
    powerIndex: number,
    dieIndex: number
  ) => {
    const updated = [...powerSets];
    updated[powerSetIndex].powers[powerIndex].dice = updated[
      powerSetIndex
    ].powers[powerIndex].dice.filter((_, i) => i !== dieIndex);
    setPowerSets(updated);
  };

  const removePower = (powerSetIndex: number, powerIndex: number) => {
    const updated = [...powerSets];
    updated[powerSetIndex].powers = updated[powerSetIndex].powers.filter(
      (_, i) => i !== powerIndex
    );
    setPowerSets(updated);
  };

  const addSFXToPowerSet = (powerSetIndex: number) => {
    const updated = [...powerSets];
    updated[powerSetIndex].sfx.push({ name: "", description: "" });
    setPowerSets(updated);
  };

  const updateSFX = (
    powerSetIndex: number,
    sfxIndex: number,
    field: "name" | "description",
    value: string
  ) => {
    const updated = [...powerSets];
    updated[powerSetIndex].sfx[sfxIndex][field] = value;
    setPowerSets(updated);
  };

  const removeSFX = (powerSetIndex: number, sfxIndex: number) => {
    const updated = [...powerSets];
    updated[powerSetIndex].sfx = updated[powerSetIndex].sfx.filter(
      (_, i) => i !== sfxIndex
    );
    setPowerSets(updated);
  };

  // Specialty functions
  const addSpecialty = () => {
    setSpecialties([...specialties, { name: "", dice: "d6" }]);
  };

  const addLimitToPowerSet = (powerSetIndex: number) => {
    const updated = [...powerSets];
    updated[powerSetIndex].limits.push({ name: "", description: "" });
    setPowerSets(updated);
  };

  const updateLimit = (
    powerSetIndex: number,
    limitIndex: number,
    field: "name" | "description",
    value: string
  ) => {
    const updated = [...powerSets];
    updated[powerSetIndex].limits[limitIndex][field] = value;
    setPowerSets(updated);
  };

  const removeLimit = (powerSetIndex: number, limitIndex: number) => {
    const updated = [...powerSets];
    updated[powerSetIndex].limits = updated[powerSetIndex].limits.filter(
      (_, i) => i !== limitIndex
    );
    setPowerSets(updated);
  };

  const updateSpecialty = (
    index: number,
    field: "name" | "dice",
    value: string
  ) => {
    const updated = [...specialties];
    if (field === "name") {
      updated[index].name = value;
    } else {
      updated[index].dice = value as DieType;
    }
    setSpecialties(updated);
  };

  const removeSpecialty = (index: number) => {
    setSpecialties(specialties.filter((_, i) => i !== index));
  };

  // Milestone functions
  const addMilestone = () => {
    setMilestones([...milestones, { name: "", rewards: [] }]);
  };

  const updateMilestoneName = (index: number, name: string) => {
    const updated = [...milestones];
    updated[index].name = name;
    setMilestones(updated);
  };

  const removeMilestone = (index: number) => {
    setMilestones(milestones.filter((_, i) => i !== index));
  };

  const addRewardToMilestone = (milestoneIndex: number) => {
    const updated = [...milestones];
    updated[milestoneIndex].rewards.push({ xp: 1, description: "" });
    setMilestones(updated);
  };

  const updateReward = (
    milestoneIndex: number,
    rewardIndex: number,
    field: "xp" | "description",
    value: string | number
  ) => {
    const updated = [...milestones];
    if (field === "xp") {
      updated[milestoneIndex].rewards[rewardIndex].xp = value as number;
    } else {
      updated[milestoneIndex].rewards[rewardIndex].description =
        value as string;
    }
    setMilestones(updated);
  };

  const removeReward = (milestoneIndex: number, rewardIndex: number) => {
    const updated = [...milestones];
    updated[milestoneIndex].rewards = updated[milestoneIndex].rewards.filter(
      (_, i) => i !== rewardIndex
    );
    setMilestones(updated);
  };

  const DicePicker = ({
    label,
    value,
    onChange,
    diceOptions = defaultDiceOptions,
  }: {
    label: string;
    value: DieType;
    onChange: (die: DieType) => void;
    diceOptions?: DieType[];
  }) => (
    <View style={styles.pickerRow}>
      <Text style={styles.pickerLabel}>{label}</Text>
      <View style={styles.diceButtons}>
        {diceOptions.map((die) => (
          <TouchableOpacity
            key={die}
            style={[
              styles.diceButton,
              value === die && styles.diceButtonSelected,
            ]}
            onPress={() => onChange(die)}
          >
            <Text
              style={[
                styles.diceButtonText,
                value === die && styles.diceButtonTextSelected,
              ]}
            >
              {die}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.title}>
          {existingCharacter ? "Edit Character" : "Create Character"}
        </Text>
        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.form}>
        {/* Basic Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Info</Text>

          <Text style={styles.label}>Character Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter character name"
            placeholderTextColor="#95a5a6"
          />
        </View>

        {/* Affiliations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Affiliations</Text>
          <DicePicker
            label="Solo"
            value={soloAffiliation}
            onChange={setSoloAffiliation}
            diceOptions={affiliationDiceOptions}
          />
          <DicePicker
            label="Buddy"
            value={buddyAffiliation}
            onChange={setBuddyAffiliation}
            diceOptions={affiliationDiceOptions}
          />
          <DicePicker
            label="Team"
            value={teamAffiliation}
            onChange={setTeamAffiliation}
            diceOptions={affiliationDiceOptions}
          />
        </View>

        {/* Distinctions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Distinctions</Text>

          <Text style={styles.label}>Distinction 1</Text>
          <TextInput
            style={styles.input}
            value={distinction1}
            onChangeText={setDistinction1}
            placeholder="Enter first distinction"
            placeholderTextColor="#95a5a6"
          />

          <Text style={styles.label}>Distinction 2</Text>
          <TextInput
            style={styles.input}
            value={distinction2}
            onChangeText={setDistinction2}
            placeholder="Enter second distinction"
            placeholderTextColor="#95a5a6"
          />

          <Text style={styles.label}>Distinction 3</Text>
          <TextInput
            style={styles.input}
            value={distinction3}
            onChangeText={setDistinction3}
            placeholder="Enter third distinction"
            placeholderTextColor="#95a5a6"
          />
        </View>

        {/* Power Sets */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Power Sets</Text>

          {powerSets.map((powerSet, psIndex) => (
            <View key={psIndex} style={styles.powerSetContainer}>
              <View style={styles.itemHeader}>
                <TextInput
                  style={[styles.input, styles.flex1]}
                  value={powerSet.name}
                  onChangeText={(text) => updatePowerSetName(psIndex, text)}
                  placeholder="Power Set Name"
                  placeholderTextColor="#95a5a6"
                />
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removePowerSet(psIndex)}
                >
                  <Text style={styles.removeButtonText}>×</Text>
                </TouchableOpacity>
              </View>

              {/* Powers */}
              <Text style={styles.subLabel}>Powers</Text>
              {powerSet.powers.map((power, pIndex) => (
                <View key={pIndex} style={styles.powerContainer}>
                  <View style={styles.itemRow}>
                    <TextInput
                      style={[styles.input, styles.flex1]}
                      value={power.name}
                      onChangeText={(text) =>
                        updatePower(psIndex, pIndex, "name", text)
                      }
                      placeholder="Power name"
                      placeholderTextColor="#95a5a6"
                    />
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => removePower(psIndex, pIndex)}
                    >
                      <Text style={styles.removeButtonText}>×</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Show all dice for this power */}
                  <View style={styles.powerDiceContainer}>
                    {power.dice.map((die, dIndex) => (
                      <View key={dIndex} style={styles.powerDieChip}>
                        <Text style={styles.powerDieText}>{die}</Text>
                        <TouchableOpacity
                          onPress={() =>
                            removeDieFromPower(psIndex, pIndex, dIndex)
                          }
                        >
                          <Text style={styles.powerDieRemove}>×</Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>

                  {/* Add die buttons */}
                  <View style={styles.addDiceRow}>
                    <Text style={styles.addDiceLabel}>Add Die:</Text>
                    {defaultDiceOptions.map((die) => (
                      <TouchableOpacity
                        key={die}
                        style={styles.addDiceButton}
                        onPress={() => addDieToPower(psIndex, pIndex, die)}
                      >
                        <Text style={styles.addDiceButtonText}>{die}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ))}
              <TouchableOpacity
                style={styles.addItemButton}
                onPress={() => addPowerToPowerSet(psIndex)}
              >
                <Text style={styles.addItemButtonText}>+ Add Power</Text>
              </TouchableOpacity>

              {/* SFX */}
              <Text style={styles.subLabel}>SFX</Text>
              {powerSet.sfx.map((sfx, sIndex) => (
                <View key={sIndex} style={styles.sfxContainer}>
                  <View style={styles.itemRow}>
                    <TextInput
                      style={[styles.input, styles.flex1]}
                      value={sfx.name}
                      onChangeText={(text) =>
                        updateSFX(psIndex, sIndex, "name", text)
                      }
                      placeholder="SFX name"
                      placeholderTextColor="#95a5a6"
                    />
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => removeSFX(psIndex, sIndex)}
                    >
                      <Text style={styles.removeButtonText}>×</Text>
                    </TouchableOpacity>
                  </View>
                  <TextInput
                    style={[styles.input, styles.multiline]}
                    value={sfx.description}
                    onChangeText={(text) =>
                      updateSFX(psIndex, sIndex, "description", text)
                    }
                    placeholder="SFX description"
                    placeholderTextColor="#95a5a6"
                    multiline
                  />
                </View>
              ))}

              {/* Limits */}
              <Text style={styles.subLabel}>Limits</Text>
              {powerSet.limits.map((limit, lIndex) => (
                <View key={lIndex} style={styles.sfxContainer}>
                  <View style={styles.itemRow}>
                    <TextInput
                      style={[styles.input, styles.flex1]}
                      value={limit.name}
                      onChangeText={(text) =>
                        updateLimit(psIndex, lIndex, "name", text)
                      }
                      placeholder="Limit name"
                      placeholderTextColor="#95a5a6"
                    />
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => removeLimit(psIndex, lIndex)}
                    >
                      <Text style={styles.removeButtonText}>×</Text>
                    </TouchableOpacity>
                  </View>
                  <TextInput
                    style={[styles.input, styles.multiline]}
                    value={limit.description}
                    onChangeText={(text) =>
                      updateLimit(psIndex, lIndex, "description", text)
                    }
                    placeholder="Limit description (e.g., 'Earn 1 PP when...')"
                    placeholderTextColor="#95a5a6"
                    multiline
                  />
                </View>
              ))}
              <TouchableOpacity
                style={styles.addItemButton}
                onPress={() => addLimitToPowerSet(psIndex)}
              >
                <Text style={styles.addItemButtonText}>+ Add Limit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.addItemButton}
                onPress={() => addSFXToPowerSet(psIndex)}
              >
                <Text style={styles.addItemButtonText}>+ Add SFX</Text>
              </TouchableOpacity>
            </View>
          ))}

          <TouchableOpacity style={styles.addButton} onPress={addPowerSet}>
            <Text style={styles.addButtonText}>+ Add Power Set</Text>
          </TouchableOpacity>
        </View>

        {/* Specialties */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Specialties</Text>

          {specialties.map((specialty, index) => (
            <View key={index} style={styles.itemRow}>
              <TextInput
                style={[styles.input, styles.flex1]}
                value={specialty.name}
                onChangeText={(text) => updateSpecialty(index, "name", text)}
                placeholder="Specialty name"
                placeholderTextColor="#95a5a6"
              />
              <View style={styles.miniDiceButtons}>
                {defaultDiceOptions.map((die) => (
                  <TouchableOpacity
                    key={die}
                    style={[
                      styles.miniDiceButton,
                      specialty.dice === die && styles.diceButtonSelected,
                    ]}
                    onPress={() => updateSpecialty(index, "dice", die)}
                  >
                    <Text
                      style={[
                        styles.miniDiceButtonText,
                        specialty.dice === die && styles.diceButtonTextSelected,
                      ]}
                    >
                      {die}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeSpecialty(index)}
              >
                <Text style={styles.removeButtonText}>×</Text>
              </TouchableOpacity>
            </View>
          ))}

          <TouchableOpacity style={styles.addButton} onPress={addSpecialty}>
            <Text style={styles.addButtonText}>+ Add Specialty</Text>
          </TouchableOpacity>
        </View>

        {/* Milestones */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Milestones</Text>

          {milestones.map((milestone, mIndex) => (
            <View key={mIndex} style={styles.milestoneContainer}>
              <View style={styles.itemHeader}>
                <TextInput
                  style={[styles.input, styles.flex1]}
                  value={milestone.name}
                  onChangeText={(text) => updateMilestoneName(mIndex, text)}
                  placeholder="Milestone Name"
                  placeholderTextColor="#95a5a6"
                />
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeMilestone(mIndex)}
                >
                  <Text style={styles.removeButtonText}>×</Text>
                </TouchableOpacity>
              </View>

              {milestone.rewards.map((reward, rIndex) => (
                <View key={rIndex} style={styles.rewardContainer}>
                  <View style={styles.rewardRow}>
                    <TextInput
                      style={styles.xpInput}
                      value={reward.xp.toString()}
                      onChangeText={(text) =>
                        updateReward(mIndex, rIndex, "xp", parseInt(text) || 1)
                      }
                      keyboardType="numeric"
                      placeholder="XP"
                      placeholderTextColor="#95a5a6"
                    />
                    <Text style={styles.xpLabel}>XP</Text>
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => removeReward(mIndex, rIndex)}
                    >
                      <Text style={styles.removeButtonText}>×</Text>
                    </TouchableOpacity>
                  </View>
                  <TextInput
                    style={[styles.input, styles.multiline]}
                    value={reward.description}
                    onChangeText={(text) =>
                      updateReward(mIndex, rIndex, "description", text)
                    }
                    placeholder="When you..."
                    placeholderTextColor="#95a5a6"
                    multiline
                  />
                </View>
              ))}
              <TouchableOpacity
                style={styles.addItemButton}
                onPress={() => addRewardToMilestone(mIndex)}
              >
                <Text style={styles.addItemButtonText}>+ Add Reward</Text>
              </TouchableOpacity>
            </View>
          ))}

          <TouchableOpacity style={styles.addButton} onPress={addMilestone}>
            <Text style={styles.addButtonText}>+ Add Milestone</Text>
          </TouchableOpacity>
        </View>
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  cancelButton: {
    padding: 8,
  },
  cancelText: {
    color: "#e74c3c",
    fontSize: 16,
    fontWeight: "600",
  },
  saveButton: {
    padding: 8,
  },
  saveText: {
    color: "#27ae60",
    fontSize: 16,
    fontWeight: "600",
  },
  form: {
    flex: 1,
  },
  section: {
    backgroundColor: "#fff",
    padding: 16,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 8,
    marginTop: 12,
  },
  subLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#7f8c8d",
    marginTop: 16,
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#bdc3c7",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#2c3e50",
  },
  multiline: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  flex1: {
    flex: 1,
  },
  pickerRow: {
    marginBottom: 16,
  },
  pickerLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 8,
  },
  diceButtons: {
    flexDirection: "row",
    gap: 8,
  },
  diceButton: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    borderWidth: 2,
    borderColor: "#bdc3c7",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  diceButtonSelected: {
    backgroundColor: "#3498db",
    borderColor: "#3498db",
  },
  diceButtonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  diceButtonTextSelected: {
    color: "#fff",
  },
  addButton: {
    backgroundColor: "#27ae60",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 16,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  powerSetContainer: {
    backgroundColor: "#f8f9fa",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  milestoneContainer: {
    backgroundColor: "#f8f9fa",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  itemHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  miniDiceButtons: {
    flexDirection: "row",
    gap: 4,
  },
  miniDiceButton: {
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#bdc3c7",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  miniDiceButtonText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  removeButton: {
    backgroundColor: "#e74c3c",
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  removeButtonText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    lineHeight: 24,
  },
  addItemButton: {
    backgroundColor: "#3498db",
    borderRadius: 6,
    padding: 10,
    alignItems: "center",
    marginTop: 8,
  },
  addItemButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
  sfxContainer: {
    marginBottom: 12,
  },
  rewardContainer: {
    marginBottom: 12,
  },
  rewardRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  xpInput: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#bdc3c7",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#2c3e50",
    width: 60,
    textAlign: "center",
  },
  xpLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2c3e50",
    flex: 1,
  },
  powerContainer: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  powerDiceContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
    marginBottom: 8,
  },
  powerDieChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3498db",
    borderRadius: 16,
    paddingLeft: 12,
    paddingRight: 8,
    paddingVertical: 6,
    gap: 6,
  },
  powerDieText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  powerDieRemove: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  addDiceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  addDiceLabel: {
    fontSize: 12,
    color: "#7f8c8d",
    fontWeight: "600",
  },
  addDiceButton: {
    backgroundColor: "#ecf0f1",
    borderWidth: 1,
    borderColor: "#bdc3c7",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  addDiceButtonText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#2c3e50",
  },
});
