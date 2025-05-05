import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Modal, TextInput, Alert } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import { Link, router } from 'expo-router';

export default function SignIn() {
  const { signIn, resetPassword } = useAuth();
  const [username, setUsername] = useState('');
  const [walletId, setWalletId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [forgotModalVisible, setForgotModalVisible] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  const validateForm = () => {
    if (!username || !walletId || !password) {
      setError('Please fill in all fields');
      return false;
    }
    return true;
  };

  const handleSignIn = async () => {
    if (!validateForm()) return;
    try {
      setError('');
      setLoading(true);
      await signIn(username, walletId, password);
      router.replace('/(tabs)');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!resetEmail) {
      Alert.alert('Error', 'Please enter your email.');
      return;
    }
    setResetLoading(true);
    try {
      await resetPassword(resetEmail);
      Alert.alert('Success', 'Password reset email sent!');
      setForgotModalVisible(false);
      setResetEmail('');
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to send reset email');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.title}>Sign In</Text>
          <Text style={styles.subtitle}>Welcome back to FollowFi</Text>
        </View>
        <View style={styles.form}>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          <Input
            label="Username"
            placeholder="Enter your username"
            autoCapitalize="none"
            value={username}
            onChangeText={setUsername}
          />
          <Input
            label="Wallet ID"
            placeholder="Enter your Solana wallet ID"
            autoCapitalize="none"
            value={walletId}
            onChangeText={setWalletId}
          />
          <Input
            label="Password"
            placeholder="Enter your password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <Text style={{ color: COLORS.primary, marginTop: 8, marginBottom: 8 }} onPress={() => setForgotModalVisible(true)}>
            Forgot Password?
          </Text>
          <Button
            title="Sign In"
            onPress={handleSignIn}
            loading={loading}
            style={styles.button}
          />
          <Text style={styles.signUpText}>Don't have an account? </Text>
          <Link href="/sign-up" style={styles.signUpLink}>
            Sign Up
          </Link>
        </View>
      </ScrollView>
      {/* Forgot Password Modal */}
      <Modal visible={forgotModalVisible} transparent animationType="slide" onRequestClose={() => setForgotModalVisible(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: COLORS.white, borderRadius: 18, padding: 24, width: 320 }}>
            <Text style={{ fontFamily: FONTS.bold, fontSize: 18, marginBottom: 12, color: COLORS.text }}>Reset Password</Text>
            <TextInput
              placeholder="Enter your email"
              placeholderTextColor={COLORS.textLight}
              style={{ borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, padding: 10, marginBottom: 12, color: COLORS.text }}
              value={resetEmail}
              onChangeText={setResetEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <Button title="Send Reset Email" onPress={handleForgotPassword} loading={resetLoading} />
            <Button title="Cancel" onPress={() => setForgotModalVisible(false)} style={{ marginTop: 8, backgroundColor: COLORS.error }} />
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: SIZES.xl,
  },
  header: {
    marginBottom: SIZES.xl,
    alignItems: 'center',
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.xxl,
    color: COLORS.text,
    marginBottom: SIZES.xs,
  },
  subtitle: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.md,
    color: COLORS.textLight,
  },
  form: {
    flex: 1,
  },
  button: {
    marginTop: SIZES.md,
  },
  errorText: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.sm,
    color: COLORS.error,
    marginBottom: SIZES.md,
  },
  signUpText: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.md,
    color: COLORS.textLight,
    marginTop: SIZES.xl,
  },
  signUpLink: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.md,
    color: COLORS.primary,
  },
}); 