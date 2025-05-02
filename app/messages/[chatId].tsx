import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, TextInput, FlatList, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { FONTS } from '../../constants/theme';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';

type Message = {
  id: string;
  fromMe: boolean;
  text?: string;
  image?: string;
  sticker?: string;
  video?: string;
  time: string;
};

const MOCK_USER = {
  name: 'Alice',
  avatar: 'https://randomuser.me/api/portraits/women/10.jpg',
};

const MOCK_MESSAGES: Message[] = [
  { id: '1', fromMe: false, text: 'Hey! 👋', time: '10:00 AM' },
  { id: '2', fromMe: true, text: 'Hi Alice! How are you?', time: '10:01 AM' },
  { id: '3', fromMe: false, text: 'I am good! Check this out:', time: '10:02 AM' },
  { id: '4', fromMe: false, image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb', time: '10:02 AM' },
  { id: '5', fromMe: true, text: 'Wow, nice photo!', time: '10:03 AM' },
  { id: '6', fromMe: false, sticker: '👍', time: '10:04 AM' },
];

export default function ChatScreen() {
  const { chatId, name, avatar, sharedPost } = useLocalSearchParams();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [input, setInput] = useState('');
  const flatListRef = useRef<FlatList<any>>(null);
  const { colors } = useTheme();

  const userName = name || 'User';
  const userAvatar = avatar || 'https://randomuser.me/api/portraits/lego/1.jpg';

  // Add shared post as a new message on mount if present
  useEffect(() => {
    if (sharedPost) {
      try {
        const post = JSON.parse(sharedPost as string);
        let image: string = '';
        if (typeof post.image === 'string') {
          image = post.image;
        } else if (Array.isArray(post.image) && typeof post.image[0] === 'string') {
          image = post.image[0];
        }
        setMessages(prev => [
          ...prev,
          {
            id: String(prev.length + 1),
            fromMe: true,
            image,
            text: post.content,
            time: 'Now',
          },
        ]);
        setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
      } catch {}
    }
  }, [sharedPost]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages(prev => [
      ...prev,
      { id: String(prev.length + 1), fromMe: true, text: input, time: 'Now' },
    ]);
    setInput('');
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  };

  // For demo: send a sticker
  const handleSendSticker = (sticker: string) => {
    setMessages(prev => [
      ...prev,
      { id: String(prev.length + 1), fromMe: true, sticker, time: 'Now' },
    ]);
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  };

  // For demo: send a photo
  const handleSendPhoto = () => {
    setMessages(prev => [
      ...prev,
      { id: String(prev.length + 1), fromMe: true, image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308', time: 'Now' },
    ]);
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  };

  // For demo: send a video (show as thumbnail)
  const handleSendVideo = () => {
    setMessages(prev => [
      ...prev,
      { id: String(prev.length + 1), fromMe: true, video: 'https://samplelib.com/mp4/sample-5s.mp4', time: 'Now' },
    ]);
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const imageUri = typeof item.image === 'string' && !Array.isArray(item.image) ? item.image : '';
    return (
      <View style={[styles.messageRow, item.fromMe ? styles.fromMe : styles.fromOther, { backgroundColor: item.fromMe ? colors.primary + '22' : colors.card }]}>
        {item.text && <Text style={[styles.messageText, { color: colors.text }]}>{item.text}</Text>}
        {item.sticker && <Text style={styles.sticker}>{item.sticker}</Text>}
        {imageUri.length > 0 && (
          <Image source={{ uri: imageUri }} style={styles.messageImage} />
        )}
        {item.video && (
          <View style={styles.videoThumb}>
            <FontAwesome name="video-camera" size={32} color={colors.primary} />
            <Text style={{ color: colors.textLight, fontSize: 12, marginTop: 2 }}>Video</Text>
          </View>
        )}
        <Text style={[styles.time, { color: colors.textLight }]}>{item.time}</Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView style={[styles.container, { backgroundColor: colors.background }]} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 10 }}>
          <FontAwesome name="chevron-left" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Image source={{ uri: userAvatar }} style={styles.avatar} />
        <Text style={[styles.name, { color: colors.text }]}>{userName}</Text>
      </View>
      {/* Chat history */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.chatContent}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />
      {/* Input bar */}
      <View style={[styles.inputBar, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
        <TouchableOpacity onPress={() => handleSendSticker('😊')} style={styles.inputIcon}>
          <Text style={{ fontSize: 24 }}>😊</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSendPhoto} style={styles.inputIcon}>
          <FontAwesome name="image" size={22} color={colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSendVideo} style={styles.inputIcon}>
          <MaterialIcons name="videocam" size={24} color={colors.primary} />
        </TouchableOpacity>
        <TextInput
          style={[styles.input, { color: colors.text, backgroundColor: colors.background, borderColor: colors.border }]}
          placeholder="Type a message..."
          placeholderTextColor={colors.textLight}
          value={input}
          onChangeText={setInput}
          multiline
        />
        <TouchableOpacity onPress={handleSend} style={[styles.sendButton, { backgroundColor: colors.primary }]}>
          <FontAwesome name="send" size={20} color={colors.white} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    elevation: 2,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  name: {
    fontFamily: FONTS.bold,
    fontSize: 18,
  },
  chatContent: {
    padding: 12,
    paddingBottom: 80,
  },
  messageRow: {
    maxWidth: '80%',
    marginBottom: 12,
    borderRadius: 14,
    padding: 10,
    alignSelf: 'flex-start',
  },
  fromMe: {
    alignSelf: 'flex-end',
  },
  fromOther: {
    alignSelf: 'flex-start',
  },
  messageText: {
    fontFamily: FONTS.regular,
    fontSize: 15,
  },
  sticker: {
    fontSize: 32,
    marginVertical: 4,
  },
  messageImage: {
    width: 180,
    height: 180,
    borderRadius: 12,
    marginVertical: 6,
  },
  videoThumb: {
    alignItems: 'center',
    marginVertical: 6,
  },
  time: {
    fontSize: 11,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderTopWidth: 1,
  },
  inputIcon: {
    marginHorizontal: 4,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 15,
    marginHorizontal: 6,
  },
  sendButton: {
    padding: 10,
    borderRadius: 20,
    marginLeft: 4,
  },
}); 