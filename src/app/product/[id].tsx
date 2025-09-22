import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  Alert,
  Modal,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { computeHeaderPaddings } from '@/constants/Layout';
import { useLocalSearchParams, router } from 'expo-router';
import { useProduct } from '@/hooks/useProduct';
import { productDetails } from '@/data/fixtures/products';
import * as MediaLibrary from 'expo-media-library';

const { width: screenWidth } = Dimensions.get('window');

export default function ProductDetailScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams();
  const { product } = useProduct(id ? String(id) : undefined);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef<ScrollView>(null);
  const [viewerUri, setViewerUri] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  const fixture = productDetails[id as keyof typeof productDetails];
  const uiProduct = fixture; // keep UI using fixture structure for now
  const images = (product?.imageUrls && product.imageUrls.length > 0)
    ? product.imageUrls
    : (uiProduct?.image ? [uiProduct.image] : []);

  const centsToLabel = (cents: number, currency: string) => {
    const euros = (cents / 100).toFixed(2).replace('.', ',');
    return `${euros}€`;
  };

  const displayName = product?.name ?? uiProduct?.name ?? '';
  const displayPrice = product?.priceCents && product.currency
    ? centsToLabel(product.priceCents, product.currency)
    : uiProduct?.price ?? '';

  useEffect(() => {
    if (uiProduct) {
      setSelectedColor(uiProduct.colors[0] ?? '');
      setSelectedSize(uiProduct.sizes[0] ?? '');
    }
  }, [uiProduct]);

  const incrementQuantity = () => setQuantity((q) => Math.min(q + 1, 99));
  const decrementQuantity = () => setQuantity((q) => Math.max(1, q - 1));

  if (!uiProduct) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <FontAwesome name="arrow-left" size={24} color="#2C1810" />
          </TouchableOpacity>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Product not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleAddToCart = () => {
    Alert.alert(
      '🛒 Added to cart',
      `${displayName} x${quantity} (${selectedColor}, ${selectedSize}) has been added to your cart successfully!`,
      [
        { text: 'Continue shopping', style: 'cancel' },
        { text: 'View cart', onPress: () => console.log('Navigate to cart') },
      ],
    );
  };

  const handlePurchase = () => {
    Alert.alert(
      '💳 Confirm purchase',
      `Buy: ${displayName}\nColor: ${selectedColor}\nSize: ${selectedSize}\nPrice: ${displayPrice}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Proceed to payment',
          onPress: () => Alert.alert('✅ Success', 'Order placed successfully!'),
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={[styles.header, computeHeaderPaddings(insets)]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <FontAwesome name="arrow-left" size={24} color="#2C1810" />
        </TouchableOpacity>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.headerIcon}>
            <FontAwesome name="search" size={24} color="#2C1810" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIcon}>
            <FontAwesome name="share" size={24} color="#2C1810" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIcon}>
            <FontAwesome name="shopping-cart" size={24} color="#2C1810" />
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>1</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIcon}>
            <FontAwesome name="ellipsis-h" size={24} color="#2C1810" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Product Image Carousel with thumbnails */}
        <View style={styles.imageContainer}>
          <ScrollView
            ref={carouselRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => {
              const index = Math.round(
                e.nativeEvent.contentOffset.x / screenWidth,
              );
              setActiveIndex(index);
            }}
          >
            {images.map((uri, index) => (
              <TouchableOpacity key={index} activeOpacity={0.9} onPress={() => setViewerUri(uri)}>
                <Image source={{ uri }} style={styles.carouselImage} />
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Dots indicator */}
          {images.length > 1 && (
            <View style={styles.dotsContainer}>
              {images.map((_, i) => (
                <View
                  key={i}
                  style={[styles.dot, i === activeIndex && styles.dotActive]}
                />
              ))}
            </View>
          )}

          {/* Image thumbnails */}
          {images.length > 1 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.thumbnailContainer}
              contentContainerStyle={styles.thumbnailContent}
            >
              {images.map((uri, i) => (
                <TouchableOpacity
                  key={i}
                  style={[styles.thumbnail, i === activeIndex && styles.activeThumbnail]}
                  onPress={() => {
                    setActiveIndex(i);
                    carouselRef.current?.scrollTo({ x: i * screenWidth, animated: true });
                  }}
                >
                  <Image source={{ uri }} style={styles.thumbnailImage} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          <TouchableOpacity
            style={styles.bookmarkButton}
            onPress={() => setIsBookmarked(!isBookmarked)}
          >
            <FontAwesome
              name={isBookmarked ? 'bookmark' : 'bookmark-o'}
              size={24}
              color={isBookmarked ? '#FF8C42' : '#8B7355'}
            />
          </TouchableOpacity>
        </View>

        {/* Product Info */}
        <View style={styles.productInfo}>
          <View style={styles.sellerInfoTop}>
            <FontAwesome name="user-circle" size={16} color="#FF8C42" />
            <Text style={styles.sellerNameTop}>Sold by {uiProduct.seller}</Text>
            <View style={styles.userIcon}>
              <FontAwesome name="user" size={12} color="#FFFFFF" />
            </View>
          </View>

          <Text style={styles.productNameLarge}>{displayName.toUpperCase()}</Text>
          <Text style={styles.productDescriptionLarge}>{uiProduct.description}</Text>

          <View style={styles.priceSection}>
            <Text style={styles.currentPriceLarge}>{displayPrice}</Text>
            <TouchableOpacity
              style={styles.bookmarkIcon}
              onPress={() => setIsBookmarked(!isBookmarked)}
            >
              <FontAwesome
                name={isBookmarked ? 'bookmark' : 'bookmark-o'}
                size={24}
                color={isBookmarked ? '#FF8C42' : '#8B7355'}
              />
            </TouchableOpacity>
          </View>

          {/* Color Selection */}
          <View style={styles.optionSection}>
            <Text style={styles.optionTitle}>Color: {selectedColor}</Text>
            <View style={styles.optionButtons}>
              {uiProduct.colors.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.optionButton,
                    selectedColor === color && styles.selectedOptionButton,
                  ]}
                  onPress={() => setSelectedColor(color)}
                >
                  <Text
                    style={[
                      styles.optionButtonText,
                      selectedColor === color && styles.selectedOptionButtonText,
                    ]}
                  >
                    {color}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Size Selection */}
          <View style={styles.optionSection}>
            <Text style={styles.optionTitle}>Size: {selectedSize}</Text>
            <View style={styles.optionButtons}>
              {uiProduct.sizes.map((size) => (
                <TouchableOpacity
                  key={size}
                  style={[
                    styles.optionButton,
                    selectedSize === size && styles.selectedOptionButton,
                  ]}
                  onPress={() => setSelectedSize(size)}
                >
                  <Text
                    style={[
                      styles.optionButtonText,
                      selectedSize === size && styles.selectedOptionButtonText,
                    ]}
                  >
                    {size}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Quantity Selection */}
          <View style={styles.quantitySection}>
            <Text style={styles.quantityTitle}>Quantity</Text>
            <View style={styles.quantityContainer}>
              <TouchableOpacity style={styles.quantityButton} onPress={decrementQuantity}>
                <FontAwesome name="minus" size={12} color="#8B7355" />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity style={styles.quantityButton} onPress={incrementQuantity}>
                <FontAwesome name="plus" size={12} color="#8B7355" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Features */}
          <View style={styles.featuresSection}>
            <Text style={styles.featuresTitle}>Features:</Text>
            {uiProduct.features.map((feature, index) => (
              <Text key={index} style={styles.featureItem}>
                • {feature}
              </Text>
            ))}
          </View>

          {/* Seller Info */}
          <View style={styles.sellerSection}>
            <FontAwesome name="user-circle" size={16} color="#FF8C42" />
            <Text style={styles.sellerText}>Sold by {uiProduct.seller}</Text>
            <View style={styles.ratingContainer}>
              <FontAwesome name="star" size={12} color="#FFD700" />
              <Text style={styles.ratingText}>{uiProduct.rating}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
          <Text style={styles.addToCartText}>Add to cart</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buyButton} onPress={handlePurchase}>
          <Text style={styles.buyButtonText}>Buy</Text>
        </TouchableOpacity>
      </View>
      {/* Image Viewer */}
      <Modal visible={!!viewerUri} transparent animationType="fade" onRequestClose={() => setViewerUri(null)}>
        <View style={styles.viewerBackdrop}>
          {viewerUri && (
            <>
              <Image source={{ uri: viewerUri }} style={styles.viewerImage} resizeMode="contain" />
              <View style={[styles.viewerTopBar, { paddingTop: Math.max(insets.top, 10) }]}>
                <TouchableOpacity style={styles.viewerTopBtn} onPress={() => setViewerUri(null)} accessibilityLabel="Fermer">
                  <FontAwesome name="close" size={22} color="#FFFFFF" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.viewerTopBtn} onPress={async () => {
                  try {
                    const perm = await MediaLibrary.requestPermissionsAsync();
                    if (!perm.granted) {
                      Alert.alert('Permission requise', "Autorisez l'accès à la galerie pour enregistrer l'image.");
                      return;
                    }
                    await MediaLibrary.saveToLibraryAsync(viewerUri);
                    Alert.alert('Enregistrée', "L'image a été enregistrée dans votre galerie.");
                  } catch {
                    Alert.alert('Erreur', "Impossible d'enregistrer l'image.");
                  }
                }} accessibilityLabel="Télécharger">
                  <FontAwesome name="download" size={22} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    marginLeft: 20,
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FF4444',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
    backgroundColor: '#F8F8F8',
  },
  productImage: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    backgroundColor: '#F8F8F8',
  },
  carouselImage: {
    width: screenWidth,
    height: 280,
    resizeMode: 'cover',
    backgroundColor: '#F8F8F8',
  },
  thumbnailContainer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 80,
  },
  thumbnailContent: {
    paddingRight: 16,
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  activeThumbnail: {
    borderColor: '#FF8C42',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    borderRadius: 6,
    resizeMode: 'cover',
  },
  bookmarkButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 24,
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotsContainer: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(0,0,0,0.2)',
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: '#FF8C42',
  },
  viewerBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewerImage: {
    width: '92%',
    height: '80%',
  },
  viewerTopBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 12,
    paddingBottom: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  viewerTopBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  welcomeBanner: {
    backgroundColor: 'rgba(255, 140, 66, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  welcomeText: {
    color: '#FF8C42',
    fontSize: 16,
    fontWeight: '600',
  },
  productInfo: {
    padding: 16,
  },
  sellerInfoTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sellerNameTop: {
    fontSize: 14,
    color: '#FF8C42',
    marginLeft: 8,
    fontWeight: '500',
    flex: 1,
  },
  userIcon: {
    backgroundColor: '#8B7355',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productNameLarge: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 8,
    letterSpacing: 1,
  },
  productDescriptionLarge: {
    fontSize: 14,
    color: '#6B4E3D',
    lineHeight: 20,
    marginBottom: 16,
  },
  priceSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  currentPriceLarge: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C1810',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  currentPrice: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C1810',
  },
  bookmarkIcon: {
    padding: 8,
  },
  taxInfo: {
    fontSize: 14,
    color: '#8B7355',
    marginBottom: 4,
  },
  discount: {
    fontSize: 16,
    color: '#FF4444',
    fontWeight: '600',
    marginBottom: 16,
  },
  productName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 8,
  },
  productDescription: {
    fontSize: 16,
    color: '#6B4E3D',
    lineHeight: 24,
    marginBottom: 24,
  },
  optionSection: {
    marginBottom: 24,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C1810',
    marginBottom: 12,
  },
  optionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginRight: 12,
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
  },
  selectedOptionButton: {
    borderColor: '#FF8C42',
    backgroundColor: '#FFF4E6',
  },
  optionButtonText: {
    fontSize: 14,
    color: '#8B7355',
    fontWeight: '500',
  },
  selectedOptionButtonText: {
    color: '#FF8C42',
    fontWeight: '600',
  },
  featuresSection: {
    marginBottom: 24,
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C1810',
    marginBottom: 12,
  },
  featureItem: {
    fontSize: 14,
    color: '#6B4E3D',
    marginBottom: 4,
    lineHeight: 20,
  },
  sellerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  sellerText: {
    fontSize: 14,
    color: '#FF8C42',
    marginLeft: 8,
    fontWeight: '500',
    flex: 1,
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
  bottomBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  addToCartButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
    marginRight: 8,
    borderWidth: 2,
    borderColor: '#FF8C42',
  },
  addToCartText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF8C42',
  },
  buyButton: {
    flex: 1,
    backgroundColor: '#FF8C42',
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
    marginLeft: 8,
  },
  buyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  quantitySection: {
    marginBottom: 24,
  },
  quantityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C1810',
    marginBottom: 12,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 25,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'center',
    minWidth: 120,
  },
  quantityButton: {
    backgroundColor: '#E0E0E0',
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C1810',
    marginHorizontal: 20,
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
