import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/Colors';

interface XPBarProps {
  current: number;
  max: number;
  level: number;
  tier: string;
  showLabel?: boolean;
  height?: number;
  color?: string;
}

export function XPBar({ current, max, level, tier, showLabel = true, height = 12, color }: XPBarProps) {
  const progress = Math.min(current / max, 1);
  const barColor = color || Colors.primary;

  return (
    <View style={styles.container}>
      {showLabel && (
        <View style={styles.labelRow}>
          <Text style={styles.levelText}>Lv {level}</Text>
          <Text style={styles.tierText}>{tier}</Text>
          <Text style={styles.xpText}>{current} / {max} XP</Text>
        </View>
      )}
      <View style={[styles.track, { height }]}>
        <View
          style={[
            styles.fill,
            {
              width: `${progress * 100}%`,
              backgroundColor: barColor,
              height,
            },
          ]}
        />
        <View
          style={[
            styles.glow,
            {
              width: `${progress * 100}%`,
              backgroundColor: barColor,
              height,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  levelText: {
    color: Colors.primary,
    fontWeight: '800',
    fontSize: FontSize.md,
  },
  tierText: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    marginLeft: Spacing.sm,
    flex: 1,
  },
  xpText: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
  },
  track: {
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    position: 'relative',
  },
  fill: {
    borderRadius: BorderRadius.full,
    position: 'absolute',
    left: 0,
    top: 0,
  },
  glow: {
    borderRadius: BorderRadius.full,
    position: 'absolute',
    left: 0,
    top: 0,
    opacity: 0.4,
    shadowColor: '#7f77dd',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
});
