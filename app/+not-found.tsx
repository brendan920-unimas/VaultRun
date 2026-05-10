import { Link, Stack } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, FontSize, Spacing } from '@/constants/Colors';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={styles.container}>
        <Text style={styles.emoji}>⚔️</Text>
        <Text style={styles.title}>Quest Not Found</Text>
        <Text style={styles.subtitle}>This path leads nowhere, adventurer.</Text>
        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>← Return to Vault</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
    padding: Spacing.xxl,
  },
  emoji: { fontSize: 64, marginBottom: Spacing.lg },
  title: {
    color: Colors.text,
    fontSize: FontSize.xxxl,
    fontWeight: '800',
  },
  subtitle: {
    color: Colors.textMuted,
    fontSize: FontSize.md,
    marginTop: Spacing.sm,
    marginBottom: Spacing.xxl,
  },
  link: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xxl,
  },
  linkText: {
    color: Colors.primary,
    fontSize: FontSize.lg,
    fontWeight: '600',
  },
});
