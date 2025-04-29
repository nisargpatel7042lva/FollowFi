import React, { useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, Text, Image, TouchableOpacity, Modal, TextInput, KeyboardAvoidingView, Platform, Dimensions, SafeAreaView } from 'react-native';
import { COLORS, FONTS, SIZES, SHADOWS } from '../../constants/theme';
import { useAuth } from '../../contexts/AuthContext';
import { FontAwesome } from '@expo/vector-icons';

const SCREEN_WIDTH = Dimensions.get('window').width;

// Temporary mock data for stories
const MOCK_STORIES = [
  { id: '1', avatar: 'https://randomuser.me/api/portraits/men/1.jpg', name: 'You', isActive: true, image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb', views: 12, comments: 2 },
  { id: '2', avatar: 'https://randomuser.me/api/portraits/women/2.jpg', name: 'Mark', isActive: false, image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca', views: 8, comments: 1 },
  { id: '3', avatar: 'https://randomuser.me/api/portraits/men/3.jpg', name: 'Alexandria', isActive: false, image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308', views: 5, comments: 0 },
  { id: '4', avatar: 'https://randomuser.me/api/portraits/women/4.jpg', name: 'Neora', isActive: true, image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429', views: 15, comments: 3 },
  { id: '5', avatar: 'https://randomuser.me/api/portraits/men/5.jpg', name: 'Maximilian', isActive: false, image: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99', views: 2, comments: 0 },
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

const MOCK_NOTIFICATIONS = [
  { id: '1', type: 'like', text: 'Mark liked your post', time: '2m ago' },
  { id: '2', type: 'story', text: 'Neora viewed your story', time: '10m ago' },
  { id: '3', type: 'comment', text: 'Alexandria commented on your story', time: '1h ago' },
];

// Inline StoryBubble component
const StoryBubble = ({ avatar, name, isActive, onPress }) => (
  <TouchableOpacity style={storyStyles.container} onPress={onPress}>
    <View style={[storyStyles.ring, isActive && { borderColor: COLORS.primary }]}> 
      <Image source={{ uri: avatar }} style={storyStyles.avatar} />
    </View>
    <Text style={storyStyles.name} numberOfLines={2} ellipsizeMode="tail">{name}</Text>
  </TouchableOpacity>
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
  const [storyModal, setStoryModal] = useState({ visible: false, story: null });
  const [notificationsVisible, setNotificationsVisible] = useState(false);

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

  const handleDoubleTapLike = (postId) => {
    setPosts((prev) => prev.map(post => {
      if (post.id === postId && !post.liked) {
        return {
          ...post,
          liked: true,
          likes: post.likes + 1,
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

  const handleStoryPress = (story) => {
    setStoryModal({ visible: true, story });
  };

  const renderPost = ({ item }) => {
    // Double-tap logic
    let lastTap = null;
    let tapTimeout = null;
    const handleImageTap = () => {
      const now = Date.now();
      if (lastTap && now - lastTap < 300) {
        handleDoubleTapLike(item.id);
        lastTap = null;
        clearTimeout(tapTimeout);
      } else {
        lastTap = now;
        tapTimeout = setTimeout(() => {
          lastTap = null;
        }, 350);
      }
    };
    return (
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
        {item.image && (
          <TouchableOpacity activeOpacity={0.8} onPress={handleImageTap}>
            <Image source={{ uri: item.image }} style={styles.postImage} />
          </TouchableOpacity>
        )}
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
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with notification bell */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => setNotificationsVisible(true)} style={styles.bellButton}>
          {/* <FontAwesome name="bell" size={26} color={COLORS.primary} /> */}
        </TouchableOpacity>
        <View style={{ flex: 1 }} />
      </View>
      {/* Story Bubbles */}
      <FlatList
        data={MOCK_STORIES}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <StoryBubble {...item} onPress={() => handleStoryPress(item)} />}
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
      {/* Story Modal */}
      <Modal
        visible={storyModal.visible}
        animationType="fade"
        transparent
        onRequestClose={() => setStoryModal({ visible: false, story: null })}
      >
        <View style={styles.storyModalOverlay}>
          <View style={styles.storyModalContent}>
            <Image source={{ uri: storyModal.story?.image }} style={styles.storyImage} />
            <Text style={styles.storyName}>{storyModal.story?.name}</Text>
            <View style={styles.storyStatsRow}>
              <FontAwesome name="eye" size={18} color={COLORS.primary} />
              <Text style={styles.storyStat}>{storyModal.story?.views} views</Text>
              <FontAwesome name="comment-o" size={18} color={COLORS.primary} style={{ marginLeft: 18 }} />
              <Text style={styles.storyStat}>{storyModal.story?.comments} comments</Text>
            </View>
            <TouchableOpacity style={styles.closeStoryButton} onPress={() => setStoryModal({ visible: false, story: null })}>
              <Text style={styles.closeStoryText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* Notifications Modal */}
      <Modal
        visible={notificationsVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setNotificationsVisible(false)}
      >
        <View style={styles.notificationsOverlay}>
          <View style={styles.notificationsContent}>
            <Text style={styles.notificationsTitle}>Notifications</Text>
            {MOCK_NOTIFICATIONS.map(n => (
              <View key={n.id} style={styles.notificationRow}>
                <FontAwesome
                  name={n.type === 'like' ? 'heart' : n.type === 'story' ? 'eye' : 'comment-o'}
                  size={18}
                  color={COLORS.primary}
                  style={{ marginRight: 10 }}
                />
                <Text style={styles.notificationText}>{n.text}</Text>
                <Text style={styles.notificationTime}>{n.time}</Text>
              </View>
            ))}
            <TouchableOpacity style={styles.closeNotificationsButton} onPress={() => setNotificationsVisible(false)}>
              <Text style={styles.closeStoryText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background, // light purple
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 0,
  },
  bellButton: {
    padding: 8,
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
  // Story modal styles
  storyModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  storyModalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 18,
    alignItems: 'center',
    width: SCREEN_WIDTH * 0.85,
  },
  storyImage: {
    width: '100%',
    height: 320,
    borderRadius: 14,
    marginBottom: 16,
    backgroundColor: COLORS.background,
  },
  storyName: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    color: COLORS.text,
    marginBottom: 8,
  },
  storyStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  storyStat: {
    fontFamily: FONTS.medium,
    fontSize: 15,
    color: COLORS.text,
    marginLeft: 6,
  },
  closeStoryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 24,
    marginTop: 8,
  },
  closeStoryText: {
    color: COLORS.white,
    fontFamily: FONTS.bold,
    fontSize: 16,
  },
  // Notifications modal styles
  notificationsOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationsContent: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 24,
    width: '85%',
    shadowColor: COLORS.primary,
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  notificationsTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    color: COLORS.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  notificationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  notificationText: {
    fontFamily: FONTS.regular,
    fontSize: 15,
    color: COLORS.text,
    flex: 1,
  },
  notificationTime: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: COLORS.textLight,
    marginLeft: 8,
  },
  closeNotificationsButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 24,
    marginTop: 8,
    alignSelf: 'center',
  },
});
