import React, { useState } from 'react';
import { StyleSheet, FlatList, View, Text, TouchableOpacity, SafeAreaView, Animated } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import Post from '@/components/specific/Post';

const followingPosts = [
  {
    id: '1',
    user: {
      id: 'c1',
      name: 'NYC Design',
      handle: '@nycdesign',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    },
    content: 'ef... zjemzjnezjnezjp ejenjb zjebnjz es zenjbc zjeb vjzbe vjz',
    likes: 3100,
    comments: 22,
    shares: 0,
    timestamp: '2h',
  },
  {
    id: '2',
    user: {
      id: 'c1',
      name: 'NYC Design',
      handle: '@nycdesign',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    },
    content: 'Man, you\'re my new guru! Viewing the lessons for a second time. Thoroughly pleased. And impressed that you draw from scientific literature in telling memorable...',
    likes: 3100,
    comments: 22,
    shares: 0,
    timestamp: '4h',
  },
  {
    id: '3',
    user: {
      id: 'c1',
      name: 'NYC Design',
      handle: '@nycdesign',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    },
    content: 'Ma nouvelle création à partager en famille !!',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop',
    likes: 3100,
    comments: 22,
    shares: 0,
    timestamp: '6h',
    price: '30 €',
  },
];

const explorerPosts = [
  {
    id: 'e1',
    user: {
      id: 'c3',
      name: 'Travel Explorer',
      handle: '@travelexplorer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    },
    content: '🌍 Découvrez les merveilles cachées de l\'Islande ! Ces paysages à couper le souffle vous laisseront sans voix.',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    likes: 8200,
    comments: 156,
    shares: 0,
    timestamp: '1h',
  },
  {
    id: 'e2',
    user: {
      id: 'c2',
      name: 'Food Lover',
      handle: '@foodlover',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    },
    content: 'Recette du jour : Tarte aux pommes traditionnelle française 🥧 Parfaite pour les soirées d\'automne !',
    image: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=400&h=300&fit=crop',
    likes: 2400,
    comments: 89,
    shares: 0,
    timestamp: '3h',
    price: '25 €',
  },
  {
    id: 'e3',
    user: {
      id: 'c4',
      name: 'Tech Guru',
      handle: '@techguru',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face',
    },
    content: 'Les nouvelles tendances en IA révolutionnent notre façon de travailler. Voici 5 outils que tout développeur devrait connaître en 2024 💻',
    likes: 5600,
    comments: 234,
    shares: 0,
    timestamp: '5h',
  },
  {
    id: 'e4',
    user: {
      id: 'c1',
      name: 'Art Studio',
      handle: '@artstudio',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    },
    content: 'Nouvelle œuvre terminée ! Peinture à l\'huile sur toile, inspirée des couchers de soleil méditerranéens 🎨',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop',
    likes: 1800,
    comments: 67,
    shares: 0,
    timestamp: '8h',
    price: '450 €',
  },
  {
    id: 'e5',
    user: {
      id: 'c4',
      name: 'Fitness Coach',
      handle: '@fitnesscoach',
      avatar: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop&crop=face',
    },
    content: '💪 Séance du matin terminée ! 45 minutes d\'entraînement intense. Qui me rejoint demain à 7h pour une session de groupe ?',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    likes: 920,
    comments: 43,
    shares: 0,
    timestamp: '10h',
  },
];

type FeedType = 'following' | 'explorer';

export default function HomeScreen() {
  const [activeFeed, setActiveFeed] = useState<FeedType>('following');

  const handleFeedSwitch = (feedType: FeedType) => {
    if (feedType !== activeFeed) {
      setActiveFeed(feedType);
    }
  };
  const renderPost = ({ item }: { item: any }) => <Post post={item} />;

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity style={styles.menuButton}>
        <FontAwesome name="bars" size={24} color="#2C1810" />
      </TouchableOpacity>
      
      <Text style={styles.logo}>DÖM</Text>
      
      <View style={styles.headerActions}>
        <TouchableOpacity style={styles.cartButton} onPress={() => router.push('/shop')}>
          <FontAwesome name="shopping-cart" size={24} color="#2C1810" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderTabBar = () => (
    <View style={styles.tabBar}>
      <TouchableOpacity 
        style={[styles.tab, activeFeed === 'following' && styles.activeTab]}
        onPress={() => handleFeedSwitch('following')}
        activeOpacity={0.7}
      >
        <Text style={[styles.tabText, activeFeed === 'following' && styles.activeTabText]}>
          Abonnements
        </Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.tab, activeFeed === 'explorer' && styles.activeTab]}
        onPress={() => handleFeedSwitch('explorer')}
        activeOpacity={0.7}
      >
        <Text style={[styles.tabText, activeFeed === 'explorer' && styles.activeTabText]}>
          Explorer
        </Text>
      </TouchableOpacity>
    </View>
  );

  const getCurrentFeedData = () => {
    return activeFeed === 'following' ? followingPosts : explorerPosts;
  };

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      {renderTabBar()}
      <FlatList
        data={getCurrentFeedData()}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        style={styles.feed}
        key={activeFeed} // Force re-render when feed changes
      />
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  menuButton: {
    padding: 8,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C1810',
    letterSpacing: 1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  messageButton: {
    padding: 8,
    marginRight: 8,
    position: 'relative',
  },
  messageBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#FF4444',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  messageBadgeText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  cartButton: {
    padding: 8,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tab: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginRight: 20,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#FF8C42',
  },
  tabText: {
    fontSize: 16,
    color: '#8B7355',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#2C1810',
    fontWeight: '600',
  },
  feed: {
    flex: 1,
  },
});
