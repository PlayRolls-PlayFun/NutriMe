import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../theme/colors';

const STORAGE_KEY = '@nutrime_state_v1';

const todayKey = () => new Date().toISOString().slice(0, 10);

const defaultState = {
  onboardingDone: false,
  authorized: false,
  user: {
    name: '',
    email: '',
    gender: null,
    age: null,
    height: null,
    weight: null,
    startWeight: null,
    goalWeight: null,
    activityLevel: null,
    goal: null,
    pace: null,
    registeredAt: null,
  },
  settings: {
    theme: 'light',
    language: 'ru',
    units: 'metric',
    reminders: {
      water: true,
      meals: true,
      weigh: true,
      tips: false,
    },
  },
  // { [date]: { meals: [], water: ml, activities: [] } }
  days: {},
  weightHistory: [], // { date, weight }
  favorites: [], // meal objects
  searchHistory: [],
  achievementsUnlocked: [],
  notifications: [
    { id: 'n1', type: 'water', title: 'Время пить воду', text: 'Не забудьте выпить стакан воды', time: '10:30', read: false },
    { id: 'n2', type: 'meal', title: 'Напоминание об обеде', text: 'Пора добавить обед в дневник', time: '13:00', read: false },
    { id: 'n3', type: 'achievement', title: 'Новое достижение', text: 'Вы получили награду «Первый шаг»', time: 'Вчера', read: true },
    { id: 'n4', type: 'weigh', title: 'Взвешивание', text: 'Пора обновить свой вес', time: 'Вчера', read: true },
    { id: 'n5', type: 'tip', title: 'Совет дня', text: 'Белок на завтрак помогает контролировать аппетит в течение дня', time: '2 дня назад', read: true },
  ],
};

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, setState] = useState(defaultState);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const saved = JSON.parse(raw);
          setState((prev) => ({
            ...prev,
            ...saved,
            user: { ...prev.user, ...saved.user },
            settings: {
              ...prev.settings,
              ...saved.settings,
              reminders: { ...prev.settings.reminders, ...(saved.settings || {}).reminders },
            },
            notifications: saved.notifications || prev.notifications,
          }));
        }
      } catch (e) {
        // ignore corrupted storage
      }
      setLoaded(true);
    })();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {});
  }, [state, loaded]);

  const update = useCallback((patch) => {
    setState((prev) => ({ ...prev, ...(typeof patch === 'function' ? patch(prev) : patch) }));
  }, []);

  const emptyDay = { meals: [], water: 0, waterLog: [], activities: [], steps: 0 };

  const getDay = useCallback(
    (date = todayKey()) => {
      return { ...emptyDay, ...(state.days[date] || {}) };
    },
    [state.days]
  );

  const updateDay = useCallback((date, updater) => {
    setState((prev) => {
      const day = { ...emptyDay, ...(prev.days[date] || {}) };
      return { ...prev, days: { ...prev.days, [date]: updater(day) } };
    });
  }, []);

  const addMeal = useCallback(
    (meal, date = todayKey()) => {
      const id = `m_${Date.now()}_${Math.round(Math.random() * 9999)}`;
      updateDay(date, (day) => ({ ...day, meals: [...day.meals, { ...meal, id, addedAt: Date.now() }] }));
      return id;
    },
    [updateDay]
  );

  const removeMeal = useCallback(
    (mealId, date = todayKey()) => {
      updateDay(date, (day) => ({ ...day, meals: day.meals.filter((m) => m.id !== mealId) }));
    },
    [updateDay]
  );

  const editMeal = useCallback(
    (mealId, patch, date = todayKey()) => {
      updateDay(date, (day) => ({
        ...day,
        meals: day.meals.map((m) => (m.id === mealId ? { ...m, ...patch } : m)),
      }));
    },
    [updateDay]
  );

  const addWater = useCallback(
    (ml, date = todayKey()) => {
      updateDay(date, (day) => ({
        ...day,
        water: Math.max(0, day.water + ml),
        waterLog: [
          ...(day.waterLog || []),
          { id: `w_${Date.now()}`, ml, time: new Date().toTimeString().slice(0, 5) },
        ].slice(-30),
      }));
    },
    [updateDay]
  );

  const addSteps = useCallback(
    (count, date = todayKey()) => {
      updateDay(date, (day) => ({ ...day, steps: Math.max(0, (day.steps || 0) + count) }));
    },
    [updateDay]
  );

  const addActivity = useCallback(
    (activity, date = todayKey()) => {
      const id = `a_${Date.now()}`;
      updateDay(date, (day) => ({ ...day, activities: [...day.activities, { ...activity, id }] }));
    },
    [updateDay]
  );

  const logWeight = useCallback((weight) => {
    setState((prev) => ({
      ...prev,
      user: { ...prev.user, weight },
      weightHistory: [...prev.weightHistory.filter((w) => w.date !== todayKey()), { date: todayKey(), weight }],
    }));
  }, []);

  const toggleFavorite = useCallback((meal) => {
    setState((prev) => {
      const exists = prev.favorites.some((f) => f.name === meal.name);
      return {
        ...prev,
        favorites: exists ? prev.favorites.filter((f) => f.name !== meal.name) : [...prev.favorites, meal],
      };
    });
  }, []);

  const addSearchTerm = useCallback((term) => {
    setState((prev) => ({
      ...prev,
      searchHistory: [term, ...prev.searchHistory.filter((t) => t !== term)].slice(0, 10),
    }));
  }, []);

  const unlockAchievement = useCallback((id) => {
    setState((prev) =>
      prev.achievementsUnlocked.includes(id)
        ? prev
        : { ...prev, achievementsUnlocked: [...prev.achievementsUnlocked, id] }
    );
  }, []);

  const markNotificationsRead = useCallback(() => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => ({ ...n, read: true })),
    }));
  }, []);

  const resetAll = useCallback(async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setState(defaultState);
  }, []);

  const theme = colors[state.settings.theme] || colors.light;

  // Расчёт дневной нормы калорий (Mifflin-St Jeor)
  const calorieGoal = useMemo(() => {
    const { gender, age, height, weight, activityLevel, goal } = state.user;
    if (!age || !height || !weight) return 2200;
    let bmr =
      gender === 'female'
        ? 10 * weight + 6.25 * height - 5 * age - 161
        : 10 * weight + 6.25 * height - 5 * age + 5;
    const mult = { low: 1.2, medium: 1.4, high: 1.6, athlete: 1.75 }[activityLevel] || 1.3;
    let total = bmr * mult;
    if (goal === 'lose') total -= 400;
    if (goal === 'gain') total += 350;
    return Math.round(total / 10) * 10;
  }, [state.user]);

  const waterGoal = useMemo(() => {
    const w = state.user.weight || 70;
    return Math.round((w * 32) / 50) * 50; // мл
  }, [state.user.weight]);

  const value = {
    state,
    loaded,
    theme,
    themeName: state.settings.theme,
    calorieGoal,
    waterGoal,
    todayKey,
    update,
    getDay,
    addMeal,
    removeMeal,
    editMeal,
    addWater,
    addSteps,
    addActivity,
    logWeight,
    toggleFavorite,
    addSearchTerm,
    unlockAchievement,
    markNotificationsRead,
    resetAll,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
