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
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import { profileSetupDefaults } from '@/data/fixtures/onboarding';

export default function ProfileSetupScreen() {
  const [profileData, setProfileData] = useState({
    name: '',
    description: '',
    category: '',
    socialNetworks: '',
    profileImage: null as string | null,
    bannerImage: null as string | null,
  });

  const handleImageSelection = (type: 'profile' | 'banner') => {
    Alert.alert(
      '📷 Sélectionner une image',
      `Choisissez une image pour votre ${type === 'profile' ? 'profil' : 'bannière'}`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Caméra',
          onPress: () => {
            const imageUrl =
              type === 'profile'
                ? profileSetupDefaults.defaultProfileCameraUrl
                : profileSetupDefaults.defaultBannerCameraUrl;
            setProfileData((prev) => ({
              ...prev,
              [type === 'profile' ? 'profileImage' : 'bannerImage']: imageUrl,
            }));
          },
        },
        {
          text: 'Galerie',
          onPress: () => {
            const imageUrl =
              type === 'profile'
                ? profileSetupDefaults.defaultProfileGalleryUrl
                : profileSetupDefaults.defaultBannerGalleryUrl;
            setProfileData((prev) => ({
              ...prev,
              [type === 'profile' ? 'profileImage' : 'bannerImage']: imageUrl,
            }));
          },
        },
      ],
    );
  };

  const handleContinue = () => {
    console.log('🔥 Continue button clicked');

    if (!profileData.name.trim()) {
      console.log('❌ Name validation failed');
      Alert.alert('Erreur', 'Veuillez saisir votre nom et prénom');
      return;
    }

    console.log('✅ Name validation passed, attempting navigation...');

    try {
      console.log('🚀 Navigating to test debug page...');
      router.push('/onboarding/test-debug');
    } catch (error) {
      console.error('❌ Navigation error:', error);
      Alert.alert('Erreur', 'Problème de navigation: ' + error);
    }
  };

  const handleSkip = () => {
    console.log('🚀 Skip button clicked - going to interests');
    try {
      console.log('🎯 Navigating to interests page...');
      router.push('/onboarding/interests');
    } catch (error) {
      console.error('❌ Skip navigation error:', error);
      Alert.alert('Erreur', 'Problème de navigation: ' + error);
    }
  };

  const ProfileField = ({
    label,
    value,
    onChangeText,
    placeholder,
    multiline = false,
    icon,
  }: {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder: string;
    multiline?: boolean;
    icon: string;
  }) => (
    <View style={styles.fieldContainer}>
      <View style={styles.fieldHeader}>
        <FontAwesome name={icon as any} size={16} color="#FF8C42" />
        <Text style={styles.fieldLabel}>{label}</Text>
        <TouchableOpacity style={styles.fillButton}>
          <Text style={styles.fillButtonText}>remplir</Text>
          <FontAwesome name="chevron-right" size={12} color="#FF8C42" />
        </TouchableOpacity>
      </View>
      <TextInput
        style={[styles.fieldInput, multiline && styles.multilineInput]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#8B7355"
        multiline={multiline}
        numberOfLines={multiline ? 3 : 1}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Sign Up page</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroIllustration}>
            <Image source={{ uri: profileSetupDefaults.heroImage }} style={styles.heroImage} />
          </View>
          <Text style={styles.heroTitle}>PRÉSENTEZ VOUS</Text>
        </View>

        {/* Profile Image Section */}
        <View style={styles.profileImageSection}>
          <TouchableOpacity
            style={styles.profileImageContainer}
            onPress={() => handleImageSelection('profile')}
          >
            {profileData.profileImage ? (
              <Image source={{ uri: profileData.profileImage }} style={styles.profileImage} />
            ) : (
              <View style={styles.profileImagePlaceholder}>
                <FontAwesome name="user" size={40} color="#8B7355" />
              </View>
            )}
            <View style={styles.cameraButton}>
              <FontAwesome name="camera" size={16} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
          <TextInput
            style={styles.nameInput}
            placeholder="Nom et prénom"
            placeholderTextColor="#8B7355"
            value={profileData.name}
            onChangeText={(text) => setProfileData((prev) => ({ ...prev, name: text }))}
          />
        </View>

        {/* Banner Section */}
        <View style={styles.bannerSection}>
          <Text style={styles.sectionTitle}>Bannière</Text>
          <TouchableOpacity
            style={styles.bannerContainer}
            onPress={() => handleImageSelection('banner')}
          >
            {profileData.bannerImage ? (
              <Image source={{ uri: profileData.bannerImage }} style={styles.bannerImage} />
            ) : (
              <View style={styles.bannerPlaceholder}>
                <FontAwesome name="image" size={32} color="#8B7355" />
                <Text style={styles.bannerPlaceholderText}>Ajouter une bannière</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Profile Fields */}
        <View style={styles.fieldsSection}>
          <ProfileField
            label="Description"
            value={profileData.description}
            onChangeText={(text) => setProfileData((prev) => ({ ...prev, description: text }))}
            placeholder="Décrivez-vous en quelques mots..."
            multiline
            icon="user"
          />

          <ProfileField
            label="Catégorie"
            value={profileData.category}
            onChangeText={(text) => setProfileData((prev) => ({ ...prev, category: text }))}
            placeholder="Votre domaine d'expertise..."
            icon="tag"
          />

          <ProfileField
            label="Réseaux sociaux"
            value={profileData.socialNetworks}
            onChangeText={(text) => setProfileData((prev) => ({ ...prev, socialNetworks: text }))}
            placeholder="Vos liens de réseaux sociaux..."
            icon="share"
          />
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipButtonText}>Passer</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>Continuer</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F0E8',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 14,
    color: '#8B7355',
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  heroSection: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  heroIllustration: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    borderWidth: 3,
    borderColor: '#FF8C42',
    borderStyle: 'dashed',
  },
  heroImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C1810',
    textAlign: 'center',
    letterSpacing: 1,
  },
  profileImageSection: {
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  profileImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FF8C42',
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 16,
    color: '#2C1810',
    textAlign: 'center',
    minWidth: 200,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  bannerSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 12,
  },
  bannerContainer: {
    height: 120,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  bannerPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerPlaceholderText: {
    fontSize: 14,
    color: '#8B7355',
    marginTop: 8,
  },
  fieldsSection: {
    paddingHorizontal: 16,
    marginBottom: 100,
  },
  fieldContainer: {
    marginBottom: 24,
  },
  fieldHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C1810',
    marginLeft: 8,
    flex: 1,
  },
  fillButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fillButtonText: {
    fontSize: 14,
    color: '#FF8C42',
    marginRight: 4,
  },
  fieldInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#2C1810',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  multilineInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  bottomActions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#F5F0E8',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  skipButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    marginRight: 8,
  },
  skipButtonText: {
    fontSize: 16,
    color: '#8B7355',
    fontWeight: '500',
  },
  continueButton: {
    flex: 2,
    backgroundColor: '#FF8C42',
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
    marginLeft: 8,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
