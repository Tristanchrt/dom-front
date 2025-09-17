import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Modal,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import { messagingUseCases, profilesUseCases } from '@/data/container';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { computeHeaderPaddings } from '@/constants/Layout';

// Messages and user are now provided by the repository with fixture fallback

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const flatListRef = useRef<FlatList>(null);
  const [user, setUser] = useState<any | null>(null);
  const insets = useSafeAreaInsets();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
    // Scroll to bottom when messages change
    if (flatListRef.current && messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  useEffect(() => {
    // Hydrate header user and messages from repo (with fixture fallback in repo)
    let mounted = true;
    (async () => {
      if (!id) return;
      try {
        const conv = await messagingUseCases.getConversations();
        if (!mounted) return;
        const found = conv.conversations.find((c) => c.id === String(id));
        if (found) {
          setUser(found.user);
        } else {
          // Fallback: load profile by id when no conversation exists yet
          try {
            const profile = await profilesUseCases.getById(String(id));
            if (profile) {
              setUser({
                id: profile.id,
                name: profile.name,
                avatar: profile.avatar,
                specialty: profile.category ?? '',
                email: '',
                username: profile.handle ?? '',
                createdAt: new Date(),
                updatedAt: new Date(),
              } as any);
            }
          } catch {}
        }
      } catch {}
      try {
        const repoMessages = await messagingUseCases.getMessages(String(id));
        if (!mounted) return;
        if (repoMessages && repoMessages.length > 0) {
          setMessages(
            repoMessages.map((m) => ({
              id: m.id,
              text: m.content,
              timestamp: new Date(m.timestamp).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
              }),
              senderId: m.senderId,
              isMe: m.senderId === 'me',
            })),
          );
          // mark latest message as read
          const latest = repoMessages[repoMessages.length - 1];
          if (latest && !latest.isRead) {
            try { await messagingUseCases.markAsRead(latest.id); } catch {}
          }
        }
      } catch {}
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <FontAwesome name="arrow-left" size={24} color="#2C1810" />
          </TouchableOpacity>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>User not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: `m${Date.now()}`,
        text: message.trim(),
        timestamp: new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        senderId: 'me',
        isMe: true,
      };

      setMessages((prev) => [...prev, newMessage]);
      setMessage('');
      const receiverId = id ? String(id) : null;
      if (receiverId) {
        messagingUseCases.sendMessage({ content: newMessage.text, receiverId }).catch(() => {});
      }
    }
  };

  const handlePhotoPress = () => {
    Alert.alert('📷 Send a photo', 'Choose an option to send a photo', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Camera', onPress: () => console.log('Open camera') },
      { text: 'Gallery', onPress: () => console.log('Open gallery') },
    ]);
  };

  const renderMessage = ({ item }: { item: any }) => (
    <View
      style={[
        styles.messageContainer,
        item.isMe ? styles.myMessageContainer : styles.theirMessageContainer,
      ]}
    >
      {!item.isMe && <Image source={{ uri: user.avatar }} style={styles.messageAvatar} />}
      <View
        style={[
          styles.messageBubble,
          item.isMe ? styles.myMessageBubble : styles.theirMessageBubble,
        ]}
      >
        <Text
          style={[styles.messageText, item.isMe ? styles.myMessageText : styles.theirMessageText]}
        >
          {item.text}
        </Text>
        <Text
          style={[
            styles.messageTimestamp,
            item.isMe ? styles.myMessageTimestamp : styles.theirMessageTimestamp,
          ]}
        >
          {formatTimestamp(item.timestamp)}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={[styles.header, computeHeaderPaddings(insets)]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <FontAwesome name="arrow-left" size={24} color="#2C1810" />
        </TouchableOpacity>

        <View style={styles.headerUserInfo}>
          <Image source={{ uri: user.avatar }} style={styles.headerAvatar} />
          <View style={styles.headerTextInfo}>
            <Text style={styles.headerUserName}>{user.name}</Text>
            <Text style={styles.headerUserSpecialty}>{user.specialty}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.moreButton} onPress={() => setIsMenuOpen(true)}>
          <FontAwesome name="ellipsis-v" size={20} color="#2C1810" />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.messagesList, { paddingBottom: Math.max(insets.bottom, 8) }]}
        style={styles.messagesContainer}
      />

      {/* Input Bar */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? Math.max(insets.bottom, 0) : 0}
        style={[styles.inputContainer, { paddingBottom: Math.max(insets.bottom, 8) }]}
      >
        <View style={styles.inputBar}>
          <TouchableOpacity style={styles.photoButton} onPress={handlePhotoPress}>
            <FontAwesome name="camera" size={20} color="#8B7355" />
          </TouchableOpacity>

          <TextInput
            style={styles.messageInput}
            placeholder="Type your message..."
            placeholderTextColor="#8B7355"
            value={message}
            onChangeText={setMessage}
            multiline
            maxLength={500}
          />

          <TouchableOpacity style={styles.sendButton} onPress={sendMessage} accessibilityLabel="Send">
            <FontAwesome name="send" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Header Action Menu */}
      <Modal
        visible={isMenuOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsMenuOpen(false)}
      >
        <View style={styles.menuOverlay}>
          <TouchableOpacity style={styles.menuBackdrop} activeOpacity={1} onPress={() => setIsMenuOpen(false)} />
          <View style={[styles.menuCard, { top: insets.top + 12, right: 12 }]}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setIsMenuOpen(false);
                Alert.alert('Signaler', `Signaler ${user?.name} ?`, [
                  { text: 'Annuler', style: 'cancel' },
                  { text: 'Signaler', style: 'destructive' as any },
                ]);
              }}
            >
              <FontAwesome name="flag" size={14} color="#FF4444" />
              <Text style={[styles.menuItemText, { color: '#FF4444' }]}>Signaler</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setIsMenuOpen(false);
                Alert.alert('Bloquer', `Bloquer ${user?.name} ?`, [
                  { text: 'Annuler', style: 'cancel' },
                  { text: 'Bloquer', style: 'destructive' as any },
                ]);
              }}
            >
              <FontAwesome name="ban" size={14} color="#D9534F" />
              <Text style={[styles.menuItemText, { color: '#D9534F' }]}>Bloquer le profil</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setIsMenuOpen(false);
                Alert.alert('Mettre en sourdine', 'La conversation a été mise en sourdine.');
              }}
            >
              <FontAwesome name="bell-slash" size={14} color="#8B7355" />
              <Text style={styles.menuItemText}>Mettre en sourdine</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerUserInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    resizeMode: 'cover',
    marginRight: 12,
  },
  headerTextInfo: {
    flex: 1,
  },
  headerUserName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C1810',
  },
  headerUserSpecialty: {
    fontSize: 12,
    color: '#8B7355',
    marginTop: 2,
  },
  headerOnlineIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    marginLeft: 8,
  },
  moreButton: {
    padding: 8,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesList: {
    padding: 16,
    paddingBottom: 8,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  myMessageContainer: {
    justifyContent: 'flex-end',
  },
  theirMessageContainer: {
    justifyContent: 'flex-start',
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
    resizeMode: 'cover',
  },
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  myMessageBubble: {
    backgroundColor: '#FF8C42',
    borderBottomRightRadius: 4,
  },
  theirMessageBubble: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  myMessageText: {
    color: '#FFFFFF',
  },
  theirMessageText: {
    color: '#2C1810',
  },
  messageTimestamp: {
    fontSize: 11,
    marginTop: 4,
  },
  myMessageTimestamp: {
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'right',
  },
  theirMessageTimestamp: {
    color: '#8B7355',
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  photoButton: {
    padding: 8,
    marginRight: 8,
  },
  messageInput: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#2C1810',
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#FF8C42',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },

  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#8B7355',
  },
  menuOverlay: {
    flex: 1,
  },
  menuBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
  menuCard: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 6,
    minWidth: 200,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  menuItemText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#2C1810',
    fontWeight: '500',
  },
});
