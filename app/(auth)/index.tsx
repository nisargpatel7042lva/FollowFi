import React, { useState, useEffect } from 'react';
import { View, Text, Button, ActivityIndicator, StyleSheet, Alert, Image } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';
import { useTheme } from '../../contexts/ThemeContext';

export default function AuthScreen() {
  const [loading, setLoading] = useState(false);
  const { colors } = useTheme();
  const router = useRouter();

  useEffect(() => {
    // Check for existing session
    (async () => {
      const session = await SecureStore.getItemAsync('civic_session');
      if (session) {
        // TODO: Optionally verify session validity
        router.replace('/'); // Go to main app
      }
    })();
  }, []);

  const handleGoToSignIn = () => {
    // This is now the Civic Auth login screen, so handle login here
    // If you want to use Civic Auth context, you can do so here
    // For now, just show the button as before
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}> 
      <Image source={require('../../assets/images/icon.png')} style={styles.logo} />
      <Text style={[styles.title, { color: colors.text }]}>Sign in to Continue</Text>
      <Text style={[styles.subtitle, { color: colors.textLight }]}>Connect your wallet and Gmail with Civic Auth</Text>
      <Button title="Sign in with Civic" onPress={handleGoToSignIn} color={colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  logo: { width: 80, height: 80, marginBottom: 32, borderRadius: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  subtitle: { fontSize: 16, marginBottom: 32, textAlign: 'center' },
}); 