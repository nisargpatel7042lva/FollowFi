import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../../constants/theme';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/Button';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.username}>{user?.username || 'User'}</Text>
      <Text style={styles.email}>{user?.email}</Text>
      <Button 
        title="Sign Out" 
        onPress={signOut}
        variant="outline"
        style={styles.signOutButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 32,
    backgroundColor: COLORS.background,
  },
  username: {
    fontFamily: FONTS.bold,
    fontSize: 24,
    color: COLORS.text,
    marginBottom: 8,
  },
  email: {
    fontFamily: FONTS.regular,
    fontSize: 16,
    color: COLORS.textLight,
    marginBottom: 32,
  },
  signOutButton: {
    width: '80%',
  },
}); 