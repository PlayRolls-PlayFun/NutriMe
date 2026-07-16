import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Alert, Platform, Image } from 'react-native';
import { ArrowLeft, Heart, Trash2, Minus, Plus } from 'lucide-react-native';
import { useApp } from '../store/AppContext';
import { Card, Caption, SectionTitle, PrimaryButton, ProgressRing } from '../components/UI';
import { MEAL_TYPES, getFoodImage } from '../data/foodDatabase';

export default function MealDetailsScreen({ navigation, route }) {
  const { theme, state, removeMeal, editMeal, toggleFavorite } = useApp();
  const meal = route.params?.meal;
  const date = route.params?.date;

  const [multiplier, setMultiplier] = useState(1);

  if (!meal) {
    return null;
  }

  const isFavorite = state.favorites.some((f) => f.name === meal.name);
  const mtName = MEAL_TYPES.find((m) => m.id === meal.mealType)?.name || 'Приём пищи';

  const scaled = (v) => Math.round((v || 0) * multiplier * 10) / 10;
  const totalMacros = (meal.protein || 0) + (meal.fat || 0) + (meal.carbs || 0) || 1;

  const applyPortion = () => {
    if (multiplier !== 1 && meal.id) {
      editMeal(
        meal.id,
        {
          calories: scaled(meal.calories),
          protein: scaled(meal.protein),
          fat: scaled(meal.fat),
          carbs: scaled(meal.carbs),
          weight: meal.weight ? Math.round(meal.weight * multiplier) : meal.weight,
        },
        date
      );
    }
    navigation.goBack();
  };

  const confirmDelete = () => {
    const doDelete = () => {
      removeMeal(meal.id, date);
      navigation.goBack();
    };
    if (Platform.OS === 'web') {
      doDelete();
    } else {
      Alert.alert('Удалить блюдо?', 'Оно будет удалено из дневника.', [
        { text: 'Отмена', style: 'cancel' },
        { text: 'Удалить', style: 'destructive', onPress: doDelete },
      ]);
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={12}>
          <ArrowLeft size={24} color={theme.text.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text.primary }]}>{mtName}</Text>
        <TouchableOpacity onPress={() => toggleFavorite(meal)} hitSlop={12}>
          <Heart size={22} color={isFavorite ? theme.red : theme.text.tertiary} fill={isFavorite ? theme.red : 'none'} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Image
          source={getFoodImage(meal.category)}
          style={styles.photo}
          accessibilityLabel={meal.name}
        />
        <Text style={[styles.name, { color: theme.text.primary }]}>{meal.name}</Text>
        <Caption>
          {meal.portion || ''}{meal.weight ? ` · ${Math.round(meal.weight * multiplier)} г` : ''}
        </Caption>

        {/* Калорийность */}
        <Card style={styles.kcalCard}>
          <ProgressRing size={130} strokeWidth={9} progress={1} color={theme.accent}>
            <View style={styles.ringCenter}>
              <Text style={[styles.kcalValue, { color: theme.text.primary }]}>{Math.round(scaled(meal.calories))}</Text>
              <Caption>ккал</Caption>
            </View>
          </ProgressRing>
          <View style={styles.macros}>
            {[
              { label: 'Белки', value: scaled(meal.protein), color: theme.blue },
              { label: 'Жиры', value: scaled(meal.fat), color: theme.orange },
              { label: 'Углеводы', value: scaled(meal.carbs), color: theme.accent },
            ].map((m) => (
              <View key={m.label} style={styles.macroRow}>
                <View style={[styles.macroDot, { backgroundColor: m.color }]} />
                <Text style={[styles.macroLabel, { color: theme.text.secondary }]}>{m.label}</Text>
                <Text style={[styles.macroValue, { color: theme.text.primary }]}>{m.value} г</Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Размер порции */}
        <Card style={styles.portionCard}>
          <SectionTitle style={styles.blockTitle}>Размер порции</SectionTitle>
          <View style={styles.portionRow}>
            <TouchableOpacity
              onPress={() => setMultiplier((m) => Math.max(0.5, Math.round((m - 0.5) * 10) / 10))}
              style={[styles.portionBtn, { backgroundColor: theme.inputBackground }]}
            >
              <Minus size={20} color={theme.text.primary} />
            </TouchableOpacity>
            <Text style={[styles.portionValue, { color: theme.text.primary }]}>x{multiplier}</Text>
            <TouchableOpacity
              onPress={() => setMultiplier((m) => Math.min(5, Math.round((m + 0.5) * 10) / 10))}
              style={[styles.portionBtn, { backgroundColor: theme.inputBackground }]}
            >
              <Plus size={20} color={theme.text.primary} />
            </TouchableOpacity>
          </View>
        </Card>

        {/* Состав */}
        {meal.ingredients && meal.ingredients.length > 0 ? (
          <Card style={styles.ingredientsCard}>
            <SectionTitle style={styles.blockTitle}>Состав</SectionTitle>
            {meal.ingredients.map((ing, i) => (
              <View key={i} style={[styles.ingredientRow, i > 0 && { borderTopWidth: 1, borderTopColor: theme.divider }]}>
                <Text style={[styles.ingredientText, { color: theme.text.primary }]}>{ing}</Text>
              </View>
            ))}
          </Card>
        ) : null}

        {meal.id ? (
          <>
            <PrimaryButton title={multiplier !== 1 ? 'Сохранить порцию' : 'Готово'} onPress={applyPortion} />
            <TouchableOpacity onPress={confirmDelete} style={styles.deleteBtn}>
              <Trash2 size={18} color={theme.red} />
              <Text style={[styles.deleteText, { color: theme.red }]}>Удалить из дневника</Text>
            </TouchableOpacity>
          </>
        ) : null}
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
  headerTitle: { fontSize: 15, fontWeight: '600' },
  content: { padding: 20, paddingTop: 8, paddingBottom: 40, gap: 16 },
  photo: { width: '100%', height: 200, borderRadius: 20 },
  name: { fontSize: 26, fontWeight: '800', letterSpacing: -0.6 },
  kcalCard: { flexDirection: 'row', alignItems: 'center', gap: 24 },
  ringCenter: { alignItems: 'center' },
  kcalValue: { fontSize: 28, fontWeight: '800' },
  macros: { flex: 1, gap: 12 },
  macroRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  macroDot: { width: 9, height: 9, borderRadius: 5 },
  macroLabel: { fontSize: 14, flex: 1 },
  macroValue: { fontSize: 15, fontWeight: '700' },
  portionCard: { gap: 14 },
  blockTitle: { fontSize: 17 },
  portionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  portionBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  portionValue: { fontSize: 22, fontWeight: '800' },
  ingredientsCard: { gap: 0 },
  ingredientRow: { paddingVertical: 12 },
  ingredientText: { fontSize: 15 },
  deleteBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 12 },
  deleteText: { fontSize: 15, fontWeight: '600' },
});
