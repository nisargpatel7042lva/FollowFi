import React, { useState } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, FlatList, ScrollView, Dimensions, Modal, TextInput, Switch } from 'react-native';
import { FONTS } from '../../constants/theme';
import { FontAwesome } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';

const MOCK_USER = {
  name: 'Jane Doe',
  username: 'janedoe',
  avatar: 'https://randomuser.me/api/portraits/women/12.jpg',
  bio: 'Web3 enthusiast. Building the future.',
  posts: [
    { id: '1', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb' },
    { id: '2', image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca' },
    { id: '3', image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308' },
    { id: '4', image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429' },
  ],
  portfolio: {
    totalValue: 3200,
    tokens: [
      { symbol: 'SOL', amount: 12.5 },
      { symbol: 'USDC', amount: 500 },
    ],
  },
};

const numColumns = 2;
const screenWidth = Dimensions.get('window').width;
const gridPadding = 16 * 2; // left + right
const postImageSize = (screenWidth - gridPadding - 16) / numColumns; // 16 is total margin between images

export default function ProfileScreen() {
  const { colors, isDark, toggleTheme } = useTheme();
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [financeVisible, setFinanceVisible] = useState(false);
  const [editProfileVisible, setEditProfileVisible] = useState(false);
  const [editName, setEditName] = useState(MOCK_USER.name);
  const [editBio, setEditBio] = useState(MOCK_USER.bio);

  // Placeholder for Solana wallet connect
  const connectWallet = () => {
    // TODO: Replace with solana-wallet-connect-adapter logic
    setWalletConnected(true);
    setWalletAddress('5D4g...XyZ1');
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
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
      borderColor: colors.primary,
    },
    name: {
      fontFamily: FONTS.bold,
      fontSize: 20,
      color: colors.text,
    },
    username: {
      fontFamily: FONTS.medium,
      fontSize: 15,
      color: colors.textLight,
      marginBottom: 2,
    },
    bio: {
      fontFamily: FONTS.regular,
      fontSize: 14,
      color: colors.text,
      marginTop: 2,
    },
    walletButton: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      paddingVertical: 10,
      alignItems: 'center',
      marginBottom: 12,
    },
    walletButtonText: {
      color: colors.white,
      fontFamily: FONTS.medium,
      fontSize: 15,
    },
    walletInfo: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 14,
      marginBottom: 14,
      shadowColor: colors.primary,
      shadowOpacity: 0.10,
      shadowRadius: 6,
      elevation: 1,
    },
    walletLabel: {
      fontFamily: FONTS.medium,
      fontSize: 14,
      color: colors.text,
      marginTop: 2,
    },
    walletAddress: {
      fontFamily: FONTS.regular,
      fontSize: 13,
      color: colors.textLight,
      marginBottom: 6,
    },
    walletValue: {
      fontFamily: FONTS.bold,
      fontSize: 18,
      color: colors.secondary,
      marginBottom: 4,
    },
    tokenRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    token: {
      fontFamily: FONTS.medium,
      fontSize: 14,
      color: colors.text,
      marginRight: 12,
    },
    sectionTitle: {
      fontFamily: FONTS.bold,
      fontSize: 18,
      color: colors.text,
      marginBottom: 8,
      marginTop: 8,
    },
    postsGridWrapper: {
      flex: 1,
    },
    postsGrid: {
      flexGrow: 1,
      justifyContent: 'flex-start',
    },
    postImage: {
      width: (Dimensions.get('window').width - 16 * 2 - 16) / 2,
      height: (Dimensions.get('window').width - 16 * 2 - 16) / 2,
      borderRadius: 12,
      margin: 4,
      backgroundColor: colors.white,
    },
    menuItem: {
      fontSize: 18,
      paddingVertical: 10,
      fontFamily: FONTS.medium,
    },
    input: {
      borderWidth: 1,
      borderRadius: 10,
      padding: 10,
      fontSize: 15,
      marginTop: 10,
      marginBottom: 4,
    },
  });

  const renderPost = ({ item }: { item: { image: string } }) => (
    <Image source={{ uri: item.image }} style={styles.postImage} />
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <Image source={{ uri: MOCK_USER.avatar }} style={[styles.avatar, { borderColor: colors.primary }]} />
        <View style={{ flex: 1 }}>
          <Text style={[styles.name, { color: colors.text }]}>{editName}</Text>
          <Text style={[styles.username, { color: colors.text }]}>{'@' + MOCK_USER.username}</Text>
          <Text style={[styles.bio, { color: colors.text }]}>{editBio}</Text>
        </View>
        <TouchableOpacity onPress={() => setMenuVisible(true)} style={{ padding: 8 }}>
          <FontAwesome name="bars" size={28} color={colors.primary} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={[styles.walletButton, { backgroundColor: colors.primary }]} onPress={connectWallet}>
        <Text style={styles.walletButtonText}>
          {walletConnected ? 'Wallet Connected' : 'Connect Solana Wallet'}
        </Text>
      </TouchableOpacity>
      {walletConnected && (
        <View style={[styles.walletInfo, { backgroundColor: colors.card, shadowColor: colors.primary }]}>
          <Text style={[styles.walletLabel, { color: colors.text }]}>Wallet Address:</Text>
          <Text style={[styles.walletAddress, { color: colors.text }]}>{walletAddress}</Text>
          <Text style={[styles.walletLabel, { color: colors.text }]}>Portfolio:</Text>
          <Text style={[styles.walletValue, { color: colors.primary }]}>{'$' + MOCK_USER.portfolio.totalValue}</Text>
          <View style={styles.tokenRow}>
            {MOCK_USER.portfolio.tokens.map((t, idx) => (
              <Text key={idx} style={[styles.token, { color: colors.text }]}>
                {t.amount} {t.symbol}
              </Text>
            ))}
          </View>
        </View>
      )}
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Posts</Text>
      <View style={styles.postsGridWrapper}>
        <FlatList
          data={MOCK_USER.posts}
          renderItem={renderPost}
          keyExtractor={item => item.id}
          numColumns={numColumns}
          scrollEnabled={false}
          contentContainerStyle={styles.postsGrid}
        />
      </View>

      {/* Hamburger Menu Modal */}
      <Modal visible={menuVisible} transparent animationType="fade" onRequestClose={() => setMenuVisible(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'flex-end' }}>
          <View style={{
            backgroundColor: colors.card, borderTopLeftRadius: 18, borderTopRightRadius: 18, padding: 24
          }}>
            <TouchableOpacity onPress={() => { setEditProfileVisible(true); setMenuVisible(false); }}>
              <Text style={[styles.menuItem, { color: colors.text }]}>Profile Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setSettingsVisible(true); setMenuVisible(false); }}>
              <Text style={[styles.menuItem, { color: colors.text }]}>Feed Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setFinanceVisible(true); setMenuVisible(false); }}>
              <Text style={[styles.menuItem, { color: colors.text }]}>Finances</Text>
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 16, marginBottom: 8 }}>
              <Text style={[styles.menuItem, { color: colors.text, flex: 1 }]}>Dark Mode</Text>
              <Switch value={isDark} onValueChange={toggleTheme} />
            </View>
            <TouchableOpacity onPress={() => setMenuVisible(false)} style={{ marginTop: 18 }}>
              <Text style={[styles.menuItem, { color: colors.error }]}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Edit Profile Modal */}
      <Modal visible={editProfileVisible} transparent animationType="slide" onRequestClose={() => setEditProfileVisible(false)}>
        <View style={{
          flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center'
        }}>
          <View style={{
            backgroundColor: colors.card, borderRadius: 18, padding: 24, width: 320
          }}>
            <Text style={[styles.menuItem, { color: colors.text }]}>Edit Profile</Text>
            <TextInput value={editName} onChangeText={setEditName} style={[styles.input, { color: colors.text, backgroundColor: colors.background, borderColor: colors.border }]} placeholder="Name" placeholderTextColor={colors.text} />
            <TextInput value={editBio} onChangeText={setEditBio} style={[styles.input, { color: colors.text, backgroundColor: colors.background, borderColor: colors.border }]} placeholder="Bio" placeholderTextColor={colors.text} multiline />
            <TouchableOpacity onPress={() => setEditProfileVisible(false)} style={{ marginTop: 18 }}>
              <Text style={[styles.menuItem, { color: colors.primary }]}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Feed Settings Modal */}
      <Modal visible={settingsVisible} transparent animationType="slide" onRequestClose={() => setSettingsVisible(false)}>
        <View style={{
          flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center'
        }}>
          <View style={{
            backgroundColor: colors.card, borderRadius: 18, padding: 24, width: 320
          }}>
            <Text style={[styles.menuItem, { color: colors.text }]}>Feed Settings</Text>
            <Text style={{ color: colors.text, marginTop: 10 }}>Coming soon...</Text>
            <TouchableOpacity onPress={() => setSettingsVisible(false)} style={{ marginTop: 18 }}>
              <Text style={[styles.menuItem, { color: colors.primary }]}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Finances Modal */}
      <Modal visible={financeVisible} transparent animationType="slide" onRequestClose={() => setFinanceVisible(false)}>
        <View style={{
          flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center'
        }}>
          <View style={{
            backgroundColor: colors.card, borderRadius: 18, padding: 24, width: 340, maxHeight: 500
          }}>
            <Text style={[styles.menuItem, { color: colors.text }]}>Finances</Text>
            <Text style={{ color: colors.text, marginTop: 10, marginBottom: 10 }}>Participants You Follow</Text>
            {/* Example: You can render your finance data here */}
            <Text style={{ color: colors.text }}>Total Value: $3200</Text>
            <TouchableOpacity onPress={() => setFinanceVisible(false)} style={{ marginTop: 18 }}>
              <Text style={[styles.menuItem, { color: colors.primary }]}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
} 