import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  Alert,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { computeHeaderPaddings } from '@/constants/Layout';
import { router } from 'expo-router';
import { profileEditDefaults } from '@/data/fixtures/settings';
import { usersUseCases } from '@/data/container';

export default function ProfileEditScreen() {
  const insets = useSafeAreaInsets();
  const [profile, setProfile] = useState({
    name: profileEditDefaults.name,
    language: 'en',
    description: profileEditDefaults.description,
    category: profileEditDefaults.category,
    instagram: '',
    facebook: '',
    linkedin: '',
    website: '',
  });

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const draft = await usersUseCases.getProfileDraft();
        if (!alive || !draft) return;
        setProfile((prev) => ({
          ...prev,
          name: draft.name ?? prev.name,
          language: draft.status === 'fr' || draft.status === 'en' ? draft.status : prev.language,
          description: draft.description ?? prev.description,
          category: draft.category ?? prev.category,
          // Attempt best-effort parse if socialLinks provided as a string
          instagram: prev.instagram,
          facebook: prev.facebook,
          linkedin: prev.linkedin,
          website: prev.website,
        }));
      } catch {
        // ignore load errors; defaults already shown
      }
    })();
    return () => { alive = false; };
  }, []);

  const handleSave = async () => {
    try {
      const links = [profile.instagram, profile.facebook, profile.linkedin, profile.website]
        .filter((x) => x && x.trim().length > 0)
        .join(', ');
      await usersUseCases.saveProfileDraft({
        name: profile.name,
        status: profile.language, // 'en' | 'fr'
        description: profile.description,
        category: profile.category,
        socialLinks: links,
        avatarUrl: profileEditDefaults.avatarUrl,
      });
      Alert.alert('✅ Profile saved', 'Your changes have been saved successfully', [
        { text: 'OK', onPress: () => router.replace('/settings') },
      ]);
    } catch {
      Alert.alert('Error', 'Failed to save your profile');
    }
  };

  const ProfileSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );

  const EditableField = ({
    label,
    value,
    onChangeText,
    placeholder,
    multiline = false,
  }: {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder: string;
    multiline?: boolean;
  }) => (
    <View style={styles.fieldContainer}>
      <View style={styles.fieldHeader}>
        <FontAwesome name="lock" size={14} color="#FF8C42" />
        <Text style={styles.fieldLabel}>{label}</Text>
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
      <View style={[styles.header, computeHeaderPaddings(insets)]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <FontAwesome name="arrow-left" size={24} color="#2C1810" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profil</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 16) + 72 }}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.profileImageContainer}>
            <Image source={{ uri: profileEditDefaults.avatarUrl }} style={styles.profileImage} />
            <TouchableOpacity style={styles.editImageButton}>
              <FontAwesome name="camera" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{profile.name}</Text>
            <Text style={styles.profileStatus}>{profile.language}</Text>
          </View>
          <View style={styles.languageSelector}>
            <TouchableOpacity
              style={styles.languageButton}
              onPress={() =>
                setProfile((p) => ({ ...p, language: p.language === 'en' ? 'fr' : 'en' }))
              }
            >
              <Text style={styles.languageText}>{profile.language === 'fr' ? '🇫🇷' : '🇬🇧'}</Text>
              <FontAwesome name="exchange" size={12} color="#8B7355" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Profile Banner */}
        <View style={styles.profileBanner}>
          <View style={styles.bannerContent}>
            <View style={styles.bannerText}>
              <Text style={styles.bannerTitle}>Complete your profile</Text>
              <Text style={styles.bannerSubtitle}>Improve your visibility</Text>
            </View>
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=100&h=100&fit=crop',
              }}
              style={styles.bannerImage}
            />
          </View>
        </View>

        {/* Editable Fields */}
        <ProfileSection title="">
          <EditableField
            label="Description"
            value={profile.description}
            onChangeText={(text) => setProfile({ ...profile, description: text })}
            placeholder="Describe yourself in a few words..."
            multiline
          />

          <EditableField
            label="Category"
            value={profile.category}
            onChangeText={(text) => setProfile({ ...profile, category: text })}
            placeholder="Your domain of expertise..."
          />

          <View style={styles.fieldContainer}>
            <View style={styles.fieldHeader}>
              <FontAwesome name="globe" size={14} color="#FF8C42" />
              <Text style={styles.fieldLabel}>Social networks (optionnel)</Text>
            </View>
            <TextInput
              style={styles.fieldInput}
              placeholder="Instagram URL"
              placeholderTextColor="#8B7355"
              value={profile.instagram}
              onChangeText={(text) => setProfile({ ...profile, instagram: text })}
              autoCapitalize="none"
            />
            <View style={{ height: 8 }} />
            <TextInput
              style={styles.fieldInput}
              placeholder="Facebook URL"
              placeholderTextColor="#8B7355"
              value={profile.facebook}
              onChangeText={(text) => setProfile({ ...profile, facebook: text })}
              autoCapitalize="none"
            />
            <View style={{ height: 8 }} />
            <TextInput
              style={styles.fieldInput}
              placeholder="LinkedIn URL"
              placeholderTextColor="#8B7355"
              value={profile.linkedin}
              onChangeText={(text) => setProfile({ ...profile, linkedin: text })}
              autoCapitalize="none"
            />
            <View style={{ height: 8 }} />
            <TextInput
              style={styles.fieldInput}
              placeholder="Website URL"
              placeholderTextColor="#8B7355"
              value={profile.website}
              onChangeText={(text) => setProfile({ ...profile, website: text })}
              autoCapitalize="none"
            />
          </View>
        </ProfileSection>

      </ScrollView>

      {/* Sticky Save */}
      <View style={[styles.saveBar, { paddingBottom: Math.max(insets.bottom, 10) }]}>
        <TouchableOpacity style={styles.saveBarButton} onPress={handleSave}>
          <Text style={styles.saveBarButtonText}>Save changes</Text>
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
  backButton: {
    padding: 8,
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
  profileHeader: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImageContainer: {
    position: 'relative',
    marginRight: 16,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  editImageButton: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#FF8C42',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 4,
  },
  profileStatus: {
    fontSize: 14,
    color: '#4CAF50',
  },
  languageSelector: {
    alignItems: 'center',
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  languageText: {
    fontSize: 16,
    marginRight: 8,
  },
  profileBanner: {
    backgroundColor: '#FFF4E6',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bannerText: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: '#8B7355',
  },
  bannerImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 16,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C1810',
    marginLeft: 8,
    flex: 1,
  },
  modifyButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modifyText: {
    fontSize: 14,
    color: '#FF8C42',
    marginRight: 4,
  },
  fieldInput: {
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    paddingHorizontal: 12,
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
  saveButton: {
    backgroundColor: '#FF8C42',
    borderRadius: 25,
    paddingVertical: 16,
    marginHorizontal: 16,
    marginBottom: 24,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  saveBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 8,
    paddingHorizontal: 16,
  },
  saveBarButton: {
    backgroundColor: '#FF8C42',
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveBarButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
