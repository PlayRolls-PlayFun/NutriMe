import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators, TransitionSpecs } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { AppProvider, useApp } from './src/store/AppContext';
import PhoneFrame from './src/components/PhoneFrame';

import SplashScreen from './src/screens/SplashScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import AuthScreen from './src/screens/AuthScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import ProfileSetupScreen from './src/screens/ProfileSetupScreen';
import MainNavigator from './src/navigation/MainNavigator';
import AddMealScreen from './src/screens/AddMealScreen';
import MealDetailsScreen from './src/screens/MealDetailsScreen';
import HydrationScreen from './src/screens/HydrationScreen';
import ActivityScreen from './src/screens/ActivityScreen';
import AchievementsScreen from './src/screens/AchievementsScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';
import FavoritesScreen from './src/screens/FavoritesScreen';
import StatisticsScreen from './src/screens/StatisticsScreen';
import SearchScreen from './src/screens/SearchScreen';
import CreateMealScreen from './src/screens/CreateMealScreen';
import EditProfileScreen from './src/screens/EditProfileScreen';

const Stack = createStackNavigator();

function Root() {
  const { themeName, theme } = useApp();

  const navTheme = {
    ...(themeName === 'dark' ? DarkTheme : DefaultTheme),
    colors: {
      ...(themeName === 'dark' ? DarkTheme : DefaultTheme).colors,
      background: theme.background,
      card: theme.card,
      text: theme.text.primary,
      border: theme.divider,
      primary: theme.accent,
    },
  };

  return (
    <PhoneFrame>
      <StatusBar style={themeName === 'dark' ? 'light' : 'dark'} />
      <NavigationContainer theme={navTheme}>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            gestureEnabled: true,
            animationEnabled: true,
            cardStyle: { backgroundColor: theme.background },
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            transitionSpec: {
              open: TransitionSpecs.TransitionIOSSpec,
              close: TransitionSpecs.TransitionIOSSpec,
            },
          }}
        >
          <Stack.Screen
            name="Splash"
            component={SplashScreen}
            options={{ cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter }}
          />
          <Stack.Screen
            name="Onboarding"
            component={OnboardingScreen}
            options={{ cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter }}
          />
          <Stack.Screen
            name="Auth"
            component={AuthScreen}
            options={{ cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter }}
          />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
          <Stack.Screen
            name="Main"
            component={MainNavigator}
            options={{ cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter }}
          />
          <Stack.Screen name="AddMeal" component={AddMealScreen} />
          <Stack.Screen name="MealDetails" component={MealDetailsScreen} />
          <Stack.Screen name="Hydration" component={HydrationScreen} />
          <Stack.Screen name="Activity" component={ActivityScreen} />
          <Stack.Screen name="Achievements" component={AchievementsScreen} />
          <Stack.Screen name="History" component={HistoryScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="Notifications" component={NotificationsScreen} />
          <Stack.Screen name="Favorites" component={FavoritesScreen} />
          <Stack.Screen name="Statistics" component={StatisticsScreen} />
          <Stack.Screen name="Search" component={SearchScreen} />
          <Stack.Screen name="CreateMeal" component={CreateMealScreen} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PhoneFrame>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Root />
    </AppProvider>
  );
}
