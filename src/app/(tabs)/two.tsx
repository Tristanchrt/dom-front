import { StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';

import { Text, View } from '@/components/common/Themed';

export default function ProfileScreen() {
  const handleLogout = () => {
    // Navigate back to login
    router.replace('/login');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <FontAwesome name="user-circle" size={80} color="#FF8C42" />
          </View>
          <Text style={styles.userName}>Jonathan Smith</Text>
          <Text style={styles.userEmail}>jonathansmlh@gmail.com</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Publications</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Abonnés</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Abonnements</Text>
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <FontAwesome name="edit" size={16} color="#6B4E3D" />
            <Text style={styles.actionButtonText}>Modifier le profil</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/settings')}>
            <FontAwesome name="cog" size={16} color="#6B4E3D" />
            <Text style={styles.actionButtonText}>Paramètres</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.actionButton, styles.logoutButton]} onPress={handleLogout}>
            <FontAwesome name="sign-out" size={16} color="#FF4444" />
            <Text style={[styles.actionButtonText, styles.logoutText]}>Se déconnecter</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.postsPlaceholder}>
          <FontAwesome name="camera" size={32} color="#999" />
          <Text style={styles.placeholderTitle}>Aucune publication</Text>
          <Text style={styles.placeholderText}>Vos publications apparaîtront ici</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  profileHeader: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#F5F0E8',
    borderRadius: 16,
    marginBottom: 24,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6B4E3D',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#8B7355',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6B4E3D',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#8B7355',
  },
  actionsContainer: {
    marginBottom: 24,
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionButtonText: {
    fontSize: 16,
    color: '#6B4E3D',
    marginLeft: 12,
    fontWeight: '500',
  },
  logoutButton: {
    borderWidth: 1,
    borderColor: '#FFE0E0',
    backgroundColor: '#FFF8F8',
  },
  logoutText: {
    color: '#FF4444',
  },
  postsPlaceholder: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#F9F9F9',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
  },
  placeholderTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  placeholderText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});
