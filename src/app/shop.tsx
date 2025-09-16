import React, { useEffect, useState } from 'react';
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { computeHeaderPaddings } from '@/constants/Layout';
import { router } from 'expo-router';
import { shopProducts as fixtureProducts, shopCategories } from '@/data/fixtures/shop';
import type { ShopProductCard } from '@/data/fixtures/shop';
import { productsUseCases } from '@/data/container';

const { width: screenWidth } = Dimensions.get('window');

// Use fixtures for initial categories
const categories = shopCategories;

export default function ShopScreen() {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [likedProducts, setLikedProducts] = useState<string[]>(['p2', 'p5', 'p8']);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [products, setProducts] = useState<ShopProductCard[]>(fixtureProducts);
  const centsToLabel = (cents: number, currency: string) => {
    const euros = (cents / 100).toFixed(2).replace('.', ',');
    return `${euros}€`;
  };

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const list = await productsUseCases.list();
        if (!isMounted) return;
        if (!list || list.length === 0) {
          setProducts(fixtureProducts);
          return;
        }
        const mapped: ShopProductCard[] = list.map((p) => ({
          id: p.id,
          name: p.name,
          price: centsToLabel(p.priceCents, p.currency),
          ...(p.originalPriceCents
            ? { originalPrice: centsToLabel(p.originalPriceCents, p.currency) }
            : {}),
          image: p.imageUrls?.[0] ?? fixtureProducts.find((fp) => fp.id === p.id)?.image ?? '',
          seller: p.sellerName,
          category: p.category ?? 'Autre',
          rating: p.rating ?? 0,
          sales: p.sales ?? 0,
          liked: false,
          description: p.description ?? '',
        }));
        setProducts(mapped);
      } catch (_e) {
        // fallback to fixtures on any error
        if (isMounted) setProducts(fixtureProducts);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const filterProducts = () => {
    let filtered = products;

    // Filter by category
    if (activeCategory !== 'all') {
      filtered = filtered.filter((product) => product.category === activeCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.seller.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query),
      );
    }

    return filtered;
  };

  const toggleLike = (productId: string) => {
    setLikedProducts((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId],
    );
  };

  const renderProduct = ({ item }: { item: any }) => {
    if (viewMode === 'list') {
      return (
        <TouchableOpacity
          style={styles.listProductCard}
          onPress={() => router.push(`/product/${item.id}`)}
        >
          <View style={styles.listImageContainer}>
            <Image source={{ uri: item.image }} style={styles.listProductImage} />
            {item.originalPrice && (
              <View style={styles.listDiscountBadge}>
                <Text style={styles.listDiscountText}>30 € ↓</Text>
              </View>
            )}
          </View>

          <View style={styles.listProductInfo}>
            <Text style={styles.listProductName}>{item.name}</Text>
            <View style={styles.listSellerRow}>
              <FontAwesome name="circle" size={8} color="#FF8C42" />
              <Text style={styles.listSellerName}>{item.seller}</Text>
            </View>
            <Text style={styles.listProductDescription} numberOfLines={1}>
              Sold by {item.seller}
            </Text>
            <View style={styles.listPriceRow}>
              <Text style={styles.listCurrentPrice}>{item.price}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.listLikeButton}
            onPress={(e) => {
              e.stopPropagation();
              toggleLike(item.id);
            }}
          >
            <FontAwesome
              name={likedProducts.includes(item.id) ? 'heart' : 'heart-o'}
              size={18}
              color={likedProducts.includes(item.id) ? '#FF4444' : '#8B7355'}
            />
          </TouchableOpacity>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        style={styles.productCard}
        onPress={() => router.push(`/product/${item.id}`)}
      >
        <View style={styles.productImageContainer}>
          <Image source={{ uri: item.image }} style={styles.productImage} />
          <TouchableOpacity
            style={styles.likeButton}
            onPress={(e) => {
              e.stopPropagation();
              toggleLike(item.id);
            }}
          >
            <FontAwesome
              name={likedProducts.includes(item.id) ? 'heart' : 'heart-o'}
              size={16}
              color={likedProducts.includes(item.id) ? '#FF4444' : '#8B7355'}
            />
          </TouchableOpacity>
          {item.originalPrice && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>30 € ↓</Text>
            </View>
          )}
        </View>

        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={2}>
            {item.name}
          </Text>
          <View style={styles.sellerContainer}>
            <FontAwesome name="circle" size={8} color="#FF8C42" />
            <Text style={styles.sellerName}>{item.seller}</Text>
          </View>
          <Text style={styles.productDescription} numberOfLines={2}>
            Sold by {item.seller}
          </Text>

          <View style={styles.productFooter}>
            <View style={styles.priceContainer}>
              <Text style={styles.currentPrice}>{item.price}</Text>
              {item.originalPrice && <Text style={styles.originalPrice}>{item.originalPrice}</Text>}
            </View>
            <View style={styles.ratingContainer}>
              <FontAwesome name="star" size={12} color="#FFD700" />
              <Text style={styles.ratingText}>{item.rating}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderCategory = (category: any) => (
    <TouchableOpacity
      key={category.id}
      style={[styles.categoryTab, activeCategory === category.id && styles.activeCategoryTab]}
      onPress={() => setActiveCategory(category.id)}
    >
      <FontAwesome
        name={category.icon}
        size={16}
        color={activeCategory === category.id ? '#FF8C42' : '#8B7355'}
      />
      <Text
        style={[styles.categoryText, activeCategory === category.id && styles.activeCategoryText]}
      >
        {category.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={[styles.header, computeHeaderPaddings(insets)]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <FontAwesome name="arrow-left" size={24} color="#2C1810" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Shop</Text>
        <TouchableOpacity
          style={styles.viewModeButton}
          onPress={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
        >
          <FontAwesome name={viewMode === 'grid' ? 'list' : 'th'} size={20} color="#2C1810" />
        </TouchableOpacity>
      </View>

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

      {/* Category Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {categories.map(renderCategory)}
      </ScrollView>

      {/* Products Grid */}
      <FlatList
        data={filterProducts()}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        numColumns={viewMode === 'grid' ? 2 : 1}
        key={viewMode} // Force re-render when view mode changes
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.productsContainer,
          viewMode === 'list' && styles.listProductsContainer,
        ]}
        columnWrapperStyle={viewMode === 'grid' ? styles.productRow : undefined}
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
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C1810',
  },
  viewModeButton: {
    padding: 8,
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
  categoriesContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  categoriesContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  categoryTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  activeCategoryTab: {
    backgroundColor: '#FFF4E6',
    borderColor: '#FF8C42',
  },
  categoryText: {
    fontSize: 14,
    color: '#8B7355',
    marginLeft: 8,
    fontWeight: '500',
  },
  activeCategoryText: {
    color: '#FF8C42',
    fontWeight: '600',
  },
  productsContainer: {
    padding: 16,
  },
  productRow: {
    justifyContent: 'space-around',
    paddingHorizontal: 0,
  },
  productCard: {
    backgroundColor: '#FFFFFF',
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
  productImageContainer: {
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: 120,
    resizeMode: 'contain',
    backgroundColor: '#F8F8F8',
  },
  likeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#FF4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 4,
    lineHeight: 20,
  },
  sellerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  sellerName: {
    fontSize: 12,
    color: '#FF8C42',
    marginLeft: 4,
    fontWeight: '500',
  },
  productDescription: {
    fontSize: 12,
    color: '#8B7355',
    lineHeight: 16,
    marginBottom: 8,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF8C42',
  },
  originalPrice: {
    fontSize: 12,
    color: '#8B7355',
    textDecorationLine: 'line-through',
    marginLeft: 6,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    color: '#8B7355',
    marginLeft: 4,
    fontWeight: '500',
  },
  // List view styles
  listProductsContainer: {
    padding: 8,
  },
  listProductCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 8,
    marginVertical: 4,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  listImageContainer: {
    position: 'relative',
    marginRight: 12,
  },
  listProductImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  listDiscountBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#FF8C42',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    minWidth: 40,
    alignItems: 'center',
  },
  listDiscountText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  listProductInfo: {
    flex: 1,
    paddingRight: 8,
  },
  listProductName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C1810',
    marginBottom: 4,
  },
  listSellerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  listSellerName: {
    fontSize: 12,
    color: '#FF8C42',
    marginLeft: 6,
    fontWeight: '500',
  },
  listProductDescription: {
    fontSize: 12,
    color: '#8B7355',
    marginBottom: 4,
  },
  listPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listCurrentPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C1810',
  },
  listLikeButton: {
    padding: 8,
  },
});
