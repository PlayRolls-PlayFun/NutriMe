import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { Plus, ChevronRight, Flame, UtensilsCrossed } from 'lucide-react-native';
import { useApp } from '../store/AppContext';
import { Card, Caption, SectionTitle, ProgressBar, EmptyState } from '../components/UI';
import { Entrance } from '../components/Entrance';
import { MEAL_TYPES } from '../data/foodDatabase';

const dateKeyOffset = (offset) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
};

const WEEKDAYS = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

export default function NutritionScreen({ navigation }) {
  const { theme, getDay, calorieGoal } = useApp();
  const [selectedDate, setSelectedDate] = useState(dateKeyOffset(0));

  const days = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => {
        const offset = i - 6;
        const key = dateKeyOffset(offset);
        const d = new Date(key);
        return { key, label: WEEKDAYS[d.getDay()], num: d.getDate(), isToday: offset === 0 };
      }),
    []
  );

  const day = getDay(selectedDate);
  const totals = day.meals.reduce(
    (acc, m) => ({
      calories: acc.calories + (m.calories || 0),
      protein: acc.protein + (m.protein || 0),
      fat: acc.fat + (m.fat || 0),
      carbs: acc.carbs + (m.carbs || 0),
    }),
    { calories: 0, protein: 0, fat: 0, carbs: 0 }
  );

  const isToday = selectedDate === dateKeyOffset(0);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Entrance index={0}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text.primary }]}>Питание</Text>
          <Caption>Дневник приёмов пищи</Caption>
        </View>
        </Entrance>

        {/* Календарная лента: последние 7 дней */}
        <Entrance index={1}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.calendarRow}>
          {days.map((d) => {
            const active = d.key === selectedDate;
            return (
              <TouchableOpacity
                key={d.key}
                onPress={() => setSelectedDate(d.key)}
                style={[
                  styles.dayChip,
                  { backgroundColor: active ? theme.accent : theme.card, borderColor: active ? theme.accent : theme.divider },
                ]}
              >
                <Text style={[styles.dayChipLabel, { color: active ? '#FFFFFF' : theme.text.secondary }]}>{d.label}</Text>
                <Text style={[styles.dayChipNum, { color: active ? '#FFFFFF' : theme.text.primary }]}>{d.num}</Text>
                {d.isToday ? <View style={[styles.todayDot, { backgroundColor: active ? '#FFFFFF' : theme.accent }]} /> : null}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        </Entrance>

        {/* Сводка за день */}
        <Entrance index={2}>
        <Card style={styles.summaryCard}>
          <View style={styles.rowBetween}>
            <View style={styles.row}>
              <Flame size={20} color={theme.orange} />
              <Text style={[styles.summaryValue, { color: theme.text.primary }]}>
                {Math.round(totals.calories)} <Text style={[styles.summaryUnit, { color: theme.text.secondary }]}>из {calorieGoal} ккал</Text>
              </Text>
            </View>
            <Caption>{Math.max(0, calorieGoal - Math.round(totals.calories))} осталось</Caption>
          </View>
          <ProgressBar progress={totals.calories / calorieGoal} color={theme.accent} style={styles.summaryBar} />
          <View style={styles.macrosRow}>
            {[
              { label: 'Белки', value: totals.protein, color: theme.blue },
              { label: 'Жиры', value: totals.fat, color: theme.orange },
              { label: 'Углеводы', value: totals.carbs, color: theme.accent },
            ].map((m) => (
              <View key={m.label} style={styles.macroItem}>
                <View style={[styles.macroDot, { backgroundColor: m.color }]} />
                <Text style={[styles.macroValue, { color: theme.text.primary }]}>{Math.round(m.value)} г</Text>
                <Caption>{m.label}</Caption>
              </View>
            ))}
          </View>
        </Card>
        </Entrance>

        {/* Приёмы пищи */}
        {MEAL_TYPES.map((mt, mtIndex) => {
          const meals = day.meals.filter((m) => m.mealType === mt.id);
          const kcal = meals.reduce((s, m) => s + (m.calories || 0), 0);
          return (
            <Entrance key={mt.id} index={3 + mtIndex}>
            <View style={styles.mealSection}>
              <View style={styles.rowBetween}>
                <SectionTitle style={styles.mealTitle}>{mt.name}</SectionTitle>
                <View style={styles.row}>
                  {kcal > 0 ? <Caption>{Math.round(kcal)} ккал</Caption> : null}
                  {isToday ? (
                    <TouchableOpacity
                      onPress={() => navigation.navigate('AddMeal', { mealType: mt.id, date: selectedDate })}
                      style={[styles.addBtn, { backgroundColor: theme.accentSoft }]}
                      hitSlop={8}
                    >
                      <Plus size={18} color={theme.accent} />
                    </TouchableOpacity>
                  ) : null}
                </View>
              </View>
              {meals.length === 0 ? (
                <Card style={styles.emptyMeal}>
                  <Caption>Ничего не добавлено</Caption>
                </Card>
              ) : (
                meals.map((meal) => (
                  <Card
                    key={meal.id}
                    style={styles.mealCard}
                    onPress={() => navigation.navigate('MealDetails', { meal, date: selectedDate })}
                  >
                    <View style={styles.rowBetween}>
                      <View style={styles.mealInfo}>
                        <Text style={[styles.mealName, { color: theme.text.primary }]} numberOfLines={1}>
                          {meal.name}
                        </Text>
                        <Caption>
                          {meal.weight ? `${meal.weight} г · ` : ''}Б {Math.round(meal.protein || 0)} · Ж {Math.round(meal.fat || 0)} · У {Math.round(meal.carbs || 0)}
                        </Caption>
                      </View>
                      <View style={styles.row}>
                        <Text style={[styles.mealKcal, { color: theme.text.primary }]}>{Math.round(meal.calories)}</Text>
                        <ChevronRight size={18} color={theme.text.tertiary} />
                      </View>
                    </View>
                  </Card>
                ))
              )}
            </View>
            </Entrance>
          );
        })}

        {day.meals.length === 0 ? (
          <Entrance index={7}>
          <EmptyState
            icon={UtensilsCrossed}
            title="Дневник пуст"
            text={isToday ? 'Добавьте первый приём пищи, нажав на «+» рядом с категорией' : 'В этот день ничего не было добавлено'}
          />
          </Entrance>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { padding: 20, paddingBottom: 120, gap: 16 },
  header: { gap: 4, marginTop: 8 },
  title: { fontSize: 30, fontWeight: '800', letterSpacing: -0.8 },
  calendarRow: { gap: 8 },
  dayChip: {
    width: 52,
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 10,
    alignItems: 'center',
    gap: 2,
  },
  dayChipLabel: { fontSize: 12, fontWeight: '600' },
  dayChipNum: { fontSize: 17, fontWeight: '700' },
  todayDot: { width: 4, height: 4, borderRadius: 2, marginTop: 2 },
  summaryCard: { gap: 14 },
  summaryBar: {},
  summaryValue: { fontSize: 20, fontWeight: '700' },
  summaryUnit: { fontSize: 14, fontWeight: '500' },
  macrosRow: { flexDirection: 'row', justifyContent: 'space-between' },
  macroItem: { alignItems: 'center', gap: 2, flex: 1 },
  macroDot: { width: 8, height: 8, borderRadius: 4, marginBottom: 2 },
  macroValue: { fontSize: 15, fontWeight: '700' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  mealSection: { gap: 10 },
  mealTitle: { fontSize: 17 },
  addBtn: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  emptyMeal: { paddingVertical: 14, alignItems: 'center' },
  mealCard: { paddingVertical: 14 },
  mealInfo: { flex: 1, gap: 2, marginRight: 12 },
  mealName: { fontSize: 15, fontWeight: '600' },
  mealKcal: { fontSize: 15, fontWeight: '700' },
});
