import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Dimensions,
  Switch,
} from 'react-native';
import { COLORS, FONTS } from '../../constants/theme';


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
const gridPadding = 16 * 2;
const postImageSize = (screenWidth - gridPadding - 16) / numColumns;

export default function ProfileScreen() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  // const { theme, toggleTheme } = useTheme();

  // const isDark = theme === 'dark';
  // const backgroundColor = isDark ? '#121212' : '#ffffff';
  // const textColor = isDark ? '#f0f0f0' : '#1a1a1a';
  // const secondaryTextColor = isDark ? '#aaaaaa' : COLORS.textLight;
  // const cardColor = isDark ? '#1e1e1e' : COLORS.white;

  const connectWallet = () => {
    setWalletConnected(true);
    setWalletAddress('5D4g...XyZ1');
  };

  const renderPost = ({ item }) => (
    <Image source={{ uri: item.image }} style={styles.postImage} />
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
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

      {/* <View style={styles.toggleRow}>
        <Text style={[styles.name, { color: textColor }]}>Dark Mode</Text>
        <Switch value={isDark} onValueChange={toggleTheme} />
      </View> */}

      {walletConnected && (
        <View style={styles.walletInfo}>
          <Text style={styles.walletLabel}>Wallet Address:</Text>
          <Text style={styles.walletAddress}>{walletAddress}</Text>
          <Text style={styles.walletLabel}>Portfolio:</Text>
          <Text style={styles.walletValue}>
            ${MOCK_USER.portfolio.totalValue}
          </Text>
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
  );
}

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
    borderColor: COLORS.primary,
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
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
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
  walletValue: {
    fontFamily: FONTS.bold,
    fontSize: 18,
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
    marginRight: 12,
  },
  sectionTitle: {
    fontFamily: FONTS.bold,
    fontSize: 18,
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
  },
});
