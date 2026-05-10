import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/Colors';
import { useGameStore } from '@/store/gameStore';

export default function VaultScreen() {
  const { vault, transactions, toggleSalaryTrigger, setSalaryTriggerPercent } = useGameStore();
  const [selectedPct, setSelectedPct] = useState(vault.salaryTriggerPercent);

  const percentages = [10, 15, 20, 25, 30];

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <View style={s.hdr}>
        <Pressable onPress={() => router.back()} style={s.back}>
          <Text style={s.backText}>← Back</Text>
        </Pressable>
        <Text style={s.title}>🏦 Your Vault</Text>
      </View>
      <ScrollView contentContainerStyle={s.sc} showsVerticalScrollIndicator={false}>
        {/* Balance card */}
        <View style={s.balCard}>
          <Text style={s.balLabel}>Total Vault Balance</Text>
          <Text style={s.balAmount}>RM {vault.totalBalance.toLocaleString('en-MY', { minimumFractionDigits: 2 })}</Text>
          <View style={s.balRow}>
            <View style={s.balStat}>
              <Text style={[s.balStatVal, { color: Colors.teal }]}>+RM{vault.monthlyDeposits}</Text>
              <Text style={s.balStatLabel}>Deposits</Text>
            </View>
            <View style={s.balDivider} />
            <View style={s.balStat}>
              <Text style={[s.balStatVal, { color: Colors.danger }]}>-RM{vault.monthlyWithdrawals}</Text>
              <Text style={s.balStatLabel}>Spent</Text>
            </View>
            <View style={s.balDivider} />
            <View style={s.balStat}>
              <Text style={[s.balStatVal, { color: Colors.teal }]}>+RM{(vault.monthlyDeposits - vault.monthlyWithdrawals)}</Text>
              <Text style={s.balStatLabel}>Net</Text>
            </View>
          </View>
        </View>

        {/* Round-up Jar */}
        <View style={s.section}>
          <View style={s.secHeader}>
            <Text style={s.secIcon}>🪙</Text>
            <View>
              <Text style={s.secTitle}>Round-Up Jar</Text>
              <Text style={s.secSub}>Spare change auto-saved from transactions</Text>
            </View>
          </View>
          <View style={s.jarCard}>
            <Text style={s.jarAmount}>RM {vault.roundUpJar.toFixed(2)}</Text>
            <Text style={s.jarLabel}>saved this month</Text>
            <View style={s.jarProgress}>
              <View style={[s.jarFill, { width: `${Math.min((vault.roundUpJar / 50) * 100, 100)}%` }]} />
            </View>
            <Text style={s.jarGoal}>Goal: RM50.00</Text>
          </View>
          {/* Recent round-ups */}
          {transactions.filter(t => t.roundUpAmount && t.roundUpAmount > 0).slice(0, 4).map(t => (
            <View key={t.id} style={s.roundupRow}>
              <Text style={s.roundupIcon}>{t.icon}</Text>
              <Text style={s.roundupMerchant}>{t.merchant}</Text>
              <Text style={s.roundupAmt}>+RM{t.roundUpAmount?.toFixed(2)}</Text>
            </View>
          ))}
        </View>

        {/* Salary Trigger */}
        <View style={s.section}>
          <View style={s.secHeader}>
            <Text style={s.secIcon}>💼</Text>
            <View style={{ flex: 1 }}>
              <Text style={s.secTitle}>Salary Trigger</Text>
              <Text style={s.secSub}>Auto-save when salary arrives</Text>
            </View>
            <Switch
              value={vault.salaryTriggerEnabled}
              onValueChange={toggleSalaryTrigger}
              trackColor={{ false: Colors.surfaceLight, true: Colors.primaryDim }}
              thumbColor={vault.salaryTriggerEnabled ? Colors.primary : Colors.textMuted}
            />
          </View>
          {vault.salaryTriggerEnabled && (
            <View style={s.triggerCard}>
              <Text style={s.triggerLabel}>Auto-save percentage</Text>
              <View style={s.pctRow}>
                {percentages.map(p => (
                  <Pressable
                    key={p}
                    style={[s.pctBtn, selectedPct === p && s.pctBtnActive]}
                    onPress={() => { setSelectedPct(p); setSalaryTriggerPercent(p); }}
                  >
                    <Text style={[s.pctText, selectedPct === p && s.pctTextActive]}>{p}%</Text>
                  </Pressable>
                ))}
              </View>
              {vault.lastSalaryDate && (
                <Text style={s.lastSalary}>Last salary: {new Date(vault.lastSalaryDate).toLocaleDateString('en-MY', { day: 'numeric', month: 'short', year: 'numeric' })}</Text>
              )}
            </View>
          )}
        </View>

        {/* Transactions */}
        <View style={s.section}>
          <Text style={s.secTitlePlain}>📊 Recent Transactions</Text>
          {transactions.map(t => (
            <View key={t.id} style={s.txRow}>
              <Text style={s.txIcon}>{t.icon}</Text>
              <View style={s.txInfo}>
                <Text style={s.txName}>{t.merchant}</Text>
                <Text style={s.txCat}>{t.category} • {new Date(t.date).toLocaleDateString('en-MY', { day: 'numeric', month: 'short' })}</Text>
              </View>
              <Text style={s.txAmt}>-RM{t.amount.toFixed(2)}</Text>
            </View>
          ))}
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  hdr: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, paddingBottom: Spacing.lg },
  back: { marginBottom: Spacing.md },
  backText: { color: Colors.primary, fontSize: FontSize.md, fontWeight: '600' },
  title: { color: Colors.text, fontSize: FontSize.xxxl, fontWeight: '800' },
  sc: { paddingHorizontal: Spacing.lg },
  balCard: { backgroundColor: Colors.surface, borderRadius: BorderRadius.xl, padding: Spacing.xxl, borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.xxl },
  balLabel: { color: Colors.textMuted, fontSize: FontSize.sm, marginBottom: Spacing.sm },
  balAmount: { color: Colors.text, fontSize: 40, fontWeight: '800', marginBottom: Spacing.xxl },
  balRow: { flexDirection: 'row' },
  balStat: { flex: 1, alignItems: 'center' },
  balStatVal: { fontSize: FontSize.lg, fontWeight: '700' },
  balStatLabel: { color: Colors.textMuted, fontSize: FontSize.xs, marginTop: Spacing.xs },
  balDivider: { width: 1, backgroundColor: Colors.border },
  section: { marginBottom: Spacing.xxl },
  secHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.lg },
  secIcon: { fontSize: 28, marginRight: Spacing.md },
  secTitle: { color: Colors.text, fontSize: FontSize.xl, fontWeight: '700' },
  secSub: { color: Colors.textMuted, fontSize: FontSize.sm, marginTop: 2 },
  secTitlePlain: { color: Colors.text, fontSize: FontSize.xl, fontWeight: '700', marginBottom: Spacing.lg },
  jarCard: { backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, padding: Spacing.lg, borderWidth: 1, borderColor: 'rgba(29,158,117,0.3)', marginBottom: Spacing.lg },
  jarAmount: { color: Colors.teal, fontSize: FontSize.xxxl, fontWeight: '800', textAlign: 'center' },
  jarLabel: { color: Colors.textMuted, fontSize: FontSize.sm, textAlign: 'center', marginBottom: Spacing.lg },
  jarProgress: { height: 8, backgroundColor: Colors.surfaceLight, borderRadius: BorderRadius.full, overflow: 'hidden', marginBottom: Spacing.sm },
  jarFill: { height: '100%', backgroundColor: Colors.teal, borderRadius: BorderRadius.full },
  jarGoal: { color: Colors.textMuted, fontSize: FontSize.xs, textAlign: 'right' },
  roundupRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.border },
  roundupIcon: { fontSize: 20, marginRight: Spacing.md },
  roundupMerchant: { flex: 1, color: Colors.textSecondary, fontSize: FontSize.sm },
  roundupAmt: { color: Colors.teal, fontSize: FontSize.sm, fontWeight: '700' },
  triggerCard: { backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, padding: Spacing.lg, borderWidth: 1, borderColor: Colors.border },
  triggerLabel: { color: Colors.textSecondary, fontSize: FontSize.sm, marginBottom: Spacing.md },
  pctRow: { flexDirection: 'row', gap: Spacing.sm },
  pctBtn: { flex: 1, paddingVertical: Spacing.md, alignItems: 'center', borderRadius: BorderRadius.lg, backgroundColor: Colors.surfaceLight, borderWidth: 1, borderColor: Colors.border },
  pctBtnActive: { backgroundColor: 'rgba(127,119,221,0.15)', borderColor: Colors.primary },
  pctText: { color: Colors.textMuted, fontSize: FontSize.md, fontWeight: '700' },
  pctTextActive: { color: Colors.primary },
  lastSalary: { color: Colors.textMuted, fontSize: FontSize.xs, marginTop: Spacing.md },
  txRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.border },
  txIcon: { fontSize: 22, marginRight: Spacing.md },
  txInfo: { flex: 1 },
  txName: { color: Colors.text, fontSize: FontSize.md, fontWeight: '600' },
  txCat: { color: Colors.textMuted, fontSize: FontSize.sm, marginTop: 2 },
  txAmt: { color: Colors.danger, fontSize: FontSize.md, fontWeight: '700' },
});
