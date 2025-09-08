import React from 'react';
import {
  StyleSheet,
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function SettingsScreen() {
  const settingsOptions = [
    {
      id: 'products',
      title: 'Mes produits',
      subtitle: 'Gérer mes produits',
      icon: 'shopping-bag',
      color: '#FF8C42',
      route: '/settings/products',
    },
    {
      id: 'personalization',
      title: 'Personnalisation',
      subtitle: 'Personnalisez votre profil',
      icon: 'user',
      color: '#FF8C42',
      route: '/settings/profile',
    },
    {
      id: 'orders',
      title: 'Mes commandes',
      subtitle: 'Historique des commandes',
      icon: 'list',
      color: '#FF8C42',
      route: '/settings/orders',
    },
    {
      id: 'purchases',
      title: 'Mes achats',
      subtitle: 'Vos achats récents',
      icon: 'credit-card',
      color: '#FF8C42',
      route: '/settings/purchases',
    },
  ];

  const accountOptions = [
    {
      id: 'contact',
      title: 'Nous contacter',
      icon: 'envelope',
      color: '#FF8C42',
    },
    {
      id: 'privacy',
      title: 'Politique de confidentialité',
      icon: 'shield',
      color: '#FF8C42',
    },
    {
      id: 'about',
      title: 'À propos',
      icon: 'info-circle',
      color: '#FF8C42',
    },
  ];

  const renderSettingItem = (item: any) => (
    <TouchableOpacity
      key={item.id}
      style={styles.settingItem}
      onPress={() => (item.route ? router.push(item.route) : console.log(`Navigate to ${item.id}`))}
    >
      <View style={[styles.iconContainer, { backgroundColor: `${item.color}20` }]}>
        <FontAwesome name={item.icon} size={20} color={item.color} />
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{item.title}</Text>
        {item.subtitle && <Text style={styles.settingSubtitle}>{item.subtitle}</Text>}
      </View>
      <FontAwesome name="chevron-right" size={16} color="#8B7355" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <FontAwesome name="arrow-left" size={24} color="#2C1810" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Paramètres</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
              }}
              style={styles.profileImage}
            />
            <View style={styles.profileInfo}>
              <Text style={styles.profileTitle}>Développez votre</Text>
              <Text style={styles.profileTitle}>communauté</Text>
              <TouchableOpacity style={styles.seeButton}>
                <Text style={styles.seeButtonText}>Voir</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* General Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Général</Text>
          {settingsOptions.map(renderSettingItem)}
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Qu'est-ce pour vous ?</Text>
          {accountOptions.map(renderSettingItem)}
        </View>
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
  profileCard: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C1810',
    lineHeight: 22,
  },
  seeButton: {
    backgroundColor: '#FF8C42',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 8,
    alignSelf: 'flex-start',
    marginTop: 12,
  },
  seeButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C1810',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F8F8F8',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C1810',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#8B7355',
  },
});
