import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/Colors';
import { useGameStore, getTierColor } from '@/store/gameStore';
import { XPBar } from '@/components/XPBar';

export default function ProfileScreen() {
  const { user, badges } = useGameStore();
  const tierColor = getTierColor(user.tier);
  const earned = badges.filter(b => b.earnedAt);
  const locked = badges.filter(b => !b.earnedAt);

  const rarityColors: Record<string, string> = {
    common: Colors.textMuted,
    rare: Colors.primary,
    epic: Colors.amber,
    legendary: Colors.danger,
  };

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <ScrollView contentContainerStyle={s.sc} showsVerticalScrollIndicator={false}>
        {/* Profile header */}
        <View style={s.profileCard}>
          <View style={[s.avatar, { borderColor: tierColor }]}>
            <Text style={s.avatarText}>{user.displayName.charAt(0)}</Text>
          </View>
          <Text style={s.name}>{user.displayName}</Text>
          <Text style={[s.tier, { color: tierColor }]}>{user.tier}</Text>
          <Text style={s.username}>@{user.username}</Text>
        </View>

        {/* XP Bar */}
        <View style={s.xpSection}>
          <XPBar current={user.xp} max={user.xpToNextLevel} level={user.level} tier={user.tier} color={tierColor} />
        </View>

        {/* Stats grid */}
        <View style={s.grid}>
          {[
            { icon: '💰', label: 'Total Saved', value: `RM${user.totalSaved.toLocaleString()}` },
            { icon: '🔥', label: 'Day Streak', value: `${user.streakDays} days` },
            { icon: '🪙', label: 'Vault Coins', value: user.vaultCoins.toLocaleString() },
            { icon: '🛡️', label: 'Streak Shields', value: `${user.streakShields}` },
            { icon: '🏆', label: 'Badges', value: `${earned.length}/${badges.length}` },
            { icon: '📅', label: 'Joined', value: new Date(user.joinedAt).toLocaleDateString('en-MY', { month: 'short', year: 'numeric' }) },
          ].map((stat, i) => (
            <View key={i} style={s.statCard}>
              <Text style={s.statIcon}>{stat.icon}</Text>
              <Text style={s.statValue}>{stat.value}</Text>
              <Text style={s.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Badges */}
        <Text style={s.secTitle}>🏆 Badges Earned</Text>
        <View style={s.badgeGrid}>
          {earned.map(b => (
            <View key={b.id} style={[s.badge, { borderColor: `${rarityColors[b.rarity]}44` }]}>
              <Text style={s.badgeIcon}>{b.icon}</Text>
              <Text style={s.badgeName}>{b.name}</Text>
              <Text style={[s.badgeRarity, { color: rarityColors[b.rarity] }]}>{b.rarity.toUpperCase()}</Text>
            </View>
          ))}
        </View>

        {locked.length > 0 && (
          <>
            <Text style={s.secTitle}>🔒 Locked</Text>
            <View style={s.badgeGrid}>
              {locked.map(b => (
                <View key={b.id} style={[s.badge, s.badgeLocked]}>
                  <Text style={[s.badgeIcon, { opacity: 0.3 }]}>❓</Text>
                  <Text style={[s.badgeName, { color: Colors.textMuted }]}>{b.name}</Text>
                  <Text style={[s.badgeRarity, { color: rarityColors[b.rarity] }]}>{b.rarity.toUpperCase()}</Text>
                </View>
              ))}
            </View>
          </>
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  sc: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.md },
  profileCard: { alignItems: 'center', paddingVertical: Spacing.xxl },
  avatar: { width: 88, height: 88, borderRadius: 44, backgroundColor: Colors.surfaceLight, alignItems: 'center', justifyContent: 'center', borderWidth: 3, marginBottom: Spacing.lg },
  avatarText: { color: Colors.text, fontSize: 36, fontWeight: '800' },
  name: { color: Colors.text, fontSize: FontSize.xxl, fontWeight: '800' },
  tier: { fontSize: FontSize.md, fontWeight: '700', marginTop: Spacing.xs },
  username: { color: Colors.textMuted, fontSize: FontSize.md, marginTop: Spacing.xs },
  xpSection: { marginBottom: Spacing.xxl },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md, marginBottom: Spacing.xxl },
  statCard: { width: '30%', flexGrow: 1, backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, padding: Spacing.lg, alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  statIcon: { fontSize: 24, marginBottom: Spacing.sm },
  statValue: { color: Colors.text, fontSize: FontSize.lg, fontWeight: '800' },
  statLabel: { color: Colors.textMuted, fontSize: FontSize.xs, marginTop: Spacing.xs, textAlign: 'center' },
  secTitle: { color: Colors.text, fontSize: FontSize.xl, fontWeight: '700', marginBottom: Spacing.lg },
  badgeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md, marginBottom: Spacing.xxl },
  badge: { width: '46%', flexGrow: 1, backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, padding: Spacing.lg, alignItems: 'center', borderWidth: 1 },
  badgeLocked: { borderColor: Colors.border, opacity: 0.5 },
  badgeIcon: { fontSize: 32, marginBottom: Spacing.sm },
  badgeName: { color: Colors.text, fontSize: FontSize.sm, fontWeight: '700', textAlign: 'center' },
  badgeRarity: { fontSize: FontSize.xs, fontWeight: '800', letterSpacing: 1, marginTop: Spacing.xs },
});
