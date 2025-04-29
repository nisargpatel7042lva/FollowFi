import React from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TextInputProps,
} from 'react-native';
import { COLORS, FONTS, SIZES } from '../constants/theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  inputStyle,
  labelStyle,
  ...props
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, labelStyle]}>
          {label}
        </Text>
      )}
      <TextInput
        style={[
          styles.input,
          error && styles.inputError,
          inputStyle,
        ]}
        placeholderTextColor={COLORS.textLight}
        {...props}
      />
      {error && (
        <Text style={styles.error}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SIZES.md,
  },
  label: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.sm,
    color: COLORS.text,
    marginBottom: SIZES.xs,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.xs,
    paddingHorizontal: SIZES.md,
    fontFamily: FONTS.regular,
    fontSize: SIZES.md,
    color: COLORS.text,
    backgroundColor: COLORS.white,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  error: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.sm,
    color: COLORS.error,
    marginTop: SIZES.xs,
  },
});

export default Input; 