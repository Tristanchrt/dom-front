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
    language: profileEditDefaults.status,
    description: profileEditDefaults.description,
    category: profileEditDefaults.category,
    socialNetworks: profileEditDefaults.socialLinks,
  });

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const draft = await usersUseCases.getProfileDraft();
        if (!alive || !draft) return;
        setProfile({
          name: draft.name,
          language: draft.status,
          description: draft.description,
          category: draft.category,
          socialNetworks: draft.socialLinks,
        });
      } catch {
        // ignore load errors; defaults already shown
      }
    })();
    return () => { alive = false; };
  }, []);

  const handleSave = async () => {
    try {
      await usersUseCases.saveProfileDraft({
        name: profile.name,
        status: profile.language,
        description: profile.description,
        category: profile.category,
        socialLinks: profile.socialNetworks,
        avatarUrl: profileEditDefaults.avatarUrl,
      });
      Alert.alert('✅ Profile saved', 'Your changes have been saved successfully', [
        { text: 'OK' },
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
        <TouchableOpacity style={styles.modifyButton}>
          <Text style={styles.modifyText}>modifier</Text>
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
      <View style={[styles.header, computeHeaderPaddings(insets)]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <FontAwesome name="arrow-left" size={24} color="#2C1810" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profil</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
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
            <TouchableOpacity style={styles.languageButton}>
              <Text style={styles.languageText}>🇬🇧</Text>
              <FontAwesome name="chevron-down" size={12} color="#8B7355" />
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

          <EditableField
            label="Social networks"
            value={profile.socialNetworks}
            onChangeText={(text) => setProfile({ ...profile, socialNetworks: text })}
            placeholder="Your social links..."
          />
        </ProfileSection>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save changes</Text>
        </TouchableOpacity>
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
});
