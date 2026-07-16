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
import { Leaf, Apple, Globe } from 'lucide-react-native';
import { PrimaryButton, Input } from '../components/UI';
import { Entrance } from '../components/Entrance';
import { useApp } from '../store/AppContext';

export default function AuthScreen({ navigation }) {
  const { theme, state, update } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resetMode, setResetMode] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const goNext = () => {
    if (state.user.goal) {
      navigation.replace('Main');
    } else {
      navigation.replace('ProfileSetup');
    }
  };

  const signIn = (provider) => {
    if (provider === 'email') {
      if (!email.trim() || !password.trim()) {
        Alert.alert('Ошибка', 'Введите email и пароль');
        return;
      }
      update((prev) => ({
        authorized: true,
        user: { ...prev.user, email: email.trim(), name: prev.user.name || email.split('@')[0], registeredAt: prev.user.registeredAt || Date.now() },
      }));
    } else {
      const demo = provider === 'google' ? 'user@gmail.com' : 'user@icloud.com';
      update((prev) => ({
        authorized: true,
        user: { ...prev.user, email: prev.user.email || demo, name: prev.user.name || 'Пользователь', registeredAt: prev.user.registeredAt || Date.now() },
      }));
    }
    goNext();
  };

  if (resetMode) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Entrance key={`reset-head-${resetSent}`} index={0}>
          <View style={styles.header}>
            <View style={[styles.logo, { backgroundColor: theme.accent }]}>
              <Leaf size={30} color="#FFFFFF" />
            </View>
            <Text style={[styles.title, { color: theme.text.primary }]}>Восстановление пароля</Text>
            <Text style={[styles.subtitle, { color: theme.text.secondary }]}>
              {resetSent
                ? 'Письмо со ссылкой для сброса пароля отправлено на вашу почту'
                : 'Укажите email, и мы отправим ссылку для сброса пароля'}
            </Text>
          </View>
          </Entrance>
          {!resetSent ? (
            <Entrance index={1}>
            <View style={styles.form}>
              <Input
                label="Email"
                placeholder="you@example.com"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
              <PrimaryButton
                title="Отправить ссылку"
                onPress={() => setResetSent(true)}
                disabled={!email.trim()}
              />
            </View>
            </Entrance>
          ) : null}
          <Entrance index={2}>
          <TouchableOpacity
            onPress={() => {
              setResetMode(false);
              setResetSent(false);
            }}
            style={styles.linkWrap}
          >
            <Text style={[styles.link, { color: theme.blue }]}>Вернуться ко входу</Text>
          </TouchableOpacity>
          </Entrance>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Entrance index={0}>
          <View style={styles.header}>
            <View style={[styles.logo, { backgroundColor: theme.accent }]}>
              <Leaf size={30} color="#FFFFFF" />
            </View>
            <Text style={[styles.title, { color: theme.text.primary }]}>С возвращением</Text>
            <Text style={[styles.subtitle, { color: theme.text.secondary }]}>
              Войдите, чтобы продолжить путь к цели
            </Text>
          </View>
          </Entrance>

          <Entrance index={1}>
          <View style={styles.form}>
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
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <TouchableOpacity onPress={() => setResetMode(true)} style={styles.forgotWrap}>
              <Text style={[styles.link, { color: theme.blue }]}>Забыли пароль?</Text>
            </TouchableOpacity>
            <PrimaryButton title="Войти" onPress={() => signIn('email')} />
          </View>
          </Entrance>

          <Entrance index={2}>
          <View style={styles.dividerRow}>
            <View style={[styles.dividerLine, { backgroundColor: theme.divider }]} />
            <Text style={[styles.dividerText, { color: theme.text.secondary }]}>или</Text>
            <View style={[styles.dividerLine, { backgroundColor: theme.divider }]} />
          </View>
          </Entrance>

          <Entrance index={3}>
          <View style={styles.socials}>
            <TouchableOpacity
              style={[styles.socialButton, { backgroundColor: theme.card, borderColor: theme.divider }]}
              onPress={() => signIn('apple')}
              activeOpacity={0.7}
            >
              <Apple size={20} color={theme.text.primary} />
              <Text style={[styles.socialText, { color: theme.text.primary }]}>Войти через Apple</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.socialButton, { backgroundColor: theme.card, borderColor: theme.divider }]}
              onPress={() => signIn('google')}
              activeOpacity={0.7}
            >
              <Globe size={20} color={theme.text.primary} />
              <Text style={[styles.socialText, { color: theme.text.primary }]}>Войти через Google</Text>
            </TouchableOpacity>
          </View>
          </Entrance>

          <Entrance index={4}>
          <View style={styles.registerRow}>
            <Text style={{ color: theme.text.secondary, fontSize: 15 }}>Нет аккаунта?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={[styles.link, { color: theme.blue }]}> Зарегистрироваться</Text>
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
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    gap: 8,
    marginBottom: 32,
  },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.6,
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  form: {
    gap: 16,
  },
  forgotWrap: {
    alignSelf: 'flex-end',
  },
  link: {
    fontSize: 15,
    fontWeight: '600',
  },
  linkWrap: {
    alignItems: 'center',
    marginTop: 24,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 28,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 13,
  },
  socials: {
    gap: 12,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 15,
    borderRadius: 14,
    borderWidth: 1,
  },
  socialText: {
    fontSize: 16,
    fontWeight: '600',
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 28,
  },
});
