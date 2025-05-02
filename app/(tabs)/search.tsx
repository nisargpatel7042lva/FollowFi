import React, { useState } from 'react';
import { View, TextInput, FlatList, TouchableOpacity, Text, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../contexts/ThemeContext';

// Dummy user data (replace with real API call)
const USERS = [
  { id: '1', name: 'John Doe', avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
  { id: '2', name: 'Jane Smith', avatar: 'https://randomuser.me/api/portraits/women/2.jpg' },
  { id: '3', name: 'Alexandria', avatar: 'https://randomuser.me/api/portraits/men/3.jpg' },
  { id: '4', name: 'Neora', avatar: 'https://randomuser.me/api/portraits/women/4.jpg' },
  { id: '5', name: 'Maximilian', avatar: 'https://randomuser.me/api/portraits/men/5.jpg' },
];

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(USERS);
  const router = useRouter();
  const { colors } = useTheme();

  const handleSearch = (text: string) => {
    setQuery(text);
    setResults(
      USERS.filter(user =>
        user.name.toLowerCase().includes(text.toLowerCase())
      )
    );
  };

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: colors.background }}>
      <TextInput
        placeholder="Search users..."
        placeholderTextColor={colors.textLight}
        value={query}
        onChangeText={handleSearch}
        style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.card }]}
      />
      <FlatList
        data={results}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.resultRow, { borderBottomColor: colors.border }]}
            onPress={() => router.push({ pathname: '/user/[userId]', params: { userId: item.id } })}
          >
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            <Text style={[styles.name, { color: colors.text }]}>{item.name}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={{ color: colors.textLight, textAlign: 'center', marginTop: 32 }}>No users found.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1, borderRadius: 8, padding: 10, marginBottom: 16,
  },
  resultRow: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1,
  },
  avatar: {
    width: 40, height: 40, borderRadius: 20, marginRight: 12,
  },
  name: {
    fontSize: 16,
  },
}); 