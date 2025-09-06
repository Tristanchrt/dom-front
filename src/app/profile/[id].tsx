import React, { useState } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';

const { width: screenWidth } = Dimensions.get('window');

// Sample creator profiles data
const creatorProfiles = {
  'c1': {
    id: 'c1',
    name: 'Marie Dubois',
    handle: '@mariedubois',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face',
    coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop',
    followers: '12.5k',
    following: '890',
    postsCount: '156',
    verified: true,
    category: 'Lifestyle',
    bio: '✨ Créatrice de contenu lifestyle\n🌍 Voyageuse passionnée\n📸 Photographe amateur\n💫 Partage mes découvertes quotidiennes',
    location: 'Paris, France',
    joinDate: 'Janvier 2022',
    posts: [
      {
        id: 'p1',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop',
        likes: 1250,
        comments: 34,
        content: 'Magnifique coucher de soleil aujourd\'hui ! 🌅'
      },
      {
        id: 'p2',
        image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=300&h=300&fit=crop',
        likes: 980,
        comments: 22,
        content: 'Nouvelle découverte culinaire 🍽️'
      },
      {
        id: 'p3',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop',
        likes: 2100,
        comments: 67,
        content: 'Art et créativité au rendez-vous 🎨'
      },
      {
        id: 'p4',
        image: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=300&h=300&fit=crop',
        likes: 1450,
        comments: 45,
        content: 'Moments précieux entre amis 💕'
      }
    ],
    shop: [
      {
        id: 's1',
        name: 'Guide Voyage Islande',
        price: '35 €',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop',
        rating: 4.9,
        sales: 234
      },
      {
        id: 's2',
        name: 'Preset Photo Lifestyle',
        price: '15 €',
        image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=200&h=200&fit=crop',
        rating: 4.7,
        sales: 456
      }
    ]
  },
  'c2': {
    id: 'c2',
    name: 'Chef Antoine',
    handle: '@chefantoine',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=face',
    coverImage: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=400&h=200&fit=crop',
    followers: '8.9k',
    following: '245',
    postsCount: '89',
    verified: false,
    category: 'Cuisine',
    bio: '👨‍🍳 Chef passionné depuis 15 ans\n🍽️ Cuisine française traditionnelle\n📚 Auteur de 3 livres de cuisine\n🎓 Formateur culinaire',
    location: 'Lyon, France',
    joinDate: 'Mars 2021',
    posts: [
      {
        id: 'p1',
        image: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=300&h=300&fit=crop',
        likes: 2400,
        comments: 89,
        content: 'Risotto aux champignons et truffe noire 🍄'
      },
      {
        id: 'p2',
        image: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=300&h=300&fit=crop',
        likes: 1800,
        comments: 56,
        content: 'Tarte aux pommes traditionnelle 🥧'
      },
      {
        id: 'p3',
        image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=300&h=300&fit=crop',
        likes: 3200,
        comments: 124,
        content: 'Coq au vin de ma grand-mère 🍷'
      }
    ],
    shop: [
      {
        id: 's1',
        name: 'Livre de Recettes',
        price: '45 €',
        image: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=200&h=200&fit=crop',
        rating: 4.8,
        sales: 189
      },
      {
        id: 's2',
        name: 'Cours de Cuisine Privé',
        price: '150 €',
        image: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=200&h=200&fit=crop',
        rating: 4.9,
        sales: 67
      },
      {
        id: 's3',
        name: 'Kit Épices Premium',
        price: '25 €',
        image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=200&h=200&fit=crop',
        rating: 4.6,
        sales: 345
      }
    ]
  },
  'c3': {
    id: 'c3',
    name: 'Travel Explorer',
    handle: '@travelexplorer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
    coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop',
    followers: '25.1k',
    following: '1.2k',
    postsCount: '234',
    verified: true,
    category: 'Voyage',
    bio: '🌍 Explorateur du monde entier\n✈️ 67 pays visités\n📸 Photographe de voyage\n🗺️ Guides et conseils voyage',
    location: 'Partout dans le monde',
    joinDate: 'Septembre 2020',
    posts: [
      {
        id: 'p1',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop',
        likes: 8200,
        comments: 156,
        content: 'Coucher de soleil en Islande 🇮🇸'
      },
      {
        id: 'p2',
        image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=300&h=300&fit=crop',
        likes: 5600,
        comments: 98,
        content: 'Aurores boréales magiques ✨'
      },
      {
        id: 'p3',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop',
        likes: 7800,
        comments: 134,
        content: 'Fjords norvégiens 🏔️'
      }
    ],
    shop: [
      {
        id: 's1',
        name: 'Guide Complet Islande',
        price: '35 €',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop',
        rating: 4.9,
        sales: 567
      },
      {
        id: 's2',
        name: 'Presets Aurora Boréale',
        price: '20 €',
        image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=200&h=200&fit=crop',
        rating: 4.8,
        sales: 432
      }
    ]
  },
  'c4': {
    id: 'c4',
    name: 'Tech Guru',
    handle: '@techguru',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=200&fit=crop',
    followers: '15.7k',
    following: '567',
    postsCount: '89',
    verified: true,
    category: 'Technologie',
    bio: '💻 Développeur Full Stack\n🤖 Passionné d\'IA et Machine Learning\n📱 Expert React Native\n🚀 Entrepreneur tech',
    location: 'San Francisco, USA',
    joinDate: 'Mai 2021',
    posts: [
      {
        id: 'p1',
        image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=300&fit=crop',
        likes: 5600,
        comments: 234,
        content: 'Les nouvelles tendances en IA 2024 🤖'
      },
      {
        id: 'p2',
        image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=300&h=300&fit=crop',
        likes: 4200,
        comments: 189,
        content: 'React Native vs Flutter 📱'
      }
    ],
    shop: [
      {
        id: 's1',
        name: 'Cours IA Complet',
        price: '199 €',
        image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=200&h=200&fit=crop',
        rating: 4.9,
        sales: 234
      },
      {
        id: 's2',
        name: 'Template React Native',
        price: '49 €',
        image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=200&h=200&fit=crop',
        rating: 4.7,
        sales: 345
      }
    ]
  }
};

type ProfileTab = 'posts' | 'shop';

export default function CreatorProfileScreen() {
  const { id } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState<ProfileTab>('posts');
  const [isFollowing, setIsFollowing] = useState(false);

  const creator = creatorProfiles[id as string];

  if (!creator) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <FontAwesome name="user-times" size={48} color="#E0E0E0" />
          <Text style={styles.errorTitle}>Profil non trouvé</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Retour</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const formatNumber = (num: number | string): string => {
    if (typeof num === 'string') return num;
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  const renderPost = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.postItem}
      onPress={() => router.push(`/post/${item.id}`)}
    >
      <Image source={{ uri: item.image }} style={styles.postImage} />
      <View style={styles.postOverlay}>
        <View style={styles.postStats}>
          <View style={styles.postStat}>
            <FontAwesome name="heart" size={14} color="#FFFFFF" />
            <Text style={styles.postStatText}>{formatNumber(item.likes)}</Text>
          </View>
          <View style={styles.postStat}>
            <FontAwesome name="comment" size={14} color="#FFFFFF" />
            <Text style={styles.postStatText}>{item.comments}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderShopItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.shopItem}>
      <Image source={{ uri: item.image }} style={styles.shopImage} />
      <View style={styles.shopContent}>
        <Text style={styles.shopName} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.shopPrice}>{item.price}</Text>
        <View style={styles.shopFooter}>
          <View style={styles.shopRating}>
            <FontAwesome name="star" size={12} color="#FFD700" />
            <Text style={styles.shopRatingText}>{item.rating}</Text>
          </View>
          <Text style={styles.shopSales}>{item.sales} ventes</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderContent = () => {
    if (activeTab === 'posts') {
      return (
        <FlatList
          data={creator.posts}
          renderItem={renderPost}
          keyExtractor={(item) => item.id}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.postsGrid}
        />
      );
    } else {
      return (
        <FlatList
          data={creator.shop}
          renderItem={renderShopItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.shopGrid}
          columnWrapperStyle={styles.shopRow}
        />
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backIcon} onPress={() => router.back()}>
          <FontAwesome name="arrow-left" size={24} color="#2C1810" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{creator.name}</Text>
        <TouchableOpacity style={styles.moreIcon}>
          <FontAwesome name="ellipsis-v" size={24} color="#2C1810" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Cover Image */}
        <View style={styles.coverContainer}>
          <Image source={{ uri: creator.coverImage }} style={styles.coverImage} />
        </View>

        {/* Profile Info */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: creator.avatar }} style={styles.avatar} />
          </View>
          
          <View style={styles.profileInfo}>
            <View style={styles.nameContainer}>
              <Text style={styles.name}>{creator.name}</Text>
              {creator.verified && (
                <FontAwesome name="check-circle" size={20} color="#FF8C42" />
              )}
            </View>
            <Text style={styles.handle}>{creator.handle}</Text>
            <Text style={styles.category}>{creator.category}</Text>
            
            <Text style={styles.bio}>{creator.bio}</Text>
            
            <View style={styles.metaInfo}>
              <View style={styles.metaItem}>
                <FontAwesome name="map-marker" size={14} color="#8B7355" />
                <Text style={styles.metaText}>{creator.location}</Text>
              </View>
              <View style={styles.metaItem}>
                <FontAwesome name="calendar" size={14} color="#8B7355" />
                <Text style={styles.metaText}>Rejoint en {creator.joinDate}</Text>
              </View>
            </View>

            {/* Stats */}
            <View style={styles.stats}>
              <View style={styles.stat}>
                <Text style={styles.statNumber}>{creator.postsCount}</Text>
                <Text style={styles.statLabel}>Publications</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statNumber}>{creator.followers}</Text>
                <Text style={styles.statLabel}>Abonnés</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statNumber}>{creator.following}</Text>
                <Text style={styles.statLabel}>Abonnements</Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={[styles.followButton, isFollowing && styles.followingButton]} 
                onPress={handleFollow}
              >
                <Text style={[styles.followButtonText, isFollowing && styles.followingButtonText]}>
                  {isFollowing ? 'Abonné' : 'Suivre'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.messageButton}>
                <FontAwesome name="envelope" size={16} color="#FF8C42" />
                <Text style={styles.messageButtonText}>Message</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Content Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'posts' && styles.activeTab]}
            onPress={() => setActiveTab('posts')}
          >
            <FontAwesome name="th-large" size={16} color={activeTab === 'posts' ? '#FF8C42' : '#8B7355'} />
            <Text style={[styles.tabText, activeTab === 'posts' && styles.activeTabText]}>
              Posts
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'shop' && styles.activeTab]}
            onPress={() => setActiveTab('shop')}
          >
            <FontAwesome name="shopping-bag" size={16} color={activeTab === 'shop' ? '#FF8C42' : '#8B7355'} />
            <Text style={[styles.tabText, activeTab === 'shop' && styles.activeTabText]}>
              Produits
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.contentContainer}>
          {renderContent()}
        </View>
      </ScrollView>
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
  backIcon: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C1810',
  },
  moreIcon: {
    padding: 8,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C1810',
    marginTop: 16,
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: '#FF8C42',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  coverContainer: {
    height: 200,
    backgroundColor: '#E0E0E0',
  },
  coverImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  profileSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingBottom: 24,
    marginTop: -50,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: -40,
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  profileInfo: {
    alignItems: 'center',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C1810',
    marginRight: 8,
  },
  handle: {
    fontSize: 16,
    color: '#8B7355',
    marginBottom: 4,
  },
  category: {
    fontSize: 14,
    color: '#FF8C42',
    fontWeight: '600',
    backgroundColor: '#FFF4E6',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 16,
  },
  bio: {
    fontSize: 16,
    color: '#2C1810',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 16,
  },
  metaInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  metaText: {
    fontSize: 14,
    color: '#8B7355',
    marginLeft: 8,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  stat: {
    alignItems: 'center',
    marginHorizontal: 20,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#8B7355',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  followButton: {
    backgroundColor: '#FF8C42',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 25,
    minWidth: 120,
    alignItems: 'center',
  },
  followingButton: {
    backgroundColor: '#E0E0E0',
  },
  followButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  followingButtonText: {
    color: '#8B7355',
  },
  messageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF4E6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#FF8C42',
  },
  messageButtonText: {
    color: '#FF8C42',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginTop: 8,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#FF8C42',
  },
  tabText: {
    fontSize: 16,
    color: '#8B7355',
    marginLeft: 8,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#FF8C42',
    fontWeight: '600',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  postsGrid: {
    padding: 2,
  },
  postItem: {
    width: (screenWidth - 4) / 2,
    height: (screenWidth - 4) / 2,
    margin: 1,
    position: 'relative',
  },
  postImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  postOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0,
  },
  postStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postStat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  postStatText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  shopGrid: {
    padding: 16,
  },
  shopRow: {
    justifyContent: 'space-around',
    paddingHorizontal: 0,
  },
  shopItem: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    marginBottom: 16,
    marginHorizontal: 4,
    overflow: 'hidden',
    width: (screenWidth - 40) / 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  shopImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  shopContent: {
    padding: 12,
  },
  shopName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C1810',
    marginBottom: 8,
    lineHeight: 18,
  },
  shopPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF8C42',
    marginBottom: 8,
  },
  shopFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  shopRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shopRatingText: {
    fontSize: 12,
    color: '#8B7355',
    marginLeft: 4,
    fontWeight: '500',
  },
  shopSales: {
    fontSize: 12,
    color: '#8B7355',
  },
});
