import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Image } from 'react-native';
import { ArrowLeft, Search, Clock, X, SearchX } from 'lucide-react-native';
import { useApp } from '../store/AppContext';
import { Card, Caption, SectionTitle, Input, EmptyState } from '../components/UI';
import { FOODS, CATEGORIES, getFoodImage } from '../data/foodDatabase';

const FILTERS = [
  { id: 'all', name: 'Всё' },
  { id: 'products', name: 'Продукты' },
  { id: 'dishes', name: 'Блюда' },
  { id: 'recipes', name: 'Рецепты' },
];

// Продукты — простые позиции из одного ингредиента, блюда — составные, рецепты — с 3+ ингредиентами
const kindOf = (food) => {
  const n = (food.ingredients || []).length;
  if (n <= 1) return 'products';
  if (n >= 4) return 'recipes';
  return 'dishes';
};

export default function SearchScreen({ navigation }) {
  const { theme, state, addSearchTerm, update } = useApp();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');

  const results = useMemo(() => {
    let items = FOODS;
    if (filter !== 'all') items = items.filter((f) => kindOf(f) === filter);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      items = items.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          (f.ingredients || []).some((ing) => ing.toLowerCase().includes(q))
      );
    }
    return items;
  }, [query, filter]);

  const openFood = (food) => {
    if (query.trim()) addSearchTerm(query.trim());
    navigation.navigate('MealDetails', { meal: { ...food, id: null, mealType: 'snack' } });
  };

  const clearHistory = () => {
    update({ searchHistory: [] });
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={12}>
          <ArrowLeft size={24} color={theme.text.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text.primary }]}>Поиск</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={[styles.searchBox, { backgroundColor: theme.inputBackground }]}>
          <Search size={18} color={theme.text.tertiary} />
          <Input
            placeholder="Продукты, блюда, рецепты"
            value={query}
            onChangeText={setQuery}
            style={styles.searchInput}
            autoFocus
          />
          {query ? (
            <TouchableOpacity onPress={() => setQuery('')} hitSlop={10} style={styles.clearBtn}>
              <X size={16} color={theme.text.tertiary} />
            </TouchableOpacity>
          ) : null}
        </View>

        <View style={styles.chipsRow}>
          {FILTERS.map((f) => {
            const active = filter === f.id;
            return (
              <TouchableOpacity
                key={f.id}
                onPress={() => setFilter(f.id)}
                style={[
                  styles.chip,
                  { backgroundColor: active ? theme.accent : theme.card, borderColor: active ? theme.accent : theme.divider },
                ]}
              >
                <Text style={[styles.chipText, { color: active ? '#FFFFFF' : theme.text.secondary }]}>{f.name}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* История поиска */}
        {!query && state.searchHistory.length > 0 ? (
          <View style={styles.historyBlock}>
            <View style={styles.rowBetween}>
              <SectionTitle style={styles.historyTitle}>История поиска</SectionTitle>
              <TouchableOpacity onPress={clearHistory} hitSlop={8}>
                <Caption style={{ color: theme.blue }}>Очистить</Caption>
              </TouchableOpacity>
            </View>
            <View style={styles.historyRow}>
              {state.searchHistory.map((term) => (
                <TouchableOpacity
                  key={term}
                  onPress={() => setQuery(term)}
                  style={[styles.historyChip, { backgroundColor: theme.card, borderColor: theme.divider }]}
                >
                  <Clock size={13} color={theme.text.tertiary} />
                  <Text style={[styles.historyText, { color: theme.text.secondary }]}>{term}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : null}

        {/* Результаты */}
        {results.length === 0 ? (
          <EmptyState
            icon={SearchX}
            title="Ничего не найдено"
            text="Попробуйте изменить запрос или выбрать другую категорию"
          />
        ) : (
          results.map((food, idx) => (
            <Card key={`${food.name}_${idx}`} style={styles.foodCard} onPress={() => openFood(food)}>
              <Image source={getFoodImage(food.category)} style={styles.foodImage} />
              <View style={styles.foodInfo}>
                <Text style={[styles.foodName, { color: theme.text.primary }]} numberOfLines={1}>
                  {food.name}
                </Text>
                <Caption>
                  {CATEGORIES.find((c) => c.id === food.category)?.name || ''} · {food.calories} ккал
                </Caption>
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
  content: { padding: 20, paddingTop: 4, paddingBottom: 40, gap: 14 },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    paddingLeft: 14,
  },
  searchInput: { flex: 1 },
  clearBtn: { paddingHorizontal: 12 },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipText: { fontSize: 13, fontWeight: '600' },
  historyBlock: { gap: 10 },
  historyTitle: { fontSize: 16 },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  historyRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  historyChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 1,
  },
  historyText: { fontSize: 13, fontWeight: '500' },
  foodCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12 },
  foodImage: { width: 52, height: 52, borderRadius: 12 },
  foodInfo: { flex: 1, gap: 2 },
  foodName: { fontSize: 15, fontWeight: '600' },
});
