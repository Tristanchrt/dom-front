import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable, View, Image } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useClientOnlyValue } from '@/hooks/useClientOnlyValue';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#4C2352',
        tabBarInactiveTintColor: '#4C2352',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
          height: 70,
          paddingBottom: 20,
          paddingTop: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.06,
          shadowRadius: 12,
          elevation: 12,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: '',
          tabBarIcon: ({ color }) => <TabBarIcon name="search" color={color} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: '',
          tabBarIcon: ({ color }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: -22 }}>
              <View
                style={{
                  width: 68,
                  height: 68,
                  borderRadius: 34,
                  backgroundColor: '#FDF3EA',
                  alignItems: 'center',
                  justifyContent: 'center',
                  shadowColor: '#FF8C42',
                  shadowOffset: { width: 0, height: 6 },
                  shadowOpacity: 0.25,
                  shadowRadius: 12,
                  elevation: 10,
                }}
              >
                <View
                  style={{
                    width: 58,
                    height: 58,
                    borderRadius: 29,
                    backgroundColor: '#FF9A3E',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Image
                    source={require('../../../assets/images/create-post.png')}
                    style={{ width: 28, height: 28 }}
                    resizeMode="contain"
                  />
                </View>
              </View>
            </View>
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="messaging"
        options={{
          title: '',
          tabBarIcon: ({ color }) => <TabBarIcon name="comment" color={color} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="myprofile"
        options={{
          title: '',
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
          headerTitle: 'Mon Profil',
          headerShown: true,
          headerRight: () => (
            <Link href="/settings" asChild>
              <Pressable
                style={{ paddingHorizontal: 16, paddingVertical: 8 }}
                accessibilityLabel="Settings"
              >
                {({ pressed }) => (
                  <FontAwesome name="cog" size={20} color={Colors['light'].tabIconDefault} />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
    </Tabs>
  );
}
