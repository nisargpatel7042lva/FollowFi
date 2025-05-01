
import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, Text, Image, TouchableOpacity, Modal, TextInput, KeyboardAvoidingView, Platform, Animated, TouchableWithoutFeedback } from 'react-native';

import React, { useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, Text, Image, TouchableOpacity, Modal, TextInput, KeyboardAvoidingView, Platform, Dimensions, SafeAreaView } from 'react-native';
import { COLORS, FONTS, SIZES, SHADOWS } from '../../constants/theme';

import { useAuth } from '../../contexts/AuthContext';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../../contexts/ThemeContext';
import { MOCK_MESSAGES } from './search'; // Import friends list
import { EventRegister } from 'react-native-event-listeners';

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


// Add types for stories and posts
type Story = { id: string; avatar: string; name: string; isActive: boolean; images: string[] };
type Post = typeof MOCK_POSTS[number];

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
  const { colors } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [commentModal, setCommentModal] = useState({ visible: false, postId: null });
  const [commentText, setCommentText] = useState('');

  // Story modal state
  const [storyModal, setStoryModal] = useState<{ visible: boolean; story: Story | null; index: number }>({ visible: false, story: null, index: 0 });
  const router = useRouter();

  // Heart animation state: { [postId]: { visible: bool, scale: Animated.Value } }
  const heartAnimations = useRef<{ [key: string]: { visible: boolean; scale: Animated.Value } }>({}).current;

  // Helper to initialize animation state for a post
  const ensureHeartAnimation = (postId: string) => {
    if (!heartAnimations[postId]) {
      heartAnimations[postId] = {
        visible: false,
        scale: new Animated.Value(0),
      };
    }
    return heartAnimations[postId];
  };

  // Double-tap logic
  const lastTapRef = useRef<{ [key: string]: number }>({});
  const handleDoubleTap = (postId: string) => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    if (lastTapRef.current[postId] && now - lastTapRef.current[postId] < DOUBLE_TAP_DELAY) {
      // Double tap detected
      triggerHeartAnimation(postId);
      handleLike(postId);
    }
    lastTapRef.current[postId] = now;
  };

  // Heart animation trigger
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

  // --- Story Modal handler ---
  const handleStoryPress = (story: Story) => {
    setStoryModal({ visible: true, story, index: 0 });
  };

  const [storyModal, setStoryModal] = useState({ visible: false, story: null });
  const [notificationsVisible, setNotificationsVisible] = useState(false);


  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // TODO: Implement actual refresh logic
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
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


  // Add these handlers inside FeedScreen:
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

  // --- Render Post with double-tap and heart animation ---
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const renderPost = ({ item }: { item: Post }) => {
    const anim = ensureHeartAnimation(item.id);

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

          <TouchableWithoutFeedback onPress={() => handleDoubleTap(item.id)}>
            <View>
              <Image source={{ uri: item.image }} style={styles.postImage} />
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

          <TouchableOpacity activeOpacity={0.8} onPress={handleImageTap}>
            <Image source={{ uri: item.image }} style={styles.postImage} />
          </TouchableOpacity>

        )}
        <Text style={styles.content}>{item.content}</Text>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton} onPress={() => handleLike(item.id)}>

            <FontAwesome name={item.liked ? 'heart' : 'heart-o'} size={22} color={item.liked ? colors.primary : colors.text} />
            <Text style={styles.actionText}>{item.likes}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => handleComment(item.id)}>
            <FontAwesome name="comment-o" size={22} color={colors.text} />
            <Text style={styles.actionText}>{item.comments}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => { setSelectedPost(item); setShareModalVisible(true); }}>
            <FontAwesome name="share" size={22} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // --- Render StoryBubble with onPress ---
  const renderStoryBubble = ({ item }: { item: Story }) => (
    <TouchableOpacity onPress={() => handleStoryPress(item)} activeOpacity={0.7}>
      <StoryBubble {...item} />
    </TouchableOpacity>
  );

  const renderMessageItem = ({ item }) => (
    <TouchableOpacity
      style={styles.messageRow}
      onPress={() => router.push({ pathname: `./messages/${item.id}`, params: { name: item.name, avatar: item.avatar } })}
    >
      <Image source={{ uri: item.avatar }} style={styles.messageAvatar} />
      <View style={{ flex: 1 }}>
        <Text style={styles.messageName}>{item.name}</Text>
        <Text style={styles.messageText} numberOfLines={1}>{item.lastMessage}</Text>
      </View>
      <Text style={styles.messageTime}>{item.time}</Text>
    </TouchableOpacity>
  );

  // Move SHADOWS import here
  const { SHADOWS } = require('../../constants/theme');

  // Move styles and storyStyles inside FeedScreen for access to colors and SHADOWS
  const storyStyles = StyleSheet.create({
    container: { alignItems: 'center', marginHorizontal: 8, width: 80 },
    ring: {
      borderWidth: 2,
      borderColor: colors.secondary,
      borderRadius: 40,
      padding: 2,
      marginBottom: 4,
    },
    avatar: { width: 56, height: 56, borderRadius: 28 },
    name: { color: colors.text, fontSize: 15, maxWidth: 78, textAlign: 'center', fontWeight: '500' },
  });

  // Move StoryBubble here so it has access to storyStyles/colors
  const StoryBubble = ({ avatar, name, isActive }: { avatar: string; name: string; isActive: boolean }) => (
    <View style={storyStyles.container}>
      <View style={[storyStyles.ring, isActive && { borderColor: colors.primary }]}> 
        <Image source={{ uri: avatar }} style={storyStyles.avatar} />
      </View>
      <Text style={storyStyles.name} numberOfLines={2} ellipsizeMode="tail">{name}</Text>
    </View>
  );

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


  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background, // light purple
    },
    stories: {
      backgroundColor: 'transparent',
    },
    listContent: {
      padding: 8,
      paddingBottom: 32,
    },
    postCardWrapper: {
      backgroundColor: colors.white,
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
      color: colors.text,
      fontSize: 15,
    },
    timestamp: {
      color: colors.textLight,
      fontSize: 12,
    },
    postImage: {
      width: '100%',
      height: 220,
      borderRadius: 14,
      marginBottom: 8,
      backgroundColor: colors.background,
    },
    content: {
      color: colors.text,
      fontSize: 15,
      marginHorizontal: 12,
      marginBottom: 8,
    },
    actions: {
      flexDirection: 'row',
      borderTopWidth: 1,
      borderTopColor: colors.border,
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
      color: colors.text,
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
      backgroundColor: colors.white,
      borderRadius: 16,
      padding: 24,
      width: '85%',
      shadowColor: colors.primary,
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    modalTitle: {
      fontWeight: 'bold',
      fontSize: 18,
      color: colors.text,
      marginBottom: 12,
    },
    modalInput: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 10,
      padding: 10,
      fontSize: 15,
      color: colors.text,
      backgroundColor: colors.background,
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
      backgroundColor: colors.white,
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
      backgroundColor: colors.primary,
    },
    storyProgressBarInactive: {
      backgroundColor: '#eee',
    },
    storyModalName: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
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
      color: colors.text,
      fontSize: 15,
    },
    messageText: {
      color: colors.textLight,
      fontSize: 12,
    },
    messageTime: {
      color: colors.textLight,
      fontSize: 12,
    },
  });

  // Share Modal: List friends to share with
  const handleShareToFriend = (friend: { id: string; name: string; avatar: string }) => {
    setShareModalVisible(false);
    if (selectedPost) {
      router.push({
        pathname: `/messages/${friend.id}`,
        params: {
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
      EventRegister.removeEventListener(listener);
    };
  }, []);

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

        renderItem={renderStoryBubble}

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
              data={MOCK_MESSAGES}
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

    </View>
  );
}

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

