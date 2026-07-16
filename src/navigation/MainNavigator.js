import React, { useEffect, useRef } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Pressable, Text, StyleSheet, Animated, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { House, UtensilsCrossed, Camera, ChartLine, User } from 'lucide-react-native';
import { useApp } from '../store/AppContext';

import HomeScreen from '../screens/HomeScreen';
import NutritionScreen from '../screens/NutritionScreen';
import ScannerScreen from '../screens/ScannerScreen';
import ProgressScreen from '../screens/ProgressScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const TABS = {
  HomeTab: { label: 'Главная', Icon: House },
  NutritionTab: { label: 'Питание', Icon: UtensilsCrossed },
  ScannerTab: { label: 'Сканер', Icon: Camera },
  ProgressTab: { label: 'Прогресс', Icon: ChartLine },
  ProfileTab: { label: 'Профиль', Icon: User },
};

function TabItem({ route, focused, onPress, theme }) {
  const { label, Icon } = TABS[route.name];
  const scale = useRef(new Animated.Value(focused ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: focused ? 1 : 0,
      useNativeDriver: true,
      friction: 8,
      tension: 80,
    }).start();
  }, [focused, scale]);

  const color = focused ? theme.accent : theme.text.secondary;

  return (
    <Pressable
      onPress={onPress}
      style={styles.tabItem}
      accessibilityRole="tab"
      accessibilityState={{ selected: focused }}
      accessibilityLabel={label}
    >
      <Animated.View
        style={[
          styles.tabIconWrap,
          {
            backgroundColor: focused ? theme.accentSoft : 'transparent',
            transform: [
              {
                scale: scale.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.08],
                }),
              },
            ],
          },
        ]}
      >
        <Icon size={22} color={color} strokeWidth={focused ? 2.4 : 2} />
      </Animated.View>
      <Text style={[styles.tabLabel, { color }]}>{label}</Text>
    </Pressable>
  );
}

function GlassTabBar({ state, navigation }) {
  const { theme, themeName } = useApp();
  const insets = useSafeAreaInsets();

  return (
    <View
      pointerEvents="box-none"
      style={[styles.tabBarWrap, { paddingBottom: Math.max(insets.bottom, 16) }]}
    >
      <BlurView
        intensity={60}
        tint={themeName === 'dark' ? 'dark' : 'light'}
        style={[
          styles.island,
          {
            backgroundColor:
              themeName === 'dark' ? 'rgba(28,28,30,0.72)' : 'rgba(255,255,255,0.72)',
            borderColor:
              themeName === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
          },
        ]}
      >
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          return (
            <TabItem
              key={route.key}
              route={route}
              focused={focused}
              theme={theme}
              onPress={() => {
                const event = navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });
                if (!focused && !event.defaultPrevented) {
                  navigation.navigate(route.name);
                }
              }}
            />
          );
        })}
      </BlurView>
    </View>
  );
}

export default function MainNavigator() {
  const { theme } = useApp();

  return (
    <Tab.Navigator
      tabBar={(props) => <GlassTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        animation: 'shift',
        sceneStyle: { backgroundColor: theme.background },
        transitionSpec: {
          animation: 'spring',
          config: {
            stiffness: 220,
            damping: 26,
            mass: 1,
            overshootClamping: false,
          },
        },
      }}
    >
      <Tab.Screen name="HomeTab" component={HomeScreen} />
      <Tab.Screen name="NutritionTab" component={NutritionScreen} />
      <Tab.Screen name="ScannerTab" component={ScannerScreen} />
      <Tab.Screen name="ProgressTab" component={ProgressScreen} />
      <Tab.Screen name="ProfileTab" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBarWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
  },
  island: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 32,
    borderWidth: 1,
    overflow: 'hidden',
    alignSelf: 'stretch',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 10,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
    paddingVertical: 4,
  },
  tabIconWrap: {
    width: 44,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.1,
  },
});
