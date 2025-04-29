import React, { useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, Text, Image, TouchableOpacity, Modal, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { COLORS, SHADOWS } from '../../constants/theme';
import { useAuth } from '../../contexts/AuthContext';
import { FontAwesome } from '@expo/vector-icons';

// Temporary mock data for stories
const MOCK_STORIES = [
  { id: '1', avatar: 'https://randomuser.me/api/portraits/men/1.jpg', name: 'You', isActive: true },
  { id: '2', avatar: 'https://randomuser.me/api/portraits/women/2.jpg', name: 'Mark', isActive: false },
  { id: '3', avatar: 'https://randomuser.me/api/portraits/men/3.jpg', name: 'Alexandria', isActive: false },
  { id: '4', avatar: 'https://randomuser.me/api/portraits/women/4.jpg', name: 'Neora', isActive: true },
  { id: '5', avatar: 'https://randomuser.me/api/portraits/men/5.jpg', name: 'Maximilian', isActive: false },
];

// Temporary mock data for posts (with images)
const MOCK_POSTS = [
  {
    id: '1',
    username: 'john_doe',
    content: 'Just started my financial journey! 🚀',
    likes: 42,
    comments: 2,
    timestamp: '2h ago',
    profilePicture: 'https://randomuser.me/api/portraits/men/1.jpg',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    commentList: ['Congrats!', 'Good luck!'],
    liked: false,
  },
  {
    id: '2',
    username: 'jane_smith',
    content: 'Hit my savings goal for the month! 💰',
    likes: 28,
    comments: 1,
    timestamp: '4h ago',
    profilePicture: 'https://randomuser.me/api/portraits/women/2.jpg',
    image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308',
    commentList: ['Awesome!'],
    liked: false,
  },
  {
    id: '3',
    username: 'alexandria',
    content: 'Investing in myself every day. #growth',
    likes: 10,
    comments: 0,
    timestamp: '1d ago',
    profilePicture: 'https://randomuser.me/api/portraits/men/3.jpg',
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca',
    commentList: [],
    liked: false,
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
  container: { alignItems: 'center', marginHorizontal: 8, width: 80 },
  ring: {
    borderWidth: 2,
    borderColor: COLORS.secondary,
    borderRadius: 40,
    padding: 2,
    marginBottom: 4,
  },
  avatar: { width: 56, height: 56, borderRadius: 28 },
  name: { color: COLORS.text, fontSize: 15, maxWidth: 78, textAlign: 'center', fontWeight: '500' },
});

export default function FeedScreen() {
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [commentModal, setCommentModal] = useState({ visible: false, postId: null });
  const [commentText, setCommentText] = useState('');

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // TODO: Implement actual refresh logic
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const handleLike = (postId) => {
    setPosts((prev) => prev.map(post => {
      if (post.id === postId) {
        const liked = !post.liked;
        return {
          ...post,
          liked,
          likes: liked ? post.likes + 1 : post.likes - 1,
        };
      }
      return post;
    }));
  };

  const handleComment = (postId) => {
    setCommentModal({ visible: true, postId });
    setCommentText('');
  };

  const handleProfile = (username) => {
    // TODO: Navigate to profile
    console.log('View profile:', username);
  };

  const handleSubmitComment = () => {
    if (!commentText.trim()) return;
    setPosts((prev) => prev.map(post => {
      if (post.id === commentModal.postId) {
        return {
          ...post,
          comments: post.comments + 1,
          commentList: [...post.commentList, commentText],
        };
      }
      return post;
    }));
    setCommentModal({ visible: false, postId: null });
    setCommentText('');
  };

  const renderPost = ({ item }) => (
    <View style={styles.postCardWrapper}>
      <View style={styles.postHeader}>
        <TouchableOpacity style={styles.userInfo} onPress={() => handleProfile(item.username)}>
          <Image source={{ uri: item.profilePicture }} style={styles.avatar} />
          <View>
            <Text style={styles.username}>{item.username}</Text>
            <Text style={styles.timestamp}>{item.timestamp}</Text>
          </View>
        </TouchableOpacity>
      </View>
      {item.image && <Image source={{ uri: item.image }} style={styles.postImage} />}
      <Text style={styles.content}>{item.content}</Text>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={() => handleLike(item.id)}>
          <FontAwesome name={item.liked ? 'heart' : 'heart-o'} size={22} color={item.liked ? 'red' : COLORS.text} />
          <Text style={styles.actionText}>{item.likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => handleComment(item.id)}>
          <FontAwesome name="comment-o" size={22} color={COLORS.text} />
          <Text style={styles.actionText}>{item.comments}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

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
      {/* Comment Modal */}
      <Modal
        visible={commentModal.visible}
        animationType="slide"
        transparent
        onRequestClose={() => setCommentModal({ visible: false, postId: null })}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add a Comment</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Write a comment..."
              value={commentText}
              onChangeText={setCommentText}
              autoFocus
            />
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 }}>
              <TouchableOpacity onPress={() => setCommentModal({ visible: false, postId: null })}>
                <Text style={{ color: COLORS.textLight, marginRight: 18, fontSize: 16 }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSubmitComment}>
                <Text style={{ color: COLORS.primary, fontWeight: 'bold', fontSize: 16 }}>Post</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    padding: 8,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    fontWeight: 'bold',
    color: COLORS.text,
    fontSize: 15,
  },
  timestamp: {
    color: COLORS.textLight,
    fontSize: 12,
  },
  postImage: {
    width: '100%',
    height: 220,
    borderRadius: 14,
    marginBottom: 8,
    backgroundColor: COLORS.background,
  },
  content: {
    color: COLORS.text,
    fontSize: 15,
    marginHorizontal: 12,
    marginBottom: 8,
  },
  actions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 8,
    marginHorizontal: 8,
    marginBottom: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  actionText: {
    color: COLORS.text,
    fontSize: 15,
    marginLeft: 6,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 24,
    width: '85%',
    shadowColor: COLORS.primary,
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  modalTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    color: COLORS.text,
    marginBottom: 12,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: 10,
    fontSize: 15,
    color: COLORS.text,
    backgroundColor: COLORS.background,
  },
});
