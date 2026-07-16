import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import Svg, { Polyline, Circle, Line } from 'react-native-svg';
import { Scale, Trophy, ChevronRight, TrendingDown, TrendingUp, GlassWater, Flame, BarChart3, HeartPulse } from 'lucide-react-native';
import { useApp } from '../store/AppContext';
import { Card, Caption, SectionTitle, PrimaryButton, Input, ProgressBar } from '../components/UI';
import { Entrance } from '../components/Entrance';

const dateKeyOffset = (offset) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
};

const WEEKDAYS = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

function WeightChart({ data, theme }) {
  const W = 300;
  const H = 130;
  const PAD = 16;
  if (data.length < 2) return null;
  const values = data.map((d) => d.weight);
  const min = Math.min(...values) - 0.5;
  const max = Math.max(...values) + 0.5;
  const range = max - min || 1;
  const pts = data.map((d, i) => {
    const x = PAD + (i / (data.length - 1)) * (W - PAD * 2);
    const y = PAD + (1 - (d.weight - min) / range) * (H - PAD * 2);
    return { x, y };
  });
  return (
    <Svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`}>
      <Line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke={theme.divider} strokeWidth={1} />
      <Polyline
        points={pts.map((p) => `${p.x},${p.y}`).join(' ')}
        fill="none"
        stroke={theme.accent}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {pts.map((p, i) => (
        <Circle key={i} cx={p.x} cy={p.y} r={i === pts.length - 1 ? 5 : 3.5} fill={theme.accent} />
      ))}
    </Svg>
  );
}

const BMI_ZONES = [
  { max: 18.5, label: 'Недостаточный вес', color: 'blue' },
  { max: 25, label: 'Норма', color: 'accent' },
  { max: 30, label: 'Избыточный вес', color: 'orange' },
  { max: Infinity, label: 'Ожирение', color: 'red' },
];

export default function ProgressScreen({ navigation }) {
  const { theme, state, getDay, calorieGoal, waterGoal, logWeight, unlockAchievement } = useApp();
  const [weightInput, setWeightInput] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [period, setPeriod] = useState('week'); // week | month

  const { user, weightHistory } = state;

  const weekData = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => {
        const key = dateKeyOffset(i - 6);
        const day = getDay(key);
        const kcal = day.meals.reduce((s, m) => s + (m.calories || 0), 0);
        const burned = (day.activities || []).reduce((s, a) => s + (a.calories || 0), 0);
        return { key, label: WEEKDAYS[new Date(key).getDay()], kcal, water: day.water || 0, burned };
      }),
    [getDay]
  );

  const bmi = useMemo(() => {
    if (!user.weight || !user.height) return null;
    const value = Math.round((user.weight / Math.pow(user.height / 100, 2)) * 10) / 10;
    const zone = BMI_ZONES.find((z) => value < z.max) || BMI_ZONES[BMI_ZONES.length - 1];
    return { value, label: zone.label, color: theme[zone.color] };
  }, [user.weight, user.height, theme]);

  const maxWater = Math.max(waterGoal, ...weekData.map((d) => d.water), 1);

  const maxKcal = Math.max(calorieGoal, ...weekData.map((d) => d.kcal), 1);
  const avgKcal = Math.round(weekData.reduce((s, d) => s + d.kcal, 0) / 7);

  const currentWeight = user.weight;
  const startWeight = user.startWeight || currentWeight;
  const goalWeight = user.goalWeight;

  const lost = startWeight && currentWeight ? Math.round((startWeight - currentWeight) * 10) / 10 : 0;
  const toGoal = goalWeight && currentWeight ? Math.round(Math.abs(currentWeight - goalWeight) * 10) / 10 : null;
  const goalProgress =
    startWeight && goalWeight && startWeight !== goalWeight
      ? Math.min(1, Math.max(0, (startWeight - currentWeight) / (startWeight - goalWeight)))
      : 0;

  const handleLogWeight = () => {
    const w = parseFloat(weightInput.replace(',', '.'));
    if (!w || w < 30 || w > 300) return;
    logWeight(w);
    unlockAchievement('weight_log');
    setWeightInput('');
    setShowInput(false);
  };

  const chartData = weightHistory.length >= 2 ? weightHistory.slice(period === 'week' ? -7 : -30) : null;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Entrance index={0}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text.primary }]}>Прогресс</Text>
          <Caption>Ваши результаты и статистика</Caption>
        </View>
        </Entrance>

        {/* Вес */}
        <Entrance index={1}>
        <Card style={styles.weightCard}>
          <View style={styles.rowBetween}>
            <View style={styles.row}>
              <View style={[styles.iconWrap, { backgroundColor: theme.accentSoft }]}>
                <Scale size={20} color={theme.accent} />
              </View>
              <View>
                <Text style={[styles.weightValue, { color: theme.text.primary }]}>
                  {currentWeight ? `${currentWeight} кг` : '—'}
                </Text>
                <Caption>Текущий вес</Caption>
              </View>
            </View>
            {lost !== 0 ? (
              <View style={styles.row}>
                {lost > 0 ? <TrendingDown size={16} color={theme.accent} /> : <TrendingUp size={16} color={theme.orange} />}
                <Text style={[styles.deltaText, { color: lost > 0 ? theme.accent : theme.orange }]}>
                  {lost > 0 ? '-' : '+'}{Math.abs(lost)} кг
                </Text>
              </View>
            ) : null}
          </View>

          {goalWeight ? (
            <View style={styles.goalBlock}>
              <View style={styles.rowBetween}>
                <Caption>Цель: {goalWeight} кг</Caption>
                {toGoal !== null ? <Caption>осталось {toGoal} кг</Caption> : null}
              </View>
              <ProgressBar progress={goalProgress} color={theme.accent} />
            </View>
          ) : null}

          {weightHistory.length >= 2 ? (
            <View style={[styles.segment, { backgroundColor: theme.inputBackground }]}>
              {[
                { id: 'week', label: 'Неделя' },
                { id: 'month', label: 'Месяц' },
              ].map((p) => {
                const active = period === p.id;
                return (
                  <TouchableOpacity
                    key={p.id}
                    onPress={() => setPeriod(p.id)}
                    style={[styles.segmentBtn, active && { backgroundColor: theme.card, ...styles.segmentActive }]}
                  >
                    <Text style={[styles.segmentText, { color: active ? theme.text.primary : theme.text.secondary }]}>
                      {p.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : null}

          {chartData ? <WeightChart data={chartData} theme={theme} /> : null}

          {showInput ? (
            <View style={styles.weightForm}>
              <Input
                placeholder="Например, 72.5"
                value={weightInput}
                onChangeText={setWeightInput}
                keyboardType="decimal-pad"
              />
              <PrimaryButton title="Сохранить" onPress={handleLogWeight} />
            </View>
          ) : (
            <PrimaryButton title="Записать вес" variant="secondary" onPress={() => setShowInput(true)} />
          )}
        </Card>
        </Entrance>

        {/* ИМТ */}
        {bmi ? (
          <Entrance index={2}>
          <Card style={styles.achievementsCard}>
            <View style={[styles.iconWrap, { backgroundColor: theme.accentSoft }]}>
              <HeartPulse size={20} color={bmi.color} />
            </View>
            <View style={styles.achievementsInfo}>
              <Text style={[styles.achievementsTitle, { color: theme.text.primary }]}>
                ИМТ: {bmi.value}
              </Text>
              <Caption style={{ color: bmi.color }}>{bmi.label}</Caption>
            </View>
          </Card>
          </Entrance>
        ) : null}

        {/* Недельная статистика калорий */}
        <Entrance index={2}>
        <SectionTitle>Калории за неделю</SectionTitle>
        </Entrance>
        <Entrance index={3}>
        <Card style={styles.chartCard}>
          <View style={styles.barsRow}>
            {weekData.map((d, i) => {
              const isToday = i === 6;
              const h = Math.max(6, (d.kcal / maxKcal) * 110);
              const over = d.kcal > calorieGoal;
              return (
                <View key={d.key} style={styles.barCol}>
                  <View style={styles.barTrack}>
                    <View
                      style={[
                        styles.bar,
                        {
                          height: h,
                          backgroundColor: d.kcal === 0 ? theme.inputBackground : over ? theme.orange : theme.accent,
                          opacity: isToday ? 1 : 0.75,
                        },
                      ]}
                    />
                  </View>
                  <Caption style={isToday ? { fontWeight: '700', color: theme.text.primary } : null}>{d.label}</Caption>
                </View>
              );
            })}
          </View>
          <View style={[styles.avgRow, { borderTopColor: theme.divider }]}>
            <Caption>Среднее за неделю</Caption>
            <Text style={[styles.avgValue, { color: theme.text.primary }]}>{avgKcal} ккал</Text>
          </View>
        </Card>
        </Entrance>

        {/* Вода за неделю */}
        <Entrance index={4}>
        <Card style={styles.chartCard}>
          <View style={styles.row}>
            <GlassWater size={18} color={theme.blue} />
            <Text style={[styles.achievementsTitle, { color: theme.text.primary }]}>Вода за неделю</Text>
          </View>
          <View style={styles.barsRow}>
            {weekData.map((d, i) => {
              const isToday = i === 6;
              const h = Math.max(6, (d.water / maxWater) * 80);
              return (
                <View key={d.key} style={styles.barCol}>
                  <View style={styles.waterBarTrack}>
                    <View
                      style={[
                        styles.bar,
                        {
                          height: h,
                          backgroundColor: d.water === 0 ? theme.inputBackground : theme.blue,
                          opacity: isToday ? 1 : 0.75,
                        },
                      ]}
                    />
                  </View>
                  <Caption style={isToday ? { fontWeight: '700', color: theme.text.primary } : null}>{d.label}</Caption>
                </View>
              );
            })}
          </View>
        </Card>
        </Entrance>

        {/* Активность за неделю */}
        <Entrance index={5}>
        <Card style={styles.achievementsCard}>
          <View style={[styles.iconWrap, { backgroundColor: theme.orangeSoft }]}>
            <Flame size={20} color={theme.orange} />
          </View>
          <View style={styles.achievementsInfo}>
            <Text style={[styles.achievementsTitle, { color: theme.text.primary }]}>
              Сожжено за неделю: {weekData.reduce((s, d) => s + d.burned, 0)} ккал
            </Text>
            <Caption>Тренировки и активность</Caption>
          </View>
        </Card>
        </Entrance>

        {/* Расширенная статистика */}
        <Entrance index={6}>
        <Card style={styles.achievementsCard} onPress={() => navigation.navigate('Statistics')}>
          <View style={[styles.iconWrap, { backgroundColor: theme.accentSoft }]}>
            <BarChart3 size={20} color={theme.accent} />
          </View>
          <View style={styles.achievementsInfo}>
            <Text style={[styles.achievementsTitle, { color: theme.text.primary }]}>Расширенная статистика</Text>
            <Caption>Средние значения, цели, лучшие дни</Caption>
          </View>
          <ChevronRight size={20} color={theme.text.tertiary} />
        </Card>
        </Entrance>

        {/* Достижения */}
        <Entrance index={7}>
        <Card style={styles.achievementsCard} onPress={() => navigation.navigate('Achievements')}>
          <View style={[styles.iconWrap, { backgroundColor: theme.orangeSoft }]}>
            <Trophy size={20} color={theme.orange} />
          </View>
          <View style={styles.achievementsInfo}>
            <Text style={[styles.achievementsTitle, { color: theme.text.primary }]}>Достижения</Text>
            <Caption>Получено {state.achievementsUnlocked.length} наград</Caption>
          </View>
          <ChevronRight size={20} color={theme.text.tertiary} />
        </Card>
        </Entrance>

        {/* История */}
        <Entrance index={8}>
        <Card style={styles.achievementsCard} onPress={() => navigation.navigate('History')}>
          <View style={[styles.iconWrap, { backgroundColor: theme.blueSoft }]}>
            <Scale size={20} color={theme.blue} />
          </View>
          <View style={styles.achievementsInfo}>
            <Text style={[styles.achievementsTitle, { color: theme.text.primary }]}>История дневника</Text>
            <Caption>Все записи по дням</Caption>
          </View>
          <ChevronRight size={20} color={theme.text.tertiary} />
        </Card>
        </Entrance>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { padding: 20, paddingBottom: 120, gap: 16 },
  header: { gap: 4, marginTop: 8 },
  title: { fontSize: 30, fontWeight: '800', letterSpacing: -0.8 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  iconWrap: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  weightCard: { gap: 16 },
  weightValue: { fontSize: 22, fontWeight: '800' },
  deltaText: { fontSize: 15, fontWeight: '700' },
  goalBlock: { gap: 8 },
  weightForm: { gap: 10 },
  chartCard: { gap: 14 },
  barsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  barCol: { alignItems: 'center', gap: 6, flex: 1 },
  barTrack: { height: 110, justifyContent: 'flex-end' },
  bar: { width: 22, borderRadius: 7 },
  avgRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    paddingTop: 12,
  },
  avgValue: { fontSize: 15, fontWeight: '700' },
  segment: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 3,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  segmentActive: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  segmentText: { fontSize: 13, fontWeight: '600' },
  waterBarTrack: { height: 80, justifyContent: 'flex-end' },
  achievementsCard: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 16 },
  achievementsInfo: { flex: 1, gap: 2 },
  achievementsTitle: { fontSize: 15, fontWeight: '600' },
});
