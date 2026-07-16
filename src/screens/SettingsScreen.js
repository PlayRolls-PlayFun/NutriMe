import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Switch, Platform, Alert } from 'react-native';
import { ArrowLeft, Moon, Sun, Trash2 } from 'lucide-react-native';
import { useApp } from '../store/AppContext';
import { Card, Caption, SectionTitle } from '../components/UI';

const REMINDER_LABELS = {
  water: 'Напоминания о воде',
  meals: 'Напоминания о приёмах пищи',
  weigh: 'Напоминание о взвешивании',
  tips: 'Советы и рекомендации',
};

export default function SettingsScreen({ navigation }) {
  const { theme, themeName, state, update, resetAll } = useApp();
  const { settings } = state;

  const setTheme = (t) => {
    update((prev) => ({ settings: { ...prev.settings, theme: t } }));
  };

  const toggleReminder = (key) => {
    update((prev) => ({
      settings: {
        ...prev.settings,
        reminders: { ...prev.settings.reminders, [key]: !prev.settings.reminders[key] },
      },
    }));
  };

  const handleReset = () => {
    if (Platform.OS === 'web') {
      resetAll();
    } else {
      Alert.alert('Сбросить все данные?', 'Дневник, прогресс и профиль будут удалены безвозвратно.', [
        { text: 'Отмена', style: 'cancel' },
        { text: 'Сбросить', style: 'destructive', onPress: resetAll },
      ]);
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={12}>
          <ArrowLeft size={24} color={theme.text.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text.primary }]}>Настройки</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Тема */}
        <SectionTitle>Оформление</SectionTitle>
        <View style={styles.themeRow}>
          {[
            { id: 'light', name: 'Светлая', icon: Sun },
            { id: 'dark', name: 'Тёмная', icon: Moon },
          ].map((t) => {
            const Icon = t.icon;
            const active = themeName === t.id;
            return (
              <Card
                key={t.id}
                style={[styles.themeCard, active && { borderColor: theme.accent, borderWidth: 2 }]}
                onPress={() => setTheme(t.id)}
              >
                <Icon size={22} color={active ? theme.accent : theme.text.secondary} />
                <Text style={[styles.themeName, { color: active ? theme.accent : theme.text.secondary }]}>
                  {t.name}
                </Text>
              </Card>
            );
          })}
        </View>

        {/* Уведомления */}
        <SectionTitle>Уведомления</SectionTitle>
        <Card style={styles.listCard}>
          {Object.keys(REMINDER_LABELS).map((key, i) => (
            <View
              key={key}
              style={[styles.settingRow, i > 0 && { borderTopWidth: 1, borderTopColor: theme.divider }]}
            >
              <Text style={[styles.settingLabel, { color: theme.text.primary }]}>{REMINDER_LABELS[key]}</Text>
              <Switch
                value={settings.reminders[key]}
                onValueChange={() => toggleReminder(key)}
                trackColor={{ false: theme.inputBackground, true: theme.accent }}
                thumbColor="#FFFFFF"
              />
            </View>
          ))}
        </Card>

        {/* Единицы */}
        <SectionTitle>Единицы измерения</SectionTitle>
        <Card style={styles.listCard}>
          <View style={styles.settingRow}>
            <Text style={[styles.settingLabel, { color: theme.text.primary }]}>Система</Text>
            <Caption>Метрическая (кг, см, мл)</Caption>
          </View>
        </Card>

        {/* О приложении */}
        <SectionTitle>О приложении</SectionTitle>
        <Card style={styles.listCard}>
          <View style={styles.settingRow}>
            <Text style={[styles.settingLabel, { color: theme.text.primary }]}>Версия</Text>
            <Caption>1.0.0</Caption>
          </View>
          <View style={[styles.settingRow, { borderTopWidth: 1, borderTopColor: theme.divider }]}>
            <Text style={[styles.settingLabel, { color: theme.text.primary }]}>Платформа</Text>
            <Caption>React Native · Expo</Caption>
          </View>
        </Card>

        <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
          <Trash2 size={18} color={theme.red} />
          <Text style={[styles.resetText, { color: theme.red }]}>Сбросить все данные</Text>
        </TouchableOpacity>
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
  themeRow: { flexDirection: 'row', gap: 12 },
  themeCard: { flex: 1, alignItems: 'center', gap: 8, paddingVertical: 20 },
  themeName: { fontSize: 14, fontWeight: '700' },
  listCard: { paddingVertical: 4, paddingHorizontal: 16 },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    gap: 12,
  },
  settingLabel: { fontSize: 15, fontWeight: '500', flex: 1 },
  resetBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 12 },
  resetText: { fontSize: 15, fontWeight: '600' },
});
