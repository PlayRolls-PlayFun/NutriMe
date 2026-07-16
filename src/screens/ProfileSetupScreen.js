import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { PrimaryButton, Input, ProgressBar } from '../components/UI';
import { Entrance } from '../components/Entrance';
import { useApp } from '../store/AppContext';
import { radius } from '../theme/colors';

const STEPS = [
  { key: 'gender', title: 'Ваш пол', subtitle: 'Нужен для точного расчёта нормы калорий', type: 'options', options: [
    { value: 'male', label: 'Мужской' },
    { value: 'female', label: 'Женский' },
  ]},
  { key: 'age', title: 'Ваш возраст', subtitle: 'Полных лет', type: 'number', placeholder: '25', unit: 'лет', min: 10, max: 100 },
  { key: 'height', title: 'Ваш рост', subtitle: 'В сантиметрах', type: 'number', placeholder: '175', unit: 'см', min: 100, max: 250 },
  { key: 'weight', title: 'Текущий вес', subtitle: 'В килограммах', type: 'number', placeholder: '82', unit: 'кг', min: 30, max: 300 },
  { key: 'goalWeight', title: 'Целевой вес', subtitle: 'К какому весу вы стремитесь', type: 'number', placeholder: '75', unit: 'кг', min: 30, max: 300 },
  { key: 'activityLevel', title: 'Уровень активности', subtitle: 'Как часто вы двигаетесь в течение дня', type: 'options', options: [
    { value: 'low', label: 'Низкий', hint: 'Сидячая работа, мало движения' },
    { value: 'medium', label: 'Средний', hint: 'Прогулки, лёгкие тренировки 1–3 раза в неделю' },
    { value: 'high', label: 'Высокий', hint: 'Тренировки 3–5 раз в неделю' },
    { value: 'athlete', label: 'Очень высокий', hint: 'Ежедневные интенсивные тренировки' },
  ]},
  { key: 'goal', title: 'Ваша цель', subtitle: 'Что вы хотите достичь', type: 'options', options: [
    { value: 'lose', label: 'Похудение', hint: 'Снижение веса с дефицитом калорий' },
    { value: 'maintain', label: 'Поддержание', hint: 'Сохранение текущего веса' },
    { value: 'gain', label: 'Набор массы', hint: 'Увеличение веса с профицитом калорий' },
  ]},
  { key: 'pace', title: 'Скорость достижения цели', subtitle: 'Комфортный для вас темп', type: 'options', options: [
    { value: 'slow', label: 'Плавно', hint: '~0.25 кг в неделю' },
    { value: 'normal', label: 'Умеренно', hint: '~0.5 кг в неделю' },
    { value: 'fast', label: 'Быстро', hint: '~1 кг в неделю' },
  ]},
];

export default function ProfileSetupScreen({ navigation }) {
  const { theme, update } = useApp();
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [numberValue, setNumberValue] = useState('');

  const step = STEPS[stepIndex];
  const progress = (stepIndex + 1) / STEPS.length;

  const currentValid =
    step.type === 'options'
      ? !!answers[step.key]
      : (() => {
          const n = parseFloat(numberValue);
          return !isNaN(n) && n >= step.min && n <= step.max;
        })();

  const next = () => {
    let newAnswers = answers;
    if (step.type === 'number') {
      newAnswers = { ...answers, [step.key]: parseFloat(numberValue) };
      setAnswers(newAnswers);
    }
    if (stepIndex < STEPS.length - 1) {
      setStepIndex(stepIndex + 1);
      const nextStep = STEPS[stepIndex + 1];
      setNumberValue(newAnswers[nextStep.key] ? String(newAnswers[nextStep.key]) : '');
    } else {
      update((prev) => ({
        user: {
          ...prev.user,
          ...newAnswers,
          startWeight: newAnswers.weight,
        },
        weightHistory: [{ date: new Date().toISOString().slice(0, 10), weight: newAnswers.weight }],
      }));
      navigation.replace('Main');
    }
  };

  const back = () => {
    if (stepIndex > 0) {
      setStepIndex(stepIndex - 1);
      const prevStep = STEPS[stepIndex - 1];
      setNumberValue(answers[prevStep.key] ? String(answers[prevStep.key]) : '');
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.replace('Auth');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={back} hitSlop={12}>
          <ArrowLeft size={24} color={theme.text.primary} />
        </TouchableOpacity>
        <Text style={[styles.stepCount, { color: theme.text.secondary }]}>
          {stepIndex + 1} из {STEPS.length}
        </Text>
      </View>
      <View style={styles.progressWrap}>
        <ProgressBar progress={progress} height={6} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Entrance key={`title-${stepIndex}`} index={0}>
        <Text style={[styles.title, { color: theme.text.primary }]}>{step.title}</Text>
        <Text style={[styles.subtitle, { color: theme.text.secondary }]}>{step.subtitle}</Text>
        </Entrance>

        {step.type === 'options' ? (
          <Entrance key={`opts-${stepIndex}`} index={1}>
          <View style={styles.options}>
            {step.options.map((opt) => {
              const selected = answers[step.key] === opt.value;
              return (
                <TouchableOpacity
                  key={opt.value}
                  style={[
                    styles.option,
                    {
                      backgroundColor: selected ? theme.accentSoft : theme.card,
                      borderColor: selected ? theme.accent : theme.divider,
                    },
                  ]}
                  onPress={() => setAnswers({ ...answers, [step.key]: opt.value })}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.optionLabel,
                      { color: selected ? theme.accent : theme.text.primary },
                    ]}
                  >
                    {opt.label}
                  </Text>
                  {opt.hint ? (
                    <Text style={[styles.optionHint, { color: theme.text.secondary }]}>
                      {opt.hint}
                    </Text>
                  ) : null}
                </TouchableOpacity>
              );
            })}
          </View>
          </Entrance>
        ) : (
          <Entrance key={`num-${stepIndex}`} index={1}>
          <View style={styles.numberWrap}>
            <Input
              placeholder={step.placeholder}
              value={numberValue}
              onChangeText={setNumberValue}
              keyboardType="numeric"
              style={{ flex: 1 }}
            />
            <Text style={[styles.unit, { color: theme.text.secondary }]}>{step.unit}</Text>
          </View>
          </Entrance>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton
          title={stepIndex === STEPS.length - 1 ? 'Завершить' : 'Далее'}
          onPress={next}
          disabled={!currentValid}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  stepCount: {
    fontSize: 15,
    fontWeight: '600',
  },
  progressWrap: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  scroll: {
    padding: 24,
    gap: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.6,
    marginTop: 12,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 20,
  },
  options: {
    gap: 12,
  },
  option: {
    borderRadius: radius.md,
    borderWidth: 1.5,
    padding: 18,
    gap: 4,
  },
  optionLabel: {
    fontSize: 17,
    fontWeight: '600',
  },
  optionHint: {
    fontSize: 13,
    lineHeight: 18,
  },
  numberWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
  },
  unit: {
    fontSize: 17,
    fontWeight: '600',
  },
  footer: {
    padding: 24,
  },
});
