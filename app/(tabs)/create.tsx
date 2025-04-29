import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, TextInput, Platform, ScrollView, KeyboardAvoidingView, Modal } from 'react-native';
import { COLORS, FONTS } from '../../constants/theme';
import * as ImagePicker from 'expo-image-picker';

export default function CreatePostScreen() {
  const [image, setImage] = useState(null);
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

  const handlePost = () => {
    // TODO: Implement post upload logic
    setShowSuccess(true);
    setImage(null);
    setCaption('');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={80}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
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
          <Image source={{ uri: image }} style={styles.imagePreview} />
        )}
        <TextInput
          style={styles.captionInput}
          placeholder="Write a caption..."
          placeholderTextColor={COLORS.textLight}
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

const styles = StyleSheet.create({
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: 22,
    color: COLORS.text,
    marginBottom: 18,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginHorizontal: 2,
    flex: 1,
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.white,
    fontFamily: FONTS.medium,
    fontSize: 14,
  },
  imagePreview: {
    width: '100%',
    height: 220,
    borderRadius: 16,
    marginBottom: 16,
    marginTop: 8,
    backgroundColor: COLORS.white,
  },
  captionInput: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 12,
    fontFamily: FONTS.regular,
    fontSize: 15,
    color: COLORS.text,
    marginBottom: 18,
    minHeight: 48,
  },
  postButton: {
    backgroundColor: COLORS.secondary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  postButtonText: {
    color: COLORS.white,
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
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 28,
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  modalTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    color: COLORS.text,
    marginBottom: 8,
  },
  modalText: {
    color: COLORS.text,
    fontSize: 16,
    marginBottom: 18,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 28,
    marginTop: 8,
  },
  modalButtonText: {
    color: COLORS.white,
    fontFamily: FONTS.bold,
    fontSize: 16,
  },
}); 