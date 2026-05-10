import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/Colors';
import { useGameStore } from '@/store/gameStore';
import type { ChatMessage } from '@/types';

export default function VaultBotScreen() {
  const { chatMessages, addChatMessage } = useGameStore();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const send = () => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = {
      id: `c${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };
    addChatMessage(userMsg);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "Great question! Looking at your spending this week, you've been quite disciplined with food expenses. Your Kopi Kurang challenge is 60% done — keep it up! ☕💪",
        "I see you spent RM40 on Shell petrol yesterday. Consider carpooling with your squad to save on transport this week! That could earn you a **Transport Saver** badge 🚗",
        "Your round-up jar has passively saved RM12.40 this month! That's like getting a free lunch. Keep those micro-savings rolling! 🪙",
        "Pro tip: Your salary hits on the 1st. With your 20% trigger active, RM600 will auto-transfer to your vault. That's 600 XP instantly! 🚀",
        "Your squad \"Budget Ronin\" is 68% through the Boss Raid! Aina is falling behind — maybe give her a nudge? The Debt Dragon won't slay itself! 🐉",
      ];
      const aiMsg: ChatMessage = {
        id: `c${Date.now() + 1}`,
        role: 'assistant',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date().toISOString(),
      };
      addChatMessage(aiMsg);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <View style={s.hdr}>
        <View style={s.botAvatar}><Text style={s.botEmoji}>🤖</Text></View>
        <View>
          <Text style={s.title}>VaultBot</Text>
          <Text style={s.sub}>AI Financial Advisor</Text>
        </View>
        <View style={s.onlineDot} />
      </View>

      <ScrollView
        ref={scrollRef}
        style={s.chat}
        contentContainerStyle={s.chatContent}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
      >
        {/* Intro card */}
        <View style={s.intro}>
          <Text style={s.introTitle}>🧠 Powered by Claude AI</Text>
          <Text style={s.introText}>I analyse your spending patterns and generate personalised quests. Ask me anything about your finances!</Text>
        </View>

        {chatMessages.map(msg => (
          <View key={msg.id} style={[s.bubble, msg.role === 'user' ? s.userBubble : s.botBubble]}>
            {msg.role === 'assistant' && <Text style={s.bubbleAvatar}>🤖</Text>}
            <View style={[s.bubbleContent, msg.role === 'user' ? s.userContent : s.botContent]}>
              <Text style={[s.msgText, msg.role === 'user' && s.userText]}>{msg.content}</Text>
            </View>
          </View>
        ))}

        {isTyping && (
          <View style={[s.bubble, s.botBubble]}>
            <Text style={s.bubbleAvatar}>🤖</Text>
            <View style={[s.bubbleContent, s.botContent]}>
              <Text style={s.typingText}>VaultBot is thinking...</Text>
            </View>
          </View>
        )}
      </ScrollView>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={s.inputArea}>
          <View style={s.suggestions}>
            {['My spending summary', 'Suggest a quest', 'Squad progress'].map(q => (
              <Pressable key={q} style={s.chip} onPress={() => { setInput(q); }}>
                <Text style={s.chipText}>{q}</Text>
              </Pressable>
            ))}
          </View>
          <View style={s.inputRow}>
            <TextInput
              style={s.input}
              value={input}
              onChangeText={setInput}
              placeholder="Ask VaultBot..."
              placeholderTextColor={Colors.textMuted}
              onSubmitEditing={send}
              returnKeyType="send"
            />
            <Pressable style={[s.sendBtn, !input.trim() && s.sendDisabled]} onPress={send} disabled={!input.trim()}>
              <Text style={s.sendText}>➤</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  hdr: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.lg, paddingVertical: Spacing.lg, borderBottomWidth: 1, borderBottomColor: Colors.border },
  botAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(127,119,221,0.2)', alignItems: 'center', justifyContent: 'center', marginRight: Spacing.md },
  botEmoji: { fontSize: 24 },
  title: { color: Colors.text, fontSize: FontSize.xl, fontWeight: '800' },
  sub: { color: Colors.textMuted, fontSize: FontSize.sm },
  onlineDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.teal, marginLeft: 'auto' },
  chat: { flex: 1 },
  chatContent: { padding: Spacing.lg },
  intro: { backgroundColor: 'rgba(127,119,221,0.08)', borderRadius: BorderRadius.lg, padding: Spacing.lg, marginBottom: Spacing.xxl, borderWidth: 1, borderColor: 'rgba(127,119,221,0.2)' },
  introTitle: { color: Colors.primary, fontSize: FontSize.md, fontWeight: '700', marginBottom: Spacing.sm },
  introText: { color: Colors.textSecondary, fontSize: FontSize.sm, lineHeight: 20 },
  bubble: { flexDirection: 'row', marginBottom: Spacing.lg, alignItems: 'flex-start' },
  userBubble: { justifyContent: 'flex-end' },
  botBubble: { justifyContent: 'flex-start' },
  bubbleAvatar: { fontSize: 20, marginRight: Spacing.sm, marginTop: 4 },
  bubbleContent: { maxWidth: '80%', padding: Spacing.lg, borderRadius: BorderRadius.lg },
  userContent: { backgroundColor: Colors.primary, borderBottomRightRadius: 4 },
  botContent: { backgroundColor: Colors.surface, borderBottomLeftRadius: 4, borderWidth: 1, borderColor: Colors.border },
  msgText: { color: Colors.text, fontSize: FontSize.md, lineHeight: 22 },
  userText: { color: '#fff' },
  typingText: { color: Colors.textMuted, fontSize: FontSize.md, fontStyle: 'italic' },
  inputArea: { borderTopWidth: 1, borderTopColor: Colors.border, paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, paddingBottom: Spacing.lg },
  suggestions: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.md, flexWrap: 'wrap' },
  chip: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: BorderRadius.full, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border },
  chipText: { color: Colors.textSecondary, fontSize: FontSize.xs, fontWeight: '600' },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  input: { flex: 1, backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md, color: Colors.text, fontSize: FontSize.md, borderWidth: 1, borderColor: Colors.border },
  sendBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  sendDisabled: { opacity: 0.4 },
  sendText: { color: '#fff', fontSize: 20 },
});
