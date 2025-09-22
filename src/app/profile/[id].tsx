import React, { useState } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { computeHeaderPaddings, HEADER_HORIZONTAL_PADDING } from '@/constants/Layout';
import { FontAwesome } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import { useAuthStore } from '@/store/auth.store';
import { profilesUseCases } from '@/data/container';
import { creatorProfiles } from '@/data/fixtures/creators';
import { useProfile } from '@/hooks/useProfile';

const { width: screenWidth } = Dimensions.get('window');

// Fixtures import above

type ProfileTab = 'posts' | 'shop';

export default function CreatorProfileScreen() {
  const { id } = useLocalSearchParams();
  const currentUserId = useAuthStore((s) => s.user?.id);
  const routeId = (id ? String(id) : (currentUserId ?? 'c1')) as string;
  const isOwnProfile = !id || routeId === currentUserId;
  const [activeTab, setActiveTab] = useState<ProfileTab>('posts');
  const [isFollowing, setIsFollowing] = useState(false);
  const insets = useSafeAreaInsets();

  const creator = creatorProfiles[routeId as keyof typeof creatorProfiles];

  if (!creator) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <FontAwesome name="user-times" size={48} color="#E0E0E0" />
          <Text style={styles.errorTitle}>Profile not found</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Retour</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const initialFollowers = creator?.followers
    ? ((): number => {
        const trimmed = creator.followers.trim().toLowerCase();
        if (trimmed.endsWith('k')) {
          const n = parseFloat(trimmed.replace('k', ''));
          return Math.round(n * 1000);
        }
        return parseInt(trimmed.replace(/[^0-9]/g, ''), 10) || 0;
      })()
    : null;

  const { followersCount, isLoading, onFollowChange } = useProfile(routeId, initialFollowers);

  const parseCount = (val: string): number => {
    const trimmed = val.trim().toLowerCase();
    if (trimmed.endsWith('k')) {
      const n = parseFloat(trimmed.replace('k', ''));
      return Math.round(n * 1000);
    }
    return parseInt(trimmed.replace(/[^0-9]/g, ''), 10) || 0;
  };

  const formatCount = (num: number): string => {
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return String(num);
  };

  const formatNumber = (num: number | string): string => {
    if (typeof num === 'string') return num;
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  const handleFollow = () => {
    const wasFollowing = isFollowing;
    setIsFollowing(!wasFollowing);
    onFollowChange(wasFollowing);
  };

  const renderPost = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.postItem} onPress={() => router.push(`/post/${item.id}`)}>
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
    <TouchableOpacity style={styles.shopItem} onPress={() => router.push(`/product/${item.id}`)}>
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

  const listData = activeTab === 'posts' ? creator.posts : creator.shop;
  const listRenderItem = activeTab === 'posts' ? renderPost : renderShopItem;
  const listContentContainerStyle = activeTab === 'posts' ? styles.postsGrid : styles.shopGrid;
  const listColumnWrapperStyle = activeTab === 'posts' ? undefined : styles.shopRow;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header (hidden when shown inside myprofile tab which has its own header) */}
      {!isOwnProfile && (
        <View style={[styles.header, computeHeaderPaddings(insets)]}>
          <TouchableOpacity
            style={styles.backIcon}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            onPress={() => router.back()}
          >
            <FontAwesome name="arrow-left" size={24} color="#2C1810" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{creator.name}</Text>
          <TouchableOpacity style={styles.moreIcon}>
            <FontAwesome name="ellipsis-v" size={24} color="#2C1810" />
          </TouchableOpacity>
        </View>
      )}
      <FlatList
        key={activeTab}
        data={listData}
        renderItem={listRenderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[listContentContainerStyle, { paddingBottom: Math.max(insets.bottom, 8) + 8 }]}
        columnWrapperStyle={listColumnWrapperStyle}
        style={styles.contentContainer}
        ListHeaderComponent={
          <View>
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
                    <Text style={styles.statNumber}>
                      {followersCount !== null ? formatCount(followersCount) : creator.followers}
                    </Text>
                    <Text style={styles.statLabel}>Abonnés</Text>
                  </View>
                  <View style={styles.stat}>
                    <Text style={styles.statNumber}>{creator.following}</Text>
                    <Text style={styles.statLabel}>Abonnements</Text>
                  </View>
                </View>

                {/* Action Buttons (hidden on myprofile) */}
                {!isOwnProfile && (
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
                )}
              </View>
            </View>

            {/* Content Tabs */}
            <View style={styles.tabsContainer}>
              <TouchableOpacity
                style={[styles.tab, activeTab === 'posts' && styles.activeTab]}
                onPress={() => setActiveTab('posts')}
              >
                <FontAwesome
                  name="th-large"
                  size={16}
                  color={activeTab === 'posts' ? '#FF8C42' : '#8B7355'}
                />
                <Text style={[styles.tabText, activeTab === 'posts' && styles.activeTabText]}>
                  Posts
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, activeTab === 'shop' && styles.activeTab]}
                onPress={() => setActiveTab('shop')}
              >
                <FontAwesome
                  name="shopping-bag"
                  size={16}
                  color={activeTab === 'shop' ? '#FF8C42' : '#8B7355'}
                />
                <Text style={[styles.tabText, activeTab === 'shop' && styles.activeTabText]}>
                  Products
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        }
        ListFooterComponent={<View style={{ height: Math.max(insets.bottom, 8) }} />}
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
    paddingHorizontal: 12,
    paddingVertical: 8,
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
