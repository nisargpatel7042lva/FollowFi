import React, { useState } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, FlatList, ScrollView, Dimensions, Modal, Alert } from 'react-native';
import { COLORS, FONTS } from '../../constants/theme';
import { FontAwesome } from '@expo/vector-icons';
import ConnectWallet from '../components/ConnectWallet';

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
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);

  // Placeholder for Solana wallet connect
  const connectWallet = () => {
    // TODO: Replace with solana-wallet-connect-adapter logic
    setWalletConnected(true);
    setWalletAddress('5D4g...XyZ1');
  };

  const renderPost = ({ item }: { item: { id: string; image: string } }) => (
    <Image source={{ uri: item.image }} style={styles.postImage} />
  );

  const handleMenuOption = (option: string) => {
    setMenuVisible(false);
    // Replace with navigation or logic as needed
    Alert.alert(option, `You selected: ${option}`);
  };

  return (
    <View style={styles.container}>
      {/* Top row: Hamburger and Profile title */}
      <View style={styles.topRow}>
        <TouchableOpacity style={styles.hamburger} onPress={() => setMenuVisible(true)}>
          <FontAwesome name="bars" size={28} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.profileTitle}>Profile</Text>
        <View style={{ width: 36 }} /> {/* Spacer for symmetry */}
      </View>
      {/* Hamburger menu modal */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity style={styles.menuOverlay} activeOpacity={1} onPress={() => setMenuVisible(false)}>
          <View style={styles.menuContent}>
            <Text style={styles.menuTitle}>Menu</Text>
            <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuOption('Finances')}>
              <FontAwesome name="line-chart" size={20} color={COLORS.primary} style={{ marginRight: 12 }} />
              <Text style={styles.menuItemText}>Finances</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuOption('Settings')}>
              <FontAwesome name="cog" size={20} color={COLORS.primary} style={{ marginRight: 12 }} />
              <Text style={styles.menuItemText}>Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuOption('Wallet Address')}>
              <FontAwesome name="wallet" size={20} color={COLORS.primary} style={{ marginRight: 12 }} />
              <Text style={styles.menuItemText}>Wallet Address</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuClose} onPress={() => setMenuVisible(false)}>
              <Text style={styles.menuCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
      <ScrollView style={styles.scrollContent} contentContainerStyle={styles.scrollInnerContent}>
        <View style={styles.header}>
          <Image source={{ uri: MOCK_USER.avatar }} style={styles.avatar} />
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{MOCK_USER.name}</Text>
            <Text style={styles.username}>@{MOCK_USER.username}</Text>
            <Text style={styles.bio}>{MOCK_USER.bio}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.walletButton} onPress={connectWallet}>
          <Text style={styles.walletButtonText}>
            {walletConnected ? 'Wallet Connected' : 'Connect Solana Wallet'}
          </Text>
        </TouchableOpacity>
        {walletConnected && (
          <View style={styles.walletInfo}>
            <Text style={styles.walletLabel}>Wallet Address:</Text>
            <Text style={styles.walletAddress}>{walletAddress}</Text>
            <Text style={styles.walletLabel}>Portfolio:</Text>
            <Text style={styles.walletValue}>${MOCK_USER.portfolio.totalValue}</Text>
            <View style={styles.tokenRow}>
              {MOCK_USER.portfolio.tokens.map((t, idx) => (
                <Text key={idx} style={styles.token}>
                  {t.amount} {t.symbol}
                </Text>
              ))}
            </View>
          </View>
        )}
        <Text style={styles.sectionTitle}>Posts</Text>
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
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingTop: 18,
    marginBottom: 8,
  },
  profileTitle: {
    fontFamily: FONTS.bold,
    fontSize: 22,
    color: COLORS.text,
    textAlign: 'center',
    flex: 1,
  },
  hamburger: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 6,
    elevation: 3,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.12,
    shadowRadius: 6,
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.18)',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  menuContent: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    marginTop: 48,
    marginLeft: 16,
    padding: 18,
    minWidth: 200,
    elevation: 5,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  menuTitle: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    color: COLORS.text,
    marginBottom: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  menuItemText: {
    fontFamily: FONTS.medium,
    fontSize: 16,
    color: COLORS.text,
  },
  menuClose: {
    marginTop: 16,
    alignSelf: 'flex-end',
  },
  menuCloseText: {
    color: COLORS.primary,
    fontFamily: FONTS.bold,
    fontSize: 15,
  },
  scrollContent: {
    flex: 1,
  },
  scrollInnerContent: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    marginTop: 24,
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
  walletButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    marginBottom: 12,
  },
  walletButtonText: {
    color: COLORS.white,
    fontFamily: FONTS.medium,
    fontSize: 15,
  },
  walletInfo: {
    backgroundColor: COLORS.white,
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
  walletValue: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    color: COLORS.secondary,
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
    color: COLORS.text,
    marginRight: 12,
  },
  sectionTitle: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    color: COLORS.text,
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
    width: postImageSize,
    height: postImageSize,
    borderRadius: 12,
    margin: 4,
    backgroundColor: COLORS.white,
  },
}); 