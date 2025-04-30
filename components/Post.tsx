import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, SHADOWS } from '../constants/theme';

// Base64 encoded default avatar (a simple placeholder image)
const DEFAULT_AVATAR = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFXUlEQVR4nO2ZeUxTZxjGn7YMZhQRHDgQp4IiinPOOT0tLZS2955721sgUGQVUEBFq4gD5wQVFTfOiRNw4MSBoksw0ejUxIlGnDgnTkQRdKBRYVzimOL4g7/k/JE2aXt7C/deE03f5Pc3Oe/zPt/7nO+79xYAY4wxxhhjjPF/QyaTvQcgAcBOAN0A/gLwN4AHAHoBXAKwH8ACAOMAyEaKtgAIAOAKYBKAWQDWATgI4ByAZwD+kYBHAE4D2AZgNgAvAA4j1XQEgHAA6wGcAPAYwL8S8AzARQD7ACwF4D2SzYcDWArgBIB+AK8k4CWAX5XP2QbAayQFYAFYBuA0gL8AvJGAlwCuKONvNYBxIyGAA4D5ADoB3APwrwQ8B3AZQBeAJQBcPqYALgA2AbgN4I0EPAfQA2ArgDAA9h9DgAuATQD6ALyWgL8BXFP+LdIAOFpTAAcACQBOKp+oFLwA8COADQACrSXAEcBKAD8AeCIBzwBcV/4tEgE4WUOAOYAYACeUX0kKngA4BWA5AHdrCLADEA/gvPKmUvAYwI8A1gDwsYYAWwAxytNlIAGPAJwBkArAzRoCrAHMB3BGxQ38DOA7AOEArKwhwBJAFIBjAB5KwEMApwGsAuBhDQEWyh/kKIAHEvAAwEkAywC4WkOAOYBoAEcA3JeA+8r7RAIAe2sIsAAwF8ARAH9KwD0AxwEsBOBkDQFmyh/kMIB7EnAXwDEACQDsrCHADMAcAN8DuCMBdwAcBTAfgK01BJgCmA3gEIDbEnAbwBEAcwHYWEOADYA5AA4CuCUBtwB8B2A2AGtrCLAGMAvAAQA3JeAmgMMAogBYWUOAFYBIAPsB3JCAGwAOAYgEYGkNAZYAIgDsA3BdAq4DOAggAoCFNQRYAAgHsBfANQm4BuAAgHAA5tYQYA4gDMAeAFcl4CqAfQDCAJhZQ4ApgFAAuwFckYArAHYDCAVgag0BJgBCAOwCcFkCLgPYBSAEgIk1BJgoH2QngEsScAnATgAh1hBgDCAYwA4AFyXgIoDtAIIBGFtDgDGAIADbAVyQgAsAtgEIAmBkDQFGAAIBbAVwXgLOA9gCIBCAoTUEGAIIALAFwDkJOAdgM4AAAIbWEGAAYDKAzQDOSsBZAJsATAZgYA0B+gAmAdgI4IwEnAGwAcAkAPrWEKAPYCKADQBOS8BpAOsBTASgZw0BegAmAFgH4JQEnAKwFsAEALrWEKALYDyAtQBOSsBJAGsAjAegYw0BOgDGAVgN4IQEnACwCsA4ANrWEKANYCyAVQCOS8BxACsBjAWgZQ0BWgC8AawEcEwCjgFYAcAbgKY1BGgC8AKwHMBRCTgKYBkALwAa1hCgAcATwFIARyTgCIClADwBqFtDgDoADwBLAByWgMMAFgPwAKBmDQFqANwBLAJwSAIOAVgIwB2AmjUEqAFwA7AAwEEJOAhgPgA3ACrWEKACwBXAPAD7JWA/gLkAXAGoWEOACgAXAHMA7JOAfQDmAHABMGQNAUMAOAPIBLBXAvYCyATgDGDQGgIGATgBSAewRwL2AEgH4ARgwBoC3gJwBJAGYLcE7AaQBsARwFtrCHgLwAFAKoBdErALQCoABwBvrSHgLQB7ACkAdkrATgApAOwBDFhDwAAAOwDJAHZIwA4AyQDsAAyZWkPAEABbAEkAtkvAdgBJAGwBDOlbQ4A+ABsAiQC2ScA2AIkAbAAM6VlDgB4AawAJALZKwFYACQCsAQzpWkOALgArAPEAtkjAFgDxAKwADOlYQ4AOACsAcQA2S8BmAHEArAAMaVtDgDYASwCxADZJwCYAsQAsAQxpWUOAFgALADEANkrARgAxACwAvDPGGGOMMcYYY4wxxhhjWJV/AO1Xy1s+h3k+AAAAAElFTkSuQmCC';

interface PostProps {
  username: string;
  content: string;
  likes: number;
  comments: number;
  timestamp: string;
  profilePicture?: string;
  onLike?: () => void;
  onComment?: () => void;
  onProfile?: () => void;
}

const Post: React.FC<PostProps> = ({
  username,
  content,
  likes,
  comments,
  timestamp,
  profilePicture,
  onLike,
  onComment,
  onProfile,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.userInfo} onPress={onProfile}>
          <Image
            source={{ uri: profilePicture || DEFAULT_AVATAR }}
            style={styles.avatar}
          />
          <View>
            <Text style={styles.username}>{username}</Text>
            <Text style={styles.timestamp}>{timestamp}</Text>
          </View>
        </TouchableOpacity>
      </View>


      <Text style={styles.content}>{content}</Text>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={onLike}>
          <FontAwesome name="heart-o" size={20} color={COLORS.text} />
          <Text style={styles.actionText}>{likes}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={onComment}>
          <FontAwesome name="comment-o" size={20} color={COLORS.text} />
          <Text style={styles.actionText}>{comments}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SIZES.md,
    marginBottom: SIZES.md,
    ...SHADOWS.small,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.sm,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: SIZES.sm,
  },
  username: {
    fontFamily: FONTS.semiBold,
    fontSize: SIZES.md,
    color: COLORS.text,
  },
  timestamp: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.sm,
    color: COLORS.textLight,
  },
  content: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.md,
    color: COLORS.text,
    marginBottom: SIZES.md,
  },
  actions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SIZES.sm,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SIZES.xl,
  },
  actionText: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.sm,
    color: COLORS.text,
    marginLeft: SIZES.xs,
  },
});

export default Post; 