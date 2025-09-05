import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';

const { width: screenWidth } = Dimensions.get('window');

// Detailed product data
const productDetails = {
  p1: {
    id: 'p1',
    name: 'T-shirt coutumain',
    price: '30,80€',
    originalPrice: '45,00€',
    discount: '2,00 € de réduction',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop',
    seller: 'Marin',
    category: 'Poterie',
    rating: 4.8,
    sales: 234,
    description: 'T-shirt artisanal en coton bio avec design unique fait main. Parfait pour un style décontracté et authentique.',
    colors: ['Beige', 'Blanc', 'Noir'],
    sizes: ['S', 'M', 'L', 'XL'],
    features: ['Coton bio', 'Fait main', 'Design unique', 'Lavable en machine'],
    welcomeOffer: true,
    tvaCoprise: true,
  },
  p2: {
    id: 'p2',
    name: 'Vase en céramique',
    price: '45,00€',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=600&fit=crop',
    seller: 'Art Studio',
    category: 'Poterie',
    rating: 4.9,
    sales: 156,
    description: 'Vase artisanal en céramique peint à la main avec motifs traditionnels.',
    colors: ['Terre cuite', 'Bleu', 'Vert'],
    sizes: ['Petit', 'Moyen', 'Grand'],
    features: ['Céramique artisanale', 'Peint à la main', 'Résistant', 'Unique'],
    welcomeOffer: false,
    tvaCoprise: true,
  },
  p3: {
    id: 'p3',
    name: 'Livre de recettes',
    price: '25,00€',
    image: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=600&h=600&fit=crop',
    seller: 'Chef Antoine',
    category: 'Livre Image',
    rating: 4.7,
    sales: 89,
    description: 'Recettes traditionnelles françaises avec photos étape par étape et conseils de chef.',
    colors: ['Standard'],
    sizes: ['Format A4'],
    features: ['200 pages', 'Photos couleur', 'Reliure solide', 'Recettes testées'],
    welcomeOffer: false,
    tvaCoprise: true,
  },
  p4: {
    id: 'p4',
    name: 'Carte postale vintage',
    price: '5,00€',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=600&fit=crop',
    seller: 'Travel Explorer',
    category: 'Carte custom',
    rating: 4.6,
    sales: 345,
    description: 'Collection de cartes postales vintage d\'Islande avec paysages authentiques.',
    colors: ['Vintage'],
    sizes: ['Standard'],
    features: ['Papier de qualité', 'Impression haute définition', 'Collection limitée', 'Authentique'],
    welcomeOffer: false,
    tvaCoprise: true,
  },
  p5: {
    id: 'p5',
    name: 'Carnet de voyage',
    price: '18,00€',
    image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600&h=600&fit=crop',
    seller: 'Travel Explorer',
    category: 'Carnet',
    rating: 4.8,
    sales: 167,
    description: 'Carnet de voyage en cuir avec pages lignées et cartes pour noter vos aventures.',
    colors: ['Marron', 'Noir', 'Cognac'],
    sizes: ['A5', 'A6'],
    features: ['Cuir véritable', 'Pages lignées', 'Cartes incluses', 'Fermeture élastique'],
    welcomeOffer: false,
    tvaCoprise: true,
  },
  p6: {
    id: 'p6',
    name: 'Bol artisanal',
    price: '35,00€',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=600&fit=crop',
    seller: 'Art Studio',
    category: 'Poterie',
    rating: 4.9,
    sales: 78,
    description: 'Bol en grès émaillé, parfait pour les petits déjeuners et repas quotidiens.',
    colors: ['Blanc', 'Beige', 'Bleu'],
    sizes: ['Petit', 'Moyen'],
    features: ['Grès émaillé', 'Fait main', 'Lave-vaisselle', 'Micro-ondes'],
    welcomeOffer: false,
    tvaCoprise: true,
  },
  p7: {
    id: 'p7',
    name: 'Guide de cuisine',
    price: '32,00€',
    image: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=600&h=600&fit=crop',
    seller: 'Chef Antoine',
    category: 'Livre Image',
    rating: 4.8,
    sales: 234,
    description: 'Guide complet de la cuisine française moderne avec techniques et astuces.',
    colors: ['Standard'],
    sizes: ['Format A4'],
    features: ['300 pages', 'Illustrations', 'Techniques pro', 'Index détaillé'],
    welcomeOffer: false,
    tvaCoprise: true,
  },
  p8: {
    id: 'p8',
    name: 'Carte personnalisée',
    price: '12,00€',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=600&fit=crop',
    seller: 'Design Studio',
    category: 'Carte custom',
    rating: 4.7,
    sales: 445,
    description: 'Carte personnalisée avec votre photo et message pour toutes occasions.',
    colors: ['Personnalisable'],
    sizes: ['A6', 'A5'],
    features: ['Personnalisation', 'Papier premium', 'Finition mate', 'Livraison rapide'],
    welcomeOffer: false,
    tvaCoprise: true,
  },
};

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [isBookmarked, setIsBookmarked] = useState(false);

  const product = productDetails[id as string];

  useEffect(() => {
    if (product) {
      setSelectedColor(product.colors[0]);
      setSelectedSize(product.sizes[0]);
    }
  }, [product]);

  if (!product) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <FontAwesome name="arrow-left" size={24} color="#2C1810" />
          </TouchableOpacity>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Produit non trouvé</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleAddToCart = () => {
    Alert.alert(
      '🛒 Ajouté au panier',
      `${product.name} (${selectedColor}, ${selectedSize}) a été ajouté à votre panier avec succès !`,
      [
        { text: 'Continuer les achats', style: 'cancel' },
        { text: 'Voir le panier', onPress: () => console.log('Navigate to cart') }
      ]
    );
  };

  const handlePurchase = () => {
    Alert.alert(
      '💳 Confirmer l\'achat',
      `Acheter: ${product.name}\nCouleur: ${selectedColor}\nTaille: ${selectedSize}\nPrix: ${product.price}`,
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Procéder au paiement', 
          onPress: () => Alert.alert('✅ Succès', 'Commande passée avec succès !') 
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
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
        {/* Product Image with thumbnails */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: product.image }} style={styles.productImage} />
          
          {/* Image thumbnails */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.thumbnailContainer}
            contentContainerStyle={styles.thumbnailContent}
          >
            <TouchableOpacity style={[styles.thumbnail, styles.activeThumbnail]}>
              <Image source={{ uri: product.image }} style={styles.thumbnailImage} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.thumbnail}>
              <Image source={{ uri: product.image }} style={styles.thumbnailImage} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.thumbnail}>
              <Image source={{ uri: product.image }} style={styles.thumbnailImage} />
            </TouchableOpacity>
          </ScrollView>
          
          <TouchableOpacity 
            style={styles.bookmarkButton}
            onPress={() => setIsBookmarked(!isBookmarked)}
          >
            <FontAwesome 
              name={isBookmarked ? "bookmark" : "bookmark-o"} 
              size={24} 
              color={isBookmarked ? "#FF8C42" : "#8B7355"} 
            />
          </TouchableOpacity>
        </View>

        {/* Welcome Offer Banner */}
        {product.welcomeOffer && (
          <View style={styles.welcomeBanner}>
            <Text style={styles.welcomeText}>Offre de bienvenue</Text>
            <FontAwesome name="chevron-right" size={12} color="#FF8C42" />
          </View>
        )}

        {/* Product Info */}
        <View style={styles.productInfo}>
          <View style={styles.sellerInfoTop}>
            <FontAwesome name="user-circle" size={16} color="#FF8C42" />
            <Text style={styles.sellerNameTop}>Vendu par {product.seller}</Text>
            <View style={styles.userIcon}>
              <FontAwesome name="user" size={12} color="#FFFFFF" />
            </View>
          </View>

          <Text style={styles.productNameLarge}>{product.name.toUpperCase()}</Text>
          <Text style={styles.productDescriptionLarge}>{product.description}</Text>
          
          <View style={styles.priceSection}>
            <Text style={styles.currentPriceLarge}>{product.price.replace(',', ',')}</Text>
            <TouchableOpacity 
              style={styles.bookmarkIcon}
              onPress={() => setIsBookmarked(!isBookmarked)}
            >
              <FontAwesome 
                name={isBookmarked ? "bookmark" : "bookmark-o"} 
                size={24} 
                color={isBookmarked ? "#FF8C42" : "#8B7355"} 
              />
            </TouchableOpacity>
          </View>

          {/* Color Selection */}
          <View style={styles.optionSection}>
            <Text style={styles.optionTitle}>Couleur: {selectedColor}</Text>
            <View style={styles.optionButtons}>
              {product.colors.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.optionButton,
                    selectedColor === color && styles.selectedOptionButton
                  ]}
                  onPress={() => setSelectedColor(color)}
                >
                  <Text style={[
                    styles.optionButtonText,
                    selectedColor === color && styles.selectedOptionButtonText
                  ]}>
                    {color}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Size Selection */}
          <View style={styles.optionSection}>
            <Text style={styles.optionTitle}>Taille: {selectedSize}</Text>
            <View style={styles.optionButtons}>
              {product.sizes.map((size) => (
                <TouchableOpacity
                  key={size}
                  style={[
                    styles.optionButton,
                    selectedSize === size && styles.selectedOptionButton
                  ]}
                  onPress={() => setSelectedSize(size)}
                >
                  <Text style={[
                    styles.optionButtonText,
                    selectedSize === size && styles.selectedOptionButtonText
                  ]}>
                    {size}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Quantity Selection */}
          <View style={styles.quantitySection}>
            <Text style={styles.quantityTitle}>Quantité</Text>
            <View style={styles.quantityContainer}>
              <TouchableOpacity style={styles.quantityButton}>
                <FontAwesome name="minus" size={12} color="#8B7355" />
              </TouchableOpacity>
              <Text style={styles.quantityText}>1</Text>
              <TouchableOpacity style={styles.quantityButton}>
                <FontAwesome name="plus" size={12} color="#8B7355" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Features */}
          <View style={styles.featuresSection}>
            <Text style={styles.featuresTitle}>Caractéristiques:</Text>
            {product.features.map((feature, index) => (
              <Text key={index} style={styles.featureItem}>• {feature}</Text>
            ))}
          </View>

          {/* Seller Info */}
          <View style={styles.sellerSection}>
            <FontAwesome name="user-circle" size={16} color="#FF8C42" />
            <Text style={styles.sellerText}>Vendu par {product.seller}</Text>
            <View style={styles.ratingContainer}>
              <FontAwesome name="star" size={12} color="#FFD700" />
              <Text style={styles.ratingText}>{product.rating}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
          <Text style={styles.addToCartText}>Ajouter au panier</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buyButton} onPress={handlePurchase}>
          <Text style={styles.buyButtonText}>Acheter</Text>
        </TouchableOpacity>
      </View>
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
    height: 250,
    resizeMode: 'cover',
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
