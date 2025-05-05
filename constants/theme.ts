export const COLORS = {
  primary: '#B983FF',    // Light purple accent
  secondary: '#A084E8',  // Slightly darker purple
  success: '#22C55E',    // Green - Growth and prosperity
  background: '#F3E8FF', // Light purple background
  text: '#3D246C',       // Deep purple for text
  textLight: '#7C73C0',  // Lighter purple for secondary text
  border: '#E5E7EB',
  error: '#EF4444',
  warning: '#F59E0B',
  white: '#FFFFFF',
  black: '#000000',
  card: '#FFFFFF', // Card background color
};

export const FONTS = {
  regular: 'Poppins_400Regular',
  medium: 'Poppins_500Medium',
  semiBold: 'Poppins_600SemiBold',
  bold: 'Poppins_700Bold',
};

export const SIZES = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
};

export const SHADOWS = {
  small: {
    shadowColor: '#B983FF',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
  },
  medium: {
    shadowColor: '#B983FF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 4,
  },
};

export default { COLORS, FONTS, SIZES, SHADOWS }; 