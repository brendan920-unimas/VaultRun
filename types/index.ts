// ============================================================
// VaultRun Type Definitions
// ============================================================

export type LevelTier = 'Rookie Saver' | 'Vault Knight' | 'Gold Warden' | 'Vault Legend';

export interface User {
  id: string;
  username: string;
  displayName: string;
  email: string;
  avatarUrl?: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  tier: LevelTier;
  totalSaved: number;
  vaultCoins: number;
  streakDays: number;
  streakShields: number;
  joinedAt: string;
  squadId?: string;
  profileFrame?: string;
  characterSkin?: string;
}

export type QuestType = 'daily' | 'weekly' | 'epic';
export type QuestStatus = 'active' | 'completed' | 'failed' | 'locked';

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: QuestType;
  status: QuestStatus;
  xpReward: number;
  coinReward: number;
  progress: number;        // 0–100
  targetAmount?: number;   // RM target for spending quests
  currentAmount?: number;
  deadline: string;
  category: string;        // e.g., 'food', 'transport', 'savings'
  icon: string;
  streakShieldReward?: boolean;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface SquadMember {
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  level: number;
  tier: LevelTier;
  contribution: number;   // RM saved toward boss raid
  isOnline: boolean;
}

export interface Squad {
  id: string;
  name: string;
  bannerUrl?: string;
  members: SquadMember[];
  bossRaidTarget: number;   // monthly goal in RM
  bossRaidProgress: number; // current total in RM
  bossName: string;
  bossHealth: number;       // 0–100 (100 = not yet defeated)
  createdAt: string;
}

export interface Transaction {
  id: string;
  merchant: string;
  category: string;
  amount: number;
  date: string;
  roundUpAmount?: number;
  icon: string;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  tier: LevelTier;
  level: number;
  savedThisWeek: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface VaultSummary {
  totalBalance: number;
  roundUpJar: number;
  salaryTriggerPercent: number;
  salaryTriggerEnabled: boolean;
  lastSalaryDate?: string;
  monthlyDeposits: number;
  monthlyWithdrawals: number;
}
