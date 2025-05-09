import { View, Text, StyleSheet, ActivityIndicator, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { db } from '../../firebaseConfig';
import { collection, query, where, getDocs, deleteDoc, doc, orderBy } from 'firebase/firestore';
import { FontAwesome } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';

export default function UserProfile() {
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const { user } = useAuth();
  const [userDetails, setUserDetails] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<any[]>([]);
  const { colors } = useTheme();

  useEffect(() => {
    // Fetch user details (replace with real user fetch if available)
    // For now, just set dummy avatar and name
    setUserDetails({
      name: userId,
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      followers: 0,
      following: 0,
    });
    // Fetch posts by this user
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, 'posts'), where('authorId', '==', userId), orderBy('timestamp', 'desc'));
        const snapshot = await getDocs(q);
        setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (e) {}
      setLoading(false);
    };
    fetchPosts();
  }, [userId]);

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} color={colors.primary} />;
  }

  if (!userDetails) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}> 
        <Text style={{ color: colors.text }}>User not found.</Text>
      </View>
    );
  }

  const handleDeletePost = async (postId: string) => {
    Alert.alert('Delete Post', 'Are you sure you want to delete this post?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        await deleteDoc(doc(db, 'posts', postId));
        setPosts(prev => prev.filter(p => p.id !== postId));
      }},
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}> 
      <Image source={{ uri: userDetails.avatar }} style={styles.avatar} />
      <Text style={[styles.name, { color: colors.text }]}>{userDetails.name}</Text>
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={[styles.statNumber, { color: colors.text }]}>{userDetails.followers}</Text>
          <Text style={[styles.statLabel, { color: colors.textLight }]}>Followers</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statNumber, { color: colors.text }]}>{userDetails.following}</Text>
          <Text style={[styles.statLabel, { color: colors.textLight }]}>Following</Text>
        </View>
      </View>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Posts</Text>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.postBox, { borderBottomColor: colors.border, flexDirection: 'row', alignItems: 'center' }]}> 
            <View style={{ flex: 1 }}>
              <Text style={[styles.post, { color: colors.text }]}>{item.content}</Text>
              {item.image ? (
                <Image source={{ uri: item.image }} style={{ width: '100%', height: 180, borderRadius: 10, marginTop: 8 }} />
              ) : null}
              {item.timestamp ? (
                <Text style={{ color: colors.textLight, fontSize: 12, marginTop: 4 }}>{
                  typeof item.timestamp === 'string' ? item.timestamp : (item.timestamp.seconds ? new Date(item.timestamp.seconds * 1000).toLocaleString() : '')
                }</Text>
              ) : null}
            </View>
            {user && user.id === userId && (
              <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => handleDeletePost(item.id)}>
                <FontAwesome name="trash" size={20} color={colors.textLight} />
              </TouchableOpacity>
            )}
          </View>
        )}
        ListEmptyComponent={<Text style={{ color: colors.textLight, textAlign: 'center', marginTop: 20 }}>No posts yet.</Text>}
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