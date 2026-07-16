import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Bell,
  Camera,
  Plus,
  Droplets,
  Footprints,
  Flame,
  Timer,
  Trophy,
  Lightbulb,
  ChevronRight,
  UtensilsCrossed,
  Search,
} from 'lucide-react-native';
import { Card, SectionTitle, Caption, ProgressBar, ProgressRing } from '../components/UI';
import { Entrance } from '../components/Entrance';
import { useApp } from '../store/AppContext';
import { TIPS, ACHIEVEMENTS, MEAL_TYPES } from '../data/foodDatabase';
import { radius } from '../theme/colors';

function greeting() {
  const h = new Date().getHours();
  if (h < 5) return 'Доброй ночи';
  if (h < 12) return 'Доброе утро';
  if (h < 18) return 'Добрый день';
  return 'Добрый вечер';
}

export default function HomeScreen({ navigation }) {
  const { theme, state, getDay, calorieGoal, waterGoal } = useApp();
  const day = getDay();

  const caloriesEaten = day.meals.reduce((s, m) => s + (m.calories || 0), 0);
  const steps = day.steps || 0;
  const burned = day.activities.reduce((s, a) => s + (a.calories || 0), 0);
  const activeMinutes = day.activities.reduce((s, a) => s + (a.minutes || 0), 0);

  const { weight, goalWeight, startWeight } = state.user;
  const weightProgress = useMemo(() => {
    if (!weight || !goalWeight || !startWeight || startWeight === goalWeight) return 0;
    return Math.min(1, Math.max(0, (startWeight - weight) / (startWeight - goalWeight)));
  }, [weight, goalWeight, startWeight]);

  const tip = TIPS[new Date().getDate() % TIPS.length];
  const lastAchievement = state.achievementsUnlocked.length
    ? ACHIEVEMENTS.find((a) => a.id === state.achievementsUnlocked[state.achievementsUnlocked.length - 1])
    : null;

  const recentMeals = [...day.meals].sort((a, b) => b.addedAt - a.addedAt).slice(0, 3);
  const unread = state.notifications.filter((n) => !n.read).length;

  const goToTab = (tab, screen, params) => {
    if (screen) {
      navigation.navigate(tab, { screen, params });
    } else {
      navigation.navigate(tab);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Приветствие */}
        <Entrance index={0}>
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.largeTitle, { color: theme.text.primary }]}>
              {greeting()}{state.user.name ? `, ${state.user.name}` : ''}
            </Text>
            <Text style={[styles.subtitle, { color: theme.text.secondary }]}>
              Сегодня вы на шаг ближе к цели
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.bellButton, { backgroundColor: theme.card, borderColor: theme.divider }]}
            onPress={() => navigation.navigate('Notifications')}
          >
            <Bell size={22} color={theme.text.primary} />
            {unread > 0 ? <View style={[styles.badge, { backgroundColor: theme.red }]} /> : null}
          </TouchableOpacity>
        </View>
        </Entrance>

        {/* Прогресс похудения */}
        <Entrance index={1}>
        <Card onPress={() => goToTab('ProgressTab')}>
          <Caption style={styles.cardLabel}>ПРОГРЕСС</Caption>
          <View style={styles.progressRow}>
            <View style={{ flex: 1, gap: 6 }}>
              <View style={styles.weightRow}>
                <Text style={[styles.bigNumber, { color: theme.text.primary }]}>
                  {weight || '—'}
                </Text>
                <Text style={[styles.unitText, { color: theme.text.secondary }]}>кг</Text>
              </View>
              <Text style={{ color: theme.text.secondary, fontSize: 14 }}>
                Цель: {goalWeight || '—'} кг
              </Text>
              {weight && goalWeight && weight > goalWeight ? (
                <Text style={{ color: theme.accent, fontSize: 14, fontWeight: '600' }}>
                  Осталось {(weight - goalWeight).toFixed(1)} кг
                </Text>
              ) : null}
            </View>
            <ProgressRing size={96} progress={weightProgress}>
              <Text style={[styles.ringText, { color: theme.text.primary }]}>
                {Math.round(weightProgress * 100)}%
              </Text>
            </ProgressRing>
          </View>
        </Card>
        </Entrance>

        {/* Калории */}
        <Entrance index={2}>
        <Card onPress={() => goToTab('NutritionTab')}>
          <View style={styles.rowBetween}>
            <SectionTitle>Калории</SectionTitle>
            <ChevronRight size={20} color={theme.text.tertiary} />
          </View>
          <View style={styles.caloriesRow}>
            <Text style={[styles.bigNumber, { color: theme.text.primary }]}>{caloriesEaten}</Text>
            <Text style={[styles.unitText, { color: theme.text.secondary }]}>
              из {calorieGoal} ккал
            </Text>
          </View>
          <ProgressBar progress={caloriesEaten / calorieGoal} />
        </Card>
        </Entrance>

        {/* Вода */}
        <Entrance index={3}>
        <Card onPress={() => navigation.navigate('Hydration')}>
          <View style={styles.rowBetween}>
            <SectionTitle>Гидратация</SectionTitle>
            <ChevronRight size={20} color={theme.text.tertiary} />
          </View>
          <View style={styles.caloriesRow}>
            <Droplets size={26} color={theme.blue} />
            <Text style={[styles.bigNumber, { color: theme.text.primary }]}>
              {(day.water / 1000).toFixed(1)}
            </Text>
            <Text style={[styles.unitText, { color: theme.text.secondary }]}>
              л из {(waterGoal / 1000).toFixed(1)} л
            </Text>
          </View>
          <ProgressBar progress={day.water / waterGoal} color={theme.blue} />
        </Card>
        </Entrance>

        {/* Активность */}
        <Entrance index={4}>
        <View style={styles.section}>
          <TouchableOpacity style={styles.rowBetween} onPress={() => navigation.navigate('Activity')}>
            <SectionTitle>Активность</SectionTitle>
            <ChevronRight size={20} color={theme.text.tertiary} />
          </TouchableOpacity>
          <View style={styles.activityGrid}>
            <Card style={styles.activityCard} onPress={() => navigation.navigate('Activity')}>
              <Footprints size={22} color={theme.accent} />
              <Caption>Шаги</Caption>
              <Text style={[styles.activityValue, { color: theme.text.primary }]}>
                {steps.toLocaleString('ru-RU')}
              </Text>
            </Card>
            <Card style={styles.activityCard} onPress={() => navigation.navigate('Activity')}>
              <Flame size={22} color={theme.orange} />
              <Caption>Сожжено</Caption>
              <Text style={[styles.activityValue, { color: theme.text.primary }]}>{burned} ккал</Text>
            </Card>
            <Card style={styles.activityCard} onPress={() => navigation.navigate('Activity')}>
              <Timer size={22} color={theme.blue} />
              <Caption>Минуты</Caption>
              <Text style={[styles.activityValue, { color: theme.text.primary }]}>{activeMinutes} мин</Text>
            </Card>
          </View>
        </View>
        </Entrance>

        {/* Быстрые действия */}
        <Entrance index={5}>
        <View style={styles.section}>
          <SectionTitle>Быстрые действия</SectionTitle>
          <View style={styles.actionsGrid}>
            <ActionButton
              icon={Camera}
              label="Сканировать еду"
              onPress={() => goToTab('ScannerTab')}
              theme={theme}
            />
            <ActionButton
              icon={Plus}
              label="Добавить блюдо"
              onPress={() => navigation.navigate('AddMeal', { mealType: 'snack' })}
              theme={theme}
            />
            <ActionButton
              icon={Droplets}
              label="Добавить воду"
              onPress={() => navigation.navigate('Hydration')}
              theme={theme}
            />
            <ActionButton
              icon={Footprints}
              label="Добавить активность"
              onPress={() => navigation.navigate('Activity')}
              theme={theme}
            />
            <ActionButton
              icon={Search}
              label="Поиск продуктов"
              onPress={() => navigation.navigate('Search')}
              theme={theme}
            />
          </View>
        </View>
        </Entrance>

        {/* Последние приёмы пищи */}
        <Entrance index={6}>
        <View style={styles.section}>
          <TouchableOpacity style={styles.rowBetween} onPress={() => goToTab('NutritionTab')}>
            <SectionTitle>Последние приёмы пищи</SectionTitle>
            <ChevronRight size={20} color={theme.text.tertiary} />
          </TouchableOpacity>
          {recentMeals.length === 0 ? (
            <Card style={styles.emptyMeals}>
              <UtensilsCrossed size={28} color={theme.text.tertiary} />
              <Text style={{ color: theme.text.secondary, fontSize: 14, textAlign: 'center' }}>
                Пока нет блюд. Добавьте первый приём пищи.
              </Text>
            </Card>
          ) : (
            <View style={{ gap: 10 }}>
              {recentMeals.map((meal) => (
                <Card
                  key={meal.id}
                  style={styles.mealRow}
                  onPress={() => navigation.navigate('MealDetails', { meal })}
                >
                  <View style={[styles.mealIcon, { backgroundColor: theme.accentSoft }]}>
                    <UtensilsCrossed size={18} color={theme.accent} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.mealName, { color: theme.text.primary }]} numberOfLines={1}>
                      {meal.name}
                    </Text>
                    <Caption>
                      {MEAL_TYPES.find((t) => t.id === meal.mealType)?.name || 'Приём пищи'}
                    </Caption>
                  </View>
                  <Text style={[styles.mealCalories, { color: theme.text.primary }]}>
                    {meal.calories} ккал
                  </Text>
                </Card>
              ))}
            </View>
          )}
        </View>
        </Entrance>

        {/* Сканер еды */}
        <Entrance index={7}>
        <Card style={styles.scannerCard} onPress={() => goToTab('ScannerTab')}>
          <View style={[styles.scannerIcon, { backgroundColor: theme.accentSoft }]}>
            <Camera size={28} color={theme.accent} />
          </View>
          <SectionTitle style={{ textAlign: 'center' }}>Сканируйте еду</SectionTitle>
          <Caption style={{ textAlign: 'center' }}>
            Наведите камеру на блюдо — мы посчитаем калории
          </Caption>
        </Card>
        </Entrance>

        {/* Последние достижения */}
        <Entrance index={8}>
        <Card style={styles.tipCard} onPress={() => navigation.navigate('Achievements')}>
          <View style={[styles.tipIcon, { backgroundColor: theme.orangeSoft }]}>
            <Trophy size={22} color={theme.orange} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.tipTitle, { color: theme.text.primary }]}>
              {lastAchievement ? lastAchievement.title : 'Достижения'}
            </Text>
            <Caption>
              {lastAchievement
                ? lastAchievement.description
                : `Открыто ${state.achievementsUnlocked.length} из ${ACHIEVEMENTS.length}`}
            </Caption>
          </View>
          <ChevronRight size={20} color={theme.text.tertiary} />
        </Card>
        </Entrance>

        {/* Совет дня */}
        <Entrance index={9}>
        <Card style={styles.tipCard}>
          <View style={[styles.tipIcon, { backgroundColor: theme.blueSoft }]}>
            <Lightbulb size={22} color={theme.blue} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.tipTitle, { color: theme.text.primary }]}>Совет дня</Text>
            <Caption style={{ lineHeight: 18 }}>{tip}</Caption>
          </View>
        </Card>
        </Entrance>
      </ScrollView>
    </SafeAreaView>
  );
}

function ActionButton({ icon: Icon, label, onPress, theme }) {
  return (
    <TouchableOpacity
      style={[styles.actionButton, { backgroundColor: theme.card, borderColor: theme.divider }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.actionIcon, { backgroundColor: theme.accentSoft }]}>
        <Icon size={22} color={theme.accent} />
      </View>
      <Text style={[styles.actionText, { color: theme.text.primary }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    padding: 20,
    paddingBottom: 120,
    gap: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  largeTitle: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.8,
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  bellButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: 10,
    right: 11,
    width: 9,
    height: 9,
    borderRadius: 5,
  },
  cardLabel: {
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    fontWeight: '600',
    marginBottom: 10,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  weightRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6,
  },
  bigNumber: {
    fontSize: 40,
    fontWeight: '800',
    letterSpacing: -1,
  },
  unitText: {
    fontSize: 16,
    marginBottom: 7,
  },
  ringText: {
    fontSize: 18,
    fontWeight: '700',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  caloriesRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    marginBottom: 14,
  },
  section: {
    gap: 12,
  },
  activityGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  activityCard: {
    flex: 1,
    padding: 14,
    gap: 6,
  },
  activityValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  actionButton: {
    flexBasis: '47%',
    flexGrow: 1,
    borderRadius: radius.md,
    borderWidth: 1,
    padding: 16,
    gap: 10,
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  emptyMeals: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 26,
  },
  mealRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
  },
  mealIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mealName: {
    fontSize: 15,
    fontWeight: '600',
  },
  mealCalories: {
    fontSize: 14,
    fontWeight: '700',
  },
  scannerCard: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 26,
  },
  scannerIcon: {
    width: 60,
    height: 60,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
  },
  tipIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
});
