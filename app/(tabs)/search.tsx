import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';

const { width: screenWidth } = Dimensions.get('window');

// Sample data
const sampleCreators = [
  {
    id: 'c1',
    name: 'Marie Dubois',
    handle: '@mariedubois',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    followers: '12.5k',
    verified: true,
    category: 'Lifestyle',
  },
  {
    id: 'c2',
    name: 'Chef Antoine',
    handle: '@chefantoine',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face',
    followers: '8.9k',
    verified: false,
    category: 'Cuisine',
  },
  {
    id: 'c3',
    name: 'Travel Explorer',
    handle: '@travelexplorer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    followers: '25.1k',
    verified: true,
    category: 'Voyage',
  },
  {
    id: 'c4',
    name: 'Tech Guru',
    handle: '@techguru',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    followers: '15.7k',
    verified: true,
    category: 'Technologie',
  },
];

const samplePosts = [
  {
    id: 'p1',
    user: {
      name: 'Art Studio',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    },
    content: 'Nouvelle œuvre terminée ! Peinture à l\'huile inspirée des couchers de soleil méditerranéens 🎨',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop',
    likes: 1800,
    comments: 67,
  },
  {
    id: 'p2',
    user: {
      name: 'Food Lover',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    },
    content: 'Recette du jour : Tarte aux pommes traditionnelle française 🥧',
    image: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=300&h=200&fit=crop',
    likes: 2400,
    comments: 89,
  },
  {
    id: 'p3',
    user: {
      name: 'Fitness Coach',
      avatar: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop&crop=face',
    },
    content: 'Séance du matin terminée ! 45 minutes d\'entraînement intense 💪',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop',
    likes: 920,
    comments: 43,
  },
];

const sampleShop = [
  {
    id: 'p1',
    name: 'T-shirt coutumain',
    price: '30 €',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop',
    seller: 'Marin',
    rating: 4.8,
    category: 'Poterie',
  },
  {
    id: 'p2',
    name: 'Vase en céramique',
    price: '45 €',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop',
    seller: 'Art Studio',
    rating: 4.9,
    category: 'Poterie',
  },
  {
    id: 'p3',
    name: 'Livre de recettes',
    price: '25 €',
    image: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=200&h=200&fit=crop',
    seller: 'Chef Antoine',
    rating: 4.7,
    category: 'Livre Image',
  },
  {
    id: 'p4',
    name: 'Carte postale vintage',
    price: '5 €',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop',
    seller: 'Travel Explorer',
    rating: 4.6,
    category: 'Carte custom',
  },
];

type SearchTab = 'creators' | 'posts' | 'shop';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<SearchTab>('creators');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchInputRef = useRef<TextInput>(null);

  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  const filterData = (data: any[], query: string) => {
    if (!query.trim()) return data;
    return data.filter(item => {
      const searchText = query.toLowerCase();
      return (
        item.name?.toLowerCase().includes(searchText) ||
        item.handle?.toLowerCase().includes(searchText) ||
        item.category?.toLowerCase().includes(searchText) ||
        item.content?.toLowerCase().includes(searchText) ||
        item.seller?.toLowerCase().includes(searchText)
      );
    });
  };

  const renderCreator = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.creatorCard}
      onPress={() => router.push(`/profile/${item.id}`)}
    >
      <Image source={{ uri: item.avatar }} style={styles.creatorAvatar} />
      <View style={styles.creatorInfo}>
        <View style={styles.creatorHeader}>
          <Text style={styles.creatorName}>{item.name}</Text>
          {item.verified && (
            <FontAwesome name="check-circle" size={16} color="#FF8C42" />
          )}
        </View>
        <Text style={styles.creatorHandle}>{item.handle}</Text>
        <Text style={styles.creatorCategory}>{item.category}</Text>
        <Text style={styles.creatorFollowers}>{item.followers} abonnés</Text>
      </View>
      <TouchableOpacity style={styles.followButton}>
        <Text style={styles.followButtonText}>Suivre</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderPost = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.postCard}
      onPress={() => router.push(`/post/${item.id}`)}
    >
      <Image source={{ uri: item.image }} style={styles.postImage} />
      <View style={styles.postContent}>
        <View style={styles.postHeader}>
          <Image source={{ uri: item.user.avatar }} style={styles.postAvatar} />
          <Text style={styles.postUserName}>{item.user.name}</Text>
        </View>
        <Text style={styles.postText} numberOfLines={2}>
          {item.content}
        </Text>
        <View style={styles.postStats}>
          <View style={styles.postStat}>
            <FontAwesome name="heart" size={14} color="#FF8C42" />
            <Text style={styles.postStatText}>{formatNumber(item.likes)}</Text>
          </View>
          <View style={styles.postStat}>
            <FontAwesome name="comment" size={14} color="#8B7355" />
            <Text style={styles.postStatText}>{item.comments}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderShopItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.shopCard}
      onPress={() => router.push(`/product/${item.id}`)}
    >
      <Image source={{ uri: item.image }} style={styles.shopImage} />
      <View style={styles.shopContent}>
        <Text style={styles.shopName} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.shopSeller}>{item.seller}</Text>
        <View style={styles.shopFooter}>
          <Text style={styles.shopPrice}>{item.price}</Text>
          <View style={styles.shopRating}>
            <FontAwesome name="star" size={12} color="#FFD700" />
            <Text style={styles.shopRatingText}>{item.rating}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderSearchResults = () => {
    let data = [];
    let renderItem = () => null;
    let numColumns = 1;

    switch (activeTab) {
      case 'creators':
        data = filterData(sampleCreators, searchQuery);
        renderItem = renderCreator;
        break;
      case 'posts':
        data = filterData(samplePosts, searchQuery);
        renderItem = renderPost;
        break;
      case 'shop':
        data = filterData(sampleShop, searchQuery);
        renderItem = renderShopItem;
        numColumns = 2;
        break;
    }

    if (data.length === 0) {
      return (
        <View style={styles.emptyState}>
          <FontAwesome name="search" size={48} color="#E0E0E0" />
          <Text style={styles.emptyStateTitle}>Aucun résultat</Text>
          <Text style={styles.emptyStateText}>
            {searchQuery 
              ? `Aucun résultat pour "${searchQuery}"` 
              : `Recherchez des ${activeTab === 'creators' ? 'créateurs' : activeTab === 'posts' ? 'publications' : 'produits'}`
            }
          </Text>
        </View>
      );
    }

    return (
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.resultsContainer}
        key={`${activeTab}-${numColumns}`} // Force re-render when changing tabs
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Search Header */}
      <View style={styles.searchHeader}>
        <View style={[styles.searchBar, isSearchFocused && styles.searchBarFocused]}>
          <FontAwesome name="search" size={18} color="#8B7355" />
          <TextInput
            ref={searchInputRef}
            style={styles.searchInput}
            placeholder="Rechercher..."
            placeholderTextColor="#8B7355"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <FontAwesome name="times-circle" size={18} color="#8B7355" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Search Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'creators' && styles.activeTab]}
            onPress={() => setActiveTab('creators')}
          >
            <FontAwesome name="users" size={16} color={activeTab === 'creators' ? '#FF8C42' : '#8B7355'} />
            <Text style={[styles.tabText, activeTab === 'creators' && styles.activeTabText]}>
              Créateurs
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'posts' && styles.activeTab]}
            onPress={() => setActiveTab('posts')}
          >
            <FontAwesome name="file-text" size={16} color={activeTab === 'posts' ? '#FF8C42' : '#8B7355'} />
            <Text style={[styles.tabText, activeTab === 'posts' && styles.activeTabText]}>
              Publications
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'shop' && styles.activeTab]}
            onPress={() => setActiveTab('shop')}
          >
            <FontAwesome name="shopping-bag" size={16} color={activeTab === 'shop' ? '#FF8C42' : '#8B7355'} />
            <Text style={[styles.tabText, activeTab === 'shop' && styles.activeTabText]}>
              Boutique
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Search Results */}
      <View style={styles.resultsSection}>
        {renderSearchResults()}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  searchHeader: {
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
    borderWidth: 1,
    borderColor: 'transparent',
  },
  searchBarFocused: {
    borderColor: '#FF8C42',
    backgroundColor: '#FFFFFF',
    shadowColor: '#FF8C42',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#2C1810',
    marginLeft: 12,
    marginRight: 8,
  },
  tabsContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tabs: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginRight: 16,
    borderRadius: 25,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  activeTab: {
    backgroundColor: '#FFF4E6',
    borderColor: '#FF8C42',
  },
  tabText: {
    fontSize: 14,
    color: '#8B7355',
    marginLeft: 8,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#FF8C42',
    fontWeight: '600',
  },
  resultsSection: {
    flex: 1,
  },
  resultsContainer: {
    padding: 16,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C1810',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#8B7355',
    textAlign: 'center',
    lineHeight: 24,
  },
  // Creator Card Styles
  creatorCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  creatorAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  creatorInfo: {
    flex: 1,
  },
  creatorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  creatorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C1810',
    marginRight: 8,
  },
  creatorHandle: {
    fontSize: 14,
    color: '#8B7355',
    marginBottom: 4,
  },
  creatorCategory: {
    fontSize: 14,
    color: '#FF8C42',
    fontWeight: '500',
    marginBottom: 4,
  },
  creatorFollowers: {
    fontSize: 14,
    color: '#8B7355',
  },
  followButton: {
    backgroundColor: '#FF8C42',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'center',
  },
  followButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  // Post Card Styles
  postCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  postImage: {
    width: '100%',
    height: 160,
    resizeMode: 'contain',
    backgroundColor: '#F8F8F8',
  },
  postContent: {
    padding: 16,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  postAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  postUserName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C1810',
  },
  postText: {
    fontSize: 16,
    color: '#2C1810',
    lineHeight: 22,
    marginBottom: 12,
  },
  postStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postStat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  postStatText: {
    fontSize: 14,
    color: '#8B7355',
    marginLeft: 6,
    fontWeight: '500',
  },
  // Shop Card Styles
  shopCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
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
    height: 100,
    resizeMode: 'contain',
    backgroundColor: '#F8F8F8',
  },
  shopContent: {
    padding: 12,
  },
  shopName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C1810',
    marginBottom: 4,
    lineHeight: 18,
  },
  shopSeller: {
    fontSize: 12,
    color: '#8B7355',
    marginBottom: 8,
  },
  shopFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  shopPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF8C42',
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
});
