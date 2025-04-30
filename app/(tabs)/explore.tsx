import React from 'react';
import { View, StyleSheet, FlatList, TextInput, Image, TouchableOpacity, Text, Dimensions, ScrollView } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { FONTS } from '../../constants/theme';

const MOCK_EXPLORE_POSTS = [
  { id: '1', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb' },
  { id: '2', image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca' },
  { id: '3', image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308' },
  { id: '4', image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429' },
  { id: '5', image: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99' },
  { id: '6', image: 'https://images.unsplash.com/photo-1519985176271-adb1088fa94c' },
];

const numColumns = 3;
const size = Dimensions.get('window').width / numColumns - 16;

export default function ExploreScreen() {
  const { colors } = useTheme();
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingTop: 8,
    },
    title: {
      fontFamily: FONTS.bold,
      fontSize: 24,
      color: colors.text,
      marginLeft: 16,
      marginTop: 18,
      marginBottom: 8,
    },
    searchBar: {
      backgroundColor: colors.white,
      borderRadius: 16,
      paddingHorizontal: 16,
      paddingVertical: 10,
      marginHorizontal: 16,
      marginBottom: 12,
      fontFamily: FONTS.regular,
      fontSize: 16,
      color: colors.text,
      shadowColor: colors.primary,
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 1,
    },
    grid: {
      paddingHorizontal: 8,
    },
    imageWrapper: {
      flex: 1,
      margin: 4,
      borderRadius: 12,
      overflow: 'hidden',
      backgroundColor: colors.white,
      shadowColor: colors.primary,
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 1,
    },
    image: {
      width: size,
      height: size,
      resizeMode: 'cover',
    },
  });
  const renderExploreItem = ({ item }: { item: { id: string; image: string } }) => (
    <TouchableOpacity style={styles.imageWrapper} onPress={() => {}}>
      <Image source={{ uri: item.image }} style={styles.image} />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }}>
      <Text style={styles.title}>Explore</Text>
      <TextInput
        style={styles.searchBar}
        placeholder="Search users, posts, or hashtags"
        placeholderTextColor={colors.textLight}
      />
      <FlatList
        data={MOCK_EXPLORE_POSTS}
        renderItem={renderExploreItem}
        keyExtractor={item => item.id}
        numColumns={numColumns}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
      />
    </ScrollView>
  );
}
