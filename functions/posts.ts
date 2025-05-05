import { defineFunction } from '@genkit-ai/core';
import { db } from '../firebaseConfig';
import { collection, addDoc, getDocs, updateDoc, doc, increment } from 'firebase/firestore';

export const createPost = defineFunction({
  handler: async (input: { authorId: string; content: string }) => {
    const post = {
      authorId: input.authorId,
      content: input.content,
      timestamp: Date.now(),
      likes: 0,
    };
    const ref = await addDoc(collection(db, 'posts'), post);
    return { id: ref.id, ...post };
  },
});

export const fetchPosts = defineFunction({
  handler: async () => {
    const snapshot = await getDocs(collection(db, 'posts'));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },
});

export const likePost = defineFunction({
  handler: async (input: { postId: string }) => {
    const postRef = doc(db, 'posts', input.postId);
    await updateDoc(postRef, { likes: increment(1) });
    return { success: true };
  },
}); 