import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/Colors';
import { useGameStore } from '@/store/gameStore';
import { SquadMemberCard } from '@/components/SquadMemberCard';

export default function SquadScreen() {
  const { squad, user, sendNudge } = useGameStore();

  const handleNudge = (name: string, id: string) => {
    Alert.alert('👊 Nudge Sent!', `${name} will get a push notification to step up!`);
    sendNudge(id);
  };

  const progress = Math.round((squad.bossRaidProgress / squad.bossRaidTarget) * 100);

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <ScrollView contentContainerStyle={s.sc} showsVerticalScrollIndicator={false}>
        <Text style={s.title}>👥 {squad.name}</Text>
        <Text style={s.sub}>{squad.members.length} members</Text>

        {/* Boss Raid */}
        <View style={s.boss}>
          <Text style={s.bossEmoji}>🐉</Text>
          <Text style={s.bossName}>{squad.bossName}</Text>
          <Text style={s.bossLabel}>Monthly Boss Raid</Text>
          <View style={s.hpBar}>
            <View style={[s.hpFill, { width: `${100 - progress}%` }]} />
          </View>
          <View style={s.hpRow}>
            <Text style={s.hpText}>HP: {100 - progress}%</Text>
            <Text style={s.hpAmt}>
              RM{squad.bossRaidProgress.toLocaleString()} / RM{squad.bossRaidTarget.toLocaleString()}
            </Text>
          </View>
          <Text style={s.bossMsg}>
            {progress >= 100 ? '🎉 BOSS DEFEATED!' : progress >= 75 ? '💪 Almost there!' : progress >= 50 ? '⚔️ Keep pushing!' : '🔥 The fight begins!'}
          </Text>
        </View>

        {/* Members */}
        <Text style={s.secTitle}>Squad Members</Text>
        {squad.members.map(m => (
          <SquadMemberCard
            key={m.id}
            member={m}
            contribution={m.contribution}
            target={squad.bossRaidTarget}
            isCurrentUser={m.id === user.id}
            onNudge={() => handleNudge(m.displayName, m.id)}
          />
        ))}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  sc: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.md },
  title: { color: Colors.text, fontSize: FontSize.xxxl, fontWeight: '800' },
  sub: { color: Colors.textMuted, fontSize: FontSize.md, marginTop: Spacing.xs, marginBottom: Spacing.xxl },
  boss: { backgroundColor: Colors.surface, borderRadius: BorderRadius.xl, padding: Spacing.xxl, alignItems: 'center', marginBottom: Spacing.xxl, borderWidth: 1, borderColor: 'rgba(229,71,91,0.3)' },
  bossEmoji: { fontSize: 56, marginBottom: Spacing.md },
  bossName: { color: Colors.danger, fontSize: FontSize.xxl, fontWeight: '800', marginBottom: Spacing.xs },
  bossLabel: { color: Colors.textMuted, fontSize: FontSize.sm, marginBottom: Spacing.lg },
  hpBar: { width: '100%', height: 14, backgroundColor: Colors.surfaceLight, borderRadius: BorderRadius.full, overflow: 'hidden', marginBottom: Spacing.sm },
  hpFill: { height: '100%', backgroundColor: Colors.danger, borderRadius: BorderRadius.full },
  hpRow: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.md },
  hpText: { color: Colors.danger, fontWeight: '700', fontSize: FontSize.md },
  hpAmt: { color: Colors.textMuted, fontSize: FontSize.sm },
  bossMsg: { color: Colors.amber, fontSize: FontSize.lg, fontWeight: '700' },
  secTitle: { color: Colors.textSecondary, fontSize: FontSize.md, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: Spacing.lg },
});
