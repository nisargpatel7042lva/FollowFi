import React, { useRef, useState } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, TextInput, FlatList, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { COLORS, FONTS } from '../../constants/theme';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';

const MOCK_USER = {
  name: 'Alice',
  avatar: 'https://randomuser.me/api/portraits/women/10.jpg',
};

const MOCK_MESSAGES = [
  { id: '1', fromMe: false, text: 'Hey! 👋', time: '10:00 AM' },
  { id: '2', fromMe: true, text: 'Hi Alice! How are you?', time: '10:01 AM' },
  { id: '3', fromMe: false, text: 'I am good! Check this out:', time: '10:02 AM' },
  { id: '4', fromMe: false, image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb', time: '10:02 AM' },
  { id: '5', fromMe: true, text: 'Wow, nice photo!', time: '10:03 AM' },
  { id: '6', fromMe: false, sticker: '👍', time: '10:04 AM' },
];

export default function ChatScreen() {
  const { chatId } = useLocalSearchParams();
  const router = useRouter();
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [input, setInput] = useState('');
  const flatListRef = useRef<FlatList>(null);

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

  const renderMessage = ({ item }: { item: any }) => (
    <View style={[styles.messageRow, item.fromMe ? styles.fromMe : styles.fromOther]}>
      {item.text && <Text style={styles.messageText}>{item.text}</Text>}
      {item.sticker && <Text style={styles.sticker}>{item.sticker}</Text>}
      {item.image && <Image source={{ uri: item.image }} style={styles.messageImage} />}
      {item.video && (
        <View style={styles.videoThumb}>
          <FontAwesome name="video-camera" size={32} color={COLORS.primary} />
          <Text style={{ color: COLORS.textLight, fontSize: 12, marginTop: 2 }}>Video</Text>
        </View>
      )}
      <Text style={styles.time}>{item.time}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 10 }}>
          <FontAwesome name="chevron-left" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Image source={{ uri: MOCK_USER.avatar }} style={styles.avatar} />
        <Text style={styles.name}>{MOCK_USER.name}</Text>
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
      <View style={styles.inputBar}>
        <TouchableOpacity onPress={handleSendSticker} style={styles.inputIcon}>
          <Text style={{ fontSize: 24 }}>😊</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSendPhoto} style={styles.inputIcon}>
          <FontAwesome name="image" size={22} color={COLORS.primary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSendVideo} style={styles.inputIcon}>
          <MaterialIcons name="videocam" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor={COLORS.textLight}
          value={input}
          onChangeText={setInput}
          multiline
        />
        <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
          <FontAwesome name="send" size={20} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
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
    color: COLORS.text,
  },
  chatContent: {
    padding: 12,
    paddingBottom: 80,
  },
  messageRow: {
    maxWidth: '80%',
    marginBottom: 12,
    borderRadius: 16,
    padding: 10,
    alignSelf: 'flex-start',
    backgroundColor: COLORS.white,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  fromMe: {
    alignSelf: 'flex-end',
    backgroundColor: COLORS.primary,
  },
  fromOther: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.white,
  },
  messageText: {
    fontFamily: FONTS.regular,
    fontSize: 15,
    color: COLORS.text,
  },
  sticker: {
    fontSize: 32,
    marginVertical: 4,
  },
  messageImage: {
    width: 160,
    height: 120,
    borderRadius: 10,
    marginVertical: 6,
  },
  videoThumb: {
    alignItems: 'center',
    marginVertical: 6,
  },
  time: {
    fontSize: 11,
    color: COLORS.textLight,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 10,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    backgroundColor: COLORS.background,
    borderRadius: 16,
    paddingHorizontal: 12,
    fontFamily: FONTS.regular,
    fontSize: 15,
    color: COLORS.text,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    padding: 10,
    marginLeft: 4,
  },
}); 