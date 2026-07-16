import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Image } from 'react-native';
import { ArrowLeft, Search, Heart, Clock } from 'lucide-react-native';
import { useApp } from '../store/AppContext';
import { Card, Caption, Input, PrimaryButton } from '../components/UI';
import { FOODS, CATEGORIES, MEAL_TYPES, getFoodImage } from '../data/foodDatabase';

export default function AddMealScreen({ navigation, route }) {
  const { theme, addMeal, state, addSearchTerm, unlockAchievement } = useApp();
  const initialMealType = route.params?.mealType || 'breakfast';
  const date = route.params?.date;

  const [mealType, setMealType] = useState(initialMealType);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState(null);
  const [tab, setTab] = useState('all'); // all | favorites | recent

  const recentMeals = useMemo(() => {
    const all = Object.values(state.days)
      .flatMap((d) => d.meals)
      .sort((a, b) => (b.addedAt || 0) - (a.addedAt || 0));
    const seen = new Set();
    return all.filter((m) => {
      if (seen.has(m.name)) return false;
      seen.add(m.name);
      return true;
    }).slice(0, 10);
  }, [state.days]);

  const list = useMemo(() => {
    let items = tab === 'favorites' ? state.favorites : tab === 'recent' ? recentMeals : FOODS;
    if (category && tab === 'all') items = items.filter((f) => f.category === category);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      items = items.filter((f) => f.name.toLowerCase().includes(q));
    }
    return items;
  }, [tab, category, query, state.favorites, recentMeals]);

  const handleAdd = (food) => {
    if (query.trim()) addSearchTerm(query.trim());
    addMeal(
      {
        name: food.name,
        calories: food.calories,
        protein: food.protein,
        fat: food.fat,
        carbs: food.carbs,
        weight: food.weight,
        portion: food.portion,
        ingredients: food.ingredients || [],
        category: food.category,
        mealType,
      },
      date
    );
    unlockAchievement('first_meal');
    navigation.goBack();
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={12}>
          <ArrowLeft size={24} color={theme.text.primary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text.primary }]}>Добавить блюдо</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {/* Тип приёма пищи */}
        <View style={styles.chipsRow}>
          {MEAL_TYPES.map((mt) => {
            const active = mealType === mt.id;
            return (
              <TouchableOpacity
                key={mt.id}
                onPress={() => setMealType(mt.id)}
                style={[styles.chip, { backgroundColor: active ? theme.accent : theme.card, borderColor: active ? theme.accent : theme.divider }]}
              >
                <Text style={[styles.chipText, { color: active ? '#FFFFFF' : theme.text.secondary }]}>{mt.name}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Поиск */}
        <View style={[styles.searchBox, { backgroundColor: theme.inputBackground }]}>
          <Search size={18} color={theme.text.tertiary} />
          <Input
            placeholder="Поиск блюда или продукта"
            value={query}
            onChangeText={setQuery}
            style={styles.searchInput}
          />
        </View>

        {/* История поиска */}
        {!query && state.searchHistory.length > 0 ? (
          <View style={styles.historyRow}>
            {state.searchHistory.slice(0, 6).map((term) => (
              <TouchableOpacity
                key={term}
                onPress={() => setQuery(term)}
                style={[styles.historyChip, { backgroundColor: theme.card, borderColor: theme.divider }]}
              >
                <Clock size={13} color={theme.text.tertiary} />
                <Text style={[styles.chipText, { color: theme.text.secondary }]}>{term}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : null}

        {/* Вкладки */}
        <View style={styles.chipsRow}>
          {[
            { id: 'all', name: 'Все', icon: null },
            { id: 'favorites', name: 'Избранное', icon: Heart },
            { id: 'recent', name: 'Недавние', icon: Clock },
          ].map((t) => {
            const active = tab === t.id;
            const Icon = t.icon;
            return (
              <TouchableOpacity
                key={t.id}
                onPress={() => setTab(t.id)}
                style={[styles.chip, styles.tabChip, { backgroundColor: active ? theme.blueSoft : 'transparent' }]}
              >
                {Icon ? <Icon size={14} color={active ? theme.blue : theme.text.secondary} /> : null}
                <Text style={[styles.chipText, { color: active ? theme.blue : theme.text.secondary }]}>{t.name}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Категории */}
        {tab === 'all' ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesRow}>
            <TouchableOpacity
              onPress={() => setCategory(null)}
              style={[styles.catChip, { backgroundColor: !category ? theme.accentSoft : theme.card, borderColor: theme.divider }]}
            >
              <Text style={[styles.chipText, { color: !category ? theme.accent : theme.text.secondary }]}>Все</Text>
            </TouchableOpacity>
            {CATEGORIES.map((c) => {
              const active = category === c.id;
              return (
                <TouchableOpacity
                  key={c.id}
                  onPress={() => setCategory(active ? null : c.id)}
                  style={[styles.catChip, { backgroundColor: active ? theme.accentSoft : theme.card, borderColor: theme.divider }]}
                >
                  <Text style={[styles.chipText, { color: active ? theme.accent : theme.text.secondary }]}>{c.name}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        ) : null}

        {/* Результаты */}
        {list.length === 0 ? (
          <Card style={styles.noResults}>
            <Caption>Ничего не найдено. Попробуйте изменить запрос.</Caption>
          </Card>
        ) : (
          list.map((food, idx) => (
            <Card key={`${food.name}_${idx}`} style={styles.foodCard} onPress={() => handleAdd(food)}>
              <View style={styles.rowBetween}>
                <Image source={getFoodImage(food.category)} style={styles.foodThumb} />
                <View style={styles.foodInfo}>
                  <Text style={[styles.foodName, { color: theme.text.primary }]} numberOfLines={1}>
                    {food.name}
                  </Text>
                  <Caption>
                    {food.portion || ''}{food.weight ? ` · ${food.weight} г` : ''} · Б {Math.round(food.protein || 0)} · Ж {Math.round(food.fat || 0)} · У {Math.round(food.carbs || 0)}
                  </Caption>
                </View>
                <View style={styles.kcalBadgeWrap}>
                  <Text style={[styles.kcalValue, { color: theme.text.primary }]}>{food.calories}</Text>
                  <Caption>ккал</Caption>
                </View>
              </View>
            </Card>
          ))
        )}

        <PrimaryButton
          title="Создать своё блюдо"
          onPress={() => navigation.navigate('CreateMeal', { mealType, date })}
        />
        <PrimaryButton
          title="Открыть сканер еды"
          variant="secondary"
          onPress={() => navigation.navigate('Main', { screen: 'ScannerTab' })}
        />
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
  title: { fontSize: 17, fontWeight: '700' },
  content: { padding: 20, paddingTop: 4, paddingBottom: 40, gap: 14 },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  tabChip: { flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 0 },
  chipText: { fontSize: 13, fontWeight: '600' },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    paddingLeft: 14,
  },
  searchInput: { flex: 1 },
  categoriesRow: { gap: 8 },
  catChip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 1,
  },
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
  noResults: { alignItems: 'center', paddingVertical: 24 },
  foodCard: { paddingVertical: 14 },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  foodThumb: { width: 44, height: 44, borderRadius: 12, marginRight: 12 },
  foodInfo: { flex: 1, gap: 2, marginRight: 12 },
  foodName: { fontSize: 15, fontWeight: '600' },
  kcalBadgeWrap: { alignItems: 'center' },
  kcalValue: { fontSize: 16, fontWeight: '700' },
});
