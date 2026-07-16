import React, { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { ArrowLeft, Flame, GlassWater, Target, TrendingUp, Star, BarChart3 } from 'lucide-react-native';
import { useApp } from '../store/AppContext';
import { Card, Caption, SectionTitle, ProgressBar, EmptyState } from '../components/UI';

const MONTHS = [
  'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
  'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря',
];

function formatShort(key) {
  const d = new Date(key);
  return `${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

export default function StatisticsScreen({ navigation }) {
  const { theme, state, calorieGoal, waterGoal } = useApp();

  const stats = useMemo(() => {
    const entries = Object.entries(state.days)
      .map(([key, day]) => {
        const kcal = (day.meals || []).reduce((s, m) => s + (m.calories || 0), 0);
        const burned = (day.activities || []).reduce((s, a) => s + (a.calories || 0), 0);
        return { key, kcal, water: day.water || 0, burned, mealsCount: (day.meals || []).length };
      })
      .filter((e) => e.kcal > 0 || e.water > 0 || e.burned > 0);

    if (entries.length === 0) return null;

    const daysCount = entries.length;
    const avgKcal = Math.round(entries.reduce((s, e) => s + e.kcal, 0) / daysCount);
    const avgWater = Math.round(entries.reduce((s, e) => s + e.water, 0) / daysCount);
    const kcalGoalDays = entries.filter((e) => e.kcal > 0 && e.kcal <= calorieGoal).length;
    const waterGoalDays = entries.filter((e) => e.water >= waterGoal).length;
    const best = [...entries].sort(
      (a, b) => b.mealsCount + (b.water >= waterGoal ? 2 : 0) + (b.burned > 0 ? 2 : 0)
        - (a.mealsCount + (a.water >= waterGoal ? 2 : 0) + (a.burned > 0 ? 2 : 0))
    ).slice(0, 3);

    return { daysCount, avgKcal, avgWater, kcalGoalDays, waterGoalDays, best };
  }, [state.days, calorieGoal, waterGoal]);

  const { user } = state;
  const overallProgress =
    user.startWeight && user.goalWeight && user.startWeight !== user.goalWeight
      ? Math.min(1, Math.max(0, (user.startWeight - user.weight) / (user.startWeight - user.goalWeight)))
      : 0;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={12}>
          <ArrowLeft size={24} color={theme.text.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text.primary }]}>Статистика</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {!stats ? (
          <EmptyState
            icon={BarChart3}
            title="Пока нет данных"
            text="Ведите дневник питания и воды, и здесь появится расширенная аналитика"
          />
        ) : (
          <>
            {/* Средние значения */}
            <View style={styles.grid}>
              <Card style={styles.statCard}>
                <Flame size={20} color={theme.orange} />
                <Text style={[styles.statValue, { color: theme.text.primary }]}>{stats.avgKcal}</Text>
                <Caption>средние ккал в день</Caption>
              </Card>
              <Card style={styles.statCard}>
                <GlassWater size={20} color={theme.blue} />
                <Text style={[styles.statValue, { color: theme.text.primary }]}>{stats.avgWater}</Text>
                <Caption>среднее мл воды</Caption>
              </Card>
            </View>

            {/* Выполнение целей */}
            <SectionTitle>Выполнение целей</SectionTitle>
            <Card style={styles.goalsCard}>
              <View style={styles.goalRow}>
                <View style={styles.goalHead}>
                  <Target size={16} color={theme.accent} />
                  <Text style={[styles.goalLabel, { color: theme.text.primary }]}>Калории в норме</Text>
                  <Caption>{stats.kcalGoalDays} из {stats.daysCount} дней</Caption>
                </View>
                <ProgressBar progress={stats.kcalGoalDays / stats.daysCount} color={theme.accent} />
              </View>
              <View style={styles.goalRow}>
                <View style={styles.goalHead}>
                  <GlassWater size={16} color={theme.blue} />
                  <Text style={[styles.goalLabel, { color: theme.text.primary }]}>Цель по воде</Text>
                  <Caption>{stats.waterGoalDays} из {stats.daysCount} дней</Caption>
                </View>
                <ProgressBar progress={stats.waterGoalDays / stats.daysCount} color={theme.blue} />
              </View>
            </Card>

            {/* Общий прогресс */}
            <SectionTitle>Общий прогресс</SectionTitle>
            <Card style={styles.goalsCard}>
              <View style={styles.goalHead}>
                <TrendingUp size={16} color={theme.accent} />
                <Text style={[styles.goalLabel, { color: theme.text.primary }]}>Путь к целевому весу</Text>
                <Text style={[styles.percent, { color: theme.accent }]}>{Math.round(overallProgress * 100)}%</Text>
              </View>
              <ProgressBar progress={overallProgress} color={theme.accent} />
              {user.startWeight && user.goalWeight ? (
                <Caption>
                  {user.startWeight} кг → {user.goalWeight} кг · сейчас {user.weight} кг
                </Caption>
              ) : null}
            </Card>

            {/* Самые продуктивные дни */}
            <SectionTitle>Самые продуктивные дни</SectionTitle>
            {stats.best.map((e, i) => (
              <Card key={e.key} style={styles.bestRow}>
                <View style={[styles.rank, { backgroundColor: i === 0 ? theme.orangeSoft : theme.inputBackground }]}>
                  <Star size={16} color={i === 0 ? theme.orange : theme.text.tertiary} fill={i === 0 ? theme.orange : 'none'} />
                </View>
                <View style={styles.bestInfo}>
                  <Text style={[styles.bestDate, { color: theme.text.primary }]}>{formatShort(e.key)}</Text>
                  <Caption>
                    {e.mealsCount} блюд · {e.water} мл воды · {e.burned} ккал сожжено
                  </Caption>
                </View>
              </Card>
            ))}
          </>
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
  content: { padding: 20, paddingTop: 8, paddingBottom: 40, gap: 14 },
  grid: { flexDirection: 'row', gap: 12 },
  statCard: { flex: 1, alignItems: 'center', gap: 4, paddingVertical: 18 },
  statValue: { fontSize: 24, fontWeight: '800' },
  goalsCard: { gap: 16 },
  goalRow: { gap: 8 },
  goalHead: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  goalLabel: { fontSize: 14, fontWeight: '600', flex: 1 },
  percent: { fontSize: 15, fontWeight: '800' },
  bestRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14 },
  rank: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  bestInfo: { flex: 1, gap: 2 },
  bestDate: { fontSize: 15, fontWeight: '700' },
});
