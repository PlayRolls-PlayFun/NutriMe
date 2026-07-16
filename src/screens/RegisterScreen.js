import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { PrimaryButton, Input } from '../components/UI';
import { Entrance } from '../components/Entrance';
import { useApp } from '../store/AppContext';

export default function RegisterScreen({ navigation }) {
  const { theme, update } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const register = () => {
    if (!name.trim() || !email.trim() || !password || !confirm) {
      Alert.alert('Ошибка', 'Заполните все поля');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      Alert.alert('Ошибка', 'Введите корректный email');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Ошибка', 'Пароль должен быть не короче 6 символов');
      return;
    }
    if (password !== confirm) {
      Alert.alert('Ошибка', 'Пароли не совпадают');
      return;
    }
    update((prev) => ({
      authorized: true,
      user: { ...prev.user, name: name.trim(), email: email.trim(), registeredAt: Date.now() },
    }));
    navigation.replace('ProfileSetup');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Entrance index={0}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back} hitSlop={12}>
            <ArrowLeft size={24} color={theme.text.primary} />
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.text.primary }]}>Создать аккаунт</Text>
            <Text style={[styles.subtitle, { color: theme.text.secondary }]}>
              Пара минут — и вы начнёте следить за питанием
            </Text>
          </View>
          </Entrance>

          <Entrance index={1}>
          <View style={styles.form}>
            <Input label="Имя" placeholder="Как вас зовут" value={name} onChangeText={setName} />
            <Input
              label="Email"
              placeholder="you@example.com"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <Input
              label="Пароль"
              placeholder="Минимум 6 символов"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <Input
              label="Подтверждение пароля"
              placeholder="Повторите пароль"
              value={confirm}
              onChangeText={setConfirm}
              secureTextEntry
            />
            <PrimaryButton title="Зарегистрироваться" onPress={register} style={{ marginTop: 8 }} />
          </View>
          </Entrance>

          <Entrance index={2}>
          <View style={styles.loginRow}>
            <Text style={{ color: theme.text.secondary, fontSize: 15 }}>Уже есть аккаунт?</Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={[styles.link, { color: theme.blue }]}> Войти</Text>
            </TouchableOpacity>
          </View>
          </Entrance>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    padding: 24,
  },
  back: {
    marginBottom: 16,
  },
  header: {
    gap: 8,
    marginBottom: 28,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -0.6,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
  },
  form: {
    gap: 16,
  },
  link: {
    fontSize: 15,
    fontWeight: '600',
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 28,
  },
});
