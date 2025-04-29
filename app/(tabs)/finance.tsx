import React from 'react';
import { View, StyleSheet, Text, FlatList, Image } from 'react-native';
import { COLORS, FONTS } from '../../constants/theme';

const MOCK_PARTICIPANTS = [
  {
    id: '1',
    name: 'Alice',
    avatar: 'https://randomuser.me/api/portraits/women/10.jpg',
    totalStaked: 1200,
    stakingHistory: [
      { amount: 500, time: '2024-06-01' },
      { amount: 700, time: '2024-06-10' },
    ],
  },
  {
    id: '2',
    name: 'Bob',
    avatar: 'https://randomuser.me/api/portraits/men/11.jpg',
    totalStaked: 800,
    stakingHistory: [
      { amount: 300, time: '2024-06-03' },
      { amount: 500, time: '2024-06-12' },
    ],
  },
];

export default function FinanceScreen() {
  const renderParticipant = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.header}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        <View>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.totalStaked}>Total Staked: ${item.totalStaked}</Text>
        </View>
      </View>
      <Text style={styles.historyTitle}>Staking History:</Text>
      {item.stakingHistory.map((s, idx) => (
        <Text key={idx} style={styles.historyItem}>
          +${s.amount} on {s.time}
        </Text>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Participants You Follow</Text>
      <FlatList
        data={MOCK_PARTICIPANTS}
        renderItem={renderParticipant}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 16,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: 22,
    color: COLORS.text,
    marginBottom: 18,
    textAlign: 'center',
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 18,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 14,
  },
  name: {
    fontFamily: FONTS.semiBold,
    fontSize: 17,
    color: COLORS.text,
  },
  totalStaked: {
    fontFamily: FONTS.medium,
    fontSize: 15,
    color: COLORS.secondary,
  },
  historyTitle: {
    fontFamily: FONTS.medium,
    fontSize: 15,
    color: COLORS.text,
    marginTop: 8,
  },
  historyItem: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.textLight,
    marginLeft: 8,
    marginTop: 2,
  },
}); 