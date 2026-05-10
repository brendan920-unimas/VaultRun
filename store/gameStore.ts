import { create } from 'zustand';
import type {
  User,
  Quest,
  Squad,
  Badge,
  Transaction,
  LeaderboardEntry,
  ChatMessage,
  VaultSummary,
  LevelTier,
} from '@/types';

// ============================================================
// Helper: Calculate tier from level
// ============================================================
export function getTier(level: number): LevelTier {
  if (level <= 5) return 'Rookie Saver';
  if (level <= 15) return 'Vault Knight';
  if (level <= 30) return 'Gold Warden';
  return 'Vault Legend';
}

export function getXpForLevel(level: number): number {
  // Exponential curve: each level needs more XP
  return Math.floor(100 * Math.pow(1.15, level - 1));
}

export function getTierColor(tier: LevelTier): string {
  switch (tier) {
    case 'Rookie Saver': return '#7f77dd';
    case 'Vault Knight': return '#1d9e75';
    case 'Gold Warden': return '#ef9f27';
    case 'Vault Legend': return '#e5475b';
  }
}

// ============================================================
// Mock Data
// ============================================================
const MOCK_USER: User = {
  id: 'u1',
  username: 'aimanzul',
  displayName: 'Aiman Zulkifli',
  email: 'aiman@utm.my',
  level: 12,
  xp: 740,
  xpToNextLevel: 880,
  tier: 'Vault Knight',
  totalSaved: 2847.60,
  vaultCoins: 1250,
  streakDays: 14,
  streakShields: 2,
  joinedAt: '2026-01-15',
  squadId: 's1',
  profileFrame: 'knight_gold',
  characterSkin: 'cyber_samurai',
};

const MOCK_QUESTS: Quest[] = [
  {
    id: 'q1',
    title: 'Kopi Kurang Challenge',
    description: 'Spend under RM8 on drinks today',
    type: 'daily',
    status: 'active',
    xpReward: 25,
    coinReward: 10,
    progress: 60,
    targetAmount: 8,
    currentAmount: 4.80,
    deadline: '2026-05-10T23:59:59',
    category: 'food',
    icon: '☕',
  },
  {
    id: 'q2',
    title: 'Transport Saver',
    description: 'Keep transport spending under RM15 this week',
    type: 'weekly',
    status: 'active',
    xpReward: 75,
    coinReward: 30,
    progress: 45,
    targetAmount: 15,
    currentAmount: 6.70,
    deadline: '2026-05-16T23:59:59',
    category: 'transport',
    icon: '🚇',
  },
  {
    id: 'q3',
    title: 'Vault Guardian',
    description: 'Save RM200 this month',
    type: 'epic',
    status: 'active',
    xpReward: 250,
    coinReward: 100,
    progress: 68,
    targetAmount: 200,
    currentAmount: 136,
    deadline: '2026-05-31T23:59:59',
    category: 'savings',
    icon: '🏰',
    streakShieldReward: true,
  },
  {
    id: 'q4',
    title: 'No GrabFood Day',
    description: 'Don\'t order any food delivery today',
    type: 'daily',
    status: 'active',
    xpReward: 30,
    coinReward: 15,
    progress: 100,
    deadline: '2026-05-10T23:59:59',
    category: 'food',
    icon: '🍔',
  },
  {
    id: 'q5',
    title: 'Budget Warrior',
    description: 'Stay under RM50 total spending for 3 days',
    type: 'weekly',
    status: 'active',
    xpReward: 100,
    coinReward: 40,
    progress: 33,
    targetAmount: 50,
    currentAmount: 28.50,
    deadline: '2026-05-16T23:59:59',
    category: 'savings',
    icon: '⚔️',
  },
  {
    id: 'q6',
    title: 'First Blood',
    description: 'Complete your first daily quest',
    type: 'daily',
    status: 'completed',
    xpReward: 15,
    coinReward: 5,
    progress: 100,
    deadline: '2026-05-10T23:59:59',
    category: 'general',
    icon: '🎯',
  },
];

const MOCK_BADGES: Badge[] = [
  { id: 'b1', name: 'First Saver', description: 'Made your first deposit', icon: '🛡️', earnedAt: '2026-01-15', rarity: 'common' },
  { id: 'b2', name: 'Week Warrior', description: '7-day saving streak', icon: '⚔️', earnedAt: '2026-02-01', rarity: 'rare' },
  { id: 'b3', name: 'Kopi Master', description: 'Completed 10 drink challenges', icon: '☕', earnedAt: '2026-03-10', rarity: 'rare' },
  { id: 'b4', name: 'Squad Leader', description: 'Lead a squad to a Boss Raid victory', icon: '👑', earnedAt: '2026-04-01', rarity: 'epic' },
  { id: 'b5', name: 'Vault Knight', description: 'Reached Level 6', icon: '🏰', earnedAt: '2026-02-20', rarity: 'common' },
  { id: 'b6', name: 'Round-Up Rookie', description: 'Saved RM10 from round-ups', icon: '🪙', earnedAt: '2026-01-28', rarity: 'common' },
  { id: 'b7', name: 'Legend Slayer', description: 'Defeat a Legendary Boss Raid', icon: '🐉', rarity: 'legendary' },
  { id: 'b8', name: 'Ironclad Streak', description: '30-day saving streak', icon: '🔥', rarity: 'epic' },
];

const MOCK_SQUAD: Squad = {
  id: 's1',
  name: 'Budget Ronin',
  members: [
    { id: 'u1', username: 'aimanzul', displayName: 'Aiman Z.', level: 12, tier: 'Vault Knight', contribution: 420, isOnline: true },
    { id: 'u2', username: 'syafiqah', displayName: 'Syafiqah M.', level: 8, tier: 'Vault Knight', contribution: 380, isOnline: true },
    { id: 'u3', username: 'haziq99', displayName: 'Haziq R.', level: 15, tier: 'Vault Knight', contribution: 510, isOnline: false },
    { id: 'u4', username: 'ainaaa', displayName: 'Aina S.', level: 6, tier: 'Vault Knight', contribution: 290, isOnline: true },
  ],
  bossRaidTarget: 2500,
  bossRaidProgress: 1700,
  bossName: 'The Debt Dragon',
  bossHealth: 32,
  createdAt: '2026-03-01',
};

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 't1', merchant: 'GrabFood - McDonalds', category: 'Food', amount: 18.90, date: '2026-05-10T12:30:00', roundUpAmount: 0.10, icon: '🍔' },
  { id: 't2', merchant: 'KTM Komuter', category: 'Transport', amount: 3.20, date: '2026-05-10T08:15:00', roundUpAmount: 0.80, icon: '🚇' },
  { id: 't3', merchant: '99 Speedmart', category: 'Groceries', amount: 23.45, date: '2026-05-09T19:40:00', roundUpAmount: 0.55, icon: '🛒' },
  { id: 't4', merchant: 'Shell Petrol', category: 'Transport', amount: 40.00, date: '2026-05-09T07:20:00', roundUpAmount: 0.00, icon: '⛽' },
  { id: 't5', merchant: 'Tealive', category: 'Food', amount: 8.90, date: '2026-05-08T15:00:00', roundUpAmount: 0.10, icon: '🧋' },
  { id: 't6', merchant: 'Shopee', category: 'Shopping', amount: 45.00, date: '2026-05-08T22:10:00', roundUpAmount: 0.00, icon: '🛍️' },
  { id: 't7', merchant: 'Petronas Mesra', category: 'Food', amount: 5.50, date: '2026-05-07T13:00:00', roundUpAmount: 0.50, icon: '🏪' },
  { id: 't8', merchant: 'Netflix Malaysia', category: 'Entertainment', amount: 35.90, date: '2026-05-07T00:01:00', roundUpAmount: 0.10, icon: '🎬' },
  { id: 't9', merchant: 'TouchnGo eWallet', category: 'Transport', amount: 50.00, date: '2026-05-06T09:00:00', roundUpAmount: 0.00, icon: '💳' },
  { id: 't10', merchant: 'Mamak Corner', category: 'Food', amount: 12.00, date: '2026-05-06T21:30:00', roundUpAmount: 0.00, icon: '🍛' },
];

const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, userId: 'u3', username: 'haziq99', displayName: 'Haziq R.', tier: 'Vault Knight', level: 15, savedThisWeek: 245 },
  { rank: 2, userId: 'u1', username: 'aimanzul', displayName: 'Aiman Z.', tier: 'Vault Knight', level: 12, savedThisWeek: 198 },
  { rank: 3, userId: 'u5', username: 'nurfarah', displayName: 'Nur Farah', tier: 'Gold Warden', level: 18, savedThisWeek: 175 },
  { rank: 4, userId: 'u2', username: 'syafiqah', displayName: 'Syafiqah M.', tier: 'Vault Knight', level: 8, savedThisWeek: 152 },
  { rank: 5, userId: 'u6', username: 'danialh', displayName: 'Danial H.', tier: 'Rookie Saver', level: 4, savedThisWeek: 120 },
  { rank: 6, userId: 'u4', username: 'ainaaa', displayName: 'Aina S.', tier: 'Vault Knight', level: 6, savedThisWeek: 98 },
  { rank: 7, userId: 'u7', username: 'izzati', displayName: 'Izzati K.', tier: 'Gold Warden', level: 22, savedThisWeek: 88 },
  { rank: 8, userId: 'u8', username: 'adam_fit', displayName: 'Adam F.', tier: 'Rookie Saver', level: 3, savedThisWeek: 65 },
];

const MOCK_VAULT: VaultSummary = {
  totalBalance: 2847.60,
  roundUpJar: 12.40,
  salaryTriggerPercent: 20,
  salaryTriggerEnabled: true,
  lastSalaryDate: '2026-05-01',
  monthlyDeposits: 680,
  monthlyWithdrawals: 245,
};

// ============================================================
// Zustand Store
// ============================================================
interface GameStore {
  // State
  user: User;
  quests: Quest[];
  badges: Badge[];
  squad: Squad;
  transactions: Transaction[];
  leaderboard: LeaderboardEntry[];
  chatMessages: ChatMessage[];
  vault: VaultSummary;
  isLoading: boolean;
  activeTab: string;

  // Actions
  setActiveTab: (tab: string) => void;
  completeQuest: (questId: string) => void;
  addXp: (amount: number) => void;
  addChatMessage: (message: ChatMessage) => void;
  sendNudge: (memberId: string) => void;
  toggleSalaryTrigger: () => void;
  setSalaryTriggerPercent: (percent: number) => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  // Initial state with mock data
  user: MOCK_USER,
  quests: MOCK_QUESTS,
  badges: MOCK_BADGES,
  squad: MOCK_SQUAD,
  transactions: MOCK_TRANSACTIONS,
  leaderboard: MOCK_LEADERBOARD,
  chatMessages: [
    {
      id: 'c1',
      role: 'assistant',
      content: "Hey Aiman! 👋 I noticed you spent RM80 on bubble tea this week — that's 2x your usual. Want to activate a **Kopi Kurang Challenge**? You'll earn 25 XP if you keep drinks under RM8 today! ☕",
      timestamp: '2026-05-10T09:00:00',
    },
  ],
  vault: MOCK_VAULT,
  isLoading: false,
  activeTab: 'home',

  // Actions
  setActiveTab: (tab) => set({ activeTab: tab }),

  completeQuest: (questId) => set((state) => {
    const quest = state.quests.find(q => q.id === questId);
    if (!quest || quest.status !== 'active') return state;

    const newXp = state.user.xp + quest.xpReward;
    const newCoins = state.user.vaultCoins + quest.coinReward;
    let newLevel = state.user.level;
    let remainingXp = newXp;

    // Level up logic
    while (remainingXp >= getXpForLevel(newLevel)) {
      remainingXp -= getXpForLevel(newLevel);
      newLevel++;
    }

    return {
      quests: state.quests.map(q =>
        q.id === questId ? { ...q, status: 'completed' as const, progress: 100 } : q
      ),
      user: {
        ...state.user,
        xp: remainingXp,
        xpToNextLevel: getXpForLevel(newLevel),
        level: newLevel,
        tier: getTier(newLevel),
        vaultCoins: newCoins,
        streakShields: quest.streakShieldReward
          ? state.user.streakShields + 1
          : state.user.streakShields,
      },
    };
  }),

  addXp: (amount) => set((state) => {
    let newXp = state.user.xp + amount;
    let newLevel = state.user.level;

    while (newXp >= getXpForLevel(newLevel)) {
      newXp -= getXpForLevel(newLevel);
      newLevel++;
    }

    return {
      user: {
        ...state.user,
        xp: newXp,
        xpToNextLevel: getXpForLevel(newLevel),
        level: newLevel,
        tier: getTier(newLevel),
      },
    };
  }),

  addChatMessage: (message) => set((state) => ({
    chatMessages: [...state.chatMessages, message],
  })),

  sendNudge: (memberId) => {
    // In production, this would send a push notification
    console.log(`Nudge sent to ${memberId}`);
  },

  toggleSalaryTrigger: () => set((state) => ({
    vault: {
      ...state.vault,
      salaryTriggerEnabled: !state.vault.salaryTriggerEnabled,
    },
  })),

  setSalaryTriggerPercent: (percent) => set((state) => ({
    vault: {
      ...state.vault,
      salaryTriggerPercent: percent,
    },
  })),
}));
