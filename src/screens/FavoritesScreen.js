import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { ArrowLeft, Heart } from 'lucide-react-native';
import { useApp } from '../store/AppContext';
import { Card, Caption, EmptyState } from '../components/UI';

export default function FavoritesScreen({ navigation }) {
  const { theme, state, toggleFavorite } = useApp();
  const favorites = state.favorites;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={12}>
          <ArrowLeft size={24} color={theme.text.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text.primary }]}>Избранное</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {favorites.length === 0 ? (
          <EmptyState
            icon={Heart}
            title="Нет избранных блюд"
            text="Отмечайте блюда сердечком на экране деталей, чтобы быстро находить их здесь"
          />
        ) : (
          favorites.map((meal, i) => (
            <Card
              key={`${meal.name}_${i}`}
              style={styles.mealCard}
              onPress={() => navigation.navigate('MealDetails', { meal: { ...meal, id: null } })}
            >
              <View style={styles.mealInfo}>
                <Text style={[styles.mealName, { color: theme.text.primary }]} numberOfLines={1}>
                  {meal.name}
                </Text>
                <Caption>
                  {Math.round(meal.calories)} ккал · Б {Math.round(meal.protein || 0)} · Ж {Math.round(meal.fat || 0)} · У {Math.round(meal.carbs || 0)}
                </Caption>
              </View>
              <TouchableOpacity onPress={() => toggleFavorite(meal)} hitSlop={10}>
                <Heart size={20} color={theme.red} fill={theme.red} />
              </TouchableOpacity>
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
  mealCard: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14 },
  mealInfo: { flex: 1, gap: 2 },
  mealName: { fontSize: 15, fontWeight: '600' },
});
