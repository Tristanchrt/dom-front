import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable, View, Image, Dimensions, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { computeHeaderPaddings } from '@/constants/Layout';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useClientOnlyValue } from '@/hooks/useClientOnlyValue';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
  focused?: boolean;
}) {
  const { name, color, focused } = props;
  const isSmallScreen = Dimensions.get('window').height < 700;
  const iconSize = isSmallScreen ? 22 : 28;

  const scale = React.useRef(new Animated.Value(1)).current;
  const translateY = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: focused ? 1.12 : 1,
        useNativeDriver: true,
        friction: 6,
        tension: 200,
      }),
      Animated.timing(translateY, {
        toValue: focused ? -2 : 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  }, [focused, scale, translateY]);

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <FontAwesome name={name} size={iconSize} color={color} style={{ marginBottom: -3 }} />
      {focused ? (
        <View
          style={{
            width: 6,
            height: 3,
            borderRadius: 2,
            backgroundColor: '#FF8C42',
            marginTop: 4,
          }}
        />
      ) : null}
    </View>
  );
}

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const isSmallScreen = Dimensions.get('window').height < 700;

  const tabBarHeight = (isSmallScreen ? 56 : 64) + Math.max(insets.bottom, 4);
  const tabBarPaddingBottom = Math.max(insets.bottom, 4);
  const tabBarPaddingTop = 6;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#4C2352',
        tabBarInactiveTintColor: '#4C2352',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
          height: tabBarHeight,
          paddingBottom: tabBarPaddingBottom,
          paddingTop: tabBarPaddingTop,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.06,
          shadowRadius: 12,
          elevation: 12,
        },
        tabBarLabelStyle: {
          fontSize: isSmallScreen ? 0 : 12,
          fontWeight: '500',
        },
        tabBarShowLabel: !isSmallScreen,
        tabBarHideOnKeyboard: true,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '',
          tabBarIcon: ({ color, focused }) => <TabBarIcon name="home" color={color} focused={focused} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: '',
          tabBarIcon: ({ color, focused }) => <TabBarIcon name="search" color={color} focused={focused} />,
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
          tabBarIcon: ({ color, focused }) => <TabBarIcon name="comment" color={color} focused={focused} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="myprofile"
        options={{
          title: '',
          tabBarIcon: ({ color, focused }) => <TabBarIcon name="user" color={color} focused={focused} />,
          headerTitle: 'Mon Profil',
          headerShown: true,
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
          // Use consistent safe-area-aware top padding
          headerStatusBarHeight: Math.max(insets.top, 8),
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
