import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from 'react-native';
import { COLORS, FONTS, SIZES } from '../constants/theme';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'medium',
  loading = false,
  style,
  textStyle,
  disabled,
  ...props
}) => {
  const getBackgroundColor = () => {
    if (disabled) return COLORS.textLight;
    switch (variant) {
      case 'secondary':
        return COLORS.secondary;
      case 'outline':
        return 'transparent';
      default:
        return COLORS.primary;
    }
  };

  const getTextColor = () => {
    if (disabled) return COLORS.white;
    switch (variant) {
      case 'outline':
        return COLORS.primary;
      default:
        return COLORS.white;
    }
  };

  const getPadding = () => {
    switch (size) {
      case 'small':
        return SIZES.xs;
      case 'large':
        return SIZES.lg;
      default:
        return SIZES.md;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          padding: getPadding(),
          borderWidth: variant === 'outline' ? 1 : 0,
          borderColor: COLORS.primary,
        },
        style,
      ]}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <Text style={[styles.text, { color: getTextColor() }, textStyle]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: SIZES.xs,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
  },
  text: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.md,
  },
});

export default Button; 