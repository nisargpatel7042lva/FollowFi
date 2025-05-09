import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, TextInput, Platform, ScrollView, KeyboardAvoidingView, Modal } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { FONTS } from '../../constants/theme';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { db } from '../../firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function CreatePostScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [image, setImage] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handlePost = async () => {
    if (!caption.trim() && !image) return;
    try {
      await addDoc(collection(db, 'posts'), {
        username: 'me', // Replace with actual username if available
        content: caption,
        likes: 0,
        comments: 0,
        timestamp: serverTimestamp(),
        profilePicture: 'https://randomuser.me/api/portraits/lego/1.jpg', // Replace with actual user avatar
        image: image || '',
        commentList: [],
        liked: false,
      });
      setShowSuccess(true);
      setImage(null);
      setCaption('');
      setTimeout(() => {
        setShowSuccess(false);
        router.replace('/(tabs)');
      }, 1200);
    } catch (e) {
      // Optionally show error
    }
  };

  const styles = StyleSheet.create({
    scrollContent: {
      padding: 20,
      paddingBottom: 40,
    },
    title: {
      fontFamily: FONTS.bold,
      fontSize: 22,
      color: colors.text,
      marginBottom: 18,
      textAlign: 'center',
    },
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 18,
    },
    button: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      paddingVertical: 10,
      paddingHorizontal: 12,
      marginHorizontal: 2,
      flex: 1,
      alignItems: 'center',
    },
    buttonText: {
      color: colors.white,
      fontFamily: FONTS.medium,
      fontSize: 14,
    },
    imagePreview: {
      width: '100%',
      height: 220,
      borderRadius: 16,
      marginBottom: 16,
      marginTop: 8,
      backgroundColor: colors.card,
    },
    captionInput: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 12,
      fontFamily: FONTS.regular,
      fontSize: 15,
      color: colors.text,
      marginBottom: 18,
      minHeight: 48,
    },
    postButton: {
      backgroundColor: colors.secondary,
      borderRadius: 12,
      paddingVertical: 14,
      alignItems: 'center',
      marginTop: 8,
    },
    postButtonText: {
      color: colors.white,
      fontFamily: FONTS.bold,
      fontSize: 16,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.25)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 28,
      alignItems: 'center',
      shadowColor: colors.primary,
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    modalTitle: {
      fontWeight: 'bold',
      fontSize: 20,
      color: colors.text,
      marginBottom: 8,
    },
    modalText: {
      color: colors.text,
      fontSize: 16,
      marginBottom: 18,
      textAlign: 'center',
    },
    modalButton: {
      backgroundColor: colors.primary,
      borderRadius: 10,
      paddingVertical: 10,
      paddingHorizontal: 28,
      marginTop: 8,
    },
    modalButtonText: {
      color: colors.white,
      fontFamily: FONTS.bold,
      fontSize: 16,
    },
  });

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={80}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" style={{ backgroundColor: colors.background }}>
        <Text style={styles.title}>Create a Post</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={pickImage}>
            <Text style={styles.buttonText}>Upload Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={takePhoto}>
            <Text style={styles.buttonText}>Take Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => alert('Add to Story!')}>
            <Text style={styles.buttonText}>Add to Story</Text>
          </TouchableOpacity>
        </View>
        {image && (
          <View style={{ position: 'relative', width: '100%', alignItems: 'center' }}>
            <Image source={{ uri: image }} style={styles.imagePreview} />
            <TouchableOpacity
              style={{
                position: 'absolute',
                top: 14,
                right: 14,
                backgroundColor: 'rgba(0,0,0,0.55)',
                borderRadius: 16,
                width: 32,
                height: 32,
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 2,
              }}
              onPress={() => setImage(null)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <FontAwesome name="close" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
        <TextInput
          style={styles.captionInput}
          placeholder="Write a caption..."
          placeholderTextColor={colors.textLight}
          value={caption}
          onChangeText={setCaption}
          multiline
        />
        <TouchableOpacity style={styles.postButton} onPress={handlePost}>
          <Text style={styles.postButtonText}>Post</Text>
        </TouchableOpacity>
      </ScrollView>
      <Modal
        visible={showSuccess}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSuccess(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Post Shared!</Text>
            <Text style={styles.modalText}>Your post was shared successfully.</Text>
            <TouchableOpacity style={styles.modalButton} onPress={() => setShowSuccess(false)}>
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
} 