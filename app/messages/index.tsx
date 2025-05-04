import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../contexts/ThemeContext';
import { COLORS, FONTS } from '../../constants/theme';

const PARTICIPANTS = [
  { id: '1', name: 'Alice', avatar: 'https://randomuser.me/api/portraits/women/10.jpg' },
  { id: '2', name: 'Bob', avatar: 'https://randomuser.me/api/portraits/men/11.jpg' },
  { id: '3', name: 'Carla', avatar: 'https://randomuser.me/api/portraits/women/12.jpg' },
  { id: '4', name: 'Daniel', avatar: 'https://randomuser.me/api/portraits/men/13.jpg' },
  { id: '5', name: 'Emma', avatar: 'https://randomuser.me/api/portraits/women/14.jpg' },
  { id: '6', name: 'Frank', avatar: 'https://randomuser.me/api/portraits/men/15.jpg' },
  { id: '7', name: 'Grace', avatar: 'https://randomuser.me/api/portraits/women/16.jpg' },
  { id: '8', name: 'Henry', avatar: 'https://randomuser.me/api/portraits/men/17.jpg' },
  { id: '9', name: 'Ivy', avatar: 'https://randomuser.me/api/portraits/women/18.jpg' },
  { id: '10', name: 'Jack', avatar: 'https://randomuser.me/api/portraits/men/19.jpg' },
];

export default function MessagesScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.participantRow}
      onPress={() => router.push({ pathname: '/messages/index' })}
      activeOpacity={0.85}
    >
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <Text style={[styles.name, { color: colors.text }]}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}> 
      <Text style={[styles.header, { color: colors.text }]}>Select a Participant</Text>
      <FlatList
        data={PARTICIPANTS}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 24,
    paddingHorizontal: 0,
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 18,
    marginLeft: 18,
    fontFamily: FONTS.bold,
  },
  participantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 18,
    marginHorizontal: 8,
    marginBottom: 2,
    backgroundColor: 'rgba(161,140,209,0.04)',
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    marginRight: 18,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  name: {
    fontSize: 17,
    fontWeight: '600',
    fontFamily: FONTS.semiBold,
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.border,
    marginLeft: 90,
    marginRight: 18,
  },
}); 