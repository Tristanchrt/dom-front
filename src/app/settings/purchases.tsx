import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
  Modal,
  ScrollView,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { computeHeaderPaddings } from '@/constants/Layout';
import { router } from 'expo-router';
import { settingsOrders } from '@/data/fixtures/settings';

type UIPurchase = (typeof settingsOrders)[number];
const fallbackPurchases: UIPurchase[] = settingsOrders;

export default function PurchasesScreen() {
  const insets = useSafeAreaInsets();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'paid' | 'pending'>('all');
  const [purchases, setPurchases] = useState<UIPurchase[]>(fallbackPurchases);
  const [opened, setOpened] = useState<UIPurchase | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        // If you add a real use case later, load it here; for now use fixture
        if (!alive) return;
        setPurchases(fallbackPurchases);
      } catch {
        if (alive) setPurchases(fallbackPurchases);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const renderPurchase = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.card} activeOpacity={0.85} onPress={() => setOpened(item)}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.product} numberOfLines={1}>{item.productName}</Text>
        <Text style={styles.seller}>Seller: {item.customerName}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.price}>{item.price}</Text>
          <Text style={styles.date}>{new Date(item.date).toLocaleDateString('fr-FR')}</Text>
        </View>
      </View>
      <View style={styles.badge}>
        <View style={[styles.statusBadge, { backgroundColor: item.status === 'Paid' ? '#E8F5E8' : item.status === 'Pending' ? '#FFF4E6' : '#FDECEC' }]}>
          <Text style={[styles.statusText, { color: item.status === 'Paid' ? '#4CAF50' : item.status === 'Pending' ? '#FF8C42' : '#FF4444' }]}>
            {item.status}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const filtered = purchases.filter((p) => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'paid') return p.status === 'Paid';
    if (selectedFilter === 'pending') return p.status === 'Pending';
    return true;
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={[styles.header, computeHeaderPaddings(insets)]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <FontAwesome name="arrow-left" size={24} color="#2C1810" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My purchases</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterTab, selectedFilter === 'all' && styles.activeFilter]}
          onPress={() => setSelectedFilter('all')}
        >
          <Text style={[styles.filterText, selectedFilter === 'all' && styles.activeFilterText]}>All ({purchases.length})</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, selectedFilter === 'paid' && styles.activeFilter]}
          onPress={() => setSelectedFilter('paid')}
        >
          <Text style={[styles.filterText, selectedFilter === 'paid' && styles.activeFilterText]}>Paid</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, selectedFilter === 'pending' && styles.activeFilter]}
          onPress={() => setSelectedFilter('pending')}
        >
          <Text style={[styles.filterText, selectedFilter === 'pending' && styles.activeFilterText]}>Pending</Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      <FlatList
        data={filtered}
        renderItem={renderPurchase}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: Math.max(insets.bottom, 8) + 8 }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <FontAwesome name="credit-card" size={48} color="#E0E0E0" />
            <Text style={styles.emptyTitle}>No purchases found</Text>
            <Text style={styles.emptyText}>Your purchases will appear here</Text>
          </View>
        }
      />

      {/* Details modal */}
      <Modal visible={!!opened} transparent animationType="slide" onRequestClose={() => setOpened(null)}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={() => setOpened(null)} />
          <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 12) }]}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Purchase details</Text>
              <TouchableOpacity onPress={() => setOpened(null)} style={styles.sheetClose}>
                <FontAwesome name="times" size={20} color="#8B7355" />
              </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={{ paddingBottom: 8 }} showsVerticalScrollIndicator={false}>
              {opened && (
                <View style={{ paddingHorizontal: 16 }}>
                  <View style={styles.detailRow}>
                    <Image source={{ uri: opened.image }} style={styles.detailImage} />
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text style={styles.detailProduct}>{opened.productName}</Text>
                      <Text style={styles.detailLine}>Order #{opened.id}</Text>
                      <Text style={styles.detailLine}>Date: {new Date(opened.date).toLocaleDateString('fr-FR')}</Text>
                    </View>
                  </View>

                  <View style={styles.sectionBlock}>
                    <Text style={styles.sectionTitle}>Seller</Text>
                    <Text style={styles.detailLine}>{opened.customerName}</Text>
                    <Text style={styles.detailSub}>Email: seller@example.com</Text>
                    <Text style={styles.detailSub}>Phone: +33 6 11 22 33 44</Text>
                  </View>

                  <View style={styles.sectionBlock}>
                    <Text style={styles.sectionTitle}>Delivery</Text>
                    <Text style={styles.detailLine}>Address: 21 rue des Lilas, 69001 Lyon</Text>
                    <Text style={styles.detailSub}>Method: Colissimo</Text>
                    <Text style={styles.detailSub}>Tracking: 6A9876543210</Text>
                  </View>

                  <View style={styles.sectionBlock}>
                    <Text style={styles.sectionTitle}>Payment</Text>
                    <Text style={styles.detailLine}>Method: Visa **** 4242</Text>
                    <Text style={styles.detailSub}>Status: {opened.status}</Text>
                  </View>

                  <View style={styles.sectionBlock}>
                    <Text style={styles.sectionTitle}>Summary</Text>
                    <View style={styles.summaryRow}>
                      <Text style={styles.summaryLabel}>Quantity</Text>
                      <Text style={styles.summaryValue}>{opened.quantity}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                      <Text style={styles.summaryLabel}>Price</Text>
                      <Text style={styles.summaryValue}>{opened.price}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                      <Text style={styles.summaryLabel}>Shipping</Text>
                      <Text style={styles.summaryValue}>3 €</Text>
                    </View>
                    <View style={[styles.summaryRow, { borderTopWidth: 1, borderTopColor: '#F0E0D0', paddingTop: 8, marginTop: 4 }] }>
                      <Text style={[styles.summaryLabel, { fontWeight: '700' }]}>Total</Text>
                      <Text style={[styles.summaryValue, { color: '#FF8C42', fontWeight: '700' }]}>
                        {opened.price}
                      </Text>
                    </View>
                  </View>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    borderRadius: 8,
    padding: 4,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeFilter: {
    backgroundColor: '#FF8C42',
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8B7355',
  },
  activeFilterText: {
    color: '#FFFFFF',
  },
  card: {
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
  image: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  info: { flex: 1 },
  product: { fontSize: 16, fontWeight: '600', color: '#2C1810', marginBottom: 4 },
  seller: { fontSize: 12, color: '#8B7355', marginBottom: 6 },
  metaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  price: { fontSize: 14, fontWeight: '700', color: '#2C1810' },
  date: { fontSize: 12, color: '#8B7355' },
  badge: { alignItems: 'flex-end' },
  statusBadge: { borderRadius: 10, paddingHorizontal: 8, paddingVertical: 4 },
  statusText: { fontSize: 12, fontWeight: '600' },
  empty: { alignItems: 'center', paddingVertical: 48 },
  emptyTitle: { fontSize: 16, fontWeight: 'bold', color: '#2C1810', marginTop: 16 },
  emptyText: { fontSize: 14, color: '#8B7355', marginTop: 6 },
  // Modal
  modalContainer: { flex: 1, justifyContent: 'flex-end' },
  modalBackdrop: { ...StyleSheet.absoluteFillObject as any, backgroundColor: 'rgba(0,0,0,0.3)' },
  sheet: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 16, borderTopRightRadius: 16, paddingTop: 12 },
  sheetHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 8 },
  sheetTitle: { fontSize: 16, fontWeight: '600', color: '#2C1810' },
  sheetClose: { padding: 6 },
  detailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  detailImage: { width: 64, height: 64, borderRadius: 8, backgroundColor: '#F0F0F0' },
  detailProduct: { fontSize: 16, fontWeight: '600', color: '#2C1810', marginBottom: 4 },
  detailLine: { fontSize: 14, color: '#2C1810' },
  detailSub: { fontSize: 12, color: '#8B7355', marginTop: 2 },
  sectionBlock: { backgroundColor: '#FFF7F0', borderRadius: 12, padding: 12, marginTop: 8 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#2C1810', marginBottom: 8 },
  summaryRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
  summaryLabel: { fontSize: 13, color: '#8B7355' },
  summaryValue: { fontSize: 14, color: '#2C1810', fontWeight: '600' },
});


