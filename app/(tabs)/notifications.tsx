import { StyleSheet, SafeAreaView, Text, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export default function NotificationsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <FontAwesome name="bell" size={48} color="#FF8C42" />
        <Text style={styles.title}>Notifications</Text>
        <Text style={styles.subtitle}>Restez informé de toute l'activité</Text>
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
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C1810',
    marginTop: 20,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#8B7355',
    textAlign: 'center',
  },
});


