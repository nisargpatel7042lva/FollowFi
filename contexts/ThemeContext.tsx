import React, { createContext, useContext, useState, ReactNode } from 'react';

const lightTheme = {
  primary: '#B983FF',
  secondary: '#A084E8',
  success: '#22C55E',
  background: '#F3E8FF',
  text: '#3D246C',
  textLight: '#7C73C0',
  border: '#E5E7EB',
  error: '#EF4444',
  warning: '#F59E0B',
  white: '#FFFFFF',
  black: '#000000',
  card: '#FFFFFF',
};

const darkTheme = {
  primary: '#A084E8',
  secondary: '#B983FF',
  success: '#22C55E',
  background: '#151718',
  text: '#ECEDEE',
  textLight: '#A3A3A3',
  border: '#333',
  error: '#EF4444',
  warning: '#F59E0B',
  white: '#23262b',
  black: '#fff',
  card: '#23262b',
};

const ThemeContext = createContext({
  isDark: false,
  colors: lightTheme,
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDark, setIsDark] = useState(false);
  const colors = isDark ? darkTheme : lightTheme;

  const toggleTheme = () => setIsDark((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ isDark, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
