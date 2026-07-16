import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { ArrowLeft, Footprints, Bike, Dumbbell, WavesLadder, Flame, Timer } from 'lucide-react-native';
import { useApp } from '../store/AppContext';
import { Card, Caption, SectionTitle, PrimaryButton, Input } from '../components/UI';
import { Entrance } from '../components/Entrance';

const ACTIVITY_TYPES = [
  { id: 'walk', name: 'Ходьба', kcalPerMin: 4.5, icon: Footprints },
  { id: 'run', name: 'Бег', kcalPerMin: 10, icon: Flame },
  { id: 'bike', name: 'Велосипед', kcalPerMin: 8, icon: Bike },
  { id: 'gym', name: 'Силовая', kcalPerMin: 7, icon: Dumbbell },
  { id: 'swim', name: 'Плавание', kcalPerMin: 9, icon: WavesLadder },
];

const STEPS_GOAL = 10000;

export default function ActivityScreen({ navigation }) {
  const { theme, getDay, addActivity, addSteps, unlockAchievement } = useApp();
  const day = getDay();

  const [selected, setSelected] = useState(ACTIVITY_TYPES[0]);
  const [minutes, setMinutes] = useState('30');
  const [stepsInput, setStepsInput] = useState('');

  const handleAddSteps = () => {
    const n = parseInt(stepsInput, 10) || 0;
    if (n <= 0) return;
    addSteps(n);
    if ((day.steps || 0) + n >= STEPS_GOAL) unlockAchievement('steps_goal');
    setStepsInput('');
  };

  const mins = parseInt(minutes, 10) || 0;
  const kcal = Math.round(mins * selected.kcalPerMin);

  const totalBurned = day.activities.reduce((s, a) => s + (a.calories || 0), 0);
  const totalMinutes = day.activities.reduce((s, a) => s + (a.minutes || 0), 0);

  const handleAdd = () => {
    if (mins <= 0) return;
    addActivity({ type: selected.id, name: selected.name, minutes: mins, calories: kcal });
    unlockAchievement('activity_first');
    setMinutes('30');
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={12}>
          <ArrowLeft size={24} color={theme.text.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text.primary }]}>Активность</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {/* Сводка за день */}
        <Entrance index={0}>
        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <Flame size={20} color={theme.orange} />
            <Text style={[styles.statValue, { color: theme.text.primary }]}>{totalBurned}</Text>
            <Caption>ккал сожжено</Caption>
          </Card>
          <Card style={styles.statCard}>
            <Timer size={20} color={theme.blue} />
            <Text style={[styles.statValue, { color: theme.text.primary }]}>{totalMinutes}</Text>
            <Caption>минут</Caption>
          </Card>
        </View>
        </Entrance>

        {/* Шаги */}
        <Entrance index={1} style={{ gap: 16 }}>
        <SectionTitle>Шаги</SectionTitle>
        <Card style={styles.formCard}>
          <View style={styles.kcalPreview}>
            <View style={styles.stepsHead}>
              <Footprints size={18} color={theme.accent} />
              <Text style={[styles.stepsValue, { color: theme.text.primary }]}>
                {(day.steps || 0).toLocaleString('ru-RU')}
              </Text>
            </View>
            <Caption>цель {STEPS_GOAL.toLocaleString('ru-RU')}</Caption>
          </View>
          <View style={styles.stepsRow}>
            <Input
              placeholder="Например, 2500"
              value={stepsInput}
              onChangeText={setStepsInput}
              keyboardType="numeric"
              style={{ flex: 1 }}
            />
            <PrimaryButton title="Записать" onPress={handleAddSteps} disabled={!parseInt(stepsInput, 10)} style={styles.stepsBtn} />
          </View>
        </Card>
        </Entrance>

        {/* Добавление тренировки */}
        <Entrance index={2} style={{ gap: 16 }}>
        <SectionTitle>Добавить тренировку</SectionTitle>
        <View style={styles.typesRow}>
          {ACTIVITY_TYPES.map((t) => {
            const Icon = t.icon;
            const active = selected.id === t.id;
            return (
              <TouchableOpacity
                key={t.id}
                onPress={() => setSelected(t)}
                style={[
                  styles.typeChip,
                  { backgroundColor: active ? theme.accentSoft : theme.card, borderColor: active ? theme.accent : theme.divider },
                ]}
              >
                <Icon size={18} color={active ? theme.accent : theme.text.secondary} />
                <Text style={[styles.typeText, { color: active ? theme.accent : theme.text.secondary }]}>{t.name}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
        </Entrance>

        <Entrance index={3}>
        <Card style={styles.formCard}>
          <Input
            label="Длительность, минут"
            value={minutes}
            onChangeText={setMinutes}
            keyboardType="numeric"
            placeholder="30"
          />
          <View style={styles.kcalPreview}>
            <Caption>Будет сожжено примерно</Caption>
            <Text style={[styles.kcalValue, { color: theme.orange }]}>{kcal} ккал</Text>
          </View>
          <PrimaryButton title="Добавить" onPress={handleAdd} disabled={mins <= 0} />
        </Card>
        </Entrance>

        {/* История за день */}
        {day.activities.length > 0 ? (
          <Entrance index={4} style={{ gap: 16 }}>
            <SectionTitle>Сегодня</SectionTitle>
            {day.activities.map((a) => {
              const meta = ACTIVITY_TYPES.find((t) => t.id === a.type) || ACTIVITY_TYPES[0];
              const Icon = meta.icon;
              return (
                <Card key={a.id} style={styles.activityRow}>
                  <View style={[styles.activityIcon, { backgroundColor: theme.orangeSoft }]}>
                    <Icon size={20} color={theme.orange} />
                  </View>
                  <View style={styles.activityInfo}>
                    <Text style={[styles.activityName, { color: theme.text.primary }]}>{a.name}</Text>
                    <Caption>{a.minutes} мин</Caption>
                  </View>
                  <Text style={[styles.activityKcal, { color: theme.text.primary }]}>-{a.calories} ккал</Text>
                </Card>
              );
            })}
          </Entrance>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  headerTitle: { fontSize: 17, fontWeight: '700' },
  content: { padding: 20, paddingTop: 8, paddingBottom: 40, gap: 16 },
  statsRow: { flexDirection: 'row', gap: 12 },
  statCard: { flex: 1, alignItems: 'center', gap: 4, paddingVertical: 18 },
  statValue: { fontSize: 24, fontWeight: '800' },
  typesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  typeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
  },
  typeText: { fontSize: 13, fontWeight: '600' },
  formCard: { gap: 14 },
  stepsHead: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  stepsValue: { fontSize: 22, fontWeight: '800' },
  stepsRow: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  stepsBtn: { paddingHorizontal: 20, paddingVertical: 14 },
  kcalPreview: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  kcalValue: { fontSize: 18, fontWeight: '800' },
  activityRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14 },
  activityIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  activityInfo: { flex: 1, gap: 2 },
  activityName: { fontSize: 15, fontWeight: '600' },
  activityKcal: { fontSize: 15, fontWeight: '700' },
});
