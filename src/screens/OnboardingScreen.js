import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Leaf, Flame, TrendingDown, Camera, Rocket } from 'lucide-react-native';
import { PrimaryButton } from '../components/UI';
import { Entrance } from '../components/Entrance';
import { useApp } from '../store/AppContext';

const SLIDES = [
  {
    icon: Leaf,
    title: 'Добро пожаловать в NutriMe',
    text: 'Умный помощник для контроля питания, воды и активности. Всё для достижения вашей цели — в одном приложении.',
  },
  {
    icon: Flame,
    title: 'Подсчёт калорий и контроль питания',
    text: 'Ведите дневник питания, отслеживайте калории, белки, жиры и углеводы каждого приёма пищи.',
  },
  {
    icon: TrendingDown,
    title: 'Прогресс похудения и аналитика',
    text: 'Наглядные графики веса, калорий и воды помогут видеть результат и не сходить с пути.',
  },
  {
    icon: Camera,
    title: 'Сканирование еды',
    text: 'Наведите камеру на блюдо — NutriMe определит его и посчитает калории автоматически.',
  },
  {
    icon: Rocket,
    title: 'Начнём?',
    text: 'Создайте аккаунт, заполните короткую анкету и получите персональный план питания.',
  },
];

export default function OnboardingScreen({ navigation }) {
  const { theme, update } = useApp();
  const [index, setIndex] = useState(0);
  const { width } = useWindowDimensions();
  const slide = SLIDES[index];
  const Icon = slide.icon;
  const last = index === SLIDES.length - 1;

  const finish = () => {
    update({ onboardingDone: true });
    navigation.replace('Auth');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.skipRow}>
        {!last ? (
          <TouchableOpacity onPress={finish} hitSlop={12}>
            <Text style={[styles.skip, { color: theme.text.secondary }]}>Пропустить</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ height: 20 }} />
        )}
      </View>

      <View style={styles.content}>
        <Entrance key={`icon-${index}`} index={0}>
          <View style={[styles.iconCircle, { backgroundColor: theme.accentSoft }]}>
            <Icon size={64} color={theme.accent} strokeWidth={1.8} />
          </View>
        </Entrance>
        <Entrance key={`title-${index}`} index={1}>
          <Text style={[styles.title, { color: theme.text.primary, maxWidth: width - 64 }]}>
            {slide.title}
          </Text>
        </Entrance>
        <Entrance key={`text-${index}`} index={2}>
          <Text style={[styles.text, { color: theme.text.secondary, maxWidth: width - 64 }]}>
            {slide.text}
          </Text>
        </Entrance>
      </View>

      <Entrance index={3} style={styles.footer}>
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                {
                  backgroundColor: i === index ? theme.accent : theme.divider,
                  width: i === index ? 24 : 8,
                },
              ]}
            />
          ))}
        </View>
        <PrimaryButton
          title={last ? 'Начать пользоваться' : 'Далее'}
          onPress={() => (last ? finish() : setIndex(index + 1))}
        />
      </Entrance>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skipRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  skip: {
    fontSize: 16,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    paddingHorizontal: 32,
  },
  iconCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: -0.6,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 24,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
});
