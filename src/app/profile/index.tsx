import React from 'react';
import { SafeAreaView, View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import ProfileScreen from './[id]';
import { useAuthStore } from '@/store/auth.store';

export default function MyProfileScreen() {
  const user = useAuthStore((s) => s.user);
  const myId = user?.id ?? 'c1';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8F8F8' }}>
      <View style={styles.headerOverlay}>
        <TouchableOpacity style={styles.settingsButton} onPress={() => router.push('/settings')}>
          <FontAwesome name="cog" size={20} color="#2C1810" />
        </TouchableOpacity>
      </View>
      {/* Reuse the same profile UI by rendering the [id] screen */}
      <ProfileScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerOverlay: {
    position: 'absolute',
    right: 12,
    top: 8,
    zIndex: 10,
  },
  settingsButton: {
    padding: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
  },
});


