import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../contexts/ThemeContext';
import Button from '../../components/Button';

export default function AuthScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}> 
      <Image source={require('../../assets/images/icon.png')} style={styles.logo} />
      <Text style={[styles.title, { color: colors.text }]}>Welcome to FollowFi</Text>
      <Text style={[styles.subtitle, { color: colors.textLight }]}>Sign in or create an account to continue</Text>
      <Button title="Sign In" style={styles.button} onPress={() => router.push('/sign-in')} />
      <Button title="Sign Up" style={styles.button} onPress={() => router.push('/sign-up')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  logo: { width: 80, height: 80, marginBottom: 32, borderRadius: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  subtitle: { fontSize: 16, marginBottom: 32, textAlign: 'center' },
  button: { width: '100%', marginBottom: 16 },
}); 