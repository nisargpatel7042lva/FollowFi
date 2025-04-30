import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { COLORS, FONTS } from '../../constants/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textLight,
        tabBarStyle: {
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          elevation: 0,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        headerStyle: {
          backgroundColor: COLORS.background,
        },
        headerTitleStyle: {
          fontFamily: FONTS.semiBold,
          fontSize: 18,
        },
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Feed',
          tabBarIcon: ({ color, size,focused }) => (
            <FontAwesome name="home" size={focused ? size +4 : size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color, size,focused }) => (
            <FontAwesome name="search" size={focused ? size +4 : size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: 'Post',
          tabBarIcon: ({ color, size ,focused}) => (
            <FontAwesome name="plus-square-o" size={focused ? size +4 : size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="finance"
        options={{
          title: 'Finance',
          tabBarIcon: ({ color, size, focused}) => (
            <FontAwesome name="line-chart" size={focused ? size +4 : size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size, focused}) => (
            <FontAwesome name="user" size={focused ? size +4 : size} color={color} />
          ),
        }}
      />
      
    </Tabs>
  );
}
