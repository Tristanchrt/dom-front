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
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';

// Sample users data
const users = {
  u1: {
    id: 'u1',
    name: 'MICHEL PAGE',
    username: 'michel.page',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    isOnline: true,
    specialty: 'Compétence de technique',
  },
  u2: {
    id: 'u2',
    name: 'Marie Dubois',
    username: 'marie.dubois',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    isOnline: false,
    specialty: 'Designer graphique',
  },
  u3: {
    id: 'u3',
    name: 'Pierre Martin',
    username: 'pierre.martin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    isOnline: true,
    specialty: 'Développeur web',
  },
};

// Sample messages data
const sampleMessages = {
  u1: [
    {
      id: 'm1',
      text: 'Salut ! Comment ça va ?',
      timestamp: '10:30',
      senderId: 'u1',
      isMe: false,
    },
    {
      id: 'm2',
      text: 'Ça va bien merci ! Et toi ?',
      timestamp: '10:32',
      senderId: 'me',
      isMe: true,
    },
    {
      id: 'm3',
      text: 'Super ! J\'aimerais discuter de ton projet',
      timestamp: '10:35',
      senderId: 'u1',
      isMe: false,
    },
    {
      id: 'm4',
      text: 'Parfait, je suis disponible maintenant',
      timestamp: '10:36',
      senderId: 'me',
      isMe: true,
    },
    {
      id: 'm5',
      text: 'Remise en oeuvre rien que ça',
      timestamp: '10:40',
      senderId: 'u1',
      isMe: false,
    },
  ],
  u2: [
    {
      id: 'm6',
      text: 'Merci pour les infos !',
      timestamp: '09:15',
      senderId: 'u2',
      isMe: false,
    },
  ],
  u3: [
    {
      id: 'm7',
      text: 'Parfait, on se parle demain',
      timestamp: 'Hier',
      senderId: 'u3',
      isMe: false,
    },
  ],
};

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(sampleMessages[id as string] || []);
  const flatListRef = useRef<FlatList>(null);

  const user = users[id as string];

  useEffect(() => {
    // Scroll to bottom when messages change
    if (flatListRef.current && messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <FontAwesome name="arrow-left" size={24} color="#2C1810" />
          </TouchableOpacity>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Utilisateur non trouvé</Text>
        </View>
      </SafeAreaView>
    );
  }

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: `m${Date.now()}`,
        text: message.trim(),
        timestamp: new Date().toLocaleTimeString('fr-FR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        senderId: 'me',
        isMe: true,
      };

      setMessages(prev => [...prev, newMessage]);
      setMessage('');
    }
  };

  const handlePhotoPress = () => {
    Alert.alert(
      '📷 Envoyer une photo',
      'Choisissez une option pour envoyer une photo',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Caméra', onPress: () => console.log('Open camera') },
        { text: 'Galerie', onPress: () => console.log('Open gallery') }
      ]
    );
  };

  const renderMessage = ({ item }: { item: any }) => (
    <View style={[
      styles.messageContainer,
      item.isMe ? styles.myMessageContainer : styles.theirMessageContainer
    ]}>
      {!item.isMe && (
        <Image source={{ uri: user.avatar }} style={styles.messageAvatar} />
      )}
      <View style={[
        styles.messageBubble,
        item.isMe ? styles.myMessageBubble : styles.theirMessageBubble
      ]}>
        <Text style={[
          styles.messageText,
          item.isMe ? styles.myMessageText : styles.theirMessageText
        ]}>
          {item.text}
        </Text>
        <Text style={[
          styles.messageTimestamp,
          item.isMe ? styles.myMessageTimestamp : styles.theirMessageTimestamp
        ]}>
          {item.timestamp}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <FontAwesome name="arrow-left" size={24} color="#2C1810" />
        </TouchableOpacity>
        
        <View style={styles.headerUserInfo}>
          <Image source={{ uri: user.avatar }} style={styles.headerAvatar} />
          <View style={styles.headerTextInfo}>
            <Text style={styles.headerUserName}>{user.name}</Text>
            <Text style={styles.headerUserSpecialty}>{user.specialty}</Text>
          </View>
          {user.isOnline && <View style={styles.headerOnlineIndicator} />}
        </View>
        
        <TouchableOpacity style={styles.moreButton}>
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
        contentContainerStyle={styles.messagesList}
        style={styles.messagesContainer}
      />

      {/* Input Bar */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputContainer}
      >
        <View style={styles.inputBar}>
          <TouchableOpacity style={styles.photoButton} onPress={handlePhotoPress}>
            <FontAwesome name="camera" size={20} color="#8B7355" />
          </TouchableOpacity>
          
          <TextInput
            style={styles.messageInput}
            placeholder="Tapez votre message..."
            placeholderTextColor="#8B7355"
            value={message}
            onChangeText={setMessage}
            multiline
            maxLength={500}
          />
          
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <FontAwesome name="send" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
});
