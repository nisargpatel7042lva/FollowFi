import React, { useState } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, ScrollView, Dimensions, Modal, Alert, Switch, ActivityIndicator, TextInput } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { COLORS, FONTS } from '../../constants/theme';
import { FontAwesome } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';

const numColumns = 2;
const screenWidth = Dimensions.get('window').width;
const gridPadding = 16 * 2; // left + right
const postImageSize = (screenWidth - gridPadding - 16) / numColumns; // 16 is total margin between images

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 16,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  name: {
    fontFamily: FONTS.bold,
    fontSize: 20,
    color: COLORS.text,
  },
  username: {
    fontFamily: FONTS.medium,
    fontSize: 15,
    color: COLORS.textLight,
    marginBottom: 2,
  },
  bio: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.text,
    marginTop: 2,
  },
  walletInfo: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.10,
    shadowRadius: 6,
    elevation: 1,
  },
  walletLabel: {
    fontFamily: FONTS.medium,
    fontSize: 14,
    color: COLORS.text,
    marginTop: 2,
  },
  walletAddress: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: COLORS.textLight,
    marginBottom: 6,
  },
  sectionTitle: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    color: COLORS.text,
    marginBottom: 8,
    marginTop: 8,
  },
});

export default function ProfileScreen() {
  const { colors } = useTheme();
  const { user, isLoading } = useAuth();
  const [menuVisible, setMenuVisible] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [financeVisible, setFinanceVisible] = useState(false);
  const [editProfileVisible, setEditProfileVisible] = useState(false);
  const [editName, setEditName] = useState(user?.firstName ? `${user.firstName} ${user.lastName || ''}` : '');
  const [editBio, setEditBio] = useState(user?.bio || '');
  const [changePwVisible, setChangePwVisible] = useState(false);
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmNewPw, setConfirmNewPw] = useState('');
  const [pwLoading, setPwLoading] = useState(false);

  if (isLoading) {
    return <ActivityIndicator style={{ flex: 1 }} color={colors.primary} />;
  }

  if (!user) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}> 
        <Text style={{ color: colors.text }}>User not found.</Text>
      </View>
    );
  }

  const handleChangePassword = async () => {
    if (!currentPw || !newPw || !confirmNewPw) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    if (newPw !== confirmNewPw) {
      Alert.alert('Error', 'New passwords do not match.');
      return;
    }
    if (newPw.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters.');
      return;
    }
    setPwLoading(true);
    try {
      // Re-authenticate user
      const authUser = require('../firebaseConfig').auth.currentUser;
      if (!authUser || !user?.email) throw new Error('User not found');
      const credential = EmailAuthProvider.credential(user.email, currentPw);
      await reauthenticateWithCredential(authUser, credential);
      await updatePassword(authUser, newPw);
      Alert.alert('Success', 'Password updated successfully!');
      setChangePwVisible(false);
      setCurrentPw(''); setNewPw(''); setConfirmNewPw('');
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to update password');
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <Image source={{ uri: user.profilePicture || 'https://randomuser.me/api/portraits/lego/1.jpg' }} style={[styles.avatar, { borderColor: colors.primary }]} />
        <View style={{ flex: 1 }}>
          <Text style={[styles.name, { color: colors.text }]}>{user.firstName || ''} {user.lastName || ''}</Text>
          <Text style={[styles.username, { color: colors.text }]}>@{user.username}</Text>
          <Text style={[styles.bio, { color: colors.text }]}>{user.bio || ''}</Text>
        </View>
        <TouchableOpacity onPress={() => setMenuVisible(true)} style={{ padding: 8 }}>
          <FontAwesome name="bars" size={28} color={colors.primary} />
        </TouchableOpacity>
      </View>
      <View style={styles.walletInfo}>
        <Text style={styles.walletLabel}>Wallet Address</Text>
        <Text style={styles.walletAddress}>{user.walletId || 'Not set'}</Text>
      </View>
      <TouchableOpacity style={[styles.walletInfo, { marginBottom: 24, backgroundColor: colors.primary }]} onPress={() => setChangePwVisible(true)}>
        <Text style={{ color: colors.white, fontFamily: FONTS.bold, textAlign: 'center' }}>Change Password</Text>
      </TouchableOpacity>
      {/* Change Password Modal */}
      <Modal visible={changePwVisible} transparent animationType="slide" onRequestClose={() => setChangePwVisible(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: colors.card, borderRadius: 18, padding: 24, width: 320 }}>
            <Text style={{ fontFamily: FONTS.bold, fontSize: 18, marginBottom: 12, color: colors.text }}>Change Password</Text>
            <TextInput
              placeholder="Current Password"
              placeholderTextColor={colors.textLight}
              style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 10, padding: 10, marginBottom: 12, color: colors.text }}
              value={currentPw}
              onChangeText={setCurrentPw}
              secureTextEntry
            />
            <TextInput
              placeholder="New Password"
              placeholderTextColor={colors.textLight}
              style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 10, padding: 10, marginBottom: 12, color: colors.text }}
              value={newPw}
              onChangeText={setNewPw}
              secureTextEntry
            />
            <TextInput
              placeholder="Confirm New Password"
              placeholderTextColor={colors.textLight}
              style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 10, padding: 10, marginBottom: 12, color: colors.text }}
              value={confirmNewPw}
              onChangeText={setConfirmNewPw}
              secureTextEntry
            />
            <TouchableOpacity onPress={handleChangePassword} style={{ backgroundColor: colors.primary, borderRadius: 10, padding: 12, marginTop: 8 }} disabled={pwLoading}>
              <Text style={{ color: colors.white, fontFamily: FONTS.bold, textAlign: 'center' }}>{pwLoading ? 'Updating...' : 'Update Password'}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setChangePwVisible(false)} style={{ marginTop: 8 }}>
              <Text style={{ color: colors.error, fontFamily: FONTS.medium, textAlign: 'center' }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* Add more profile info and sections as needed */}
    </ScrollView>
  );
} 

