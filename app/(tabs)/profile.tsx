import React, { useState } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, ScrollView, Dimensions, Modal, Alert, Switch, ActivityIndicator, TextInput } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { COLORS, FONTS } from '../../constants/theme';
import { FontAwesome } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import * as ImagePicker from 'expo-image-picker';
import { db } from '../../firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const numColumns = 2;
const screenWidth = Dimensions.get('window').width;
const gridPadding = 16 * 2; // left + right
const postImageSize = (screenWidth - gridPadding - 16) / numColumns; // 16 is total margin between images

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
  name: {
    fontFamily: FONTS.bold,
    fontSize: 20,
  },
  username: {
    fontFamily: FONTS.medium,
    fontSize: 15,
    marginBottom: 2,
  },
  bio: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    marginTop: 2,
  },
  walletInfo: {
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
    marginTop: 2,
  },
  walletAddress: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    marginBottom: 6,
  },
  sectionTitle: {
    fontFamily: FONTS.bold,
    fontSize: 18,
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
  const [profilePicModal, setProfilePicModal] = useState(false);
  const [uploading, setUploading] = useState(false);

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

  const handlePickProfilePic = async () => {
    setProfilePicModal(false);
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && user) {
      setUploading(true);
      try {
        const storage = getStorage();
        const img = result.assets[0];
        const response = await fetch(img.uri);
        const blob = await response.blob();
        const storageRef = ref(storage, `profilePictures/${user.id}`);
        await uploadBytes(storageRef, blob);
        const url = await getDownloadURL(storageRef);
        await updateDoc(doc(db, 'users', user.id), { profilePicture: url });
        user.profilePicture = url; // Update in context (may need context update for full reactivity)
        Alert.alert('Success', 'Profile picture updated!');
      } catch (err) {
        console.error('Profile picture upload error:', err);
        Alert.alert('Error', 'Failed to upload profile picture.');
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <Image source={{ uri: user.profilePicture || 'https://randomuser.me/api/portraits/lego/1.jpg' }} style={[styles.avatar, { borderColor: colors.primary }]} />
        <View style={{ flex: 1 }}>
          <Text style={[styles.name, { color: colors.text }]}>{user.firstName || ''} {user.lastName || ''}</Text>
          <Text style={[styles.username, { color: colors.textLight }]}>@{user.username}</Text>
          <Text style={[styles.bio, { color: colors.text }]}>{user.bio || ''}</Text>
        </View>
        <TouchableOpacity onPress={() => setMenuVisible(true)} style={{ padding: 8 }}>
          <FontAwesome name="bars" size={28} color={colors.primary} />
        </TouchableOpacity>
      </View>
      <View style={[styles.walletInfo, { backgroundColor: colors.card }]}> 
        <Text style={[styles.walletLabel, { color: colors.text }]}>Wallet Address</Text>
        <Text style={[styles.walletAddress, { color: colors.textLight }]}>{user.walletId || 'Not set'}</Text>
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
      {/* Profile Menu Modal */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setMenuVisible(false)}
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.25)' }}
        >
          <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
            <TouchableOpacity
              activeOpacity={1}
              style={{
                backgroundColor: colors.card + 'EE',
                borderRadius: 24,
                padding: 24,
                width: 320,
                marginBottom: 40,
                shadowColor: colors.primary,
                shadowOpacity: 0.18,
                shadowRadius: 16,
                elevation: 8,
                alignItems: 'stretch',
              }}
              onPress={() => {}}
            >
              <Text style={{ fontFamily: FONTS.bold, fontSize: 20, color: colors.text, marginBottom: 18, textAlign: 'center' }}>Menu</Text>
              <TouchableOpacity onPress={() => { setProfilePicModal(true); setMenuVisible(false); }} style={{ paddingVertical: 12 }}>
                <Text style={{ color: colors.text, fontFamily: FONTS.medium, fontSize: 16 }}>Change Profile Picture</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { setEditProfileVisible(true); setMenuVisible(false); }} style={{ paddingVertical: 12 }}>
                <Text style={{ color: colors.text, fontFamily: FONTS.medium, fontSize: 16 }}>Edit Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { setSettingsVisible(true); setMenuVisible(false); }} style={{ paddingVertical: 12 }}>
                <Text style={{ color: colors.text, fontFamily: FONTS.medium, fontSize: 16 }}>Settings</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { setFinanceVisible(true); setMenuVisible(false); }} style={{ paddingVertical: 12 }}>
                <Text style={{ color: colors.text, fontFamily: FONTS.medium, fontSize: 16 }}>Finance</Text>
              </TouchableOpacity>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12 }}>
                <Text style={{ color: colors.text, fontFamily: FONTS.medium, fontSize: 16 }}>Dark Mode</Text>
                <Switch
                  value={useTheme().isDark}
                  onValueChange={useTheme().toggleTheme}
                  thumbColor={colors.primary}
                  trackColor={{ false: colors.border, true: colors.primary + '88' }}
                />
              </View>
              <TouchableOpacity onPress={() => { /* Add logout logic here */ setMenuVisible(false); }} style={{ paddingVertical: 12 }}>
                <Text style={{ color: colors.error, fontFamily: FONTS.medium, fontSize: 16 }}>Logout</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
      {/* Edit Profile Modal */}
      <Modal visible={editProfileVisible} transparent animationType="slide" onRequestClose={() => setEditProfileVisible(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: colors.card, borderRadius: 18, padding: 24, width: 320 }}>
            <Text style={{ fontFamily: FONTS.bold, fontSize: 18, marginBottom: 18, color: colors.text }}>Edit Profile</Text>
            <TextInput
              placeholder="Full Name"
              placeholderTextColor={colors.textLight}
              style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 10, padding: 10, marginBottom: 12, color: colors.text }}
              value={editName}
              onChangeText={setEditName}
            />
            <TextInput
              placeholder="Bio"
              placeholderTextColor={colors.textLight}
              style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 10, padding: 10, marginBottom: 12, color: colors.text }}
              value={editBio}
              onChangeText={setEditBio}
              multiline
            />
            <TouchableOpacity onPress={() => setEditProfileVisible(false)} style={{ backgroundColor: colors.primary, borderRadius: 10, padding: 12, marginTop: 8 }}>
              <Text style={{ color: colors.white, fontFamily: FONTS.bold, textAlign: 'center' }}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setEditProfileVisible(false)} style={{ marginTop: 8 }}>
              <Text style={{ color: colors.error, fontFamily: FONTS.medium, textAlign: 'center' }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* Settings Modal */}
      <Modal visible={settingsVisible} transparent animationType="slide" onRequestClose={() => setSettingsVisible(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: colors.card, borderRadius: 18, padding: 24, width: 320 }}>
            <Text style={{ fontFamily: FONTS.bold, fontSize: 18, marginBottom: 18, color: colors.text }}>Settings</Text>
            <Text style={{ color: colors.textLight, fontSize: 16, marginBottom: 18 }}>Settings options coming soon!</Text>
            <TouchableOpacity onPress={() => setSettingsVisible(false)} style={{ backgroundColor: colors.primary, borderRadius: 10, padding: 12, marginTop: 8 }}>
              <Text style={{ color: colors.white, fontFamily: FONTS.bold, textAlign: 'center' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* Finance Modal */}
      <Modal visible={financeVisible} transparent animationType="slide" onRequestClose={() => setFinanceVisible(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: colors.card, borderRadius: 18, padding: 24, width: 320 }}>
            <Text style={{ fontFamily: FONTS.bold, fontSize: 18, marginBottom: 18, color: colors.text }}>Finance</Text>
            <Text style={{ color: colors.textLight, fontSize: 16, marginBottom: 18 }}>Finance features coming soon!</Text>
            <TouchableOpacity onPress={() => setFinanceVisible(false)} style={{ backgroundColor: colors.primary, borderRadius: 10, padding: 12, marginTop: 8 }}>
              <Text style={{ color: colors.white, fontFamily: FONTS.bold, textAlign: 'center' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* Profile Pic Modal (just triggers picker) */}
      <Modal visible={profilePicModal} transparent animationType="fade" onRequestClose={() => setProfilePicModal(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: colors.card, borderRadius: 18, padding: 24, width: 320, alignItems: 'center' }}>
            <Text style={{ fontFamily: FONTS.bold, fontSize: 18, marginBottom: 18, color: colors.text }}>Change Profile Picture</Text>
            <TouchableOpacity onPress={handlePickProfilePic} style={{ backgroundColor: colors.primary, borderRadius: 10, padding: 12, marginBottom: 12 }} disabled={uploading}>
              <Text style={{ color: colors.white, fontFamily: FONTS.bold, textAlign: 'center' }}>{uploading ? 'Uploading...' : 'Pick Image'}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setProfilePicModal(false)}>
              <Text style={{ color: colors.error, fontFamily: FONTS.medium, textAlign: 'center' }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* Add more profile info and sections as needed */}
    </ScrollView>
  );
} 

