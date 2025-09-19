import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import { sellerProductsUseCases } from '@/data/container';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { computeHeaderPaddings } from '@/constants/Layout';
import { settingsSellerProducts } from '@/data/fixtures/settings';

type UISellerProduct = (typeof settingsSellerProducts)[number];
const fallbackProducts: UISellerProduct[] = settingsSellerProducts;

export default function ProductsScreen() {
  const insets = useSafeAreaInsets();
  const [selectedTab, setSelectedTab] = useState<'active' | 'draft'>('active');
  const [products, setProducts] = useState<UISellerProduct[]>(fallbackProducts);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const list = await sellerProductsUseCases.listMine();
        if (!alive) return;
        if (!list || list.length === 0) {
          setProducts(fallbackProducts);
        } else {
          const mapped: UISellerProduct[] = list.map((p) => ({
            id: p.id,
            name: p.name,
            price: p.priceLabel,
            status: p.status,
            image: p.imageUrl,
            sales: p.sales,
            views: p.views,
          }));
          setProducts(mapped);
        }
      } catch (_e) {
        if (alive) setProducts(fallbackProducts);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const renderProduct = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.productCard}>
      <Image source={{ uri: item.image }} style={styles.productImage} />

      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <View style={styles.productMeta}>
          <FontAwesome name="circle" size={8} color="#FF8C42" />
          <Text style={styles.productSeller}>Marin</Text>
        </View>
        <Text style={styles.productPrice}>{item.price}</Text>
      </View>

      <View style={styles.productActions}>
        <TouchableOpacity style={styles.actionButton}>
          <FontAwesome name="edit" size={16} color="#FF8C42" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <FontAwesome name="trash" size={16} color="#FF4444" />
        </TouchableOpacity>
        <View
          style={[
            styles.statusBadge,
            item.status === 'Active' ? styles.activeBadge : styles.draftBadge,
          ]}
        >
          <Text
            style={[
              styles.statusText,
              item.status === 'Active' ? styles.activeText : styles.draftText,
            ]}
          >
            {item.status}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const filteredProducts = products.filter((product) =>
    selectedTab === 'active' ? product.status === 'Active' : product.status === 'Draft',
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={[styles.header, computeHeaderPaddings(insets)]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <FontAwesome name="arrow-left" size={24} color="#2C1810" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Produits</Text>
        <TouchableOpacity style={styles.addButton}>
          <FontAwesome name="plus" size={20} color="#FF8C42" />
        </TouchableOpacity>
      </View>

      {/* Stats Banner */}
      <View style={styles.statsBanner}>
        <View style={styles.statsItem}>
          <Text style={styles.statsNumber}>156</Text>
          <Text style={styles.statsLabel}>Ventes totales</Text>
        </View>
        <View style={styles.statsItem}>
          <Text style={styles.statsNumber}>2.4k</Text>
          <Text style={styles.statsLabel}>Vues totales</Text>
        </View>
        <View style={styles.statsItem}>
          <Text style={styles.statsNumber}>4.8</Text>
          <Text style={styles.statsLabel}>Note moyenne</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'active' && styles.activeTab]}
          onPress={() => setSelectedTab('active')}
        >
          <Text style={[styles.tabText, selectedTab === 'active' && styles.activeTabText]}>
            Active ({products.filter((p) => p.status === 'Active').length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'draft' && styles.activeTab]}
          onPress={() => setSelectedTab('draft')}
        >
          <Text style={[styles.tabText, selectedTab === 'draft' && styles.activeTabText]}>
            Draft ({products.filter((p) => p.status === 'Draft').length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Products List */}
      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.productsList}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <FontAwesome name="shopping-bag" size={48} color="#E0E0E0" />
            <Text style={styles.emptyText}>
              Aucun produit {selectedTab === 'active' ? 'actif' : 'en brouillon'}
            </Text>
            <TouchableOpacity style={styles.createButton}>
              <Text style={styles.createButtonText}>Créer un produit</Text>
            </TouchableOpacity>
          </View>
        }
      />
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
  addButton: {
    padding: 8,
  },
  statsBanner: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    paddingVertical: 20,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsItem: {
    flex: 1,
    alignItems: 'center',
  },
  statsNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 4,
  },
  statsLabel: {
    fontSize: 12,
    color: '#8B7355',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: '#FF8C42',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B7355',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  productsList: {
    padding: 16,
  },
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C1810',
    marginBottom: 4,
  },
  productMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  productSeller: {
    fontSize: 12,
    color: '#FF8C42',
    marginLeft: 6,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2C1810',
  },
  productActions: {
    alignItems: 'flex-end',
    gap: 8,
  },
  actionButton: {
    padding: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeBadge: {
    backgroundColor: '#E8F5E8',
  },
  draftBadge: {
    backgroundColor: '#FFF4E6',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  activeText: {
    color: '#4CAF50',
  },
  draftText: {
    color: '#FF8C42',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 16,
    color: '#8B7355',
    marginTop: 16,
    marginBottom: 24,
  },
  createButton: {
    backgroundColor: '#FF8C42',
    borderRadius: 25,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
