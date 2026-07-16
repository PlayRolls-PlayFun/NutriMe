import React, { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { ArrowLeft, Flame, GlassWater, Dumbbell, CalendarDays } from 'lucide-react-native';
import { useApp } from '../store/AppContext';
import { Card, Caption, EmptyState } from '../components/UI';

const MONTHS = [
  'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
  'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря',
];
const WEEKDAYS = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];

function formatDate(key) {
  const d = new Date(key);
  return `${WEEKDAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

export default function HistoryScreen({ navigation }) {
  const { theme, state, calorieGoal } = useApp();

  const entries = useMemo(
    () =>
      Object.entries(state.days)
        .map(([key, day]) => {
          const kcal = day.meals.reduce((s, m) => s + (m.calories || 0), 0);
          const burned = day.activities.reduce((s, a) => s + (a.calories || 0), 0);
          return { key, kcal, water: day.water, burned, mealsCount: day.meals.length };
        })
        .filter((e) => e.kcal > 0 || e.water > 0 || e.burned > 0)
        .sort((a, b) => (a.key < b.key ? 1 : -1)),
    [state.days]
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={12}>
          <ArrowLeft size={24} color={theme.text.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text.primary }]}>История</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {entries.length === 0 ? (
          <EmptyState
            icon={CalendarDays}
            title="История пуста"
            text="Начните вести дневник питания, и записи появятся здесь"
          />
        ) : (
          entries.map((e) => (
            <Card key={e.key} style={styles.dayCard}>
              <View style={styles.rowBetween}>
                <Text style={[styles.dayTitle, { color: theme.text.primary }]}>{formatDate(e.key)}</Text>
                <Caption>{e.mealsCount} блюд</Caption>
              </View>
              <View style={styles.statsRow}>
                <View style={styles.stat}>
                  <Flame size={16} color={e.kcal > calorieGoal ? theme.orange : theme.accent} />
                  <Text style={[styles.statText, { color: theme.text.primary }]}>{Math.round(e.kcal)} ккал</Text>
                </View>
                <View style={styles.stat}>
                  <GlassWater size={16} color={theme.blue} />
                  <Text style={[styles.statText, { color: theme.text.primary }]}>{e.water} мл</Text>
                </View>
                <View style={styles.stat}>
                  <Dumbbell size={16} color={theme.orange} />
                  <Text style={[styles.statText, { color: theme.text.primary }]}>-{e.burned} ккал</Text>
                </View>
              </View>
            </Card>
          ))
        )}
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
  content: { padding: 20, paddingTop: 8, paddingBottom: 40, gap: 12 },
  dayCard: { gap: 12 },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  dayTitle: { fontSize: 15, fontWeight: '700' },
  statsRow: { flexDirection: 'row', gap: 18 },
  stat: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statText: { fontSize: 13, fontWeight: '600' },
});
