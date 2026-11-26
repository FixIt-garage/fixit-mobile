import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { onlineManager } from '@tanstack/react-query';
import { setOnSessionExpired } from '../../api/client';
import { queryClient } from '../api/queryClient';
import { fetchCurrentUser, login, logout, register, type RegisterInput, type User } from './api';
import { hasStoredAccessToken } from './session';

export type AuthState =
  | { status: 'loading' }
  // Збережена сесія є, але перевірити її не вдалося через мережу: не виходимо з акаунта,
  // а повторюємо перевірку, коли з'явиться інтернет
  | { status: 'offline' }
  | { status: 'signedOut' }
  | { status: 'signedIn'; user: User };

type AuthContextValue = {
  state: AuthState;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (input: RegisterInput) => Promise<void>;
  signOut: () => Promise<void>;
  /** Повторити відновлення сесії після стану `offline` */
  retryRestore: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * `fetch` кидає `TypeError`, коли сервер узагалі не відповів (немає мережі).
 * Відповідь сервера з помилкою (401 тощо) приходить як `ApiError` — тоді сесія справді недійсна.
 */
function isNetworkError(error: unknown) {
  return error instanceof TypeError;
}

/** Перевіряє збережену сесію і повертає, в якому стані має бути застосунок. */
async function resolveStoredSession(): Promise<AuthState> {
  try {
    if (!(await hasStoredAccessToken())) {
      return { status: 'signedOut' };
    }
    return { status: 'signedIn', user: await fetchCurrentUser() };
  } catch (error) {
    return isNetworkError(error) ? { status: 'offline' } : { status: 'signedOut' };
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ status: 'loading' });

  useEffect(() => {
    setOnSessionExpired(() => {
      queryClient.clear();
      setState({ status: 'signedOut' });
    });
    return () => setOnSessionExpired(null);
  }, []);

  useEffect(() => {
    let active = true;
    void resolveStoredSession().then((next) => {
      if (active) setState(next);
    });
    return () => {
      active = false;
    };
  }, []);

  // Повертаємось до перевірки сесії, щойно з'явився інтернет
  const offline = state.status === 'offline';
  useEffect(() => {
    if (!offline) return;
    let active = true;
    const unsubscribe = onlineManager.subscribe((isOnline) => {
      if (!isOnline) return;
      void resolveStoredSession().then((next) => {
        if (active) setState(next);
      });
    });
    return () => {
      active = false;
      unsubscribe();
    };
  }, [offline]);

  const retryRestore = useCallback(async () => {
    setState(await resolveStoredSession());
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
      queryClient.clear();
      setState({ status: 'signedOut' });
    },
    retryRestore,
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
