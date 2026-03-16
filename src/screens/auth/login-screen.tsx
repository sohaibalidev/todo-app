import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useAuth } from '../../context/auth-context';

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
          <Text style={styles.welcomeSubtitle}>Sign in to access your tasks and projects</Text>
        </View>

        <TouchableOpacity
          style={[styles.googleButton, signInLoading && styles.googleButtonDisabled]}
          onPress={handleGoogleSignIn}
          disabled={signInLoading}
          activeOpacity={0.8}
        >
          {signInLoading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <View style={styles.buttonContent}>
              <Text style={styles.googleIcon}>G</Text>
              <Text style={styles.googleButtonText}>Continue with Google</Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Your tasks are securely synced</Text>
          <Text style={styles.footerSubtext}>Version 1.0.0</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconCircle: {
    width: 70,
    height: 70,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  iconText: {
    fontSize: 32,
    color: '#fff',
    fontWeight: '500',
  },
  appName: {
    fontSize: 32,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  appTagline: {
    fontSize: 14,
    color: '#999',
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 48,
  },
  welcomeTitle: {
    fontSize: 26,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  googleButton: {
    backgroundColor: '#4285F4',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: '100%',
    maxWidth: 320,
    alignSelf: 'center',
    shadowColor: '#4285F4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  googleButtonDisabled: {
    opacity: 0.7,
  },
  googleIcon: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    width: 24,
    textAlign: 'center',
  },
  googleButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  footer: {
    marginTop: 64,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 13,
    color: '#999',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 11,
    color: '#ccc',
  },
});