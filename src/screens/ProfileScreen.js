import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import {
  Settings,
  Heart,
  Trophy,
  History,
  Bell,
  ChevronRight,
  LogOut,
  Target,
  Ruler,
  Scale,
  Pencil,
  BarChart3,
} from 'lucide-react-native';
import { useApp } from '../store/AppContext';
import { Card, Caption, SectionTitle } from '../components/UI';
import { Entrance } from '../components/Entrance';

const GOALS = { lose: 'Похудение', maintain: 'Поддержание веса', gain: 'Набор массы' };

export default function ProfileScreen({ navigation }) {
  const { theme, state, update } = useApp();
  const { user } = state;

  const initials = (user.name || 'П').trim().charAt(0).toUpperCase();
  const unread = state.notifications.filter((n) => !n.read).length;

  const menu = [
    { icon: Bell, label: 'Уведомления', screen: 'Notifications', badge: unread > 0 ? String(unread) : null },
    { icon: Heart, label: 'Избранные блюда', screen: 'Favorites' },
    { icon: Trophy, label: 'Достижения', screen: 'Achievements' },
    { icon: BarChart3, label: 'Статистика', screen: 'Statistics' },
    { icon: History, label: 'История дневника', screen: 'History' },
    { icon: Settings, label: 'Настройки', screen: 'Settings' },
  ];

  const handleLogout = () => {
    update({ authorized: false });
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Entrance index={0}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text.primary }]}>Профиль</Text>
        </View>
        </Entrance>

        {/* Карточка пользователя */}
        <Entrance index={1}>
        <Card style={styles.userCard}>
          <View style={[styles.avatar, { backgroundColor: theme.accentSoft }]}>
            <Text style={[styles.avatarText, { color: theme.accent }]}>{initials}</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={[styles.userName, { color: theme.text.primary }]}>{user.name || 'Пользователь'}</Text>
            <Caption>{user.email || 'Аккаунт не указан'}</Caption>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('EditProfile')}
            style={[styles.editBtn, { backgroundColor: theme.inputBackground }]}
            accessibilityLabel="Редактировать профиль"
          >
            <Pencil size={16} color={theme.text.primary} />
          </TouchableOpacity>
        </Card>
        </Entrance>

        {/* Параметры */}
        <Entrance index={2}>
        <View style={styles.paramsRow}>
          <Card style={styles.paramCard}>
            <Scale size={18} color={theme.accent} />
            <Text style={[styles.paramValue, { color: theme.text.primary }]}>
              {user.weight ? `${user.weight}` : '—'}
            </Text>
            <Caption>кг</Caption>
          </Card>
          <Card style={styles.paramCard}>
            <Ruler size={18} color={theme.blue} />
            <Text style={[styles.paramValue, { color: theme.text.primary }]}>
              {user.height ? `${user.height}` : '—'}
            </Text>
            <Caption>см</Caption>
          </Card>
          <Card style={styles.paramCard}>
            <Target size={18} color={theme.orange} />
            <Text style={[styles.paramValue, { color: theme.text.primary }]}>
              {user.goalWeight ? `${user.goalWeight}` : '—'}
            </Text>
            <Caption>цель, кг</Caption>
          </Card>
        </View>
        </Entrance>

        {user.goal ? (
          <Entrance index={3}>
          <Card style={styles.goalCard}>
            <Caption>Ваша программа</Caption>
            <Text style={[styles.goalText, { color: theme.text.primary }]}>{GOALS[user.goal] || '—'}</Text>
          </Card>
          </Entrance>
        ) : null}

        {/* Меню */}
        <Entrance index={4}>
        <SectionTitle>Разделы</SectionTitle>
        </Entrance>
        <Entrance index={5}>
        <Card style={styles.menuCard}>
          {menu.map((item, i) => {
            const Icon = item.icon;
            return (
              <TouchableOpacity
                key={item.screen}
                style={[styles.menuRow, i > 0 && { borderTopWidth: 1, borderTopColor: theme.divider }]}
                onPress={() => navigation.navigate(item.screen)}
                activeOpacity={0.6}
              >
                <View style={[styles.menuIcon, { backgroundColor: theme.inputBackground }]}>
                  <Icon size={18} color={theme.text.primary} />
                </View>
                <Text style={[styles.menuLabel, { color: theme.text.primary }]}>{item.label}</Text>
                {item.badge ? (
                  <View style={[styles.badge, { backgroundColor: theme.red }]}>
                    <Text style={styles.badgeText}>{item.badge}</Text>
                  </View>
                ) : null}
                <ChevronRight size={18} color={theme.text.tertiary} />
              </TouchableOpacity>
            );
          })}
        </Card>
        </Entrance>

        <Entrance index={6}>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <LogOut size={18} color={theme.red} />
          <Text style={[styles.logoutText, { color: theme.red }]}>Выйти из аккаунта</Text>
        </TouchableOpacity>
        </Entrance>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { padding: 20, paddingBottom: 120, gap: 16 },
  header: { marginTop: 8 },
  title: { fontSize: 30, fontWeight: '800', letterSpacing: -0.8 },
  userCard: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  avatar: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 24, fontWeight: '800' },
  userInfo: { flex: 1, gap: 2 },
  editBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  userName: { fontSize: 18, fontWeight: '700' },
  paramsRow: { flexDirection: 'row', gap: 10 },
  paramCard: { flex: 1, alignItems: 'center', gap: 4, paddingVertical: 16, paddingHorizontal: 8 },
  paramValue: { fontSize: 20, fontWeight: '800' },
  goalCard: { gap: 4 },
  goalText: { fontSize: 17, fontWeight: '700' },
  menuCard: { paddingVertical: 4, paddingHorizontal: 16 },
  menuRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14 },
  menuIcon: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  menuLabel: { flex: 1, fontSize: 15, fontWeight: '600' },
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  badgeText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 12 },
  logoutText: { fontSize: 15, fontWeight: '600' },
});
