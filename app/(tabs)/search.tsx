import React from 'react';
import { View, StyleSheet, FlatList, Image, TouchableOpacity, Text, ScrollView } from 'react-native';
import { FONTS } from '../../constants/theme';
import { useRouter } from 'expo-router';
import { useTheme } from '../../contexts/ThemeContext';

export const MOCK_MESSAGES = [
  {
    id: '1',
    name: 'Alice',
    avatar: 'https://randomuser.me/api/portraits/women/10.jpg',
    lastMessage: 'See you soon! 😊',
    time: '2m ago',
  },
  {
    id: '2',
    name: 'Bob',
    avatar: 'https://randomuser.me/api/portraits/men/11.jpg',
    lastMessage: "Let's catch up tomorrow.",
    time: '10m ago',
  },
  {
    id: '3',
    name: 'Charlie',
    avatar: 'https://randomuser.me/api/portraits/men/12.jpg',
    lastMessage: 'Sent the docs.',
    time: '1h ago',
  },
];

export default function MessagesScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingTop: 8,
    },
    sectionTitle: {
      fontFamily: FONTS.bold,
      fontSize: 22,
      color: colors.text,
      marginLeft: 16,
      marginTop: 18,
      marginBottom: 8,
    },
    messagesList: {
      paddingHorizontal: 0,
    },
    messageRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: colors.white,
      borderRadius: 12,
      marginHorizontal: 8,
      marginBottom: 10,
      shadowColor: colors.primary,
      shadowOpacity: 0.06,
      shadowRadius: 2,
      elevation: 1,
    },
    messageAvatar: {
      width: 44,
      height: 44,
      borderRadius: 22,
      marginRight: 12,
    },
    messageName: {
      fontFamily: FONTS.medium,
      fontSize: 16,
      color: colors.text,
    },
    messageText: {
      fontFamily: FONTS.regular,
      fontSize: 14,
      color: colors.textLight,
      marginTop: 2,
    },
    messageTime: {
      fontFamily: FONTS.regular,
      fontSize: 13,
      color: colors.textLight,
      marginLeft: 8,
    },
  });

  const renderMessageItem = ({ item }: { item: { id: string; name: string; avatar: string; lastMessage: string; time: string } }) => (
    <TouchableOpacity
      style={styles.messageRow}
      onPress={() => router.push({
        pathname: '/messages/[chatId]',
        params: { chatId: item.id, name: item.name, avatar: item.avatar }
      })}
    >
      <Image source={{ uri: item.avatar }} style={styles.messageAvatar} />
      <View style={{ flex: 1 }}>
        <Text style={styles.messageName}>{item.name}</Text>
        <Text style={styles.messageText} numberOfLines={1}>{item.lastMessage}</Text>
      </View>
      <Text style={styles.messageTime}>{item.time}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }}>
      <Text style={styles.sectionTitle}>Messages</Text>
      <FlatList
        data={MOCK_MESSAGES}
        renderItem={renderMessageItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
      />
    </ScrollView>
  );
} 