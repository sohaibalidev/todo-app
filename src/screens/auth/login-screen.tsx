import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../../context/auth-context';
import { Button } from '../../components/ui/Button';
import { COLORS } from '../../constants/colors';

export default function LoginScreen() {
  const { signInWithGoogle } = useAuth();
  const [signInLoading, setSignInLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setSignInLoading(true);
      await signInWithGoogle();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to sign in with Google');
    } finally {
      setSignInLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.headerContainer}>
          <View style={styles.iconCircle}>
            <Text style={styles.iconText}>✓</Text>
          </View>
          <Text style={styles.appName}>Tasklist</Text>
          <Text style={styles.appTagline}>Stay organized, get things done</Text>
        </View>

        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Welcome Back</Text>
          <Text style={styles.welcomeSubtitle}>
            Sign in to access your tasks and projects
          </Text>
        </View>

        <View style={styles.buttonWrapper}>
          <Button
            variant="google"
            text="Continue with Google"
            loading={signInLoading}
            onPress={handleGoogleSignIn}
            disabled={signInLoading}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Your tasks are securely synced</Text>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.ui.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: COLORS.ui.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: COLORS.ui.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  iconText: {
    fontSize: 40,
    color: COLORS.ui.background,
    fontWeight: '600',
  },
  appName: {
    fontSize: 36,
    fontWeight: '700',
    color: COLORS.ui.text,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  appTagline: {
    fontSize: 15,
    color: COLORS.ui.textSecondary,
    letterSpacing: 0.3,
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 48,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '600',
    color: COLORS.ui.text,
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: COLORS.ui.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  buttonWrapper: {
    width: '100%',
    maxWidth: 340,
  },
  footer: {
    position: 'absolute',
    bottom: 32,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 13,
    color: COLORS.ui.textSecondary,
    marginBottom: 4,
  },
  versionText: {
    fontSize: 11,
    color: COLORS.ui.border,
  },
});