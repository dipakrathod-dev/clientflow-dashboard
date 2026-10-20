import { useEffect, useState, type ReactNode } from 'react';
import {
  browserLocalPersistence,
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type User,
  type UserCredential,
} from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { AuthContext } from './auth-context';

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const formatError = (errorCode?: string): string => {
    switch (errorCode) {
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
      case 'auth/user-not-found':
        return 'Incorrect email or password.';
      case 'auth/email-already-in-use':
        return 'This email is already registered.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/too-many-requests':
        return 'Too many attempts. Please wait a moment and try again.';
      case 'auth/network-request-failed':
        return 'Network error. Check your connection and try again.';
      case 'auth/popup-closed-by-user':
        return 'Google sign-in was closed before completion.';
      case 'auth/unauthorized-domain':
        return 'This domain is not enabled for sign-in in Firebase.';
      default:
        return 'An error occurred. Please try again.';
    }
  };

  const register = async (email: string, password: string, name?: string): Promise<UserCredential> => {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    if (name) {
      await updateProfile(res.user, { displayName: name });
    }
    return res;
  };

  const login = async (email: string, password: string, rememberMe = true): Promise<UserCredential> => {
    await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const loginWithGoogle = async (): Promise<UserCredential> => {
    await setPersistence(auth, browserLocalPersistence);
    return signInWithPopup(auth, new GoogleAuthProvider());
  };

  const resetPassword = (email: string): Promise<void> => sendPasswordResetEmail(auth, email);

  const updateDisplayName = async (name: string): Promise<void> => {
    if (!auth.currentUser) {
      throw new Error('No signed-in user.');
    }

    await updateProfile(auth.currentUser, { displayName: name });
    setCurrentUser({ ...auth.currentUser });
  };

  const logout = (): Promise<void> => signOut(auth);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, register, login, loginWithGoogle, resetPassword, updateDisplayName, logout, formatError }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
