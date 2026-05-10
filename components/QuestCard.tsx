import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/Colors';
import type { Quest } from '@/types';

interface QuestCardProps {
  quest: Quest;
  onPress?: () => void;
  compact?: boolean;
}

export function QuestCard({ quest, onPress, compact = false }: QuestCardProps) {
  const isCompleted = quest.status === 'completed';
  const typeColors: Record<string, string> = {
    daily: Colors.primary,
    weekly: Colors.teal,
    epic: Colors.amber,
  };
  const accentColor = typeColors[quest.type] || Colors.primary;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        isCompleted && styles.cardCompleted,
        pressed && styles.cardPressed,
      ]}
    >
      <View style={[styles.accentBar, { backgroundColor: accentColor }]} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.icon}>{quest.icon}</Text>
          <View style={styles.titleArea}>
            <Text style={[styles.title, isCompleted && styles.titleCompleted]} numberOfLines={1}>
              {quest.title}
            </Text>
            {!compact && (
              <Text style={styles.description} numberOfLines={1}>
                {quest.description}
              </Text>
            )}
          </View>
          <View style={styles.rewards}>
            <Text style={[styles.xpReward, { color: accentColor }]}>+{quest.xpReward} XP</Text>
            {quest.coinReward > 0 && (
              <Text style={styles.coinReward}>🪙 {quest.coinReward}</Text>
            )}
          </View>
        </View>

        {!compact && (
          <View style={styles.progressArea}>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${quest.progress}%`,
                    backgroundColor: isCompleted ? Colors.teal : accentColor,
                  },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {isCompleted ? '✓ Done' : `${quest.progress}%`}
            </Text>
          </View>
        )}

        {!compact && quest.streakShieldReward && (
          <View style={styles.shieldBadge}>
            <Text style={styles.shieldText}>🛡️ Streak Shield Reward</Text>
          </View>
        )}

        {!compact && (
          <View style={styles.footer}>
            <View style={[styles.typeBadge, { backgroundColor: `${accentColor}22` }]}>
              <Text style={[styles.typeText, { color: accentColor }]}>
                {quest.type.toUpperCase()}
              </Text>
            </View>
            {quest.targetAmount && (
              <Text style={styles.targetText}>
                RM{quest.currentAmount?.toFixed(2)} / RM{quest.targetAmount?.toFixed(2)}
              </Text>
            )}
          </View>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardCompleted: {
    opacity: 0.7,
    borderColor: Colors.teal,
  },
  cardPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  accentBar: {
    width: 4,
  },
  content: {
    flex: 1,
    padding: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: 28,
    marginRight: Spacing.md,
  },
  titleArea: {
    flex: 1,
  },
  title: {
    color: Colors.text,
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: Colors.textMuted,
  },
  description: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    marginTop: 2,
  },
  rewards: {
    alignItems: 'flex-end',
    marginLeft: Spacing.sm,
  },
  xpReward: {
    fontWeight: '800',
    fontSize: FontSize.md,
  },
  coinReward: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
    marginTop: 2,
  },
  progressArea: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  progressTrack: {
    flex: 1,
    height: 6,
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    marginRight: Spacing.sm,
  },
  progressFill: {
    height: '100%',
    borderRadius: BorderRadius.full,
  },
  progressText: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
    fontWeight: '600',
    minWidth: 40,
    textAlign: 'right',
  },
  shieldBadge: {
    marginTop: Spacing.sm,
    backgroundColor: 'rgba(239, 159, 39, 0.12)',
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    alignSelf: 'flex-start',
  },
  shieldText: {
    color: Colors.amber,
    fontSize: FontSize.xs,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.md,
    justifyContent: 'space-between',
  },
  typeBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  typeText: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    letterSpacing: 1,
  },
  targetText: {
    color: Colors.textMuted,
    fontSize: FontSize.sm,
  },
});
