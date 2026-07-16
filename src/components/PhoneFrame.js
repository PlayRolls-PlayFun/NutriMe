import React from 'react';
import { View, Text, StyleSheet, Platform, useWindowDimensions } from 'react-native';
import { useApp } from '../store/AppContext';

// На web показываем приложение в аккуратной "рамке телефона" по центру,
// чтобы мобильный интерфейс не растягивался на всю ширину браузера.
// На iOS/Android рендерим приложение как есть.
export default function PhoneFrame({ children }) {
  const { theme, themeName } = useApp();
  const { width, height } = useWindowDimensions();

  if (Platform.OS !== 'web') {
    return children;
  }

  // На узких окнах (реальный телефон в браузере) рамка не нужна
  const isNarrow = width < 500;
  if (isNarrow) {
    return <View style={{ flex: 1 }}>{children}</View>;
  }

  const frameHeight = Math.min(height - 48, 900);
  const now = new Date();
  const clock = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;

  return (
    <View style={[styles.stage, { backgroundColor: themeName === 'dark' ? '#050505' : '#E8E8ED' }]}>
      <View
        style={[
          styles.phone,
          {
            height: frameHeight,
            backgroundColor: theme.background,
            borderColor: themeName === 'dark' ? '#26262B' : '#D6D6DE',
            shadowColor: '#000',
          },
        ]}
      >
        {/* Статус-бар как на iPhone */}
        <View style={styles.statusBar}>
          <Text style={[styles.statusClock, { color: theme.text.primary }]}>{clock}</Text>
          <View style={[styles.island, { backgroundColor: themeName === 'dark' ? '#000' : '#111' }]} />
          <View style={styles.statusIcons}>
            <View style={styles.signalBars}>
              {[4, 6, 8, 10].map((h) => (
                <View key={h} style={[styles.signalBar, { height: h, backgroundColor: theme.text.primary }]} />
              ))}
            </View>
            <View style={[styles.battery, { borderColor: theme.text.secondary }]}>
              <View style={[styles.batteryFill, { backgroundColor: theme.text.primary }]} />
            </View>
          </View>
        </View>

        <View style={styles.screen}>{children}</View>

        {/* Полоска home-индикатора */}
        <View style={styles.homeArea}>
          <View style={[styles.homeIndicator, { backgroundColor: theme.text.tertiary }]} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  phone: {
    width: 400,
    borderRadius: 48,
    borderWidth: 1,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 24 },
    shadowOpacity: 0.35,
    shadowRadius: 60,
    elevation: 24,
  },
  statusBar: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 26,
  },
  statusClock: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: -0.2,
    width: 54,
  },
  island: {
    width: 96,
    height: 26,
    borderRadius: 14,
  },
  statusIcons: {
    width: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 6,
  },
  signalBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 1.5,
  },
  signalBar: {
    width: 2.5,
    borderRadius: 1,
  },
  battery: {
    width: 22,
    height: 11,
    borderRadius: 3.5,
    borderWidth: 1,
    padding: 1.5,
  },
  batteryFill: {
    flex: 1,
    width: '72%',
    borderRadius: 1.5,
  },
  screen: {
    flex: 1,
  },
  homeArea: {
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeIndicator: {
    width: 120,
    height: 5,
    borderRadius: 3,
    opacity: 0.5,
  },
});
