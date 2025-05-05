import { defineFunction } from '@genkit-ai/core';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';

export const signUp = defineFunction({
  handler: async (input: { email: string; password: string }) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, input.email, input.password);
      return { uid: userCredential.user.uid, email: userCredential.user.email };
    } catch (error: any) {
      return { error: error.message };
    }
  },
});

export const signIn = defineFunction({
  handler: async (input: { email: string; password: string }) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, input.email, input.password);
      return { uid: userCredential.user.uid, email: userCredential.user.email };
    } catch (error: any) {
      return { error: error.message };
    }
  },
}); 