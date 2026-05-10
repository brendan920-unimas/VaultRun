import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/Colors';
import { getTierColor } from '@/store/gameStore';
import type { SquadMember } from '@/types';

interface SquadMemberCardProps {
  member: SquadMember;
  contribution: number;
  target: number;
  onNudge?: () => void;
  isCurrentUser?: boolean;
}

export function SquadMemberCard({
  member,
  contribution,
  target,
  onNudge,
  isCurrentUser,
}: SquadMemberCardProps) {
  const progress = Math.min(contribution / (target / 4), 1); // each member's fair share
  const tierColor = getTierColor(member.tier);
  const isBehind = progress < 0.5;

  return (
    <View style={[styles.card, isCurrentUser && styles.currentUserCard]}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {member.displayName.charAt(0)}
          </Text>
          {member.isOnline && <View style={styles.onlineDot} />}
        </View>
        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{member.displayName}</Text>
            {isCurrentUser && (
              <View style={styles.youBadge}>
                <Text style={styles.youText}>YOU</Text>
              </View>
            )}
          </View>
          <Text style={[styles.tier, { color: tierColor }]}>
            Lv {member.level} • {member.tier}
          </Text>
        </View>
        <View style={styles.contributionArea}>
          <Text style={styles.contributionValue}>RM{contribution}</Text>
          {isBehind && !isCurrentUser && onNudge && (
            <Pressable style={styles.nudgeBtn} onPress={onNudge}>
              <Text style={styles.nudgeText}>👊 Nudge</Text>
            </Pressable>
          )}
        </View>
      </View>

      <View style={styles.progressArea}>
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${progress * 100}%`,
                backgroundColor: isBehind ? Colors.amber : Colors.teal,
              },
            ]}
          />
        </View>
        <Text style={[styles.progressText, isBehind && { color: Colors.amber }]}>
          {Math.round(progress * 100)}%
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  currentUserCard: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(127, 119, 221, 0.08)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  avatarText: {
    color: Colors.primary,
    fontSize: FontSize.xl,
    fontWeight: '700',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.teal,
    borderWidth: 2,
    borderColor: Colors.surface,
  },
  info: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    color: Colors.text,
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
  youBadge: {
    marginLeft: Spacing.sm,
    backgroundColor: 'rgba(127, 119, 221, 0.2)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  youText: {
    color: Colors.primary,
    fontSize: FontSize.xs,
    fontWeight: '800',
    letterSpacing: 1,
  },
  tier: {
    fontSize: FontSize.sm,
    marginTop: 2,
  },
  contributionArea: {
    alignItems: 'flex-end',
  },
  contributionValue: {
    color: Colors.teal,
    fontSize: FontSize.lg,
    fontWeight: '800',
  },
  nudgeBtn: {
    marginTop: Spacing.xs,
    backgroundColor: 'rgba(239, 159, 39, 0.15)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  nudgeText: {
    color: Colors.amber,
    fontSize: FontSize.xs,
    fontWeight: '700',
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
    minWidth: 30,
    textAlign: 'right',
  },
});
