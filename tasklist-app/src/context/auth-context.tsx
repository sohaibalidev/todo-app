import React, { createContext, useState, useEffect, useContext } from "react";
import { supabase } from "../services/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { AppState, AppStateStatus, Platform } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { getRedirectUrl, isRedirectUrl } from "../utils/redirect";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Handle incoming links for OAuth redirects
const handleDeepLink = (event: { url: string }) => {
  console.log("🔗 Deep link received:", event.url);

  if (isRedirectUrl(event.url)) {
    console.log("✅ This is our OAuth redirect!");
    // Close the browser if it's open
    WebBrowser.dismissBrowser();
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("🔐 AuthProvider: Mounting...");

    // Set up deep link handler
    const subscription = Linking.addEventListener("url", handleDeepLink);

    // Check initial URL in case app was opened from a link
    Linking.getInitialURL().then((url) => {
      if (url && isRedirectUrl(url)) {
        console.log("📱 App opened from OAuth redirect:", url);
      }
    });

    const getInitialSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        if (error) {
          console.error("❌ Error getting session:", error.message);
        }
        console.log(
          "📦 Initial session:",
          session?.user?.email ?? "No session",
        );
        setSession(session);
        setUser(session?.user ?? null);
      } catch (error) {
        console.error("❌ Unexpected error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    const {
      data: { subscription: authSubscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("🔄 Auth event:", event, session?.user?.email ?? "No user");
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      subscription.remove();
      authSubscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    try {
      console.log("🚀 Starting Google sign-in...");

      const redirectUrl = getRedirectUrl();
      console.log("📱 Using redirect URL:", redirectUrl);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: false,
        },
      });

      if (error) {
        console.error("❌ Sign-in error:", error.message);
        throw error;
      }

      if (data?.url) {
        console.log("✅ Opening browser with URL");

        if (Platform.OS === "ios") {
          // On iOS, use openAuthSessionAsync
          const result = await WebBrowser.openAuthSessionAsync(
            data.url,
            redirectUrl,
          );
          console.log("Browser result:", result);
        } else {
          // On Android, use openBrowserAsync
          await WebBrowser.openBrowserAsync(data.url);
        }
      }
    } catch (error) {
      console.error("❌ Error signing in:", error);
    }
  };

  const signOut = async () => {
    try {
      console.log("👋 Signing out...");
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      console.log("✅ Sign out successful");
    } catch (error) {
      console.error("❌ Error signing out:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, session, isLoading, signInWithGoogle, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
