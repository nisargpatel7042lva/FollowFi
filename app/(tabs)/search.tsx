import React from 'react';
import { View, StyleSheet, FlatList, TextInput, Image, TouchableOpacity, Text, Dimensions } from 'react-native';
import { COLORS, FONTS } from '../../constants/theme';

const MOCK_EXPLORE_POSTS = [
  { id: '1', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb' },
  { id: '2', image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca' },
  { id: '3', image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308' },
  { id: '4', image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429' },
  { id: '5', image: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99' },
  { id: '6', image: 'https://images.unsplash.com/photo-1519985176271-adb1088fa94c' },
  { id: '7', image: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2' },
  { id: '8', image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca' },
  { id: '9', image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308' },
];

const numColumns = 3;
const size = Dimensions.get('window').width / numColumns - 16;

export default function SearchScreen() {
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.imageWrapper} onPress={() => {}}>
      <Image source={{ uri: item.image }} style={styles.image} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search"
        placeholderTextColor={COLORS.textLight}
      />
      <FlatList
        data={MOCK_EXPLORE_POSTS}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={numColumns}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 8,
  },
  searchBar: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginHorizontal: 16,
    marginBottom: 12,
    fontFamily: FONTS.regular,
    fontSize: 16,
    color: COLORS.text,
    shadowColor: COLORS.primary,
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
    backgroundColor: COLORS.white,
    shadowColor: COLORS.primary,
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