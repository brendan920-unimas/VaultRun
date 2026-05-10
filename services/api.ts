import axios from 'axios';
import type { ChatMessage } from '@/types';

const API_BASE = process.env.EXPO_PUBLIC_API_URL || 'https://vaultrun-api.onrender.com';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// ============================================================
// Bank API
// ============================================================
export const bankApi = {
  getBalance: (userId: string) =>
    api.get(`/api/bank/balance/${userId}`).then(r => r.data),

  getTransactions: (userId: string, limit = 20) =>
    api.get(`/api/bank/transactions/${userId}?limit=${limit}`).then(r => r.data),

  createTransaction: (data: {
    userId: string;
    merchant: string;
    category: string;
    amount: number;
    icon?: string;
  }) => api.post('/api/bank/transaction', data).then(r => r.data),
};

// ============================================================
// Game API
// ============================================================
export const gameApi = {
  getUser: (userId: string) =>
    api.get(`/api/user/${userId}`).then(r => r.data),

  getSpendingAnalysis: (userId: string) =>
    api.get(`/api/spending/analysis/${userId}`).then(r => r.data),

  getSquad: (squadId: string) =>
    api.get(`/api/squad/${squadId}`).then(r => r.data),

  getLeaderboard: () =>
    api.get('/api/leaderboard').then(r => r.data),
};

// ============================================================
// VaultBot API
// ============================================================
export const vaultBotApi = {
  chat: (userId: string, message: string) =>
    api.post('/api/vaultbot/chat', { userId, message }).then(r => r.data),

  generateQuests: (userId: string) =>
    api.post('/api/vaultbot/generate-quests', { userId }).then(r => r.data),
};

export default api;
