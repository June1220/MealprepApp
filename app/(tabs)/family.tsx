import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Pressable,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, radius, shadows } from '@/constants/theme';
import { Avatar } from '@/components/ui/Avatar';
import { useFamilyStore } from '@/stores/familyStore';
import { DIETARY_RESTRICTION_LABELS } from '@/constants/dietaryOptions';
import type { AgeGroup } from '@/types';

const AGE_GROUPS: AgeGroup[] = ['infant', 'toddler', 'child', 'teen', 'adult', 'senior'];
const AGE_GROUP_LABELS: Record<AgeGroup, string> = {
  infant: 'Infant',
  toddler: 'Toddler',
  child: 'Child',
  teen: 'Teen',
  adult: 'Adult',
  senior: 'Senior',
};

export default function FamilyScreen() {
  const family = useFamilyStore((s) => s.family);
  const updateFamilyName = useFamilyStore((s) => s.updateFamilyName);
  const addMember = useFamilyStore((s) => s.addMember);
  const removeMember = useFamilyStore((s) => s.removeMember);
  const setDefaultServings = useFamilyStore((s) => s.setDefaultServings);

  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(family.familyName ?? '');
  const [addingMember, setAddingMember] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberAge, setNewMemberAge] = useState<AgeGroup>('adult');

  const handleSaveName = () => {
    if (nameInput.trim()) updateFamilyName(nameInput.trim());
    setEditingName(false);
  };

  const handleAddMember = () => {
    if (!newMemberName.trim()) return;
    addMember({
      name: newMemberName.trim(),
      ageGroup: newMemberAge,
      dietaryRestrictions: [],
      dislikedIngredients: [],
      isAdmin: false,
    });
    setNewMemberName('');
    setAddingMember(false);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Family Name */}
        <View style={styles.section}>
          {editingName ? (
            <View style={styles.editRow}>
              <TextInput
                style={styles.nameInput}
                value={nameInput}
                onChangeText={setNameInput}
                autoFocus
                onBlur={handleSaveName}
                onSubmitEditing={handleSaveName}
              />
              <Pressable onPress={handleSaveName} hitSlop={8}>
                <Ionicons name="checkmark" size={22} color={colors.primary[400]} />
              </Pressable>
            </View>
          ) : (
            <Pressable style={styles.familyNameRow} onPress={() => { setEditingName(true); setNameInput(family.familyName ?? ''); }}>
              <Text style={styles.familyName}>{family.familyName || 'My Family'}</Text>
              <Ionicons name="pencil-outline" size={18} color={colors.stone[600]} />
            </Pressable>
          )}
          <Text style={styles.memberCount}>{family.members.length} member{family.members.length !== 1 ? 's' : ''}</Text>
        </View>

        {/* Members */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Family Members</Text>
          {family.members.map((member) => (
            <View key={member.id} style={styles.memberCard}>
              <Avatar name={member.name} color={member.avatarColor} size={44} />
              <View style={styles.memberInfo}>
                <Text style={styles.memberName}>{member.name}</Text>
                <Text style={styles.memberAge}>{AGE_GROUP_LABELS[member.ageGroup]}</Text>
                {member.dietaryRestrictions.length > 0 && (
                  <Text style={styles.restrictions} numberOfLines={1}>
                    {member.dietaryRestrictions.map((r) => DIETARY_RESTRICTION_LABELS[r]).join(' · ')}
                  </Text>
                )}
              </View>
              <Pressable
                onPress={() => removeMember(member.id)}
                hitSlop={8}
                style={styles.removeBtn}
              >
                <Ionicons name="close-circle-outline" size={20} color={colors.stone[300]} />
              </Pressable>
            </View>
          ))}

          {/* Add member */}
          {addingMember ? (
            <View style={styles.addMemberForm}>
              <TextInput
                style={styles.addMemberInput}
                placeholder="Name"
                placeholderTextColor={colors.stone[300]}
                value={newMemberName}
                onChangeText={setNewMemberName}
                autoFocus
              />
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.ageGroupRow}
              >
                {AGE_GROUPS.map((ag) => (
                  <Pressable
                    key={ag}
                    onPress={() => setNewMemberAge(ag)}
                    style={[styles.ageChip, newMemberAge === ag && styles.ageChipActive]}
                  >
                    <Text style={[styles.ageChipLabel, newMemberAge === ag && styles.ageChipLabelActive]}>
                      {AGE_GROUP_LABELS[ag]}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
              <View style={styles.addMemberActions}>
                <Pressable style={styles.cancelBtn} onPress={() => setAddingMember(false)}>
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </Pressable>
                <Pressable style={styles.addBtn} onPress={handleAddMember}>
                  <Text style={styles.addBtnText}>Add</Text>
                </Pressable>
              </View>
            </View>
          ) : (
            <Pressable style={styles.addMemberCard} onPress={() => setAddingMember(true)}>
              <Ionicons name="add" size={24} color={colors.primary[400]} />
              <Text style={styles.addMemberLabel}>Add Family Member</Text>
            </Pressable>
          )}
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Household Settings</Text>
          <View style={styles.settingsCard}>
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Default servings</Text>
              <View style={styles.stepper}>
                <Pressable
                  hitSlop={8}
                  onPress={() => setDefaultServings(Math.max(1, family.defaultServings - 1))}
                >
                  <Ionicons name="remove" size={20} color={colors.primary[400]} />
                </Pressable>
                <Text style={styles.stepperValue}>{family.defaultServings}</Text>
                <Pressable
                  hitSlop={8}
                  onPress={() => setDefaultServings(family.defaultServings + 1)}
                >
                  <Ionicons name="add" size={20} color={colors.primary[400]} />
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.stone[50] },
  content: { padding: spacing[4], paddingBottom: spacing[16] },
  section: { marginBottom: spacing[6] },
  familyNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    marginBottom: spacing[1],
  },
  familyName: {
    ...typography.display,
    color: colors.stone[900],
    fontSize: 26,
  },
  memberCount: {
    ...typography.bodySm,
    color: colors.stone[600],
  },
  editRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    marginBottom: spacing[1],
  },
  nameInput: {
    flex: 1,
    ...typography.title,
    color: colors.stone[900],
    borderBottomWidth: 2,
    borderBottomColor: colors.primary[400],
    paddingVertical: 4,
  },
  sectionTitle: {
    ...typography.heading,
    color: colors.stone[900],
    marginBottom: spacing[3],
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: spacing[3],
    marginBottom: spacing[2],
    gap: spacing[3],
    ...shadows.sm,
  },
  memberInfo: { flex: 1 },
  memberName: {
    ...typography.bodySm,
    fontFamily: 'Inter_600SemiBold',
    color: colors.stone[900],
  },
  memberAge: {
    ...typography.caption,
    color: colors.stone[600],
  },
  restrictions: {
    ...typography.caption,
    color: colors.accent[400],
    marginTop: 2,
  },
  removeBtn: { padding: spacing[1] },
  addMemberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.stone[300],
    borderRadius: radius.md,
    paddingVertical: spacing[4],
    gap: spacing[2],
  },
  addMemberLabel: {
    ...typography.body,
    color: colors.primary[400],
    fontFamily: 'Inter_500Medium',
  },
  addMemberForm: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: spacing[4],
    ...shadows.sm,
  },
  addMemberInput: {
    borderBottomWidth: 1,
    borderBottomColor: colors.stone[100],
    paddingVertical: spacing[2],
    ...typography.body,
    color: colors.stone[900],
    marginBottom: spacing[3],
    minHeight: 44,
  },
  ageGroupRow: { gap: spacing[2], marginBottom: spacing[4] },
  ageChip: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: radius.sm,
    backgroundColor: colors.stone[100],
    minHeight: 36,
    justifyContent: 'center',
  },
  ageChipActive: { backgroundColor: colors.primary[400] },
  ageChipLabel: { ...typography.chip, color: colors.stone[600] },
  ageChipLabelActive: { color: colors.white },
  addMemberActions: { flexDirection: 'row', gap: spacing[2], justifyContent: 'flex-end' },
  cancelBtn: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    minHeight: 44,
    justifyContent: 'center',
  },
  cancelBtnText: { ...typography.label, color: colors.stone[600] },
  addBtn: {
    backgroundColor: colors.primary[400],
    borderRadius: radius.full,
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[2],
    minHeight: 44,
    justifyContent: 'center',
  },
  addBtnText: { ...typography.label, color: colors.white },
  settingsCard: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    ...shadows.sm,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing[4],
    minHeight: 56,
  },
  settingLabel: { ...typography.body, color: colors.stone[900] },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[4],
  },
  stepperValue: {
    ...typography.heading,
    color: colors.stone[900],
    minWidth: 28,
    textAlign: 'center',
  },
});
