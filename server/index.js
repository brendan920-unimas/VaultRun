// ============================================================
// VaultRun Backend Server
// Express + Mock Bank API + Claude AI Integration
// ============================================================

const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// ============================================================
// MOCK DATA — Realistic Malaysian student transactions
// ============================================================

const users = new Map();
const transactions = new Map();
const quests = new Map();
const squads = new Map();

// Seed data
function seedData() {
  const userId = 'u1';

  // User
  users.set(userId, {
    id: userId,
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
    bankAccountId: 'bank_001',
  });

  // Malaysian student transactions
  const txData = [
    { merchant: 'GrabFood - McDonalds', category: 'Food', amount: 18.90, icon: '🍔', hoursAgo: 4 },
    { merchant: 'KTM Komuter', category: 'Transport', amount: 3.20, icon: '🚇', hoursAgo: 8 },
    { merchant: '99 Speedmart', category: 'Groceries', amount: 23.45, icon: '🛒', hoursAgo: 20 },
    { merchant: 'Shell Petrol', category: 'Transport', amount: 40.00, icon: '⛽', hoursAgo: 33 },
    { merchant: 'Tealive', category: 'Food', amount: 8.90, icon: '🧋', hoursAgo: 41 },
    { merchant: 'Shopee', category: 'Shopping', amount: 45.00, icon: '🛍️', hoursAgo: 48 },
    { merchant: 'Petronas Mesra', category: 'Food', amount: 5.50, icon: '🏪', hoursAgo: 57 },
    { merchant: 'Netflix Malaysia', category: 'Entertainment', amount: 35.90, icon: '🎬', hoursAgo: 70 },
    { merchant: 'TouchnGo eWallet', category: 'Transport', amount: 50.00, icon: '💳', hoursAgo: 96 },
    { merchant: 'Mamak Corner', category: 'Food', amount: 12.00, icon: '🍛', hoursAgo: 99 },
    { merchant: 'Tealive', category: 'Food', amount: 9.50, icon: '🧋', hoursAgo: 110 },
    { merchant: 'GrabFood - KFC', category: 'Food', amount: 22.90, icon: '🍗', hoursAgo: 120 },
    { merchant: 'Tealive', category: 'Food', amount: 11.20, icon: '🧋', hoursAgo: 140 },
    { merchant: 'MR DIY', category: 'Shopping', amount: 15.80, icon: '🔧', hoursAgo: 160 },
    { merchant: 'Watsons', category: 'Health', amount: 32.40, icon: '💊', hoursAgo: 168 },
  ];

  const userTxs = txData.map((tx, i) => {
    const date = new Date(Date.now() - tx.hoursAgo * 3600000);
    const roundUp = tx.amount % 1 === 0 ? 0 : parseFloat((1 - (tx.amount % 1)).toFixed(2));
    return {
      id: `t${i + 1}`,
      userId,
      merchant: tx.merchant,
      category: tx.category,
      amount: tx.amount,
      date: date.toISOString(),
      roundUpAmount: roundUp,
      icon: tx.icon,
    };
  });
  transactions.set(userId, userTxs);

  // Squad
  squads.set('s1', {
    id: 's1',
    name: 'Budget Ronin',
    members: ['u1', 'u2', 'u3', 'u4'],
    bossRaidTarget: 2500,
    bossRaidProgress: 1700,
    bossName: 'The Debt Dragon',
    createdAt: '2026-03-01',
  });
}

seedData();

// ============================================================
// MOCK BANK API
// ============================================================

// Get bank account balance
app.get('/api/bank/balance/:userId', (req, res) => {
  const user = users.get(req.params.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  res.json({
    accountId: user.bankAccountId,
    balance: 1523.45,
    vaultBalance: user.totalSaved,
    currency: 'MYR',
    lastUpdated: new Date().toISOString(),
  });
});

// Get transactions
app.get('/api/bank/transactions/:userId', (req, res) => {
  const txs = transactions.get(req.params.userId) || [];
  const limit = parseInt(req.query.limit) || 20;
  res.json({ transactions: txs.slice(0, limit), total: txs.length });
});

// Simulate a new transaction
app.post('/api/bank/transaction', (req, res) => {
  const { userId, merchant, category, amount, icon } = req.body;
  const roundUp = amount % 1 === 0 ? 0 : parseFloat((1 - (amount % 1)).toFixed(2));
  const tx = {
    id: `t${uuidv4().slice(0, 8)}`,
    userId,
    merchant,
    category,
    amount,
    date: new Date().toISOString(),
    roundUpAmount: roundUp,
    icon: icon || '💳',
  };

  const userTxs = transactions.get(userId) || [];
  userTxs.unshift(tx);
  transactions.set(userId, userTxs);

  res.json({ transaction: tx, roundUpSaved: roundUp });
});

// ============================================================
// GAME API
// ============================================================

// Get user profile
app.get('/api/user/:userId', (req, res) => {
  const user = users.get(req.params.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

// Get spending analysis
app.get('/api/spending/analysis/:userId', (req, res) => {
  const txs = transactions.get(req.params.userId) || [];
  const categories = {};
  let totalSpent = 0;
  let totalRoundUp = 0;

  txs.forEach(tx => {
    categories[tx.category] = (categories[tx.category] || 0) + tx.amount;
    totalSpent += tx.amount;
    totalRoundUp += tx.roundUpAmount || 0;
  });

  // Find bubble tea spending
  const bubbleTea = txs
    .filter(tx => tx.merchant.toLowerCase().includes('tealive') || tx.merchant.toLowerCase().includes('boba'))
    .reduce((sum, tx) => sum + tx.amount, 0);

  res.json({
    totalSpent: parseFloat(totalSpent.toFixed(2)),
    totalRoundUpSaved: parseFloat(totalRoundUp.toFixed(2)),
    categoryBreakdown: categories,
    bubbleTeaSpending: bubbleTea,
    avgDailySpend: parseFloat((totalSpent / 7).toFixed(2)),
    topMerchant: Object.entries(categories).sort((a, b) => b[1] - a[1])[0],
  });
});

// ============================================================
// VAULTBOT — Claude AI Integration
// ============================================================

app.post('/api/vaultbot/chat', async (req, res) => {
  const { userId, message } = req.body;
  const user = users.get(userId);
  const txs = transactions.get(userId) || [];

  // Build context for Claude
  const spendingContext = txs.slice(0, 10).map(tx =>
    `${tx.merchant}: RM${tx.amount.toFixed(2)} (${tx.category})`
  ).join('\n');

  const systemPrompt = `You are VaultBot, the AI financial advisor in VaultRun — a gamified savings app for Malaysian university students. You speak casually, use emoji, and relate everything back to the RPG game mechanics (XP, quests, streaks, squad raids). Keep responses concise (2-3 sentences max). Reference Malaysian brands and culture (mamak, teh tarik, GrabFood, etc.).

User Profile:
- Name: ${user?.displayName || 'Player'}
- Level: ${user?.level || 1} (${user?.tier || 'Rookie Saver'})
- Streak: ${user?.streakDays || 0} days
- Total Saved: RM${user?.totalSaved || 0}

Recent Spending:
${spendingContext}`;

  try {
    // Check if Anthropic API key is available
    if (!process.env.ANTHROPIC_API_KEY) {
      // Fallback to mock responses
      const mockResponses = [
        `Hey ${user?.displayName || 'Player'}! 👋 Looking at your recent spending, you've dropped RM${txs.slice(0, 5).reduce((s, t) => s + t.amount, 0).toFixed(2)} in the last few days. Your Kopi Kurang quest is still active — try keeping drinks under RM8 today for +25 XP! ☕`,
        `Your squad "Budget Ronin" is 68% through the Boss Raid! 🐉 Haziq is leading with RM510 saved. Want me to suggest a quick quest to boost your contribution?`,
        `Pro tip: Your round-up jar has passively saved RM12.40! That's basically free XP. Every sen counts toward defeating The Debt Dragon! 💪`,
        `I noticed 3 Tealive transactions this week totalling RM${txs.filter(t => t.merchant.includes('Tealive')).reduce((s, t) => s + t.amount, 0).toFixed(2)}. Want to activate a "Boba Detox" challenge? Survive 3 days without bubble tea for +50 XP and a rare badge! 🧋❌`,
      ];
      return res.json({
        response: mockResponses[Math.floor(Math.random() * mockResponses.length)],
        source: 'mock',
      });
    }

    const Anthropic = require('@anthropic-ai/sdk');
    const anthropic = new Anthropic.default();

    const completion = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 300,
      system: systemPrompt,
      messages: [{ role: 'user', content: message }],
    });

    res.json({
      response: completion.content[0].text,
      source: 'claude',
    });
  } catch (error) {
    console.error('Claude API error:', error.message);
    res.json({
      response: `Hmm, I'm having trouble thinking right now 🤔 But looking at your data, you're doing great at Level ${user?.level}! Keep that ${user?.streakDays}-day streak alive! 🔥`,
      source: 'fallback',
    });
  }
});

// Generate quests from spending data
app.post('/api/vaultbot/generate-quests', async (req, res) => {
  const { userId } = req.body;
  const txs = transactions.get(userId) || [];

  // Analyse spending patterns
  const foodSpend = txs.filter(t => t.category === 'Food').reduce((s, t) => s + t.amount, 0);
  const transportSpend = txs.filter(t => t.category === 'Transport').reduce((s, t) => s + t.amount, 0);
  const avgDaily = txs.reduce((s, t) => s + t.amount, 0) / 7;

  // Generate contextual quests
  const generatedQuests = [
    {
      id: `gq_${uuidv4().slice(0, 6)}`,
      title: 'Kopi Kurang Challenge',
      description: `Spend under RM8 on drinks today (avg: RM${(foodSpend / 5).toFixed(0)}/day on food)`,
      type: 'daily',
      xpReward: 25,
      coinReward: 10,
      targetAmount: 8,
      category: 'food',
      icon: '☕',
    },
    {
      id: `gq_${uuidv4().slice(0, 6)}`,
      title: 'Transport Saver',
      description: `Keep transport under RM${Math.ceil(transportSpend * 0.8)} this week`,
      type: 'weekly',
      xpReward: 75,
      coinReward: 30,
      targetAmount: Math.ceil(transportSpend * 0.8),
      category: 'transport',
      icon: '🚇',
    },
    {
      id: `gq_${uuidv4().slice(0, 6)}`,
      title: 'No Delivery Day',
      description: 'Don\'t order any food delivery today — cook or eat at mamak!',
      type: 'daily',
      xpReward: 30,
      coinReward: 15,
      targetAmount: 0,
      category: 'food',
      icon: '🍔',
    },
  ];

  res.json({ quests: generatedQuests });
});

// ============================================================
// SQUAD API
// ============================================================

app.get('/api/squad/:squadId', (req, res) => {
  const squad = squads.get(req.params.squadId);
  if (!squad) return res.status(404).json({ error: 'Squad not found' });
  res.json(squad);
});

// Leaderboard
app.get('/api/leaderboard', (req, res) => {
  const entries = [
    { rank: 1, userId: 'u3', username: 'haziq99', displayName: 'Haziq R.', tier: 'Vault Knight', level: 15, savedThisWeek: 245 },
    { rank: 2, userId: 'u1', username: 'aimanzul', displayName: 'Aiman Z.', tier: 'Vault Knight', level: 12, savedThisWeek: 198 },
    { rank: 3, userId: 'u5', username: 'nurfarah', displayName: 'Nur Farah', tier: 'Gold Warden', level: 18, savedThisWeek: 175 },
    { rank: 4, userId: 'u2', username: 'syafiqah', displayName: 'Syafiqah M.', tier: 'Vault Knight', level: 8, savedThisWeek: 152 },
    { rank: 5, userId: 'u6', username: 'danialh', displayName: 'Danial H.', tier: 'Rookie Saver', level: 4, savedThisWeek: 120 },
    { rank: 6, userId: 'u4', username: 'ainaaa', displayName: 'Aina S.', tier: 'Vault Knight', level: 6, savedThisWeek: 98 },
    { rank: 7, userId: 'u7', username: 'izzati', displayName: 'Izzati K.', tier: 'Gold Warden', level: 22, savedThisWeek: 88 },
    { rank: 8, userId: 'u8', username: 'adam_fit', displayName: 'Adam F.', tier: 'Rookie Saver', level: 3, savedThisWeek: 65 },
  ];
  res.json({ leaderboard: entries });
});

// ============================================================
// HEALTH CHECK
// ============================================================

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', version: '1.0.0', name: 'VaultRun API' });
});

// ============================================================
// START SERVER
// ============================================================

app.listen(PORT, () => {
  console.log(`
  ⚔️  VaultRun API Server
  🏰  Running on http://localhost:${PORT}
  📊  Mock bank data seeded
  🤖  VaultBot ready (${process.env.ANTHROPIC_API_KEY ? 'Claude API active' : 'Mock mode'})
  `);
});
