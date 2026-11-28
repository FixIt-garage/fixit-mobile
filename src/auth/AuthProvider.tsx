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
 * Чи можна повторити перевірку сесії пізніше, не виходячи з акаунта:
 * - `fetch` кинув `TypeError` — сервер узагалі не відповів (немає мережі);
 * - `ApiUnavailableError` (`retryable`) — не вдалося оновити токен, бо сервер недоступний або відповів 5xx;
 * - `ApiError` з кодом 5xx — сервер тимчасово не працює.
 * Відповідь 401 після невдалого оновлення токена означає, що сесія справді недійсна.
 */
function isRetryableError(error: unknown) {
  if (error instanceof TypeError) return true;
  if (typeof error !== 'object' || error === null) return false;
  const { retryable, status } = error as { retryable?: unknown; status?: unknown };
  return retryable === true || (typeof status === 'number' && status >= 500);
}

/** Перевіряє збережену сесію і повертає, в якому стані має бути застосунок. */
async function resolveStoredSession(): Promise<AuthState> {
  try {
    if (!(await hasStoredAccessToken())) {
      return { status: 'signedOut' };
    }
    return { status: 'signedIn', user: await fetchCurrentUser() };
  } catch (error) {
    return isRetryableError(error) ? { status: 'offline' } : { status: 'signedOut' };
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
