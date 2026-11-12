import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { setOnSessionExpired } from '../../api/client';
import { fetchCurrentUser, login, logout, register, type RegisterInput, type User } from './api';
import { hasStoredAccessToken } from './session';

export type AuthState =
  | { status: 'loading' }
  | { status: 'signedOut' }
  | { status: 'signedIn'; user: User };

type AuthContextValue = {
  state: AuthState;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (input: RegisterInput) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ status: 'loading' });

  useEffect(() => {
    setOnSessionExpired(() => setState({ status: 'signedOut' }));
    return () => setOnSessionExpired(null);
  }, []);

  useEffect(() => {
    let active = true;

    async function restore() {
      try {
        if (!(await hasStoredAccessToken())) {
          if (active) setState({ status: 'signedOut' });
          return;
        }
        const user = await fetchCurrentUser();
        if (active) setState({ status: 'signedIn', user });
      } catch {
        if (active) setState({ status: 'signedOut' });
      }
    }

    void restore();
    return () => {
      active = false;
    };
  }, []);

  const value: AuthContextValue = {
    state,
    signIn: async (email, password) => {
      await login(email, password);
      setState({ status: 'signedIn', user: await fetchCurrentUser() });
    },
    signUp: async (input) => {
      await register(input);
      setState({ status: 'signedIn', user: await fetchCurrentUser() });
    },
    signOut: async () => {
      await logout();
      setState({ status: 'signedOut' });
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}