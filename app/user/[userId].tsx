import { View, Text, StyleSheet, ActivityIndicator, FlatList, Image } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

// Dummy data fetching function (replace with real API call)
const fetchUserDetails = async (userId: string) => {
  // Simulate API call
  return new Promise<UserDetails>((resolve) => {
    setTimeout(() => {
      resolve({
        name: 'John Doe',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
        followers: 123,
        following: 45,
        posts: [
          { id: '1', content: 'First post!' },
          { id: '2', content: 'Another post.' },
        ],
      });
    }, 1000);
  });
};

type UserDetails = {
  name: string;
  avatar: string;
  followers: number;
  following: number;
  posts: { id: string; content: string }[];
};

export default function UserProfile() {
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const [user, setUser] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const { colors } = useTheme();

  useEffect(() => {
    fetchUserDetails(userId).then((data) => {
      setUser(data);
      setLoading(false);
    });
  }, [userId]);

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} color={colors.primary} />;
  }

  if (!user) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}> 
        <Text style={{ color: colors.text }}>User not found.</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}> 
      <Image source={{ uri: user.avatar }} style={styles.avatar} />
      <Text style={[styles.name, { color: colors.text }]}>{user.name}</Text>
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={[styles.statNumber, { color: colors.text }]}>{user.followers}</Text>
          <Text style={[styles.statLabel, { color: colors.textLight }]}>Followers</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statNumber, { color: colors.text }]}>{user.following}</Text>
          <Text style={[styles.statLabel, { color: colors.textLight }]}>Following</Text>
        </View>
      </View>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Posts</Text>
      <FlatList
        data={user.posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.postBox, { borderBottomColor: colors.border }]}> 
            <Text style={[styles.post, { color: colors.text }]}>{item.content}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignSelf: 'center',
    marginBottom: 14,
    borderWidth: 2,
    borderColor: '#ccc',
  },
  name: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  statBox: { alignItems: 'center', flex: 1 },
  statNumber: { fontSize: 20, fontWeight: 'bold' },
  statLabel: { fontSize: 14, marginTop: 2 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  postBox: { paddingVertical: 12, borderBottomWidth: 1 },
  post: { fontSize: 16 },
}); 