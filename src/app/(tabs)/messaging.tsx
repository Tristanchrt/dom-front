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
  Modal,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import SearchBar from '@/components/common/SearchBar';
import { router } from 'expo-router';
import { messagingUseCases, profilesUseCases } from '@/data/container';
import { conversationsFixture } from '@/data/fixtures/messaging';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { computeHeaderPaddings } from '@/constants/Layout';

const fixtureConversations = conversationsFixture;

export default function MessagingScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [conversations, setConversations] = useState(fixtureConversations);
  const insets = useSafeAreaInsets();
  const [isNewOpen, setIsNewOpen] = useState(false);
  const [people, setPeople] = useState<any[]>([]);
  const [peopleQuery, setPeopleQuery] = useState('');

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const list = await profilesUseCases.list().catch(() => []);
        if (!active) return;
        setPeople(
          (list || []).map((p: any) => ({
            id: p.id,
            name: p.name,
            handle: p.handle ?? '',
            avatar: p.avatar,
          })),
        );
      } catch {
        if (active) setPeople([]);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const formatTimestamp = (input: Date | string): string => {
    const now = new Date();
    const d = typeof input === 'string' ? new Date(input) : input;
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfYesterday = new Date(startOfToday);
    startOfYesterday.setDate(startOfYesterday.getDate() - 1);

    if (d >= startOfToday) {
      return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    }
    if (d >= startOfYesterday && d < startOfToday) {
      return 'Hier';
    }
    if (d.getFullYear() === now.getFullYear()) {
      const str = d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
      return str.replace('.', '');
    }
    const str = d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
    return str.replace('.', '');
  };

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await messagingUseCases.getConversations();
        if (!alive) return;
        if (res && res.conversations && res.conversations.length > 0) {
          // Enrich with latest message per conversation
          const enriched = await Promise.all(
            res.conversations.map(async (c: any) => {
              try {
                const msgs = await messagingUseCases.getMessages(c.id);
                if (msgs && msgs.length > 0) {
                  const last = msgs[msgs.length - 1]!;
                  return {
                    ...c,
                    lastMessage: last?.content ?? c.lastMessage,
                    lastFromMe: last?.senderId === 'me',
                    timestamp: formatTimestamp(last?.timestamp ?? new Date()),
                  };
                }
              } catch {}
              return c;
            }),
          );
          setConversations(enriched);
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

  const filteredPeople = people.filter((p) => {
    const q = peopleQuery.toLowerCase();
    if (!q) return true;
    return p.name.toLowerCase().includes(q) || p.handle.toLowerCase().includes(q);
  });

  const renderConversation = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.conversationItem}
      onPress={() => router.push(`/chat/${item.user.id}`)}
    >
      <View style={styles.avatarContainer}>
        <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
        {/* Online indicator removed for now */}
      </View>

      <View style={styles.conversationContent}>
        <View style={styles.conversationHeader}>
          <Text style={styles.userName} numberOfLines={1}>
            {item.user.name}
          </Text>
          <Text style={styles.timestamp}>{item.timestamp}</Text>
        </View>
        <Text
          style={[
            styles.lastMessage,
            item.lastFromMe && styles.lastMessageMine,
            item.hasNewMessage && styles.unreadMessage,
          ]}
          numberOfLines={1}
        >
          {item.lastFromMe ? `You: ${item.lastMessage}` : item.lastMessage}
        </Text>
      </View>

      <View style={styles.conversationMeta}>
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
      {/* Header */}
      <View style={[styles.header, computeHeaderPaddings(insets)]}>
        <View style={styles.headerSpacer} />
      </View>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          containerStyle={styles.searchBar}
          inputStyle={styles.searchInput}
        />
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
      <TouchableOpacity
        style={[styles.newConversationButton, { bottom: Math.max(insets.bottom, 20) }]}
        onPress={() => setIsNewOpen(true)}
      >
        <FontAwesome name="plus" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      <Modal
        visible={isNewOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setIsNewOpen(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={() => setIsNewOpen(false)} />
          <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 12) }]}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Nouveau message</Text>
              <TouchableOpacity onPress={() => setIsNewOpen(false)} style={styles.sheetClose}>
                <FontAwesome name="times" size={20} color="#8B7355" />
              </TouchableOpacity>
            </View>
            <View style={styles.modalSearchContainer}>
              <View style={styles.modalSearchBar}>
                <FontAwesome name="search" size={18} color="#8B7355" />
                <TextInput
                  style={styles.modalSearchInput}
                  placeholder="Rechercher une personne"
                  placeholderTextColor="#8B7355"
                  value={peopleQuery}
                  onChangeText={setPeopleQuery}
                />
              </View>
            </View>
            <FlatList
              data={filteredPeople}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.peopleList}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.personRow}
                  onPress={() => {
                    setIsNewOpen(false);
                    router.push(`/chat/${item.id}`);
                  }}
                >
                  <Image source={{ uri: item.avatar }} style={styles.personAvatar} />
                  <View style={styles.personInfo}>
                    <Text style={styles.personName}>{item.name}</Text>
                    {!!item.handle && <Text style={styles.personHandle}>{item.handle}</Text>}
                  </View>
                  <FontAwesome name="chevron-right" size={14} color="#8B7355" />
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F0E8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerBack: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C1810',
  },
  headerSpacer: { width: 32 },
  searchContainer: {
    backgroundColor: '#F7EFE6',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
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
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7F0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F0E2D4',
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
  lastMessageMine: {
    fontStyle: 'italic',
    color: '#B0A090',
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
    backgroundColor: '#FFEEDC',
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
  newConversationLabelWrapper: {
    position: 'absolute',
    bottom: 28,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  newConversationLabel: {
    color: '#8B7355',
    fontSize: 12,
  },
  // New conversation modal
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 12,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C1810',
  },
  sheetClose: {
    padding: 6,
  },
  modalSearchContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  modalSearchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  modalSearchInput: {
    flex: 1,
    fontSize: 16,
    color: '#2C1810',
    marginLeft: 12,
  },
  peopleList: {
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  personRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  personAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  personInfo: {
    flex: 1,
  },
  personName: {
    fontSize: 16,
    color: '#2C1810',
    fontWeight: '600',
  },
  personHandle: {
    fontSize: 12,
    color: '#8B7355',
    marginTop: 2,
  },
});
