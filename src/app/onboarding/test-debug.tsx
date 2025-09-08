import React from 'react';
import { StyleSheet, SafeAreaView, Text, View, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

export default function TestDebugScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>🎉 Test Page - Navigation Works!</Text>
        <Text style={styles.subtitle}>
          Si tu vois cette page, c'est que la navigation depuis profile-setup fonctionne !
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            console.log('Going to interests page...');
            router.push('/onboarding/interests');
          }}
        >
          <Text style={styles.buttonText}>Aller aux Centres d'Intérêt</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => {
            console.log('Going to feed...');
            router.push('/(tabs)');
          }}
        >
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>Aller au Feed</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.backButton]}
          onPress={() => {
            console.log('Going back...');
            router.back();
          }}
        >
          <Text style={[styles.buttonText, styles.backButtonText]}>Retour</Text>
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C1810',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#8B7355',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 22,
  },
  button: {
    backgroundColor: '#FF8C42',
    borderRadius: 25,
    paddingVertical: 16,
    paddingHorizontal: 32,
    marginBottom: 16,
    minWidth: 250,
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: '#4CAF50',
  },
  backButton: {
    backgroundColor: '#E0E0E0',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  secondaryButtonText: {
    color: '#FFFFFF',
  },
  backButtonText: {
    color: '#2C1810',
  },
});
