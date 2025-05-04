import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../contexts/ThemeContext';

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

const ParticipantsList = () => {
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}> 
      <Text style={[styles.title, { color: colors.text }]}>Select a Participant</Text>
      <FlatList
        data={PARTICIPANTS}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.row}
            onPress={() => router.push({ pathname: '/messages/[chatId]', params: { chatId: item.id, name: item.name, avatar: item.avatar } })}
          >
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            <Text style={[styles.name, { color: colors.text }]}>{item.name}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 32,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 18,
    alignSelf: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 16,
  },
  name: {
    fontSize: 17,
    fontWeight: '500',
  },
});

export default ParticipantsList; 