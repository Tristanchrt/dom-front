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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { computeHeaderPaddings } from '@/constants/Layout';
import { router } from 'expo-router';
import { ordersUseCases } from '@/data/container';
import { settingsOrders } from '@/data/fixtures/settings';

type UIOrder = (typeof settingsOrders)[number];
const fallbackOrders: UIOrder[] = settingsOrders;

export default function OrdersScreen() {
  const insets = useSafeAreaInsets();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'paid' | 'pending'>('all');
  const [orders, setOrders] = useState<UIOrder[]>(fallbackOrders);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const list = await ordersUseCases.list();
        if (!alive) return;
        if (!list || list.length === 0) {
          setOrders(fallbackOrders);
        } else {
          const mapped: UIOrder[] = list.map((o) => ({
            id: o.id,
            productName: o.item.productName,
            customerName: o.customerName,
            price: '—',
            status: o.status,
            date: o.placedAt.toISOString(),
            image: o.item.imageUrl ?? '',
            quantity: o.item.quantity,
          }));
          setOrders(mapped);
        }
      } catch (_e) {
        if (alive) setOrders(fallbackOrders);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return '#4CAF50';
      case 'Pending':
        return '#FF8C42';
      case 'Cancelled':
        return '#FF4444';
      default:
        return '#8B7355';
    }
  };

  const renderOrder = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.orderCard}>
      <Image source={{ uri: item.image }} style={styles.orderImage} />

      <View style={styles.orderInfo}>
        <Text style={styles.orderProduct}>{item.productName}</Text>
        <Text style={styles.orderCustomer}>Customer: {item.customerName}</Text>
        <Text style={styles.orderDate}>{new Date(item.date).toLocaleDateString('fr-FR')}</Text>
        <View style={styles.orderMeta}>
          <Text style={styles.orderQuantity}>Qty: {item.quantity}</Text>
          <Text style={styles.orderPrice}>{item.price}</Text>
        </View>
      </View>

      <View style={styles.orderActions}>
        <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(item.status)}20` }]}>
          <View style={[styles.statusDot, { backgroundColor: getStatusColor(item.status) }]} />
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status}
          </Text>
        </View>
        <TouchableOpacity style={styles.moreButton}>
          <FontAwesome name="ellipsis-h" size={16} color="#8B7355" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const filteredOrders = orders.filter((order) => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'paid') return order.status === 'Paid';
    if (selectedFilter === 'pending') return order.status === 'Pending';
    return true;
  });

  const totalRevenue = orders.reduce(
    (sum, order) => sum + (parseInt(order.price.replace(' €', '')) || 0),
    0,
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={[styles.header, computeHeaderPaddings(insets)]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <FontAwesome name="arrow-left" size={24} color="#2C1810" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Commandes</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Revenue Summary */}
      <View style={styles.revenueBanner}>
        <View style={styles.revenueContent}>
          <View style={styles.revenueStats}>
            <Text style={styles.revenueAmount}>{totalRevenue} €</Text>
            <Text style={styles.revenueLabel}>Total revenue</Text>
          </View>
          <View style={styles.revenueStats}>
            <Text style={styles.revenueAmount}>{orders.length}</Text>
            <Text style={styles.revenueLabel}>Total orders</Text>
          </View>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterTab, selectedFilter === 'all' && styles.activeFilter]}
          onPress={() => setSelectedFilter('all')}
        >
          <Text style={[styles.filterText, selectedFilter === 'all' && styles.activeFilterText]}>
            All ({orders.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, selectedFilter === 'paid' && styles.activeFilter]}
          onPress={() => setSelectedFilter('paid')}
        >
          <Text style={[styles.filterText, selectedFilter === 'paid' && styles.activeFilterText]}>
            Paid ({orders.filter((o) => o.status === 'Paid').length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, selectedFilter === 'pending' && styles.activeFilter]}
          onPress={() => setSelectedFilter('pending')}
        >
          <Text
            style={[styles.filterText, selectedFilter === 'pending' && styles.activeFilterText]}
          >
            Pending ({orders.filter((o) => o.status === 'Pending').length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Orders List */}
      <FlatList
        data={filteredOrders}
        renderItem={renderOrder}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.ordersList}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <FontAwesome name="shopping-cart" size={48} color="#E0E0E0" />
            <Text style={styles.emptyText}>No orders found</Text>
            <Text style={styles.emptySubtext}>Your orders will appear here</Text>
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
  headerSpacer: {
    width: 40,
  },
  revenueBanner: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  revenueContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  revenueStats: {
    alignItems: 'center',
  },
  revenueAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF8C42',
    marginBottom: 4,
  },
  revenueLabel: {
    fontSize: 12,
    color: '#8B7355',
    textAlign: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 8,
    padding: 4,
    marginBottom: 16,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 12,
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
  ordersList: {
    paddingHorizontal: 16,
  },
  orderCard: {
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
  orderImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  orderInfo: {
    flex: 1,
  },
  orderProduct: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C1810',
    marginBottom: 4,
  },
  orderCustomer: {
    fontSize: 12,
    color: '#8B7355',
    marginBottom: 2,
  },
  orderDate: {
    fontSize: 12,
    color: '#8B7355',
    marginBottom: 4,
  },
  orderMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderQuantity: {
    fontSize: 12,
    color: '#8B7355',
  },
  orderPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2C1810',
  },
  orderActions: {
    alignItems: 'flex-end',
    gap: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  moreButton: {
    padding: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 16,
    color: '#8B7355',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#B0B0B0',
  },
});
