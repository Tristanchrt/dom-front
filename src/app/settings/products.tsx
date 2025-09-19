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
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import { sellerProductsUseCases } from '@/data/container';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { computeHeaderPaddings } from '@/constants/Layout';
import { Dimensions } from 'react-native';
import { settingsSellerProducts } from '@/data/fixtures/settings';

type UISellerProduct = (typeof settingsSellerProducts)[number];
const fallbackProducts: UISellerProduct[] = settingsSellerProducts;

const CATEGORIES = [
  'Livres & Écriture',
  'Art Visuel',
  'Musique & Son',
  'Objets Artisanaux',
  'Mode & Accessoires',
  'Maison & Décoration',
  'Papeterie & Illustration',
  'Jeux & Univers Ludiques',
  'DIY & Matériaux créatifs',
  'Bien-être & Art de Vivre',
  'Expériences & Services Créatifs',
] as const;

export default function ProductsScreen() {
  const insets = useSafeAreaInsets();
  const isSmallScreen = Dimensions.get('window').height < 700;
  const [selectedTab, setSelectedTab] = useState<'active' | 'draft'>('active');
  const [products, setProducts] = useState<UISellerProduct[]>(fallbackProducts);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newCategory, setNewCategory] = useState<string | null>(null);
  const [newImages, setNewImages] = useState<string[]>([]);
  const [newDescription, setNewDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagDraft, setTagDraft] = useState('');

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
        <TouchableOpacity style={styles.addButton} onPress={() => setIsCreateOpen(true)}>
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

      {/* Create Product Modal */}
      <Modal
        visible={isCreateOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setIsCreateOpen(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => setIsCreateOpen(false)}
          />
          <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 12), maxHeight: '85%' }]}>
            <View style={styles.sheetHandle} />
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Nouveau produit</Text>
              <TouchableOpacity onPress={() => setIsCreateOpen(false)} style={styles.sheetClose}>
                <FontAwesome name="times" size={20} color="#8B7355" />
              </TouchableOpacity>
            </View>
            <ScrollView
              contentContainerStyle={{ paddingBottom: isSmallScreen ? 12 : 16 }}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Nom</Text>
                <View style={styles.inputRow}>
                  <FontAwesome name="pencil" size={16} color="#8B7355" style={{ marginRight: 10 }} />
                  <TextInput
                    style={[styles.textInput, { flex: 1 }]}
                    placeholder="Nom du produit"
                    placeholderTextColor="#8B7355"
                    value={newName}
                    onChangeText={setNewName}
                    maxLength={80}
                  />
                </View>
              </View>

              {/* Photos */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Photos (min 1)</Text>
                <View style={styles.photosRow}>
                  {newImages.map((uri) => (
                    <View key={uri} style={styles.photoItem}>
                      <Image source={{ uri }} style={styles.photoThumb} />
                      <TouchableOpacity
                        style={styles.photoRemove}
                        onPress={() => setNewImages((prev) => prev.filter((u) => u !== uri))}
                      >
                        <Text style={styles.photoRemoveText}>×</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                  <TouchableOpacity
                    style={[styles.photoAdd, isSmallScreen && { paddingHorizontal: 10, paddingVertical: 8 }]}
                    onPress={async () => {
                      try {
                        const res = await ImagePicker.launchImageLibraryAsync({
                          mediaTypes: ImagePicker.MediaTypeOptions.Images,
                          allowsMultipleSelection: true,
                          selectionLimit: 10,
                          quality: 0.85,
                        });
                        if (!res.canceled) {
                          const picked = (res as any).assets?.map((a: any) => a.uri).filter(Boolean) || [];
                          if (picked.length > 0) {
                            setNewImages((prev) => Array.from(new Set([...(prev || []), ...picked])));
                          }
                        }
                      } catch (e) {
                        Alert.alert('Erreur', "Impossible d'ouvrir la galerie");
                      }
                    }}
                  >
                    <FontAwesome name="image" size={18} color="#FF8C42" />
                    <Text style={styles.photoAddText}>Ajouter</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Description (optional) */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Description (optionnel)</Text>
                <View style={styles.inputRow}>
                  <FontAwesome name="align-left" size={16} color="#8B7355" style={{ marginRight: 10 }} />
                  <TextInput
                    style={[styles.textInput, { flex: 1, height: 90, textAlignVertical: 'top' }]}
                    placeholder="Décrivez votre produit..."
                    placeholderTextColor="#8B7355"
                    value={newDescription}
                    onChangeText={setNewDescription}
                    multiline
                    maxLength={500}
                  />
                </View>
              </View>

              <View style={styles.fieldRow}>
                <View style={[styles.fieldGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.fieldLabel}>Prix</Text>
                  <View style={styles.inputRow}>
                    <FontAwesome name="tag" size={16} color="#8B7355" style={{ marginRight: 10 }} />
                    <TextInput
                      style={[styles.textInput, { flex: 1 }]}
                      placeholder="Ex: 25 €"
                      placeholderTextColor="#8B7355"
                      value={newPrice}
                      onChangeText={setNewPrice}
                      keyboardType="decimal-pad"
                      maxLength={12}
                    />
                  </View>
                </View>
                <View style={{ width: 100, alignItems: 'center', justifyContent: 'flex-end' }}>
                  <Text style={[styles.fieldLabel, { marginBottom: 6 }]}>Statut</Text>
                  <View style={styles.statusPill}><Text style={styles.statusPillText}>Draft</Text></View>
                </View>
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Catégorie</Text>
                <View style={styles.categoriesWrap}>
                  {CATEGORIES.map((cat) => {
                    const selected = newCategory === cat;
                    return (
                      <TouchableOpacity
                        key={cat}
                        style={[styles.categoryChip, selected && styles.categoryChipSelected]}
                        onPress={() => setNewCategory(cat)}
                        activeOpacity={0.8}
                      >
                        <Text style={[styles.categoryChipText, selected && styles.categoryChipTextSelected]}>
                          {cat}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Hashtags */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>#hashtags (min 1, max 10)</Text>
                <View style={styles.tagsWrap}>
                  {tags.map((t) => (
                    <View key={t} style={styles.tagChip}>
                      <Text style={styles.tagChipText}>{t}</Text>
                      <TouchableOpacity onPress={() => setTags((prev) => prev.filter((x) => x !== t))}>
                        <Text style={styles.tagRemove}>×</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
                <View style={styles.tagInputRow}>
                  <View style={[styles.inputRow, { flex: 1 }]}>
                    <FontAwesome name="hashtag" size={16} color="#8B7355" style={{ marginRight: 10 }} />
                    <TextInput
                      style={[styles.textInput, { flex: 1 }]}
                      placeholder="#ajouter-un-hashtag"
                      placeholderTextColor="#8B7355"
                      value={tagDraft}
                      onChangeText={setTagDraft}
                      maxLength={40}
                    />
                  </View>
                  <TouchableOpacity
                    style={[styles.secondaryButton, { marginLeft: 8 }]}
                    onPress={() => {
                      const raw = tagDraft.trim();
                      if (!raw) return;
                      let norm = raw.startsWith('#') ? raw : `#${raw}`;
                      norm = norm.replace(/\s+/g, '-');
                      if (tags.includes(norm)) {
                        setTagDraft('');
                        return;
                      }
                      if (tags.length >= 10) {
                        Alert.alert('Maximum atteint', 'Vous pouvez ajouter jusqu\'à 10 hashtags.');
                        return;
                      }
                      setTags((prev) => [...prev, norm]);
                      setTagDraft('');
                    }}
                  >
                    <Text style={styles.secondaryButtonText}>Ajouter</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>

            <TouchableOpacity
              style={[styles.primaryButton, (!newName.trim() || !newCategory || newImages.length < 1 || tags.length < 1) && { opacity: 0.6 }]}
              onPress={() => {
                if (!newName.trim()) {
                  Alert.alert('Nom requis', 'Veuillez saisir un nom de produit.');
                  return;
                }
                if (!newCategory) {
                  Alert.alert('Catégorie requise', 'Veuillez sélectionner une catégorie.');
                  return;
                }
                if (newImages.length < 1) {
                  Alert.alert('Photo requise', 'Veuillez ajouter au moins une photo.');
                  return;
                }
                if (tags.length < 1) {
                  Alert.alert('Hashtag requis', 'Veuillez ajouter au moins un hashtag.');
                  return;
                }
                const priceLabel = newPrice.trim() ? newPrice.trim() : '—';
                const newItem: UISellerProduct = {
                  id: `tmp_${Date.now()}`,
                  name: newName.trim(),
                  price: priceLabel,
                  status: 'Draft' as any,
                  image: newImages[0] as string,
                  sales: 0,
                  views: 0,
                };
                setProducts((prev) => [newItem, ...prev]);
                setIsCreateOpen(false);
                setNewName('');
                setNewPrice('');
                setNewCategory(null);
                setNewImages([]);
                setNewDescription('');
                setTags([]);
                setTagDraft('');
              }}
            >
              <Text style={styles.primaryButtonText}>Créer</Text>
            </TouchableOpacity>
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
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 6,
  },
  sheetHandle: {
    alignSelf: 'center',
    width: 48,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E6DCD0',
    marginTop: 8,
    marginBottom: 8,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C1810',
  },
  sheetClose: {
    padding: 6,
  },
  fieldGroup: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 12,
    color: '#8B7355',
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#2C1810',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  statusPill: {
    backgroundColor: '#FFF4E6',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#FF8C42',
  },
  statusPillText: {
    color: '#FF8C42',
    fontSize: 12,
    fontWeight: '600',
  },
  categoriesWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  categoryChip: {
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  categoryChipSelected: {
    backgroundColor: '#FFF4E6',
    borderColor: '#FF8C42',
  },
  categoryChipText: {
    fontSize: 12,
    color: '#8B7355',
  },
  categoryChipTextSelected: {
    color: '#FF8C42',
    fontWeight: '600',
  },
  tagChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF4E6',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#FF8C42',
  },
  tagChipText: {
    color: '#FF8C42',
    fontSize: 12,
    fontWeight: '600',
    marginRight: 6,
  },
  tagRemove: {
    color: '#8B7355',
    fontSize: 14,
  },
  tagInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  primaryButton: {
    marginTop: 4,
    marginHorizontal: 16,
    backgroundColor: '#FF8C42',
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#FFF4E6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#FF8C42',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: '#FF8C42',
    fontSize: 14,
    fontWeight: '600',
  },
  photosRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10,
  },
  photoItem: {
    position: 'relative',
  },
  photoThumb: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
  },
  photoRemove: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#2C1810',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoRemoveText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  photoAdd: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFF4E6',
    borderWidth: 1,
    borderColor: '#FF8C42',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  photoAddText: {
    color: '#FF8C42',
    fontSize: 14,
    fontWeight: '600',
  },
});
