import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { ArrowLeft, Trophy, Lock } from 'lucide-react-native';
import { useApp } from '../store/AppContext';
import { Card, Caption } from '../components/UI';
import { ACHIEVEMENTS } from '../data/foodDatabase';

export default function AchievementsScreen({ navigation }) {
  const { theme, state } = useApp();
  const unlocked = state.achievementsUnlocked;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={12}>
          <ArrowLeft size={24} color={theme.text.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text.primary }]}>Достижения</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Card style={styles.summary}>
          <Trophy size={28} color={theme.orange} />
          <Text style={[styles.summaryText, { color: theme.text.primary }]}>
            {unlocked.length} из {ACHIEVEMENTS.length}
          </Text>
          <Caption>наград получено</Caption>
        </Card>

        {ACHIEVEMENTS.map((a) => {
          const isUnlocked = unlocked.includes(a.id);
          return (
            <Card key={a.id} style={[styles.achievementCard, !isUnlocked && { opacity: 0.6 }]}>
              <View
                style={[
                  styles.badge,
                  { backgroundColor: isUnlocked ? theme.orangeSoft : theme.inputBackground },
                ]}
              >
                {isUnlocked ? (
                  <Trophy size={22} color={theme.orange} />
                ) : (
                  <Lock size={20} color={theme.text.tertiary} />
                )}
              </View>
              <View style={styles.info}>
                <Text style={[styles.name, { color: theme.text.primary }]}>{a.title}</Text>
                <Caption>{a.description}</Caption>
              </View>
              {isUnlocked ? (
                <Text style={[styles.doneLabel, { color: theme.accent }]}>Получено</Text>
              ) : null}
            </Card>
          );
        })}
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
  summary: { alignItems: 'center', gap: 6, paddingVertical: 24 },
  summaryText: { fontSize: 26, fontWeight: '800' },
  achievementCard: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 16 },
  badge: { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center' },
  info: { flex: 1, gap: 2 },
  name: { fontSize: 15, fontWeight: '700' },
  doneLabel: { fontSize: 12, fontWeight: '700' },
});
