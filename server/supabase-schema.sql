-- ============================================================
-- VaultRun — Supabase Database Schema
-- PostgreSQL + Row Level Security + Realtime
-- ============================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- USERS
-- ============================================================
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  level INTEGER DEFAULT 1,
  xp INTEGER DEFAULT 0,
  xp_to_next_level INTEGER DEFAULT 100,
  tier TEXT DEFAULT 'Rookie Saver' CHECK (tier IN ('Rookie Saver', 'Vault Knight', 'Gold Warden', 'Vault Legend')),
  total_saved DECIMAL(12,2) DEFAULT 0,
  vault_coins INTEGER DEFAULT 0,
  streak_days INTEGER DEFAULT 0,
  streak_shields INTEGER DEFAULT 0,
  squad_id UUID REFERENCES public.squads(id),
  profile_frame TEXT,
  character_skin TEXT,
  bank_account_id TEXT,
  salary_trigger_enabled BOOLEAN DEFAULT false,
  salary_trigger_percent INTEGER DEFAULT 20,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SQUADS
-- ============================================================
CREATE TABLE public.squads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  banner_url TEXT,
  boss_raid_target DECIMAL(12,2) DEFAULT 2500,
  boss_raid_progress DECIMAL(12,2) DEFAULT 0,
  boss_name TEXT DEFAULT 'The Debt Dragon',
  boss_health INTEGER DEFAULT 100,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- QUESTS
-- ============================================================
CREATE TABLE public.quests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT CHECK (type IN ('daily', 'weekly', 'epic')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'failed', 'locked')),
  xp_reward INTEGER DEFAULT 0,
  coin_reward INTEGER DEFAULT 0,
  progress INTEGER DEFAULT 0,
  target_amount DECIMAL(12,2),
  current_amount DECIMAL(12,2) DEFAULT 0,
  deadline TIMESTAMPTZ,
  category TEXT,
  icon TEXT,
  streak_shield_reward BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- ============================================================
-- TRANSACTIONS (Mock Bank)
-- ============================================================
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  merchant TEXT NOT NULL,
  category TEXT,
  amount DECIMAL(12,2) NOT NULL,
  round_up_amount DECIMAL(12,2) DEFAULT 0,
  icon TEXT,
  transaction_date TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- BADGES
-- ============================================================
CREATE TABLE public.badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  rarity TEXT CHECK (rarity IN ('common', 'rare', 'epic', 'legendary'))
);

CREATE TABLE public.user_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  badge_id UUID REFERENCES public.badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

-- ============================================================
-- CHAT MESSAGES (VaultBot)
-- ============================================================
CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- VAULT (Savings Summary)
-- ============================================================
CREATE TABLE public.vault_summary (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  total_balance DECIMAL(12,2) DEFAULT 0,
  round_up_jar DECIMAL(12,2) DEFAULT 0,
  monthly_deposits DECIMAL(12,2) DEFAULT 0,
  monthly_withdrawals DECIMAL(12,2) DEFAULT 0,
  last_salary_date TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- LEADERBOARD VIEW (Realtime-enabled)
-- ============================================================
CREATE OR REPLACE VIEW public.weekly_leaderboard AS
SELECT
  u.id AS user_id,
  u.username,
  u.display_name,
  u.avatar_url,
  u.level,
  u.tier,
  COALESCE(SUM(t.round_up_amount), 0) + COALESCE(
    (SELECT monthly_deposits FROM vault_summary WHERE user_id = u.id), 0
  ) AS saved_this_week,
  RANK() OVER (ORDER BY u.total_saved DESC) AS rank
FROM public.users u
LEFT JOIN public.transactions t ON t.user_id = u.id
  AND t.transaction_date >= NOW() - INTERVAL '7 days'
GROUP BY u.id;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vault_summary ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = auth_id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = auth_id);

-- Quests: users see their own quests
CREATE POLICY "Users can view own quests" ON public.quests
  FOR SELECT USING (user_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid()));

-- Transactions: users see their own transactions
CREATE POLICY "Users can view own transactions" ON public.transactions
  FOR SELECT USING (user_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid()));

-- Squads: public read for leaderboard
ALTER TABLE public.squads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Squads are publicly readable" ON public.squads
  FOR SELECT USING (true);

-- Badges: public read
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Badges are publicly readable" ON public.badges
  FOR SELECT USING (true);

-- ============================================================
-- ENABLE REALTIME for leaderboard
-- ============================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.users;
ALTER PUBLICATION supabase_realtime ADD TABLE public.squads;

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_quests_user_status ON public.quests(user_id, status);
CREATE INDEX idx_transactions_user_date ON public.transactions(user_id, transaction_date DESC);
CREATE INDEX idx_users_level ON public.users(level DESC);
CREATE INDEX idx_users_total_saved ON public.users(total_saved DESC);
