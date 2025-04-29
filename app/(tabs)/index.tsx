import React from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { COLORS } from '../../constants/theme';
import { useAuth } from '../../contexts/AuthContext';
import Post from '../../components/Post';

// Temporary mock data
const MOCK_POSTS = [
  {
    id: '1',
    username: 'john_doe',
    content: 'Just started my financial journey! 🚀',
    likes: 42,
    comments: 5,
    timestamp: '2h ago',
  },
  {
    id: '2',
    username: 'jane_smith',
    content: 'Hit my savings goal for the month! 💰',
    likes: 28,
    comments: 3,
    timestamp: '4h ago',
  },
];

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
      <Post
        {...item}
        onLike={() => handleLike(item.id)}
        onComment={() => handleComment(item.id)}
        onProfile={() => handleProfile(item.username)}
      />
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContent: {
    padding: 16,
  },
});
