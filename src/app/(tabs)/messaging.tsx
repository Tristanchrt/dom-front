import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
  TextInput,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import { messagingUseCases } from '@/data/container';
import { conversationsFixture } from '@/data/fixtures/messaging';

const fixtureConversations = conversationsFixture;

export default function MessagingScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [conversations, setConversations] = useState(fixtureConversations);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await messagingUseCases.getConversations();
        if (!alive) return;
        if (res && res.conversations && res.conversations.length > 0) {
          setConversations(res.conversations);
        } else {
          setConversations(fixtureConversations);
        }
      } catch (_e) {
        if (alive) setConversations(fixtureConversations);
      }
    })();
    return () => { alive = false; };
  }, []);

  const filteredConversations = conversations.filter((conv) =>
    conv.user.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const renderConversation = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.conversationItem}
      onPress={() => router.push(`/chat/${item.user.id}`)}
    >
      <View style={styles.avatarContainer}>
        <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
        {item.user.isOnline && <View style={styles.onlineIndicator} />}
      </View>

      <View style={styles.conversationContent}>
        <View style={styles.conversationHeader}>
          <Text style={styles.userName} numberOfLines={1}>
            {item.user.name}
          </Text>
          <Text style={styles.timestamp}>{item.timestamp}</Text>
        </View>
        <Text
          style={[styles.lastMessage, item.hasNewMessage && styles.unreadMessage]}
          numberOfLines={1}
        >
          {item.lastMessage}
        </Text>
      </View>

      <View style={styles.conversationMeta}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>View</Text>
          <FontAwesome name="chevron-right" size={12} color="#FF8C42" />
        </TouchableOpacity>
        {item.unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadBadgeText}>{item.unreadCount}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <FontAwesome name="search" size={18} color="#8B7355" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor="#8B7355"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Conversations List */}
      <FlatList
        data={filteredConversations}
        renderItem={renderConversation}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.conversationsList}
      />

      {/* New Conversation Button */}
      <TouchableOpacity style={styles.newConversationButton}>
        <FontAwesome name="plus" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  searchContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#2C1810',
    marginLeft: 12,
  },
  conversationsList: {
    padding: 16,
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    resizeMode: 'cover',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  conversationContent: {
    flex: 1,
    marginRight: 12,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C1810',
    flex: 1,
    marginRight: 8,
  },
  timestamp: {
    fontSize: 12,
    color: '#8B7355',
  },
  lastMessage: {
    fontSize: 14,
    color: '#8B7355',
    lineHeight: 18,
  },
  unreadMessage: {
    fontWeight: '600',
    color: '#2C1810',
  },
  conversationMeta: {
    alignItems: 'flex-end',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF4E6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginBottom: 8,
  },
  actionButtonText: {
    fontSize: 12,
    color: '#FF8C42',
    fontWeight: '600',
    marginRight: 4,
  },
  unreadBadge: {
    backgroundColor: '#FF8C42',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  unreadBadgeText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  newConversationButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#FF8C42',
    borderRadius: 28,
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
