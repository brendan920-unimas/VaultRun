import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/Colors';
import { useGameStore, getTierColor } from '@/store/gameStore';

type Filter = 'global' | 'squad';

export default function LeaderboardScreen() {
  const { leaderboard, squad, user } = useGameStore();
  const [filter, setFilter] = useState<Filter>('global');

  const data = filter === 'squad'
    ? leaderboard.filter(e => squad.members.some(m => m.id === e.userId))
    : leaderboard;

  const getMedal = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <View style={s.hdr}>
        <Text style={s.title}>🏆 Leaderboard</Text>
        <Text style={s.sub}>Weekly Top Savers</Text>
      </View>
      <View style={s.tabs}>
        {(['global', 'squad'] as Filter[]).map(f => (
          <Pressable key={f} style={[s.tab, filter === f && s.tabA]} onPress={() => setFilter(f)}>
            <Text style={[s.tabT, filter === f && s.tabTA]}>{f === 'global' ? '🌍 Global' : '👥 Squad'}</Text>
          </Pressable>
        ))}
      </View>
      <ScrollView contentContainerStyle={s.sc} showsVerticalScrollIndicator={false}>
        {/* Top 3 podium */}
        {data.length >= 3 && (
          <View style={s.podium}>
            {[data[1], data[0], data[2]].map((e, i) => {
              const pos = [2, 1, 3][i];
              const isFirst = pos === 1;
              return (
                <View key={e.userId} style={[s.podiumItem, isFirst && s.podiumFirst]}>
                  <Text style={s.medal}>{getMedal(pos)}</Text>
                  <View style={[s.podAvatar, isFirst && s.podAvatarFirst, { borderColor: getTierColor(e.tier) }]}>
                    <Text style={s.podAvatarT}>{e.displayName.charAt(0)}</Text>
                  </View>
                  <Text style={s.podName} numberOfLines={1}>{e.displayName}</Text>
                  <Text style={[s.podTier, { color: getTierColor(e.tier) }]}>Lv {e.level}</Text>
                  <Text style={s.podAmt}>RM{e.savedThisWeek}</Text>
                </View>
              );
            })}
          </View>
        )}

        {/* Full list */}
        {data.map((e, i) => {
          const isMe = e.userId === user.id;
          return (
            <View key={e.userId} style={[s.row, isMe && s.rowMe]}>
              <Text style={s.rank}>{getMedal(e.rank)}</Text>
              <View style={[s.avatar, { borderColor: getTierColor(e.tier) }]}>
                <Text style={s.avatarT}>{e.displayName.charAt(0)}</Text>
              </View>
              <View style={s.info}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={s.name}>{e.displayName}</Text>
                  {isMe && <View style={s.youBadge}><Text style={s.youT}>YOU</Text></View>}
                </View>
                <Text style={[s.tier, { color: getTierColor(e.tier) }]}>Lv {e.level} • {e.tier}</Text>
              </View>
              <Text style={s.saved}>RM{e.savedThisWeek}</Text>
            </View>
          );
        })}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  hdr: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.md },
  title: { color: Colors.text, fontSize: FontSize.xxxl, fontWeight: '800' },
  sub: { color: Colors.textMuted, fontSize: FontSize.md, marginTop: Spacing.xs },
  tabs: { flexDirection: 'row', paddingHorizontal: Spacing.lg, marginTop: Spacing.lg, marginBottom: Spacing.lg, gap: Spacing.sm },
  tab: { flex: 1, paddingVertical: Spacing.md, alignItems: 'center', borderRadius: BorderRadius.lg, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border },
  tabA: { backgroundColor: 'rgba(127,119,221,0.15)', borderColor: Colors.primary },
  tabT: { color: Colors.textMuted, fontWeight: '700', fontSize: FontSize.md },
  tabTA: { color: Colors.primary },
  sc: { paddingHorizontal: Spacing.lg },
  podium: { flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end', marginBottom: Spacing.xxxl, paddingTop: Spacing.lg },
  podiumItem: { alignItems: 'center', flex: 1 },
  podiumFirst: { marginBottom: 20 },
  medal: { fontSize: 28, marginBottom: Spacing.sm },
  podAvatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: Colors.surfaceLight, alignItems: 'center', justifyContent: 'center', borderWidth: 2, marginBottom: Spacing.sm },
  podAvatarFirst: { width: 64, height: 64, borderRadius: 32 },
  podAvatarT: { color: Colors.text, fontSize: FontSize.xl, fontWeight: '700' },
  podName: { color: Colors.text, fontSize: FontSize.sm, fontWeight: '600', maxWidth: 80, textAlign: 'center' },
  podTier: { fontSize: FontSize.xs, marginTop: 2 },
  podAmt: { color: Colors.teal, fontSize: FontSize.md, fontWeight: '800', marginTop: Spacing.xs },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.lg, borderBottomWidth: 1, borderBottomColor: Colors.border },
  rowMe: { backgroundColor: 'rgba(127,119,221,0.08)', borderRadius: BorderRadius.lg, paddingHorizontal: Spacing.md, marginHorizontal: -Spacing.md, borderBottomWidth: 0 },
  rank: { fontSize: 18, width: 40, textAlign: 'center', color: Colors.textMuted },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.surfaceLight, alignItems: 'center', justifyContent: 'center', borderWidth: 2, marginRight: Spacing.md },
  avatarT: { color: Colors.text, fontSize: FontSize.lg, fontWeight: '700' },
  info: { flex: 1 },
  name: { color: Colors.text, fontSize: FontSize.lg, fontWeight: '700' },
  youBadge: { marginLeft: Spacing.sm, backgroundColor: 'rgba(127,119,221,0.2)', paddingHorizontal: Spacing.sm, paddingVertical: 2, borderRadius: BorderRadius.sm },
  youT: { color: Colors.primary, fontSize: FontSize.xs, fontWeight: '800', letterSpacing: 1 },
  tier: { fontSize: FontSize.sm, marginTop: 2 },
  saved: { color: Colors.teal, fontSize: FontSize.lg, fontWeight: '800' },
});
