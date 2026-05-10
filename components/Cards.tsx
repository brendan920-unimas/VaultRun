import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/Colors';

interface StatCardProps {
  icon: string;
  label: string;
  value: string;
  subValue?: string;
  accentColor?: string;
}

export function StatCard({ icon, label, value, subValue, accentColor = Colors.primary }: StatCardProps) {
  return (
    <View style={[styles.card, { borderColor: `${accentColor}33` }]}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={[styles.value, { color: accentColor }]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
      {subValue && <Text style={styles.subValue}>{subValue}</Text>}
    </View>
  );
}

interface GlowCardProps {
  children: React.ReactNode;
  glowColor?: string;
  style?: any;
}

export function GlowCard({ children, glowColor = Colors.primaryGlow, style }: GlowCardProps) {
  return (
    <View style={[styles.glowCard, { shadowColor: glowColor }, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: Spacing.xs,
    borderWidth: 1,
    minHeight: 100,
  },
  icon: {
    fontSize: 24,
    marginBottom: Spacing.sm,
  },
  value: {
    fontSize: FontSize.xxl,
    fontWeight: '800',
  },
  label: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
  subValue: {
    color: Colors.textSecondary,
    fontSize: FontSize.xs,
    marginTop: 2,
  },
  glowCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.lg,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
});
