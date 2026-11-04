import type { LoginInput } from "@/utils/login-schema";
import * as SecureStore from "expo-secure-store";
import { createContext, use, useEffect, useState } from "react";

type AuthContextData = {
  /** Brukernavnet til den innloggede brukeren, eller null. */
  user: string | null;
  /** false mens token leses fra SecureStore ved oppstart. */
  ready: boolean;
  signIn: (input: LoginInput) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextData | null>(null);

const TOKEN_KEY = "stocked.token";

// shortcut: falsk lokal innlogging, ingen server; bytt ut med et ekte kall når det finnes en backend.
async function fakeLoginRequest({ username }: LoginInput): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  return `${username}.${Date.now().toString(36)}`;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    SecureStore.getItemAsync(TOKEN_KEY)
      .then((token) => setUser(token ? token.split(".")[0] : null))
      .catch((error) => console.error("Kunne ikke lese token:", error))
      .finally(() => setReady(true));
  }, []);

  async function signIn(input: LoginInput) {
    const token = await fakeLoginRequest(input);
    await SecureStore.setItemAsync(TOKEN_KEY, token);
    setUser(input.username);
  }

  async function signOut() {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    setUser(null);
  }

  return (
    <AuthContext value={{ user, ready, signIn, signOut }}>
      {children}
    </AuthContext>
  );
}

export function useAuth() {
  const context = use(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
