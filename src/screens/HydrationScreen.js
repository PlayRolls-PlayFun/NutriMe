import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { ArrowLeft, GlassWater, Coffee, Droplets, Minus } from 'lucide-react-native';
import { useApp } from '../store/AppContext';
import { Card, Caption, SectionTitle, ProgressRing } from '../components/UI';
import { Entrance } from '../components/Entrance';

const QUICK_ADD = [
  { ml: 200, label: 'Стакан', icon: GlassWater },
  { ml: 300, label: 'Кружка', icon: Coffee },
  { ml: 500, label: 'Бутылка', icon: Droplets },
];

export default function HydrationScreen({ navigation }) {
  const { theme, getDay, addWater, waterGoal, unlockAchievement } = useApp();
  const day = getDay();
  const progress = day.water / waterGoal;

  const handleAdd = (ml) => {
    addWater(ml);
    if (day.water + ml >= waterGoal) unlockAchievement('water_goal');
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={12}>
          <ArrowLeft size={24} color={theme.text.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text.primary }]}>Вода</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Entrance index={0}>
        <Card style={styles.mainCard}>
          <ProgressRing size={190} strokeWidth={13} progress={progress} color={theme.blue}>
            <View style={styles.ringCenter}>
              <Text style={[styles.waterValue, { color: theme.text.primary }]}>{day.water}</Text>
              <Caption>из {waterGoal} мл</Caption>
            </View>
          </ProgressRing>
          <Text style={[styles.statusText, { color: theme.text.secondary }]}>
            {progress >= 1
              ? 'Дневная цель выполнена. Отличная работа!'
              : `Осталось выпить ${waterGoal - day.water} мл`}
          </Text>
        </Card>
        </Entrance>

        <Entrance index={1}>
        <SectionTitle>Быстрое добавление</SectionTitle>
        </Entrance>
        <Entrance index={2}>
        <View style={styles.quickRow}>
          {QUICK_ADD.map((q) => {
            const Icon = q.icon;
            return (
              <Card key={q.ml} style={styles.quickCard} onPress={() => handleAdd(q.ml)}>
                <View style={[styles.quickIcon, { backgroundColor: theme.blueSoft }]}>
                  <Icon size={22} color={theme.blue} />
                </View>
                <Text style={[styles.quickMl, { color: theme.text.primary }]}>+{q.ml} мл</Text>
                <Caption>{q.label}</Caption>
              </Card>
            );
          })}
        </View>
        </Entrance>

        <Entrance index={3}>
        <TouchableOpacity
          style={[styles.undoBtn, { backgroundColor: theme.card, borderColor: theme.divider }]}
          onPress={() => addWater(-200)}
          disabled={day.water <= 0}
        >
          <Minus size={16} color={theme.text.secondary} />
          <Text style={[styles.undoText, { color: theme.text.secondary }]}>Убрать 200 мл</Text>
        </TouchableOpacity>
        </Entrance>

        {(day.waterLog || []).length > 0 ? (
          <Entrance index={4} style={{ gap: 16 }}>
            <SectionTitle>История за сегодня</SectionTitle>
            <Card style={styles.logCard}>
              {[...day.waterLog].reverse().map((entry, i, arr) => (
                <View
                  key={entry.id}
                  style={[styles.logRow, i < arr.length - 1 && { borderBottomWidth: 1, borderBottomColor: theme.divider }]}
                >
                  <View style={[styles.logIcon, { backgroundColor: theme.blueSoft }]}>
                    <GlassWater size={16} color={theme.blue} />
                  </View>
                  <Text style={[styles.logMl, { color: entry.ml > 0 ? theme.text.primary : theme.red }]}>
                    {entry.ml > 0 ? '+' : ''}{entry.ml} мл
                  </Text>
                  <Caption>{entry.time}</Caption>
                </View>
              ))}
            </Card>
          </Entrance>
        ) : null}

        <Entrance index={5}>
        <Card style={styles.infoCard}>
          <SectionTitle style={styles.infoTitle}>Зачем пить воду?</SectionTitle>
          <Text style={[styles.infoText, { color: theme.text.secondary }]}>
            Вода участвует в обмене веществ, помогает контролировать аппетит и поддерживает
            энергию в течение дня. Ваша норма рассчитана исходя из веса тела.
          </Text>
        </Card>
        </Entrance>
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
  mainCard: { alignItems: 'center', gap: 16, paddingVertical: 28 },
  ringCenter: { alignItems: 'center' },
  waterValue: { fontSize: 40, fontWeight: '800', letterSpacing: -1 },
  statusText: { fontSize: 14, textAlign: 'center' },
  quickRow: { flexDirection: 'row', gap: 10 },
  quickCard: { flex: 1, alignItems: 'center', gap: 6, paddingVertical: 18, paddingHorizontal: 8 },
  quickIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginBottom: 2 },
  quickMl: { fontSize: 15, fontWeight: '700' },
  undoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  undoText: { fontSize: 14, fontWeight: '600' },
  logCard: { paddingVertical: 4, paddingHorizontal: 16 },
  logRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  logIcon: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  logMl: { flex: 1, fontSize: 15, fontWeight: '600' },
  infoCard: { gap: 8 },
  infoTitle: { fontSize: 16 },
  infoText: { fontSize: 14, lineHeight: 20 },
});
