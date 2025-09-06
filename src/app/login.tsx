import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleGoogleLogin = () => {
    // TODO: Implement Google OAuth
    console.log('Google login pressed');
    // For testing: redirect to onboarding instead of main app
    router.push('/onboarding/profile-setup');
  };

  const handleFacebookLogin = () => {
    // TODO: Implement Facebook OAuth
    console.log('Facebook login pressed');
    // For testing: redirect to onboarding instead of main app
    router.push('/onboarding/profile-setup');
  };

  const handleEmailLogin = () => {
    // TODO: Implement email login
    console.log('Email login pressed', { email, password });
    // For now, simulate successful login
    router.replace('/(tabs)');
  };

  const handleForgotPassword = () => {
    // TODO: Navigate to forgot password screen
    console.log('Forgot password pressed');
  };

  const handleSignUp = () => {
    // Simulate account creation and redirect to onboarding
    console.log('Sign up pressed');
    router.push('/onboarding/profile-setup');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header with question mark */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.helpButton}>
              <Text style={styles.helpText}>?</Text>
            </TouchableOpacity>
          </View>

          {/* Welcome Title */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>BIENVENUE SUR</Text>
            <Text style={styles.title}>DOM</Text>
          </View>

          {/* Social Login Buttons */}
          <View style={styles.socialContainer}>
            <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
              <FontAwesome name="google" size={20} color="#4285F4" />
              <Text style={styles.googleButtonText}>Continuez avec Google</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.facebookButton} onPress={handleFacebookLogin}>
              <FontAwesome name="facebook" size={20} color="#1877F2" />
              <Text style={styles.facebookButtonText}>Continuez avec Facebook</Text>
            </TouchableOpacity>
          </View>

          {/* Email Login Section */}
          <View style={styles.emailSection}>
            <Text style={styles.emailSectionTitle}>Connectez-vous avec e-mail</Text>
            
            <View style={styles.inputContainer}>
              <FontAwesome name="envelope-o" size={16} color="#FF8C42" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Jonathansmlh@gmail.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputContainer}>
              <FontAwesome name="lock" size={16} color="#999" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Mot de passe"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                placeholderTextColor="#999"
              />
              <TouchableOpacity
                style={styles.showPasswordButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Text style={styles.showPasswordText}>Montrer</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.loginButton} onPress={handleEmailLogin}>
              <Text style={styles.loginButtonText}>Se connecter</Text>
            </TouchableOpacity>
          </View>

          {/* Footer Links */}
          <View style={styles.footer}>
            <TouchableOpacity onPress={handleForgotPassword}>
              <Text style={styles.forgotPasswordText}>Mot de passe oublié?</Text>
            </TouchableOpacity>
            
            <View style={styles.signUpContainer}>
              <Text style={styles.noAccountText}>Vous n'avez pas de compte? </Text>
              <TouchableOpacity onPress={handleSignUp}>
                <Text style={styles.signUpText}>Inscrivez-vous</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F0E8', // Beige/cream background
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  header: {
    alignItems: 'flex-end',
    marginTop: 20,
    marginBottom: 40,
  },
  helpButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E8DDD4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  helpText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B7355',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6B4E3D',
    textAlign: 'center',
    lineHeight: 32,
  },
  socialContainer: {
    marginBottom: 40,
    gap: 16,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  googleButtonText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
    fontWeight: '500',
  },
  facebookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1877F2',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  facebookButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 12,
    fontWeight: '500',
  },
  emailSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  emailSectionTitle: {
    fontSize: 16,
    color: '#6B4E3D',
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    marginBottom: 20,
    paddingBottom: 12,
  },
  inputIcon: {
    marginRight: 12,
    width: 20,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 4,
  },
  showPasswordButton: {
    paddingHorizontal: 8,
  },
  showPasswordText: {
    fontSize: 14,
    color: '#6B4E3D',
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: '#FF8C42',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  footer: {
    alignItems: 'center',
    gap: 16,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#6B4E3D',
    textDecorationLine: 'underline',
  },
  signUpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  noAccountText: {
    fontSize: 14,
    color: '#6B4E3D',
  },
  signUpText: {
    fontSize: 14,
    color: '#6B4E3D',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});
