import { defineFunction } from '@genkit-ai/core';
import { db } from '../firebaseConfig';
import { collection, addDoc, getDocs, query, where, orderBy } from 'firebase/firestore';

export const sendMessage = defineFunction({
  handler: async (input: { senderId: string; recipientId: string; content: string }) => {
    const message = {
      senderId: input.senderId,
      recipientId: input.recipientId,
      content: input.content,
      timestamp: Date.now(),
    };
    const ref = await addDoc(collection(db, 'messages'), message);
    return { id: ref.id, ...message };
  },
});

export const fetchMessages = defineFunction({
  handler: async (input: { userId1: string; userId2: string }) => {
    const messagesRef = collection(db, 'messages');
    const q = query(
      messagesRef,
      where('senderId', 'in', [input.userId1, input.userId2]),
      where('recipientId', 'in', [input.userId1, input.userId2]),
      orderBy('timestamp', 'asc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },
}); 