import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useApp } from '../store/AppContext';
import { Card, Caption, PrimaryButton, Input } from '../components/UI';
import { MEAL_TYPES } from '../data/foodDatabase';

export default function CreateMealScreen({ navigation, route }) {
  const { theme, addMeal, unlockAchievement } = useApp();
  const initialMealType = route.params?.mealType || 'snack';
  const date = route.params?.date;

  const prefill = route.params?.prefill || {};

  const [mealType, setMealType] = useState(initialMealType);
  const [name, setName] = useState(prefill.name || '');
  const [calories, setCalories] = useState(prefill.calories ? String(prefill.calories) : '');
  const [protein, setProtein] = useState(prefill.protein ? String(prefill.protein) : '');
  const [fat, setFat] = useState(prefill.fat ? String(prefill.fat) : '');
  const [carbs, setCarbs] = useState(prefill.carbs ? String(prefill.carbs) : '');
  const [weight, setWeight] = useState(prefill.weight ? String(prefill.weight) : '');

  const num = (v) => parseFloat(String(v).replace(',', '.')) || 0;
  const valid = name.trim().length > 0 && num(calories) > 0;

  const handleSave = () => {
    if (!valid) return;
    addMeal(
      {
        name: name.trim(),
        calories: Math.round(num(calories)),
        protein: num(protein),
        fat: num(fat),
        carbs: num(carbs),
        weight: num(weight) || null,
        portion: '1 порция',
        ingredients: [],
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
        <Text style={[styles.title, { color: theme.text.primary }]}>
          {prefill.name ? 'Корректировка' : 'Создать блюдо'}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <Caption>Укажите название и пищевую ценность на порцию</Caption>

          <View style={styles.chipsRow}>
            {MEAL_TYPES.map((mt) => {
              const active = mealType === mt.id;
              return (
                <TouchableOpacity
                  key={mt.id}
                  onPress={() => setMealType(mt.id)}
                  style={[
                    styles.chip,
                    { backgroundColor: active ? theme.accent : theme.card, borderColor: active ? theme.accent : theme.divider },
                  ]}
                >
                  <Text style={[styles.chipText, { color: active ? '#FFFFFF' : theme.text.secondary }]}>{mt.name}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Card style={styles.formCard}>
            <Input label="Название" placeholder="Например, домашний плов" value={name} onChangeText={setName} />
            <View style={styles.row2}>
              <Input
                label="Калории, ккал"
                placeholder="350"
                value={calories}
                onChangeText={setCalories}
                keyboardType="numeric"
                style={styles.half}
              />
              <Input
                label="Вес, г"
                placeholder="250"
                value={weight}
                onChangeText={setWeight}
                keyboardType="numeric"
                style={styles.half}
              />
            </View>
            <View style={styles.row3}>
              <Input
                label="Белки, г"
                placeholder="20"
                value={protein}
                onChangeText={setProtein}
                keyboardType="numeric"
                style={styles.third}
              />
              <Input
                label="Жиры, г"
                placeholder="12"
                value={fat}
                onChangeText={setFat}
                keyboardType="numeric"
                style={styles.third}
              />
              <Input
                label="Углеводы, г"
                placeholder="40"
                value={carbs}
                onChangeText={setCarbs}
                keyboardType="numeric"
                style={styles.third}
              />
            </View>
          </Card>

          <PrimaryButton title="Добавить в дневник" onPress={handleSave} disabled={!valid} />
        </ScrollView>
      </KeyboardAvoidingView>
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
  content: { padding: 20, paddingTop: 4, paddingBottom: 40, gap: 16 },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipText: { fontSize: 13, fontWeight: '600' },
  formCard: { gap: 14 },
  row2: { flexDirection: 'row', gap: 12 },
  half: { flex: 1 },
  row3: { flexDirection: 'row', gap: 10 },
  third: { flex: 1 },
});
