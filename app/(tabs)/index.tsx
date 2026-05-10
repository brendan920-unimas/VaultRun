import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Animated,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/Colors';
import { useGameStore, getTierColor } from '@/store/gameStore';
import { XPBar } from '@/components/XPBar';
import { QuestCard } from '@/components/QuestCard';
import { StatCard, GlowCard } from '@/components/Cards';

export default function HomeScreen() {
  const { user, quests, squad, vault, badges, transactions } = useGameStore();
  const activeQuests = quests.filter(q => q.status === 'active').slice(0, 3);
  const tierColor = getTierColor(user.tier);

  // Animated values for entrance
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View
          style={[
            styles.header,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <View>
            <Text style={styles.greeting}>Good afternoon,</Text>
            <Text style={styles.userName}>{user.displayName} ⚔️</Text>
          </View>
          <View style={styles.headerRight}>
            <View style={styles.coinBadge}>
              <Text style={styles.coinIcon}>🪙</Text>
              <Text style={styles.coinValue}>{user.vaultCoins.toLocaleString()}</Text>
            </View>
            <View style={styles.streakBadge}>
              <Text style={styles.streakIcon}>🔥</Text>
              <Text style={styles.streakValue}>{user.streakDays}</Text>
            </View>
          </View>
        </Animated.View>

        {/* Vault Balance Card */}
        <Animated.View
          style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
        >
          <Pressable onPress={() => router.push('/vault')}>
            <GlowCard glowColor={Colors.primaryGlow} style={styles.vaultCard}>
              <View style={styles.vaultHeader}>
                <Text style={styles.vaultLabel}>🏦 Your Vault</Text>
                <Text style={styles.vaultLink}>See all →</Text>
              </View>
              <Text style={styles.vaultBalance}>
                RM {vault.totalBalance.toLocaleString('en-MY', { minimumFractionDigits: 2 })}
              </Text>
              <View style={styles.vaultStats}>
                <View style={styles.vaultStat}>
                  <Text style={styles.vaultStatLabel}>Round-up jar</Text>
                  <Text style={[styles.vaultStatValue, { color: Colors.teal }]}>
                    +RM{vault.roundUpJar.toFixed(2)}
                  </Text>
                </View>
                <View style={styles.vaultDivider} />
                <View style={styles.vaultStat}>
                  <Text style={styles.vaultStatLabel}>This month</Text>
                  <Text style={[styles.vaultStatValue, { color: Colors.teal }]}>
                    +RM{vault.monthlyDeposits}
                  </Text>
                </View>
                <View style={styles.vaultDivider} />
                <View style={styles.vaultStat}>
                  <Text style={styles.vaultStatLabel}>Spent</Text>
                  <Text style={[styles.vaultStatValue, { color: Colors.danger }]}>
                    -RM{vault.monthlyWithdrawals}
                  </Text>
                </View>
              </View>
            </GlowCard>
          </Pressable>
        </Animated.View>

        {/* XP Progress */}
        <View style={styles.section}>
          <XPBar
            current={user.xp}
            max={user.xpToNextLevel}
            level={user.level}
            tier={user.tier}
            color={tierColor}
          />
        </View>

        {/* Quick Stats */}
        <View style={styles.statsRow}>
          <StatCard
            icon="🛡️"
            label="Streak Shields"
            value={`${user.streakShields}`}
            accentColor={Colors.amber}
          />
          <StatCard
            icon="🏆"
            label="Badges"
            value={`${badges.filter(b => b.earnedAt).length}`}
            subValue={`of ${badges.length}`}
            accentColor={Colors.primary}
          />
          <StatCard
            icon="💰"
            label="Total Saved"
            value={`RM${(user.totalSaved / 1000).toFixed(1)}k`}
            accentColor={Colors.teal}
          />
        </View>

        {/* Active Quests Preview */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>⚔️ Active Quests</Text>
            <Pressable onPress={() => router.push('/(tabs)/quests')}>
              <Text style={styles.seeAll}>See all →</Text>
            </Pressable>
          </View>
          {activeQuests.map(quest => (
            <QuestCard key={quest.id} quest={quest} compact />
          ))}
        </View>

        {/* Squad Boss Raid Preview */}
        {squad && (
          <Pressable onPress={() => router.push('/(tabs)/squad')}>
            <GlowCard glowColor={Colors.dangerGlow} style={styles.bossCard}>
              <View style={styles.bossHeader}>
                <Text style={styles.bossTitle}>🐉 Boss Raid</Text>
                <Text style={styles.bossName}>{squad.bossName}</Text>
              </View>
              <Text style={styles.squadName}>Squad: {squad.name}</Text>
              <View style={styles.bossProgressArea}>
                <View style={styles.bossProgressTrack}>
                  <View
                    style={[
                      styles.bossProgressFill,
                      {
                        width: `${(squad.bossRaidProgress / squad.bossRaidTarget) * 100}%`,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.bossProgressText}>
                  {Math.round((squad.bossRaidProgress / squad.bossRaidTarget) * 100)}%
                </Text>
              </View>
              <Text style={styles.bossAmountText}>
                RM{squad.bossRaidProgress.toLocaleString()} / RM{squad.bossRaidTarget.toLocaleString()}
              </Text>
            </GlowCard>
          </Pressable>
        )}

        {/* Recent Transactions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Recent Activity</Text>
          {transactions.slice(0, 4).map(tx => (
            <View key={tx.id} style={styles.txRow}>
              <Text style={styles.txIcon}>{tx.icon}</Text>
              <View style={styles.txInfo}>
                <Text style={styles.txMerchant}>{tx.merchant}</Text>
                <Text style={styles.txCategory}>{tx.category}</Text>
              </View>
              <View style={styles.txAmountArea}>
                <Text style={styles.txAmount}>-RM{tx.amount.toFixed(2)}</Text>
                {(tx.roundUpAmount ?? 0) > 0 && (
                  <Text style={styles.txRoundup}>+RM{(tx.roundUpAmount ?? 0).toFixed(2)} saved</Text>
                )}
              </View>
            </View>
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.xxl,
  },
  greeting: {
    color: Colors.textMuted,
    fontSize: FontSize.md,
  },
  userName: {
    color: Colors.text,
    fontSize: FontSize.xxxl,
    fontWeight: '800',
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  coinBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  coinIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  coinValue: {
    color: Colors.amber,
    fontWeight: '700',
    fontSize: FontSize.sm,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  streakIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  streakValue: {
    color: Colors.amber,
    fontWeight: '700',
    fontSize: FontSize.sm,
  },
  vaultCard: {
    marginBottom: Spacing.xxl,
  },
  vaultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  vaultLabel: {
    color: Colors.textSecondary,
    fontSize: FontSize.md,
    fontWeight: '600',
  },
  vaultLink: {
    color: Colors.primary,
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  vaultBalance: {
    color: Colors.text,
    fontSize: FontSize.hero,
    fontWeight: '800',
    marginBottom: Spacing.lg,
  },
  vaultStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  vaultStat: {
    flex: 1,
    alignItems: 'center',
  },
  vaultStatLabel: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
    marginBottom: 4,
  },
  vaultStatValue: {
    fontSize: FontSize.md,
    fontWeight: '700',
  },
  vaultDivider: {
    width: 1,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.sm,
  },
  section: {
    marginBottom: Spacing.xxl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: FontSize.xl,
    fontWeight: '700',
    marginBottom: Spacing.lg,
  },
  seeAll: {
    color: Colors.primary,
    fontSize: FontSize.sm,
    fontWeight: '600',
    marginBottom: Spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: Spacing.xxl,
    marginHorizontal: -Spacing.xs,
  },
  bossCard: {
    marginBottom: Spacing.xxl,
    borderColor: 'rgba(229, 71, 91, 0.3)',
  },
  bossHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  bossTitle: {
    color: Colors.danger,
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
  bossName: {
    color: Colors.text,
    fontSize: FontSize.lg,
    fontWeight: '800',
  },
  squadName: {
    color: Colors.textMuted,
    fontSize: FontSize.sm,
    marginBottom: Spacing.md,
  },
  bossProgressArea: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  bossProgressTrack: {
    flex: 1,
    height: 10,
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    marginRight: Spacing.sm,
  },
  bossProgressFill: {
    height: '100%',
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.danger,
  },
  bossProgressText: {
    color: Colors.danger,
    fontWeight: '800',
    fontSize: FontSize.md,
  },
  bossAmountText: {
    color: Colors.textMuted,
    fontSize: FontSize.sm,
    textAlign: 'center',
  },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  txIcon: {
    fontSize: 24,
    marginRight: Spacing.md,
  },
  txInfo: {
    flex: 1,
  },
  txMerchant: {
    color: Colors.text,
    fontSize: FontSize.md,
    fontWeight: '600',
  },
  txCategory: {
    color: Colors.textMuted,
    fontSize: FontSize.sm,
    marginTop: 2,
  },
  txAmountArea: {
    alignItems: 'flex-end',
  },
  txAmount: {
    color: Colors.danger,
    fontSize: FontSize.md,
    fontWeight: '700',
  },
  txRoundup: {
    color: Colors.teal,
    fontSize: FontSize.xs,
    marginTop: 2,
  },
});
