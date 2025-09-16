import React, { useState } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { computeHeaderPaddings } from '@/constants/Layout';
import { router } from 'expo-router';
import { availableInterests, type InterestFixture } from '@/data/fixtures/onboarding';

export default function InterestsSelectionScreen() {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const minInterests = 3;
  const insets = useSafeAreaInsets();

  const toggleInterest = (interestId: string) => {
    setSelectedInterests((prev) => {
      if (prev.includes(interestId)) {
        return prev.filter((id) => id !== interestId);
      } else {
        return [...prev, interestId];
      }
    });
  };

  const handleContinue = () => {
    if (selectedInterests.length < minInterests) {
      Alert.alert(
        'Sélection incomplète',
        `Veuillez sélectionner au moins ${minInterests} centres d'intérêt pour personnaliser vos recommandations.`,
      );
      return;
    }
    router.replace('/(tabs)');
  };

  const renderInterest = (interest: InterestFixture) => {
    const isSelected = selectedInterests.includes(interest.id);

    return (
      <TouchableOpacity
        key={interest.id}
        style={[
          styles.interestCard,
          isSelected && styles.selectedInterestCard,
          { borderColor: interest.color },
        ]}
        onPress={() => toggleInterest(interest.id)}
      >
        <View style={[styles.interestIcon, { backgroundColor: `${interest.color}20` }]}>
          <FontAwesome
            name={interest.icon as any}
            size={24}
            color={isSelected ? interest.color : '#8B7355'}
          />
        </View>
        <Text style={[styles.interestName, isSelected && { color: interest.color }]}>
          {interest.name}
        </Text>
        {isSelected && (
          <View style={[styles.checkIcon, { backgroundColor: interest.color }]}>
            <FontAwesome name="check" size={12} color="#FFFFFF" />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={[styles.header, computeHeaderPaddings(insets)]}>
        <TouchableOpacity
          style={styles.backButton}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          onPress={() => router.back()}
        >
          <FontAwesome name="arrow-left" size={24} color="#2C1810" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Centres d'intérêt</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroIcon}>
            <FontAwesome name="heart" size={32} color="#FF8C42" />
          </View>
          <Text style={styles.heroTitle}>Quels sont vos centres d'intérêt ?</Text>
          <Text style={styles.heroSubtitle}>
            Sélectionnez au moins {minInterests} centres d'intérêt pour personnaliser votre
            expérience et découvrir du contenu qui vous correspond.
          </Text>
        </View>

        {/* Progress Indicator */}
        <View style={styles.progressSection}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${Math.min((selectedInterests.length / minInterests) * 100, 100)}%`,
                  backgroundColor: selectedInterests.length >= minInterests ? '#4CAF50' : '#FF8C42',
                },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {selectedInterests.length} / {minInterests} minimum
          </Text>
        </View>

        {/* Interests Grid */}
        <View style={styles.interestsGrid}>{availableInterests.map(renderInterest)}</View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={[styles.bottomActions, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            selectedInterests.length < minInterests && styles.disabledButton,
          ]}
          onPress={handleContinue}
          disabled={selectedInterests.length < minInterests}
        >
          <Text
            style={[
              styles.continueButtonText,
              selectedInterests.length < minInterests && styles.disabledButtonText,
            ]}
          >
            Continuer ({selectedInterests.length})
          </Text>
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
    paddingVertical: 6,
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
  heroSection: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
  },
  heroIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFF4E6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C1810',
    textAlign: 'center',
    marginBottom: 12,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#8B7355',
    textAlign: 'center',
    lineHeight: 22,
  },
  progressSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#8B7355',
    textAlign: 'center',
    fontWeight: '500',
  },
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    marginBottom: 100,
  },
  interestCard: {
    width: '47%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginRight: '3%',
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    position: 'relative',
  },
  selectedInterestCard: {
    backgroundColor: '#FFF8F0',
  },
  interestIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  interestName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C1810',
    textAlign: 'center',
  },
  checkIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomActions: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  continueButton: {
    backgroundColor: '#FF8C42',
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#E0E0E0',
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  disabledButtonText: {
    color: '#8B7355',
  },
});
