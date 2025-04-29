import React from 'react';
import { View, StyleSheet, FlatList, RefreshControl, Text, Image, TouchableOpacity } from 'react-native';
import { COLORS, SHADOWS } from '../../constants/theme';
import { useAuth } from '../../contexts/AuthContext';
import Post from '../../components/Post';

// Temporary mock data for stories
const MOCK_STORIES = [
  { id: '1', avatar: 'https://randomuser.me/api/portraits/men/1.jpg', name: 'You', isActive: true },
  { id: '2', avatar: 'https://randomuser.me/api/portraits/women/2.jpg', name: 'Mark', isActive: false },
  { id: '3', avatar: 'https://randomuser.me/api/portraits/men/3.jpg', name: 'Alex', isActive: false },
  { id: '4', avatar: 'https://randomuser.me/api/portraits/women/4.jpg', name: 'Neora', isActive: true },
  { id: '5', avatar: 'https://randomuser.me/api/portraits/men/5.jpg', name: 'Maxi', isActive: false },
];

// Temporary mock data for posts
const MOCK_POSTS = [
  {
    id: '1',
    username: 'john_doe',
    content: 'Just started my financial journey! 🚀',
    likes: 42,
    comments: 5,
    timestamp: '2h ago',
    profilePicture: 'https://randomuser.me/api/portraits/men/1.jpg',
  },
  {
    id: '2',
    username: 'jane_smith',
    content: 'Hit my savings goal for the month! 💰',
    likes: 28,
    comments: 3,
    timestamp: '4h ago',
    profilePicture: 'https://randomuser.me/api/portraits/women/2.jpg',
  },
];

// Inline StoryBubble component
const StoryBubble = ({ avatar, name, isActive }) => (
  <View style={storyStyles.container}>
    <View style={[storyStyles.ring, isActive && { borderColor: COLORS.primary }]}> 
      <Image source={{ uri: avatar }} style={storyStyles.avatar} />
    </View>
    <Text style={storyStyles.name} numberOfLines={2} ellipsizeMode="tail">{name}</Text>
  </View>
);

const storyStyles = StyleSheet.create({
  container: { alignItems: 'center', marginHorizontal: 8, width: 70 },
  ring: {
    borderWidth: 2,
    borderColor: COLORS.secondary,
    borderRadius: 40,
    padding: 2,
    marginBottom: 4,
  },
  avatar: { width: 56, height: 56, borderRadius: 28 },
  name: { color: COLORS.text, fontSize: 13, maxWidth: 68, textAlign: 'center', fontWeight: '500' },
});

export default function FeedScreen() {
  const { user } = useAuth();
  const [refreshing, setRefreshing] = React.useState(false);
  const [posts, setPosts] = React.useState(MOCK_POSTS);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // TODO: Implement actual refresh logic
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const handleLike = (postId: string) => {
    // TODO: Implement like functionality
    console.log('Like post:', postId);
  };

  const handleComment = (postId: string) => {
    // TODO: Implement comment functionality
    console.log('Comment on post:', postId);
  };

  const handleProfile = (username: string) => {
    // TODO: Navigate to profile
    console.log('View profile:', username);
  };

  const renderPost = ({ item }) => {
    return (
      <View style={styles.postCardWrapper}>
        <Post
          {...item}
          onLike={() => handleLike(item.id)}
          onComment={() => handleComment(item.id)}
          onProfile={() => handleProfile(item.username)}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Story Bubbles */}
      <FlatList
        data={MOCK_STORIES}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <StoryBubble {...item} />}
        style={styles.stories}
        contentContainerStyle={{ paddingLeft: 12, paddingVertical: 12 }}
      />
      {/* Feed */}
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background, // light purple
  },
  stories: {
    backgroundColor: 'transparent',
  },
  listContent: {
    padding: 8,
    paddingBottom: 32,
  },
  postCardWrapper: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    marginBottom: 16,
    ...SHADOWS.small,
    padding: 2,
  },
});
