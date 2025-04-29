import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../../constants/theme';

export default function CreatePostScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Create Post Screen (Coming Soon)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  text: {
    fontFamily: FONTS.medium,
    fontSize: 16,
    color: COLORS.text,
  },
}); 