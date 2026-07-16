import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { ArrowLeft, GlassWater, UtensilsCrossed, Trophy, Scale, Lightbulb, Bell } from 'lucide-react-native';
import { useApp } from '../store/AppContext';
import { Card, Caption, EmptyState } from '../components/UI';

const ICONS = {
  water: { icon: GlassWater, colorKey: 'blue', softKey: 'blueSoft' },
  meal: { icon: UtensilsCrossed, colorKey: 'accent', softKey: 'accentSoft' },
  achievement: { icon: Trophy, colorKey: 'orange', softKey: 'orangeSoft' },
  weigh: { icon: Scale, colorKey: 'accent', softKey: 'accentSoft' },
  tip: { icon: Lightbulb, colorKey: 'orange', softKey: 'orangeSoft' },
};

export default function NotificationsScreen({ navigation }) {
  const { theme, state, markNotificationsRead } = useApp();
  const notifications = state.notifications;

  useEffect(() => {
    const t = setTimeout(markNotificationsRead, 1200);
    return () => clearTimeout(t);
  }, [markNotificationsRead]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={12}>
          <ArrowLeft size={24} color={theme.text.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text.primary }]}>Уведомления</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {notifications.length === 0 ? (
          <EmptyState icon={Bell} title="Нет уведомлений" text="Здесь будут появляться напоминания и советы" />
        ) : (
          notifications.map((n) => {
            const meta = ICONS[n.type] || ICONS.tip;
            const Icon = meta.icon;
            return (
              <Card key={n.id} style={[styles.notifCard, !n.read && { borderColor: theme.accent }]}>
                <View style={[styles.notifIcon, { backgroundColor: theme[meta.softKey] }]}>
                  <Icon size={18} color={theme[meta.colorKey]} />
                </View>
                <View style={styles.notifInfo}>
                  <View style={styles.rowBetween}>
                    <Text style={[styles.notifTitle, { color: theme.text.primary }]}>{n.title}</Text>
                    <Caption>{n.time}</Caption>
                  </View>
                  <Text style={[styles.notifText, { color: theme.text.secondary }]}>{n.text}</Text>
                </View>
                {!n.read ? <View style={[styles.unreadDot, { backgroundColor: theme.accent }]} /> : null}
              </Card>
            );
          })
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
  notifCard: { flexDirection: 'row', gap: 12, paddingVertical: 14 },
  notifIcon: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  notifInfo: { flex: 1, gap: 4 },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  notifTitle: { fontSize: 14, fontWeight: '700', flex: 1 },
  notifText: { fontSize: 13, lineHeight: 18 },
  unreadDot: { width: 8, height: 8, borderRadius: 4, alignSelf: 'center' },
});
