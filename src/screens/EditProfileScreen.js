import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Check } from 'lucide-react-native';
import { useApp } from '../store/AppContext';
import { Card, Caption, SectionTitle, PrimaryButton, Input } from '../components/UI';
import { Entrance } from '../components/Entrance';

const GOALS = [
  { id: 'lose', label: 'Похудение' },
  { id: 'maintain', label: 'Поддержание веса' },
  { id: 'gain', label: 'Набор массы' },
];

const ACTIVITY_LEVELS = [
  { id: 'low', label: 'Низкая' },
  { id: 'medium', label: 'Умеренная' },
  { id: 'high', label: 'Высокая' },
];

export default function EditProfileScreen({ navigation }) {
  const { theme, state, update, logWeight } = useApp();
  const user = state.user;
  const [name, setName] = useState(user.name || '');
  const [age, setAge] = useState(String(user.age || ''));
  const [height, setHeight] = useState(String(user.height || ''));
  const [weight, setWeight] = useState(String(user.weight || ''));
  const [goalWeight, setGoalWeight] = useState(String(user.goalWeight || ''));
  const [goal, setGoal] = useState(user.goal || 'lose');
  const [activityLevel, setActivityLevel] = useState(user.activityLevel || 'medium');

  const handleSave = () => {
    const newWeight = parseFloat(weight.replace(',', '.')) || user.weight;
    update((prev) => ({
      user: {
        ...prev.user,
        name: name.trim() || prev.user.name,
        age: parseInt(age, 10) || prev.user.age,
        height: parseInt(height, 10) || prev.user.height,
        goalWeight: parseFloat(goalWeight.replace(',', '.')) || prev.user.goalWeight,
        goal,
        activityLevel,
      },
    }));
    if (newWeight && newWeight !== user.weight) logWeight(newWeight);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={['top']}>
      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[styles.backBtn, { backgroundColor: theme.card }]}
          accessibilityLabel="Назад"
        >
          <ArrowLeft size={20} color={theme.text.primary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text.primary }]}>Редактирование</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Entrance index={0}>
            <Card style={styles.formCard}>
              <Caption>Имя</Caption>
              <Input value={name} onChangeText={setName} placeholder="Ваше имя" />
              <Caption style={{ marginTop: 12 }}>Возраст</Caption>
              <Input value={age} onChangeText={setAge} keyboardType="numeric" placeholder="25" />
              <Caption style={{ marginTop: 12 }}>Рост (см)</Caption>
              <Input value={height} onChangeText={setHeight} keyboardType="numeric" placeholder="175" />
              <Caption style={{ marginTop: 12 }}>Текущий вес (кг)</Caption>
              <Input value={weight} onChangeText={setWeight} keyboardType="numeric" placeholder="70" />
              <Caption style={{ marginTop: 12 }}>Целевой вес (кг)</Caption>
              <Input value={goalWeight} onChangeText={setGoalWeight} keyboardType="numeric" placeholder="65" />
            </Card>
          </Entrance>

          <Entrance index={1}>
            <SectionTitle>Цель</SectionTitle>
            <View style={styles.optionsRow}>
              {GOALS.map((g) => {
                const active = goal === g.id;
                return (
                  <TouchableOpacity
                    key={g.id}
                    onPress={() => setGoal(g.id)}
                    style={[
                      styles.option,
                      { backgroundColor: active ? theme.accentSoft : theme.card, borderColor: active ? theme.accent : theme.divider },
                    ]}
                  >
                    {active ? <Check size={14} color={theme.accent} /> : null}
                    <Text style={[styles.optionText, { color: active ? theme.accent : theme.text.secondary }]}>{g.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Entrance>

          <Entrance index={2}>
            <SectionTitle>Уровень активности</SectionTitle>
            <View style={styles.optionsRow}>
              {ACTIVITY_LEVELS.map((a) => {
                const active = activityLevel === a.id;
                return (
                  <TouchableOpacity
                    key={a.id}
                    onPress={() => setActivityLevel(a.id)}
                    style={[
                      styles.option,
                      { backgroundColor: active ? theme.accentSoft : theme.card, borderColor: active ? theme.accent : theme.divider },
                    ]}
                  >
                    {active ? <Check size={14} color={theme.accent} /> : null}
                    <Text style={[styles.optionText, { color: active ? theme.accent : theme.text.secondary }]}>{a.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Entrance>

          <Entrance index={3}>
            <PrimaryButton title="Сохранить" onPress={handleSave} style={{ marginTop: 8 }} />
          </Entrance>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontSize: 17, fontWeight: '600' },
  content: { padding: 20, paddingBottom: 40, gap: 16 },
  formCard: { gap: 4 },
  optionsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
  },
  optionText: { fontSize: 14, fontWeight: '500' },
});
