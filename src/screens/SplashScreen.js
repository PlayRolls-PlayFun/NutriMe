import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Leaf } from 'lucide-react-native';
import { useApp } from '../store/AppContext';

export default function SplashScreen({ navigation }) {
  const { state, loaded, theme } = useApp();
  const fade = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.5)).current;
  const textFade = useRef(new Animated.Value(0)).current;
  const textRise = useRef(new Animated.Value(16)).current;
  const barWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.spring(logoScale, {
        toValue: 1,
        stiffness: 160,
        damping: 14,
        mass: 1,
        useNativeDriver: true,
      }),
    ]).start();
    Animated.parallel([
      Animated.timing(textFade, { toValue: 1, duration: 500, delay: 350, useNativeDriver: true }),
      Animated.spring(textRise, {
        toValue: 0,
        delay: 350,
        stiffness: 170,
        damping: 20,
        mass: 1,
        useNativeDriver: true,
      }),
    ]).start();
    Animated.timing(barWidth, { toValue: 1, duration: 1600, useNativeDriver: false }).start();
  }, [fade, logoScale, textFade, textRise, barWidth]);

  useEffect(() => {
    if (!loaded) return;
    const t = setTimeout(() => {
      if (state.authorized && state.user.goal) {
        navigation.replace('Main');
      } else if (state.onboardingDone) {
        navigation.replace('Auth');
      } else {
        navigation.replace('Onboarding');
      }
    }, 1800);
    return () => clearTimeout(t);
  }, [loaded, state.authorized, state.onboardingDone, state.user.goal, navigation]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.center}>
        <Animated.View
          style={[
            styles.logo,
            { backgroundColor: theme.accent, opacity: fade, transform: [{ scale: logoScale }] },
          ]}
        >
          <Leaf size={44} color="#FFFFFF" strokeWidth={2} />
        </Animated.View>
        <Animated.View
          style={[styles.center, { opacity: textFade, transform: [{ translateY: textRise }] }]}
        >
          <Text style={[styles.title, { color: theme.text.primary }]}>NutriMe</Text>
          <Text style={[styles.subtitle, { color: theme.text.secondary }]}>
            Ваш путь к здоровому питанию
          </Text>
        </Animated.View>
      </View>
      <View style={styles.loaderWrap}>
        <View style={[styles.loaderTrack, { backgroundColor: theme.inputBackground }]}>
          <Animated.View
            style={[
              styles.loaderFill,
              {
                backgroundColor: theme.accent,
                width: barWidth.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
              },
            ]}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    alignItems: 'center',
    gap: 12,
  },
  logo: {
    width: 96,
    height: 96,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: -0.8,
  },
  subtitle: {
    fontSize: 16,
  },
  loaderWrap: {
    position: 'absolute',
    bottom: 80,
    width: 160,
  },
  loaderTrack: {
    height: 5,
    borderRadius: 3,
    overflow: 'hidden',
  },
  loaderFill: {
    height: '100%',
    borderRadius: 3,
  },
});
