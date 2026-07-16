import React from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { radius, shadow } from '../theme/colors';
import { useApp } from '../store/AppContext';

export function Card({ children, style, onPress }) {
  const { theme } = useApp();
  const base = [
    styles.card,
    { backgroundColor: theme.card, borderColor: theme.divider },
    style,
  ];
  if (onPress) {
    return (
      <TouchableOpacity style={base} onPress={onPress} activeOpacity={0.7}>
        {children}
      </TouchableOpacity>
    );
  }
  return <View style={base}>{children}</View>;
}

export function PrimaryButton({ title, onPress, style, disabled, variant = 'primary' }) {
  const { theme } = useApp();
  const bg =
    variant === 'primary' ? theme.accent : variant === 'danger' ? theme.redSoft : theme.inputBackground;
  const color =
    variant === 'primary' ? '#FFFFFF' : variant === 'danger' ? theme.red : theme.text.primary;
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: bg, opacity: disabled ? 0.5 : 1 }, style]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text style={[styles.buttonText, { color }]}>{title}</Text>
    </TouchableOpacity>
  );
}

export function Input({ label, style, ...props }) {
  const { theme } = useApp();
  return (
    <View style={style}>
      {label ? (
        <Text style={[styles.inputLabel, { color: theme.text.secondary }]}>{label}</Text>
      ) : null}
      <TextInput
        style={[
          styles.input,
          { backgroundColor: theme.inputBackground, color: theme.text.primary },
        ]}
        placeholderTextColor={theme.text.tertiary}
        {...props}
      />
    </View>
  );
}

export function SectionTitle({ children, style }) {
  const { theme } = useApp();
  return <Text style={[styles.sectionTitle, { color: theme.text.primary }, style]}>{children}</Text>;
}

export function Caption({ children, style }) {
  const { theme } = useApp();
  return <Text style={[styles.caption, { color: theme.text.secondary }, style]}>{children}</Text>;
}

export function ProgressBar({ progress, color, height = 8, trackColor }) {
  const { theme } = useApp();
  return (
    <View
      style={{
        height,
        borderRadius: height / 2,
        backgroundColor: trackColor || theme.inputBackground,
        overflow: 'hidden',
      }}
    >
      <View
        style={{
          width: `${Math.min(100, Math.max(0, progress * 100))}%`,
          height: '100%',
          borderRadius: height / 2,
          backgroundColor: color || theme.accent,
        }}
      />
    </View>
  );
}

export function ProgressRing({ size = 100, strokeWidth = 7, progress, color, children }) {
  const { theme } = useApp();
  const r = (size - strokeWidth) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.min(1, Math.max(0, progress));
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={{ position: 'absolute' }}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={theme.inputBackground}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color || theme.accent}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${c} ${c}`}
          strokeDashoffset={c * (1 - clamped)}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      {children}
    </View>
  );
}

export function EmptyState({ icon: Icon, title, text, action }) {
  const { theme } = useApp();
  return (
    <View style={styles.emptyState}>
      {Icon ? <Icon size={44} color={theme.text.tertiary} strokeWidth={1.6} /> : null}
      <Text style={[styles.emptyTitle, { color: theme.text.primary }]}>{title}</Text>
      {text ? <Text style={[styles.emptyText, { color: theme.text.secondary }]}>{text}</Text> : null}
      {action}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.md,
    borderWidth: 1,
    padding: 20,
    ...shadow.sm,
  },
  button: {
    borderRadius: radius.sm,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '600',
  },
  input: {
    borderRadius: radius.sm,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.4,
  },
  caption: {
    fontSize: 13,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
    gap: 10,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginTop: 6,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
