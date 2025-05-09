import { defineFunction } from '@genkit-ai/core';

export const helloGenkit = defineFunction({
  handler: async (input: { name: string }) => {
    return { message: `Hello, ${input.name}!` };
  },
});

// ---
// This is a sample Genkit function. You can deploy it with Firebase Functions.
// To test, call helloGenkit({ name: 'YourName' }) 