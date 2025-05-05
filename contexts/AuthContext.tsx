import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, db } from '../firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut as firebaseSignOut, onAuthStateChanged, sendPasswordResetEmail } from 'firebase/auth';
import { collection, doc, setDoc, getDocs, query, where } from 'firebase/firestore';

interface User {
  id: string;
  email: string;
  username?: string;
  walletId?: string;
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
  bio?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (username: string, walletId: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string, walletId: string, firstName: string, lastName: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDocs(query(collection(db, 'users'), where('uid', '==', firebaseUser.uid)));
        let userData: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
        };
        if (!userDoc.empty) {
          userData = { ...userData, ...userDoc.docs[0].data() };
        }
        setUser(userData);
        await AsyncStorage.setItem('user', JSON.stringify(userData));
      } else {
        setUser(null);
        await AsyncStorage.removeItem('user');
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // SIGN UP: Check username uniqueness, then create user and store in Firestore
  const signUp = async (email: string, password: string, username: string, walletId: string, firstName: string, lastName: string) => {
    setIsLoading(true);
    try {
      // Check if username exists
      const q = query(collection(db, 'users'), where('username', '==', username));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        throw new Error('Username already taken');
      }
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      // Store user data in Firestore
      const userData: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        username,
        walletId,
        firstName,
        lastName,
      };
      await setDoc(doc(db, 'users', firebaseUser.uid), {
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        username,
        walletId,
        firstName,
        lastName,
      });
      setUser(userData);
      await AsyncStorage.setItem('user', JSON.stringify(userData));
    } catch (error: any) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // SIGN IN: Lookup username, check walletId, then sign in with email/password
  const signIn = async (username: string, walletId: string, password: string) => {
    setIsLoading(true);
    try {
      // Lookup user by username
      const q = query(collection(db, 'users'), where('username', '==', username));
      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        throw new Error('User not found');
      }
      const userDoc = snapshot.docs[0];
      const userData = userDoc.data();
      if (userData.walletId !== walletId) {
        throw new Error('Wallet ID does not match');
      }
      // Sign in with email and password
      const userCredential = await signInWithEmailAndPassword(auth, userData.email, password);
      const firebaseUser = userCredential.user;
      const finalUser: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        username: userData.username,
        walletId: userData.walletId,
      };
      setUser(finalUser);
      await AsyncStorage.setItem('user', JSON.stringify(finalUser));
    } catch (error: any) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      await firebaseSignOut(auth);
      setUser(null);
      await AsyncStorage.removeItem('user');
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signIn,
        signUp,
        signOut,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 