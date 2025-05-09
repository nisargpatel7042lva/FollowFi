import 'dotenv/config';
import { defineConfig } from '@genkit-ai/core';
import { firebase } from '@genkit-ai/firebase';
import { googleGenerativeAI } from '@genkit-ai/google-genai';

export default defineConfig({
  plugins: [
    firebase({
      projectId: '405914954548', // TODO: Replace with your actual Firebase project ID
    }),
    googleGenerativeAI({
      apiKey: process.env.GOOGLE_GENAI_API_KEY,
    }),
  ],
});

// ---
// 1. Replace 'YOUR_FIREBASE_PROJECT_ID' with your real Firebase project ID.
// 2. The Google GenAI API key is loaded securely from the .env file. 