import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Session } from '@supabase/supabase-js';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { Platform } from 'react-native';

type AuthContextData = {
  session: Session | null;
  user: Session['user'] | null;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await GoogleSignin.configure({
          webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
          iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
          offlineAccess: true,
        });

        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);

      } catch (error) {
        console.error('Initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      if (Platform.OS === 'android') {
        await GoogleSignin.hasPlayServices();
      }

      await GoogleSignin.signOut();

      const userInfo = await GoogleSignin.signIn();

      const idToken = userInfo.data?.idToken;

      if (!idToken) {
        throw new Error('No ID token received from Google');
      }

      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: idToken,
      });

      if (error) throw error;

    } catch (error: any) {
      console.error('Sign-in error:', {
        message: error.message,
        code: error.code,
      });

      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        throw new Error('Sign in was cancelled');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        throw new Error('Sign in already in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        throw new Error('Play Services not available');
      } else {
        throw new Error(error.message || 'Failed to sign in with Google');
      }
    }
  };

  const signOut = async () => {
    try {
      await Promise.all([
        GoogleSignin.signOut(),
        supabase.auth.signOut()
      ]);
    } catch (error) {
      console.error('❌ Error signing out:', error);
      throw error;
    }
  };

  const value = {
    session,
    user: session?.user ?? null,
    isLoading,
    signInWithGoogle,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};