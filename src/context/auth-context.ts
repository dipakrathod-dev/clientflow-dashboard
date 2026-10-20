import { createContext } from 'react';
import type { User, UserCredential } from 'firebase/auth';

export type AuthContextValue = {
  currentUser: User | null;
  register: (email: string, password: string, name?: string) => Promise<UserCredential>;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<UserCredential>;
  loginWithGoogle: () => Promise<UserCredential>;
  resetPassword: (email: string) => Promise<void>;
  updateDisplayName: (name: string) => Promise<void>;
  logout: () => Promise<void>;
  formatError: (errorCode?: string) => string;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
