import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomNav from '../components/BottomNav';

const MOCK_PRODUCTS = [
  {
    id: '1',
    name: 'LG UltraGear 27" 165Hz',
    stock: 24,
    category: 'Gaming Monitors',
    location: 'Bangkok, TH',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=200&h=200&fit=crop',
  },
  {
    id: '2',
    name: 'Dell UltraSharp 27" 4K',
    stock: 8,
    category: 'Office Monitors',
    location: 'Chon Buri, TH',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1586952518485-11b180e92764?w=200&h=200&fit=crop',
  },
  {
    id: '3',
    name: 'Samsung Odyssey G9 49"',
    stock: 0,
    category: 'Curved Monitors',
    location: 'Warehouse',
    status: 'Sold out',
    image: 'https://images.unsplash.com/photo-1616763355548-1b606f439fce?w=200&h=200&fit=crop',
  },
  {
    id: '4',
    name: 'BenQ ZOWIE 24" 144Hz',
    stock: 15,
    category: 'Esports Monitors',
    location: 'Chiang Mai, TH',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1551645120-d70bfe84c826?w=200&h=200&fit=crop',
  },
];

export default function ProductsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {/* เปลี่ยนคำสั่งตรงนี้เพื่อให้กลับไปหน้า Home แทนการใช้ back() */}
        <TouchableOpacity onPress={() => router.replace('/home')}>
          <Ionicons name="arrow-back" size={26} color="#1E3A8A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Products</Text>
        <TouchableOpacity>
          <Ionicons name="person-circle-outline" size={30} color="#8B5CF6" />
        </TouchableOpacity>
      </View>

      {/* Action Bar: Search & Add */}
      <View style={styles.actionBar}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            placeholderTextColor="#9CA3AF"
          />
        </View>
        
        <Link href="/add" asChild>
          <TouchableOpacity style={styles.addButton}>
            <Ionicons name="add" size={20} color="#FFF" />
            <Text style={styles.addButtonText}>Add Product</Text>
          </TouchableOpacity>
        </Link>

        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="funnel-outline" size={20} color="#8B5CF6" />
        </TouchableOpacity>
      </View>

      {/* Product List */}
      <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
        {MOCK_PRODUCTS.map((product) => (
          <TouchableOpacity key={product.id} style={styles.productCard}>
            <Image source={{ uri: product.image }} style={styles.productImage} />
            
            <View style={styles.productInfo}>
              <Text style={styles.productName} numberOfLines={1}>{product.name}</Text>
              
              <View style={styles.detailRow}>
                <Ionicons name="cube-outline" size={14} color="#6B7280" />
                <Text style={styles.detailText}>Stock: {product.stock} units</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Ionicons name="pricetag-outline" size={14} color="#6B7280" />
                <Text style={styles.detailText}>{product.category}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Ionicons name="location-outline" size={14} color="#6B7280" />
                <Text style={styles.detailText}>{product.location}</Text>
              </View>

              <View style={[
                styles.statusBadge,
                product.status === 'Active' ? styles.statusActive : styles.statusSoldOut
              ]}>
                <Text style={[
                  styles.statusText,
                  product.status === 'Active' ? styles.statusActiveText : styles.statusSoldOutText
                ]}>
                  {product.status}
                </Text>
              </View>
            </View>

            <TouchableOpacity style={styles.moreButton}>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
        {/* เว้นระยะด้านล่างเผื่อเมนู */}
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* แถบเมนูด้านล่าง */}
      <BottomNav activeScreen="products" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6F8',
    paddingBottom: 70, 
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E3A8A',
  },
  actionBar: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
    gap: 10,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#1F2937',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingHorizontal: 12,
    height: 40,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  filterButton: {
    width: 40,
    height: 40,
    backgroundColor: '#F5F3FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  productImage: {
    width: 80, 
    height: 80,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  detailText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 6, 
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginTop: 6,
  },
  statusActive: {
    backgroundColor: '#ECFDF5',
  },
  statusActiveText: {
    color: '#10B981',
    fontSize: 10,
    fontWeight: '600',
  },
  statusSoldOut: {
    backgroundColor: '#FEF2F2',
  },
  statusSoldOutText: {
    color: '#EF4444',
    fontSize: 10,
    fontWeight: '600',
  },
  moreButton: {
    padding: 8,
  },
});