import React, { useState } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function SubscriptionScreen() {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('annual');

  const features = ['Unlimited products', 'Reduced commission', 'Access to unique badges'];

  const handleSubscribe = () => {
    Alert.alert(
      '✅ Subscription',
      `You are about to subscribe to the ${selectedPlan === 'monthly' ? 'monthly' : 'annual'} plan`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Subscribe now', onPress: () => console.log('Subscribe') },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <FontAwesome name="arrow-left" size={24} color="#2C1810" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Subscription</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Promotion Banner */}
        <View style={styles.promotionBanner}>
          <View style={styles.promotionContent}>
            <Text style={styles.promotionTitle}>60% off now</Text>
            <Text style={styles.promotionSubtitle}>Save on your subscription</Text>

            {/* Countdown */}
            <View style={styles.countdown}>
              <View style={styles.countdownItem}>
                <Text style={styles.countdownNumber}>23</Text>
              </View>
              <Text style={styles.countdownSeparator}>:</Text>
              <View style={styles.countdownItem}>
                <Text style={styles.countdownNumber}>56</Text>
              </View>
              <Text style={styles.countdownSeparator}>:</Text>
              <View style={styles.countdownItem}>
                <Text style={styles.countdownNumber}>48</Text>
              </View>
            </View>
          </View>

          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=150&h=150&fit=crop',
            }}
            style={styles.promotionImage}
          />
        </View>

        {/* Community Development */}
        <View style={styles.communitySection}>
          <Text style={styles.communityTitle}>Grow your community</Text>

          {/* Features */}
          <View style={styles.featuresContainer}>
            {features.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <FontAwesome name="check-circle" size={16} color="#FF8C42" />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Pricing Plans */}
        <View style={styles.pricingSection}>
          {/* Monthly Plan */}
          <TouchableOpacity
            style={[styles.planCard, selectedPlan === 'monthly' && styles.selectedPlan]}
            onPress={() => setSelectedPlan('monthly')}
          >
            <View style={styles.planHeader}>
              <Text style={styles.planPrice}>29 €</Text>
              <Text style={styles.planPeriod}>/month</Text>
            </View>
            <Text style={styles.planSubtext}>Monthly billing</Text>
            <Text style={styles.planLabel}>Monthly</Text>
          </TouchableOpacity>

          {/* Annual Plan */}
          <TouchableOpacity
            style={[styles.planCard, selectedPlan === 'annual' && styles.selectedPlan]}
            onPress={() => setSelectedPlan('annual')}
          >
            <View style={styles.popularBadge}>
              <Text style={styles.popularText}>Most popular</Text>
            </View>
            <View style={styles.planHeader}>
              <Text style={styles.planPrice}>19 €</Text>
              <Text style={styles.planPeriod}>/month</Text>
            </View>
            <Text style={styles.planSubtext}>Annual billing</Text>
            <Text style={styles.planOriginalPrice}>15 € /month</Text>
            <Text style={styles.planLabel}>Annual</Text>
            <View style={styles.savingsBadge}>
              <Text style={styles.savingsText}>2 years</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Subscribe Button */}
        <TouchableOpacity style={styles.subscribeButton} onPress={handleSubscribe}>
          <Text style={styles.subscribeButtonText}>Subscribe now</Text>
        </TouchableOpacity>

        {/* Footer Info */}
        <View style={styles.footerInfo}>
          <View style={styles.infoRow}>
            <FontAwesome name="shield" size={16} color="#8B7355" />
            <Text style={styles.infoText}>Secure payment</Text>
          </View>
          <View style={styles.infoRow}>
            <FontAwesome name="refresh" size={16} color="#8B7355" />
            <Text style={styles.infoText}>Cancel anytime</Text>
          </View>
        </View>

        {/* Terms */}
        <View style={styles.termsSection}>
          <TouchableOpacity>
            <Text style={styles.termsLink}>Terms of service</Text>
          </TouchableOpacity>
          <Text style={styles.termsSeparator}> • </Text>
          <TouchableOpacity>
            <Text style={styles.termsLink}>Privacy policy</Text>
          </TouchableOpacity>
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
  promotionBanner: {
    backgroundColor: '#FFF4E6',
    margin: 16,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  promotionContent: {
    flex: 1,
  },
  promotionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF8C42',
    marginBottom: 4,
  },
  promotionSubtitle: {
    fontSize: 14,
    color: '#8B7355',
    marginBottom: 16,
  },
  countdown: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countdownItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minWidth: 40,
    alignItems: 'center',
  },
  countdownNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C1810',
  },
  countdownSeparator: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF8C42',
    marginHorizontal: 4,
  },
  promotionImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  communitySection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 20,
  },
  communityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 16,
  },
  featuresContainer: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureText: {
    fontSize: 16,
    color: '#2C1810',
    marginLeft: 12,
  },
  pricingSection: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 24,
    gap: 12,
  },
  planCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    position: 'relative',
  },
  selectedPlan: {
    borderColor: '#FF8C42',
  },
  popularBadge: {
    position: 'absolute',
    top: -8,
    left: 12,
    right: 12,
    backgroundColor: '#FF8C42',
    borderRadius: 8,
    paddingVertical: 4,
    alignItems: 'center',
  },
  popularText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  planPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C1810',
  },
  planPeriod: {
    fontSize: 16,
    color: '#8B7355',
    marginLeft: 4,
  },
  planSubtext: {
    fontSize: 12,
    color: '#8B7355',
    marginBottom: 8,
  },
  planOriginalPrice: {
    fontSize: 14,
    color: '#8B7355',
    textDecorationLine: 'line-through',
    marginBottom: 8,
  },
  planLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C1810',
    textAlign: 'center',
    marginTop: 8,
  },
  savingsBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  savingsText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  subscribeButton: {
    backgroundColor: '#FF8C42',
    borderRadius: 25,
    paddingVertical: 16,
    marginHorizontal: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  subscribeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  footerInfo: {
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoText: {
    fontSize: 14,
    color: '#8B7355',
    marginLeft: 8,
  },
  termsSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  termsLink: {
    fontSize: 12,
    color: '#FF8C42',
    textDecorationLine: 'underline',
  },
  termsSeparator: {
    fontSize: 12,
    color: '#8B7355',
  },
});
