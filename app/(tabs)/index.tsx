import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, Text, Image, TouchableOpacity, Modal, TextInput, KeyboardAvoidingView, Platform, Animated, TouchableWithoutFeedback, Dimensions, SafeAreaView } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../../contexts/ThemeContext';
import { EventRegister } from 'react-native-event-listeners';
import { COLORS, FONTS, SIZES, SHADOWS } from '../../constants/theme';

const SCREEN_WIDTH = Dimensions.get('window').width;

// Temporary mock data for stories
const DEMO_STORY_IMAGES = [
  [
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    'https://images.unsplash.com/photo-1519125323398-675f0ddb6308',
    'https://images.unsplash.com/photo-1465101046530-73398c7f28ca',
  ],
  [
    'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429',
    'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99',
  ],
  [
    'https://images.unsplash.com/photo-1519985176271-adb1088fa94c',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
  ],
  [
    'https://images.unsplash.com/photo-1519125323398-675f0ddb6308',
    'https://images.unsplash.com/photo-1465101046530-73398c7f28ca',
    'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429',
  ],
  [
    'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99',
    'https://images.unsplash.com/photo-1519985176271-adb1088fa94c',
  ],
];

const MOCK_STORIES = [
  { id: '1', avatar: 'https://randomuser.me/api/portraits/men/1.jpg', name: 'You', isActive: true, images: DEMO_STORY_IMAGES[0] },
  { id: '2', avatar: 'https://randomuser.me/api/portraits/women/2.jpg', name: 'Mark', isActive: false, images: DEMO_STORY_IMAGES[1] },
  { id: '3', avatar: 'https://randomuser.me/api/portraits/men/3.jpg', name: 'Alexandria', isActive: false, images: DEMO_STORY_IMAGES[2] },
  { id: '4', avatar: 'https://randomuser.me/api/portraits/women/4.jpg', name: 'Neora', isActive: true, images: DEMO_STORY_IMAGES[3] },
  { id: '5', avatar: 'https://randomuser.me/api/portraits/men/5.jpg', name: 'Maximilian', isActive: false, images: DEMO_STORY_IMAGES[4] },
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
  // Additional posts for better scrolling/testing
  {
    id: '4',
    username: 'neora',
    content: 'Learning about DeFi and loving it! 🌐',
    likes: 19,
    comments: 3,
    timestamp: '3h ago',
    profilePicture: 'https://randomuser.me/api/portraits/women/4.jpg',
    image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429',
    commentList: ['So cool!', 'Teach me!', 'Nice!'],
    liked: false,
  },
  {
    id: '5',
    username: 'maximilian',
    content: 'Crypto is the future. HODL! 🚀',
    likes: 33,
    comments: 2,
    timestamp: '5h ago',
    profilePicture: 'https://randomuser.me/api/portraits/men/5.jpg',
    image: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99',
    commentList: ['Absolutely!', 'To the moon!'],
    liked: false,
  },
  {
    id: '6',
    username: 'alice',
    content: 'Just bought my first NFT! 🎨',
    likes: 21,
    comments: 1,
    timestamp: '6h ago',
    profilePicture: 'https://randomuser.me/api/portraits/women/10.jpg',
    image: 'https://images.unsplash.com/photo-1519985176271-adb1088fa94c',
    commentList: ['Congrats!'],
    liked: false,
  },
  {
    id: '7',
    username: 'bob',
    content: 'Passive income is the best income. 💸',
    likes: 17,
    comments: 0,
    timestamp: '7h ago',
    profilePicture: 'https://randomuser.me/api/portraits/men/11.jpg',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    commentList: [],
    liked: false,
  },
  {
    id: '8',
    username: 'carla',
    content: 'Exploring new blockchain projects!',
    likes: 25,
    comments: 2,
    timestamp: '8h ago',
    profilePicture: 'https://randomuser.me/api/portraits/women/12.jpg',
    image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308',
    commentList: ['Which ones?', 'Share more!'],
    liked: false,
  },
  {
    id: '9',
    username: 'daniel',
    content: 'Automating my savings with smart contracts.',
    likes: 14,
    comments: 1,
    timestamp: '9h ago',
    profilePicture: 'https://randomuser.me/api/portraits/men/13.jpg',
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca',
    commentList: ['Techy!'],
    liked: false,
  },
  {
    id: '10',
    username: 'emma',
    content: 'Financial freedom is the goal! 🌟',
    likes: 29,
    comments: 4,
    timestamp: '10h ago',
    profilePicture: 'https://randomuser.me/api/portraits/women/14.jpg',
    image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429',
    commentList: ['Inspiring!', 'Go girl!', 'You got this!', 'Rooting for you!'],
    liked: false,
  },
];

type Story = { id: string; avatar: string; name: string; isActive: boolean; images: string[] };
type Post = typeof MOCK_POSTS[number];

const MOCK_NOTIFICATIONS = [
  { id: '1', type: 'like', text: 'Mark liked your post', time: '2m ago' },
  { id: '2', type: 'story', text: 'Neora viewed your story', time: '10m ago' },
  { id: '3', type: 'comment', text: 'Alexandria commented on your story', time: '1h ago' },
];

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

const FeedScreen = () => {
  const { user } = useAuth();
  const { colors } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [commentModal, setCommentModal] = useState<{ visible: boolean; postId: string | null }>({ visible: false, postId: null });
  const [commentText, setCommentText] = useState('');
  const [storyModal, setStoryModal] = useState<{ visible: boolean; story: Story | null; index: number }>({ visible: false, story: null, index: 0 });
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [notificationsVisible, setNotificationsVisible] = useState(false);
  const router = useRouter();

  // Heart animation state: { [postId]: { visible: bool, scale: Animated.Value } }
  const heartAnimations = useRef<{ [key: string]: { visible: boolean; scale: Animated.Value } }>({}).current;

  const ensureHeartAnimation = (postId: string) => {
    if (!heartAnimations[postId]) {
      heartAnimations[postId] = {
        visible: false,
        scale: new Animated.Value(0),
      };
    }
    return heartAnimations[postId];
  };

  const lastTapRef = useRef<{ [key: string]: number }>({});
  const handleDoubleTap = (postId: string) => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    if (lastTapRef.current[postId] && now - lastTapRef.current[postId] < DOUBLE_TAP_DELAY) {
      triggerHeartAnimation(postId);
      handleLike(postId);
    }
    lastTapRef.current[postId] = now;
  };

  const triggerHeartAnimation = (postId: string) => {
    const anim = ensureHeartAnimation(postId);
    anim.visible = true;
    anim.scale.setValue(0.3);
    Animated.spring(anim.scale, {
      toValue: 1.2,
      friction: 3,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        Animated.timing(anim.scale, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start(() => {
          anim.visible = false;
        });
      }, 600);
    });
  };

  const handleStoryPress = (story: Story) => {
    setStoryModal({ visible: true, story, index: 0 });
  };

  // Shuffle array helper
  function shuffleArray<T>(array: T[]): T[] {
    return array
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  }

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setPosts(prev => shuffleArray(prev));
      setRefreshing(false);
    }, 1200);
  }, []);

  const handleLike = (postId: string) => {
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

  const handleComment = (postId: string) => {
    setCommentModal({ visible: true, postId });
    setCommentText('');
  };

  const handleProfile = (username: string) => {
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

  const handleNextStoryImage = () => {
    if (!storyModal.story) return;
    if (storyModal.index < storyModal.story.images.length - 1) {
      setStoryModal((prev) => ({ ...prev, index: prev.index + 1 }));
    } else {
      setStoryModal({ visible: false, story: null, index: 0 });
    }
  };

  const handlePrevStoryImage = () => {
    if (!storyModal.story) return;
    if (storyModal.index > 0) {
      setStoryModal((prev) => ({ ...prev, index: prev.index - 1 }));
    }
  };

  const renderPost = ({ item }: { item: Post }) => {
    const anim = ensureHeartAnimation(item.id);
    return (
      <View style={[styles.postCardWrapper, { backgroundColor: colors.card, shadowColor: colors.primary }]}> 
        <View style={styles.postHeader}>
          <TouchableOpacity style={styles.userInfo} onPress={() => handleProfile(item.username)}>
            <Image source={{ uri: item.profilePicture }} style={styles.avatar} />
            <View>
              <Text style={[styles.username, { color: colors.text }]}>{item.username}</Text>
              <Text style={[styles.timestamp, { color: colors.textLight }]}>{item.timestamp}</Text>
            </View>
          </TouchableOpacity>
        </View>
        {item.image && (
          <TouchableWithoutFeedback onPress={() => handleDoubleTap(item.id)}>
            <View>
              <Image source={{ uri: item.image }} style={[styles.postImage, { backgroundColor: colors.background }]} />
              {anim.visible && (
                <Animated.View
                  style={[
                    styles.heartOverlay,
                    { transform: [{ scale: anim.scale }] },
                  ]}
                  pointerEvents="none"
                >
                  <FontAwesome name="heart" size={90} color="rgba(255,0,80,0.85)" />
                </Animated.View>
              )}
            </View>
          </TouchableWithoutFeedback>
        )}
        <Text style={[styles.content, { color: colors.text }]}>{item.content}</Text>
        <View style={[styles.actions, { borderTopColor: colors.border }]}> 
          <TouchableOpacity style={styles.actionButton} onPress={() => handleLike(item.id)}>
            <FontAwesome name={item.liked ? 'heart' : 'heart-o'} size={22} color={item.liked ? colors.primary : colors.text} />
            <Text style={[styles.actionText, { color: colors.text }]}>{item.likes}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => handleComment(item.id)}>
            <FontAwesome name="comment-o" size={22} color={colors.text} />
            <Text style={[styles.actionText, { color: colors.text }]}>{item.comments}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => { setSelectedPost(item); setShareModalVisible(true); }}>
            <FontAwesome name="share" size={22} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderStoryBubble = ({ item }: { item: Story }) => (
    <TouchableOpacity onPress={() => handleStoryPress(item)} activeOpacity={0.7}>
      <View style={styles.storyBubbleContainer}>
        <View style={[styles.storyBubbleRing, item.isActive && { borderColor: colors.primary }]}> 
          <Image source={{ uri: item.avatar }} style={styles.storyBubbleAvatar} />
        </View>
        <Text style={styles.storyBubbleName} numberOfLines={2} ellipsizeMode="tail">{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  // Share Modal: List friends to share with (dummy data for now)
  const handleShareToFriend = (friend: { id: string; name: string; avatar: string }) => {
    setShareModalVisible(false);
    if (selectedPost) {
      router.push({
        pathname: '/messages/[chatId]',
        params: {
          chatId: friend.id,
          name: friend.name,
          avatar: friend.avatar,
          sharedPost: JSON.stringify({ image: selectedPost.image, content: selectedPost.content })
        }
      });
    }
  };

  // Listen for new posts
  useEffect(() => {
    const listener = EventRegister.addEventListener('newPost', (newPost: any) => {
      setPosts(prev => [newPost, ...prev]);
    });
    return () => {
      EventRegister.removeEventListener(String(listener));
    };
  }, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header row with app icon and messaging icon */}
      <View style={[styles.headerRow, { borderBottomColor: colors.border }]}> 
        <Image source={require('../../assets/images/icon.png')} style={styles.appIcon} />
        <View style={{ flex: 1 }} />
        <TouchableOpacity onPress={() => router.push('/messages/ParticipantsList')} style={styles.messageIconButton}>
          <FontAwesome name="envelope" size={26} color={colors.primary} />
        </TouchableOpacity>
      </View>
      {/* Feed with Stories as ListHeaderComponent */}
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.stories}>
            <FlatList
              data={MOCK_STORIES}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={item => item.id}
              renderItem={renderStoryBubble}
              style={styles.stories}
              contentContainerStyle={{ paddingLeft: 12, paddingVertical: 12 }}
            />
          </View>
        }
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
                <Text style={{ color: colors.textLight, marginRight: 18, fontSize: 16 }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSubmitComment}>
                <Text style={{ color: colors.primary, fontWeight: 'bold', fontSize: 16 }}>Post</Text>
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
        onRequestClose={() => setStoryModal({ visible: false, story: null, index: 0 })}
      >
        <View style={styles.storyModalOverlay}>
          {storyModal.story && (
            <TouchableWithoutFeedback onPress={handleNextStoryImage}>
              <View style={styles.storyModalContent}>
                {/* Progress bar */}
                <View style={styles.storyProgressBarContainer}>
                  {storyModal.story.images.map((img, idx) => (
                    <View
                      key={idx}
                      style={[
                        styles.storyProgressBar,
                        idx <= storyModal.index
                          ? styles.storyProgressBarActive
                          : styles.storyProgressBarInactive,
                      ]}
                    />
                  ))}
                </View>
                {/* Story image */}
                <Image
                  source={{ uri: storyModal.story.images[storyModal.index] }}
                  style={styles.storyModalImage}
                  resizeMode="cover"
                />
                {/* Avatar and name */}
                <View style={styles.storyModalHeader}>
                  <Image source={{ uri: storyModal.story.avatar }} style={styles.storyModalAvatarSmall} />
                  <TouchableOpacity
                    onPress={() => {
                      setStoryModal({ visible: false, story: null, index: 0 });
                      if (storyModal.story) {
                        router.push({ pathname: '/user/[userId]', params: { userId: storyModal.story.id } });
                      }
                    }}
                  >
                    <Text style={styles.storyModalName}>{storyModal.story.name}</Text>
                  </TouchableOpacity>
                </View>
                {/* Close button */}
                <TouchableOpacity
                  style={styles.storyModalClose}
                  onPress={() => setStoryModal({ visible: false, story: null, index: 0 })}
                >
                  <Text style={{ color: colors.primary, fontWeight: 'bold', fontSize: 18 }}>Close</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          )}
        </View>
      </Modal>
      {/* Share Modal */}
      <Modal
        visible={shareModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setShareModalVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: colors.card, borderRadius: 16, padding: 24, width: 320 }}>
            <Text style={{ color: colors.text, fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>Share Post With</Text>
            <FlatList
              data={PARTICIPANTS}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10 }} onPress={() => handleShareToFriend(item)}>
                  <Image source={{ uri: item.avatar }} style={{ width: 36, height: 36, borderRadius: 18, marginRight: 12 }} />
                  <Text style={{ color: colors.text, fontSize: 16 }}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity onPress={() => setShareModalVisible(false)} style={{ marginTop: 18, alignSelf: 'flex-end' }}>
              <Text style={{ color: colors.primary, fontSize: 16 }}>Cancel</Text>
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
                  color={colors.primary}
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  appIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    marginRight: 8,
  },
  messageIconButton: {
    padding: 6,
    marginLeft: 8,
  },
  stories: {
    backgroundColor: 'transparent',
  },
  listContent: {
    padding: 8,
    paddingBottom: 32,
  },
  postCardWrapper: {
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
    fontSize: 15,
  },
  timestamp: {
    fontSize: 12,
  },
  postImage: {
    width: '100%',
    height: 220,
    borderRadius: 14,
    marginBottom: 8,
  },
  content: {
    fontSize: 15,
    marginHorizontal: 12,
    marginBottom: 8,
  },
  actions: {
    flexDirection: 'row',
    borderTopWidth: 1,
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
    fontSize: 15,
    marginLeft: 6,
  },
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
  heartOverlay: {
    position: 'absolute',
    top: '35%',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  storyModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  storyModalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 16,
    alignItems: 'center',
    width: 340,
    maxWidth: '95%',
  },
  storyModalImage: {
    width: 320,
    height: 520,
    borderRadius: 18,
    marginBottom: 18,
    backgroundColor: '#eee',
    maxWidth: '100%',
  },
  storyModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  storyModalAvatarSmall: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  storyProgressBarContainer: {
    flexDirection: 'row',
    width: 320,
    marginBottom: 8,
    marginTop: 4,
    maxWidth: '100%',
  },
  storyProgressBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    marginHorizontal: 2,
    backgroundColor: '#ccc',
  },
  storyProgressBarActive: {
    backgroundColor: COLORS.primary,
  },
  storyProgressBarInactive: {
    backgroundColor: '#eee',
  },
  storyModalName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 18,
  },
  storyModalClose: {
    marginTop: 10,
    padding: 8,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  messageAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  messageName: {
    fontWeight: 'bold',
    color: COLORS.text,
    fontSize: 15,
  },
  messageText: {
    color: COLORS.textLight,
    fontSize: 12,
  },
  messageTime: {
    color: COLORS.textLight,
    fontSize: 12,
  },
  // StoryBubble styles
  storyBubbleContainer: { alignItems: 'center', marginHorizontal: 8, width: 80 },
  storyBubbleRing: {
    borderWidth: 2,
    borderColor: COLORS.secondary,
    borderRadius: 40,
    padding: 2,
    marginBottom: 4,
  },
  storyBubbleAvatar: { width: 56, height: 56, borderRadius: 28 },
  storyBubbleName: { color: COLORS.text, fontSize: 15, maxWidth: 78, textAlign: 'center', fontWeight: '500' },
  // Notifications styles
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
    marginBottom: 12,
  },
  notificationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  notificationText: {
    color: COLORS.text,
    fontSize: 15,
    flex: 1,
  },
  notificationTime: {
    color: COLORS.textLight,
    fontSize: 12,
    marginLeft: 8,
  },
  closeNotificationsButton: {
    marginTop: 18,
    alignSelf: 'flex-end',
  },
  closeStoryText: {
    color: COLORS.primary,
    fontSize: 16,
  },
});

export default FeedScreen;

