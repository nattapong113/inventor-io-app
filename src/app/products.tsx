import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import BottomNav from '../components/BottomNav';

export default function ProductsScreen() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // URL ของ API เซิร์ฟเวอร์
  const API_BASE_URL = 'http://119.59.102.161:3017/api';

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/products`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts();
  };

  const renderProduct = ({ item }: { item: any }) => {
    return (
      <View style={styles.card}>
        <View style={styles.cardTop}>
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: item.image || 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=200&h=200&fit=crop' }} 
              style={styles.productImage} 
              resizeMode="contain"
            />
          </View>
          
          <View style={styles.detailsContainer}>
            <Text style={styles.detailText}>
              <Text style={styles.detailLabel}>Stock: </Text>
              <Text style={styles.detailValue}>{item.stock} in stock</Text>
            </Text>
            <Text style={styles.detailText}>
              <Text style={styles.detailLabel}>Category: </Text>
              <Text style={styles.detailValue}>{item.category == 1 ? 'Monitors' : item.category || 'General'}</Text>
            </Text>
            <Text style={styles.detailText}>
              <Text style={styles.detailLabel}>Location: </Text>
              <Text style={styles.detailValue}>{item.location || '3 stores'}</Text>
            </Text>

            <View style={styles.statusRow}>
              <View style={styles.statusBadge}>
                <Text style={styles.statusBadgeText}>{item.status || 'Active'}</Text>
              </View>
              <TouchableOpacity
                style={styles.arrowButton}
                onPress={() => router.push({ pathname: '/edit', params: { id: item.id } })}
              >
                <Ionicons name="chevron-forward" size={16} color="#2563EB" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        
        <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuIcon}>
          <Ionicons name="menu-outline" size={32} color="#2563EB" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Products</Text>
        <TouchableOpacity style={styles.profileIcon}>
          <Ionicons name="person-outline" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Actions (Search, Add, Filter) */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.searchIcon}>
          <Ionicons name="search-outline" size={26} color="#2563EB" />
        </TouchableOpacity>
        
        <View style={styles.actionRight}>
          <TouchableOpacity style={styles.addButton} onPress={() => router.push('/add')}>
            <Text style={styles.addButtonText}>+ Add Product</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterButtonText}>Filter</Text>
            <Ionicons name="funnel" size={14} color="#2563EB" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Product List */}
      {isLoading ? (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item, index) => item.id?.toString() || index.toString()}
          renderItem={renderProduct}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2563EB']} />
          }
        />
      )}

      {/* Bottom Navigation */}
      <BottomNav activeScreen="products" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F8FAFC', 
    paddingBottom: 70 
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingVertical: 16,
    backgroundColor: '#F8FAFC'
  },
  menuIcon: {
    padding: 4,
  },
  headerTitle: { 
    fontSize: 22, 
    fontWeight: '800', 
    color: '#0F172A' 
  },
  profileIcon: { 
    width: 36, 
    height: 36, 
    borderRadius: 18, 
    backgroundColor: '#2563EB', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  actionsContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    marginBottom: 16 
  },
  searchIcon: {
    padding: 4,
  },
  actionRight: { 
    flexDirection: 'row', 
    gap: 12 
  },
  addButton: { 
    backgroundColor: '#2563EB', 
    paddingVertical: 10, 
    paddingHorizontal: 16, 
    borderRadius: 8 
  },
  addButtonText: { 
    color: '#FFFFFF', 
    fontWeight: '700', 
    fontSize: 13 
  },
  filterButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#FFFFFF', 
    paddingVertical: 10, 
    paddingHorizontal: 16, 
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 6
  },
  filterButtonText: { 
    color: '#2563EB', 
    fontWeight: '700', 
    fontSize: 13 
  },
  listContent: { 
    paddingHorizontal: 20, 
    paddingBottom: 20 
  },
  card: { 
    backgroundColor: '#FFFFFF', 
    borderRadius: 16, 
    padding: 16, 
    marginBottom: 16, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2
  },
  cardTop: { 
    flexDirection: 'row', 
    marginBottom: 16 
  },
  imageContainer: { 
    width: 100, 
    height: 100, 
    borderRadius: 12, 
    backgroundColor: '#FFFFFF', 
    justifyContent: 'center', 
    alignItems: 'center',
    marginRight: 16
  },
  productImage: { 
    width: '100%', 
    height: '100%', 
    borderRadius: 12 
  },
  detailsContainer: { 
    flex: 1, 
    justifyContent: 'center' 
  },
  detailText: { 
    fontSize: 13, 
    marginBottom: 4 
  },
  detailLabel: { 
    color: '#64748B' 
  },
  detailValue: { 
    color: '#1E293B', 
    fontWeight: '700' 
  },
  statusRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginTop: 8,
    gap: 12
  },
  statusBadge: { 
    backgroundColor: '#60A5FA', 
    paddingHorizontal: 16, 
    paddingVertical: 6, 
    borderRadius: 20 
  },
  statusBadgeText: { 
    color: '#FFFFFF', 
    fontSize: 12, 
    fontWeight: '700' 
  },
  arrowButton: { 
    backgroundColor: '#EFF6FF', 
    width: 28, 
    height: 28, 
    borderRadius: 14, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  productName: { 
    fontSize: 16, 
    fontWeight: '800', 
    color: '#0F172A' 
  },
  centerContent: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginTop: 100 
  }
});