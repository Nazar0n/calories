import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#000',
        tabBarInactiveTintColor: '#666',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#fff',
        },
      }}
    >
      <Tabs.Screen
        name="testscreen"
        options={{
          title: 'Calories',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="food" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
