import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Animated, Easing, Linking, Platform } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Camera, ScanLine, Check, RotateCcw, Zap, Pencil, CameraOff } from 'lucide-react-native';
import { useApp } from '../store/AppContext';
import { Card, Caption, PrimaryButton } from '../components/UI';
import { Entrance } from '../components/Entrance';
import { FOODS } from '../data/foodDatabase';

export default function ScannerScreen({ navigation }) {
  const { theme, addMeal, unlockAchievement } = useApp();
  const [phase, setPhase] = useState('idle'); // idle | scanning | result
  const [result, setResult] = useState(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraError, setCameraError] = useState(false);
  const scanAnim = useRef(new Animated.Value(0)).current;
  const timerRef = useRef(null);

  const cameraGranted = permission?.granted && !cameraError;

  const startScan = async () => {
    if (!permission?.granted) {
      const res = await requestPermission();
      if (!res.granted) {
        if (!res.canAskAgain && Platform.OS !== 'web') {
          Linking.openSettings();
        }
        // Разрешение не выдано — сканируем в демо-режиме без камеры
      }
    }
    setPhase('scanning');
  };

  useEffect(() => {
    if (phase === 'scanning') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scanAnim, { toValue: 1, duration: 1100, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          Animated.timing(scanAnim, { toValue: 0, duration: 1100, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        ])
      ).start();
      timerRef.current = setTimeout(() => {
        const food = FOODS[Math.floor(Math.random() * FOODS.length)];
        setResult(food);
        setPhase('result');
        unlockAchievement('scanner_used');
      }, 2600);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      scanAnim.stopAnimation();
    };
  }, [phase]);

  const translateY = scanAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 208] });

  const hour = new Date().getHours();
  const autoMealType = hour < 11 ? 'breakfast' : hour < 16 ? 'lunch' : hour < 21 ? 'dinner' : 'snack';

  const handleAdd = () => {
    addMeal({
      name: result.name,
      calories: result.calories,
      protein: result.protein,
      fat: result.fat,
      carbs: result.carbs,
      weight: result.weight,
      portion: result.portion,
      ingredients: result.ingredients || [],
      mealType: autoMealType,
    });
    unlockAchievement('first_meal');
    setPhase('idle');
    setResult(null);
    navigation.navigate('NutritionTab');
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <Entrance index={0}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text.primary }]}>Сканер еды</Text>
          <Caption>Наведите камеру на блюдо, и мы распознаем его калорийность</Caption>
        </View>
        </Entrance>

        {/* Видоискатель */}
        <Entrance index={1}>
        <View style={[styles.viewfinder, { backgroundColor: theme.card, borderColor: theme.divider }]}>
          {phase === 'result' && result ? (
            <View style={styles.resultInner}>
              <View style={[styles.resultBadge, { backgroundColor: theme.accentSoft }]}>
                <Check size={30} color={theme.accent} />
              </View>
              <Text style={[styles.resultName, { color: theme.text.primary }]}>{result.name}</Text>
              <Caption>Распознано с уверенностью 94%</Caption>
            </View>
          ) : (
            <>
              {cameraGranted ? (
                <CameraView
                  style={StyleSheet.absoluteFill}
                  facing="back"
                  onMountError={() => setCameraError(true)}
                />
              ) : permission && !permission.granted && !permission.canAskAgain ? (
                <View style={styles.cameraOffWrap}>
                  <CameraOff size={44} color={theme.text.tertiary} strokeWidth={1.4} />
                  <Caption style={{ textAlign: 'center' }}>
                    Доступ к камере запрещён.{'\n'}Разрешите его в настройках телефона
                  </Caption>
                </View>
              ) : (
                <Camera size={48} color={theme.text.tertiary} strokeWidth={1.4} />
              )}
              {phase === 'scanning' ? (
                <Animated.View
                  style={[styles.scanLine, { backgroundColor: theme.accent, transform: [{ translateY }] }]}
                />
              ) : null}
              {/* Углы рамки */}
              {['tl', 'tr', 'bl', 'br'].map((corner) => (
                <View
                  key={corner}
                  style={[
                    styles.corner,
                    { borderColor: phase === 'scanning' ? theme.accent : theme.text.tertiary },
                    corner === 'tl' && styles.cornerTL,
                    corner === 'tr' && styles.cornerTR,
                    corner === 'bl' && styles.cornerBL,
                    corner === 'br' && styles.cornerBR,
                  ]}
                />
              ))}
            </>
          )}
        </View>
        </Entrance>

        {phase === 'result' && result ? (
          <Entrance index={2}>
          <Card style={styles.resultCard}>
            <View style={styles.macroGrid}>
              {[
                { label: 'Калории', value: `${result.calories}`, color: theme.orange },
                { label: 'Белки', value: `${Math.round(result.protein)} г`, color: theme.blue },
                { label: 'Жиры', value: `${Math.round(result.fat)} г`, color: theme.red },
                { label: 'Углеводы', value: `${Math.round(result.carbs)} г`, color: theme.accent },
              ].map((m) => (
                <View key={m.label} style={styles.macroCell}>
                  <Text style={[styles.macroValue, { color: m.color }]}>{m.value}</Text>
                  <Caption>{m.label}</Caption>
                </View>
              ))}
            </View>
          </Card>
          </Entrance>
        ) : (
          <Entrance index={2}>
          <Card style={styles.hintCard}>
            <Zap size={18} color={theme.orange} />
            <Text style={[styles.hintText, { color: theme.text.secondary }]}>
              {cameraGranted
                ? 'Камера активна. Распознавание блюда имитируется на основе локальной базы'
                : 'При сканировании приложение запросит доступ к камере телефона'}
            </Text>
          </Card>
          </Entrance>
        )}

        <Entrance index={3} style={styles.actions}>
          {phase === 'idle' ? (
            <PrimaryButton title="Сканировать" onPress={startScan} />
          ) : phase === 'scanning' ? (
            <PrimaryButton title="Идёт распознавание..." disabled onPress={() => {}} />
          ) : (
            <>
              <PrimaryButton title="Добавить в дневник" onPress={handleAdd} />
              <View style={styles.secondaryRow}>
                <TouchableOpacity
                  style={styles.retryBtn}
                  onPress={() => {
                    const prefill = { ...result };
                    setPhase('idle');
                    setResult(null);
                    navigation.navigate('CreateMeal', { prefill, mealType: autoMealType });
                  }}
                >
                  <Pencil size={16} color={theme.blue} />
                  <Text style={[styles.retryText, { color: theme.blue }]}>Исправить значения</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.retryBtn}
                  onPress={() => {
                    setPhase('scanning');
                    setResult(null);
                  }}
                >
                  <RotateCcw size={16} color={theme.blue} />
                  <Text style={[styles.retryText, { color: theme.blue }]}>Снова</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </Entrance>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { flex: 1, padding: 20, paddingBottom: 116, gap: 20 },
  header: { gap: 4, marginTop: 8 },
  title: { fontSize: 30, fontWeight: '800', letterSpacing: -0.8 },
  viewfinder: {
    height: 280,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  scanLine: {
    position: 'absolute',
    top: 36,
    left: 32,
    right: 32,
    height: 2,
    borderRadius: 1,
    opacity: 0.9,
  },
  corner: { position: 'absolute', width: 28, height: 28, borderColor: '#AEAEB2' },
  cornerTL: { top: 20, left: 20, borderTopWidth: 3, borderLeftWidth: 3, borderTopLeftRadius: 10 },
  cornerTR: { top: 20, right: 20, borderTopWidth: 3, borderRightWidth: 3, borderTopRightRadius: 10 },
  cornerBL: { bottom: 20, left: 20, borderBottomWidth: 3, borderLeftWidth: 3, borderBottomLeftRadius: 10 },
  cornerBR: { bottom: 20, right: 20, borderBottomWidth: 3, borderRightWidth: 3, borderBottomRightRadius: 10 },
  cameraOffWrap: { alignItems: 'center', gap: 10, paddingHorizontal: 32 },
  resultInner: { alignItems: 'center', gap: 8, paddingHorizontal: 24 },
  resultBadge: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  resultName: { fontSize: 21, fontWeight: '800', textAlign: 'center' },
  resultCard: { paddingVertical: 18 },
  macroGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  macroCell: { alignItems: 'center', gap: 2, flex: 1 },
  macroValue: { fontSize: 18, fontWeight: '800' },
  hintCard: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14 },
  hintText: { flex: 1, fontSize: 13, lineHeight: 18 },
  actions: { gap: 12, marginTop: 'auto', marginBottom: 8 },
  secondaryRow: { flexDirection: 'row', justifyContent: 'center', gap: 24 },
  retryBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 8 },
  retryText: { fontSize: 15, fontWeight: '600' },
});
