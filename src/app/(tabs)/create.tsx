import React, { useState } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  Alert,
  Dimensions,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';

const { width: screenWidth } = Dimensions.get('window');

type PostType = 'text' | 'image' | 'video' | 'product' | 'poll';

interface PollOption {
  id: string;
  text: string;
}

export default function CreatePostScreen() {
  const [postType, setPostType] = useState<PostType>('text');
  const [postText, setPostText] = useState('');
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState<PollOption[]>([
    { id: '1', text: '' },
    { id: '2', text: '' },
  ]);

  const postTypes = [
    { id: 'text', icon: 'font', label: 'Texte', color: '#8B7355' },
    { id: 'image', icon: 'camera', label: 'Image', color: '#4CAF50' },
    { id: 'video', icon: 'video-camera', label: 'Vidéo', color: '#2196F3' },
    { id: 'product', icon: 'shopping-bag', label: 'Produit', color: '#FF8C42' },
    { id: 'poll', icon: 'bar-chart', label: 'Sondage', color: '#9C27B0' },
  ];

  const sampleProducts = [
    {
      id: 'p1',
      name: 'T-shirt cousu main',
      price: '30 €',
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop',
    },
    {
      id: 'p2',
      name: 'Vase en céramique',
      price: '45 €',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop',
    },
  ];

  const handleMediaSelection = () => {
    Alert.alert(
      postType === 'image' ? '📷 Sélectionner une image' : '🎥 Sélectionner une vidéo',
      'Choisissez une source',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Caméra',
          onPress: () => {
            setSelectedMedia(
              'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
            );
            console.log('Open camera');
          },
        },
        {
          text: 'Galerie',
          onPress: () => {
            setSelectedMedia(
              'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
            );
            console.log('Open gallery');
          },
        },
      ],
    );
  };

  const handleProductSelection = () => {
    Alert.alert('🛍️ Sélectionner un produit', 'Choisissez un produit à présenter', [
      { text: 'Annuler', style: 'cancel' },
      ...sampleProducts.map((product) => ({
        text: `${product.name} - ${product.price}`,
        onPress: () => setSelectedProduct(product),
      })),
    ]);
  };

  const addPollOption = () => {
    if (pollOptions.length < 4) {
      setPollOptions([...pollOptions, { id: Date.now().toString(), text: '' }]);
    }
  };

  const removePollOption = (id: string) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter((option) => option.id !== id));
    }
  };

  const updatePollOption = (id: string, text: string) => {
    setPollOptions(pollOptions.map((option) => (option.id === id ? { ...option, text } : option)));
  };

  const handlePublish = () => {
    if (!postText.trim() && postType === 'text') {
      Alert.alert('Erreur', 'Veuillez saisir du texte pour votre publication');
      return;
    }

    if (
      postType === 'poll' &&
      (!pollQuestion.trim() || pollOptions.some((opt) => !opt.text.trim()))
    ) {
      Alert.alert('Erreur', 'Veuillez compléter la question et toutes les options du sondage');
      return;
    }

    Alert.alert('✅ Publication créée', 'Votre publication a été créée avec succès !', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  const renderPostTypeSelector = () => (
    <View style={styles.postTypeSelector}>
      <Text style={styles.sectionTitle}>Type de publication</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typeScrollView}>
        {postTypes.map((type) => (
          <TouchableOpacity
            key={type.id}
            style={[
              styles.typeButton,
              postType === type.id && styles.selectedTypeButton,
              { borderColor: type.color },
            ]}
            onPress={() => {
              setPostType(type.id as PostType);
              setSelectedMedia(null);
              setSelectedProduct(null);
              setPollQuestion('');
              setPollOptions([
                { id: '1', text: '' },
                { id: '2', text: '' },
              ]);
            }}
          >
            <FontAwesome
              name={type.icon}
              size={24}
              color={postType === type.id ? type.color : '#8B7355'}
            />
            <Text style={[styles.typeLabel, postType === type.id && { color: type.color }]}>
              {type.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderTextInput = () => (
    <View style={styles.textInputSection}>
      <Text style={styles.sectionTitle}>
        {postType === 'poll' ? 'Description (optionnel)' : 'Votre message'}
      </Text>
      <TextInput
        style={styles.textInput}
        placeholder={
          postType === 'poll'
            ? 'Ajoutez une description à votre sondage...'
            : 'Que voulez-vous partager ?'
        }
        placeholderTextColor="#8B7355"
        value={postText}
        onChangeText={setPostText}
        multiline
        numberOfLines={4}
        maxLength={500}
      />
      <Text style={styles.characterCount}>{postText.length}/500</Text>
    </View>
  );

  const renderMediaSection = () => {
    if (postType !== 'image' && postType !== 'video') return null;

    return (
      <View style={styles.mediaSection}>
        <Text style={styles.sectionTitle}>{postType === 'image' ? 'Image' : 'Vidéo'}</Text>

        {selectedMedia ? (
          <View style={styles.mediaPreview}>
            <Image source={{ uri: selectedMedia }} style={styles.mediaImage} />
            <TouchableOpacity
              style={styles.removeMediaButton}
              onPress={() => setSelectedMedia(null)}
            >
              <FontAwesome name="times" size={16} color="#FFFFFF" />
            </TouchableOpacity>
            {postType === 'video' && (
              <View style={styles.playButton}>
                <FontAwesome name="play" size={24} color="#FFFFFF" />
              </View>
            )}
          </View>
        ) : (
          <TouchableOpacity style={styles.mediaSelector} onPress={handleMediaSelection}>
            <FontAwesome
              name={postType === 'image' ? 'camera' : 'video-camera'}
              size={32}
              color="#8B7355"
            />
            <Text style={styles.mediaSelectorText}>
              Ajouter une {postType === 'image' ? 'image' : 'vidéo'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderProductSection = () => {
    if (postType !== 'product') return null;

    return (
      <View style={styles.productSection}>
        <Text style={styles.sectionTitle}>Produit</Text>

        {selectedProduct ? (
          <View style={styles.productPreview}>
            <Image source={{ uri: selectedProduct.image }} style={styles.productImage} />
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{selectedProduct.name}</Text>
              <Text style={styles.productPrice}>{selectedProduct.price}</Text>
            </View>
            <TouchableOpacity
              style={styles.removeProductButton}
              onPress={() => setSelectedProduct(null)}
            >
              <FontAwesome name="times" size={16} color="#FF4444" />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.productSelector} onPress={handleProductSelection}>
            <FontAwesome name="shopping-bag" size={32} color="#8B7355" />
            <Text style={styles.productSelectorText}>Sélectionner un produit</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderPollSection = () => {
    if (postType !== 'poll') return null;

    return (
      <View style={styles.pollSection}>
        <Text style={styles.sectionTitle}>Question du sondage</Text>
        <TextInput
          style={styles.pollQuestionInput}
          placeholder="Posez votre question..."
          placeholderTextColor="#8B7355"
          value={pollQuestion}
          onChangeText={setPollQuestion}
          maxLength={200}
        />

        <Text style={styles.sectionTitle}>Options de réponse</Text>
        {pollOptions.map((option, index) => (
          <View key={option.id} style={styles.pollOptionContainer}>
            <TextInput
              style={styles.pollOptionInput}
              placeholder={`Option ${index + 1}`}
              placeholderTextColor="#8B7355"
              value={option.text}
              onChangeText={(text) => updatePollOption(option.id, text)}
              maxLength={100}
            />
            {pollOptions.length > 2 && (
              <TouchableOpacity
                style={styles.removePollOptionButton}
                onPress={() => removePollOption(option.id)}
              >
                <FontAwesome name="minus-circle" size={20} color="#FF4444" />
              </TouchableOpacity>
            )}
          </View>
        ))}

        {pollOptions.length < 4 && (
          <TouchableOpacity style={styles.addPollOptionButton} onPress={addPollOption}>
            <FontAwesome name="plus-circle" size={16} color="#FF8C42" />
            <Text style={styles.addPollOptionText}>Ajouter une option</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
          <Text style={styles.cancelText}>Annuler</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nouvelle publication</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {renderPostTypeSelector()}
        {renderTextInput()}
        {renderMediaSection()}
        {renderProductSection()}
        {renderPollSection()}
      </ScrollView>

      {/* Bottom Publish Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.publishButtonBottom} onPress={handlePublish}>
          <Text style={styles.publishButtonText}>Publier</Text>
        </TouchableOpacity>
      </View>
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
  cancelButton: {
    padding: 8,
  },
  cancelText: {
    fontSize: 16,
    color: '#8B7355',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C1810',
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  postTypeSelector: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C1810',
    marginBottom: 12,
  },
  typeScrollView: {
    flexGrow: 0,
  },
  typeButton: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
    minWidth: 80,
  },
  selectedTypeButton: {
    backgroundColor: '#FFF8F0',
  },
  typeLabel: {
    fontSize: 12,
    color: '#8B7355',
    marginTop: 4,
    fontWeight: '500',
  },
  textInputSection: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 1,
  },
  textInput: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#2C1810',
    textAlignVertical: 'top',
    minHeight: 100,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  characterCount: {
    fontSize: 12,
    color: '#8B7355',
    textAlign: 'right',
    marginTop: 8,
  },
  mediaSection: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 1,
  },
  mediaSelector: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
  },
  mediaSelectorText: {
    fontSize: 16,
    color: '#8B7355',
    marginTop: 8,
  },
  mediaPreview: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
  },
  mediaImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  removeMediaButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }],
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 25,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productSection: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 1,
  },
  productSelector: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
  },
  productSelectorText: {
    fontSize: 16,
    color: '#8B7355',
    marginTop: 8,
  },
  productPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 16,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C1810',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    color: '#FF8C42',
    fontWeight: '600',
  },
  removeProductButton: {
    padding: 8,
  },
  pollSection: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 1,
  },
  pollQuestionInput: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#2C1810',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  pollOptionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  pollOptionInput: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: '#2C1810',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  removePollOptionButton: {
    marginLeft: 12,
    padding: 4,
  },
  addPollOptionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF8F0',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#FF8C42',
    borderStyle: 'dashed',
    marginTop: 8,
  },
  addPollOptionText: {
    fontSize: 14,
    color: '#FF8C42',
    fontWeight: '600',
    marginLeft: 8,
  },
  bottomContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  publishButtonBottom: {
    backgroundColor: '#FF8C42',
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  publishButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
