import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/Colors';
import { useGameStore } from '@/store/gameStore';
import { QuestCard } from '@/components/QuestCard';
import type { QuestType } from '@/types';

const FILTERS: { key: QuestType | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'daily', label: '⚡ Daily' },
  { key: 'weekly', label: '📅 Weekly' },
  { key: 'epic', label: '🏰 Epic' },
];

export default function QuestsScreen() {
  const { quests, completeQuest } = useGameStore();
  const [filter, setFilter] = useState<QuestType | 'all'>('all');
  const filtered = quests.filter(q => filter === 'all' || q.type === filter);
  const active = filtered.filter(q => q.status === 'active');
  const done = filtered.filter(q => q.status === 'completed');

  const claim = (id: string) => {
    const q = quests.find(x => x.id === id);
    if (q && q.progress >= 100 && q.status === 'active') {
      Alert.alert('🎉 Quest Complete!', `+${q.xpReward} XP and 🪙 ${q.coinReward}!`, [
        { text: 'Claim', onPress: () => completeQuest(id) },
      ]);
    }
  };

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <View style={s.hdr}>
        <Text style={s.title}>⚔️ Quest Board</Text>
        <Text style={s.sub}>{active.length} active • {done.length} completed</Text>
      </View>
      <View style={s.filters}>
        {FILTERS.map(f => (
          <Pressable key={f.key} style={[s.fb, filter === f.key && s.fba]} onPress={() => setFilter(f.key)}>
            <Text style={[s.ft, filter === f.key && s.fta]}>{f.label}</Text>
          </Pressable>
        ))}
      </View>
      <ScrollView style={s.sv} contentContainerStyle={s.sc} showsVerticalScrollIndicator={false}>
        <View style={s.banner}>
          <View style={{ flex: 1 }}>
            <Text style={s.bt}>🎯 Daily Bonus</Text>
            <Text style={s.bd}>Complete all daily quests for 2x XP!</Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text style={s.bm}>2x</Text>
            <Text style={s.bx}>XP</Text>
          </View>
        </View>
        {active.length > 0 && (
          <View style={s.sec}>
            <Text style={s.sh}>Active Quests</Text>
            {active.map(q => <QuestCard key={q.id} quest={q} onPress={() => claim(q.id)} />)}
          </View>
        )}
        {done.length > 0 && (
          <View style={s.sec}>
            <Text style={s.sh}>Completed ✓</Text>
            {done.map(q => <QuestCard key={q.id} quest={q} />)}
          </View>
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  hdr: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, paddingBottom: Spacing.lg },
  title: { color: Colors.text, fontSize: FontSize.xxxl, fontWeight: '800' },
  sub: { color: Colors.textMuted, fontSize: FontSize.md, marginTop: Spacing.xs },
  filters: { flexDirection: 'row', paddingHorizontal: Spacing.lg, marginBottom: Spacing.lg, gap: Spacing.sm },
  fb: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, borderRadius: BorderRadius.full, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border },
  fba: { backgroundColor: 'rgba(127,119,221,0.15)', borderColor: Colors.primary },
  ft: { color: Colors.textMuted, fontSize: FontSize.sm, fontWeight: '600' },
  fta: { color: Colors.primary },
  sv: { flex: 1 },
  sc: { paddingHorizontal: Spacing.lg },
  banner: { backgroundColor: 'rgba(127,119,221,0.1)', borderRadius: BorderRadius.lg, borderWidth: 1, borderColor: 'rgba(127,119,221,0.3)', padding: Spacing.lg, marginBottom: Spacing.xxl, flexDirection: 'row', alignItems: 'center' },
  bt: { color: Colors.primary, fontSize: FontSize.lg, fontWeight: '700', marginBottom: Spacing.xs },
  bd: { color: Colors.textSecondary, fontSize: FontSize.sm },
  bm: { color: Colors.primary, fontSize: FontSize.hero, fontWeight: '900' },
  bx: { color: Colors.primary, fontSize: FontSize.sm, fontWeight: '700', letterSpacing: 2 },
  sec: { marginBottom: Spacing.xxl },
  sh: { color: Colors.textSecondary, fontSize: FontSize.md, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: Spacing.lg },
});
