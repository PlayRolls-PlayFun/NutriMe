import React, { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

const STAGGER = 65;

/**
 * Каскадное появление блока: fade + подъём + лёгкий scale.
 * Повторяется каждый раз, когда экран получает фокус (переключение таба, возврат назад).
 */
export function Entrance({ index = 0, children, style }) {
  const isFocused = useIsFocused();
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(28)).current;
  const scale = useRef(new Animated.Value(0.96)).current;

  useEffect(() => {
    if (isFocused) {
      opacity.setValue(0);
      translateY.setValue(28);
      scale.setValue(0.96);
      const delay = index * STAGGER;
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 440,
          delay,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          delay,
          stiffness: 170,
          damping: 22,
          mass: 1,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          delay,
          stiffness: 170,
          damping: 22,
          mass: 1,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      opacity.setValue(0);
    }
  }, [isFocused, index, opacity, translateY, scale]);

  return (
    <Animated.View style={[style, { opacity, transform: [{ translateY }, { scale }] }]}>
      {children}
    </Animated.View>
  );
}
