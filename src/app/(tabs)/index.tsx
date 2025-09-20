import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  FlatList,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Animated,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import Post from '@/components/specific/Post';
import { postsUseCases } from '@/data/container';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Dimensions } from 'react-native';
import { computeHeaderPaddings } from '@/constants/Layout';

type UIFeedPost = {
  id: string;
  user: { id?: string; name: string; handle: string; avatar: string };
  content: string;
  image?: string | undefined;
  likes: number;
  comments: number;
  shares: number;
  timestamp: string;
  price?: string | undefined;
};

type FeedType = 'following' | 'explorer';

export default function HomeScreen() {
  const [activeFeed, setActiveFeed] = useState<FeedType>('following');
  const insets = useSafeAreaInsets();
  const isSmallScreen = Dimensions.get('window').height < 700;
  const [following, setFollowing] = useState<UIFeedPost[]>([]);
  const [explore, setExplore] = useState<UIFeedPost[]>([]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const list = await postsUseCases.list();
        if (!alive) return;
        const mapped: UIFeedPost[] = (list || []).map((p: any) => ({
          id: p.id,
          user: {
            id: p.author?.id,
            name: p.author?.name ?? 'User',
            handle: p.author?.username ?? '@user',
            avatar: p.author?.avatar ?? '',
          },
          content: p.content ?? '',
          image: (p.imageUrls && p.imageUrls.length > 0 ? p.imageUrls[0] : undefined) as string | undefined,
          likes: p.likesCount ?? 0,
          comments: p.commentsCount ?? 0,
          shares: 0,
          timestamp: '1h',
          price: undefined,
        }));
        setFollowing(mapped);
        setExplore(mapped.slice().reverse());
      } catch {
        setFollowing([]);
        setExplore([]);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const handleFeedSwitch = (feedType: FeedType) => {
    if (feedType !== activeFeed) {
      setActiveFeed(feedType);
    }
  };
  const renderPost = ({ item }: { item: any }) => <Post post={item} />;

  const renderHeader = () => (
    <View
      style={[
        styles.header,
        computeHeaderPaddings(insets),
        { justifyContent: 'center', alignItems: 'center' },
      ]}
    >
      <Text
        style={[
          styles.logo,
          {
            fontSize: isSmallScreen ? 20 : 24,
            letterSpacing: isSmallScreen ? 0.5 : 1,
            marginTop: 2,
          },
        ]}
      >
        DÖM
      </Text>
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
          Following
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, activeFeed === 'explorer' && styles.activeTab]}
        onPress={() => handleFeedSwitch('explorer')}
        activeOpacity={0.7}
      >
        <Text style={[styles.tabText, activeFeed === 'explorer' && styles.activeTabText]}>
          Explore
        </Text>
      </TouchableOpacity>
    </View>
  );

  const getCurrentFeedData = () => (activeFeed === 'following' ? following : explore);

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
        contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 8) + 8 }}
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
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 6,
  },
  headerCenter: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  menuButton: {
    padding: 8,
  },
  logo: {
    fontWeight: 'bold',
    color: '#2C1810',
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
    justifyContent: 'center',
  },
  tab: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginHorizontal: 10,
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
