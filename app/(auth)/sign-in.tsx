import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SignIn() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>
      <Text>This screen is under construction.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
}); 