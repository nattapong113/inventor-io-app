import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomNav from '../components/BottomNav';

export default function HomeScreen() {
  const router = useRouter();
  const [isMenuVisible, setMenuVisible] = useState(false);

  // 1. สร้าง State เก็บข้อมูลสินค้าสำหรับหน้า Home
  const [trendingProducts, setTrendingProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // ประกาศตัวแปร URL ของเซิร์ฟเวอร์ (ชี้ไปที่ IP ของมหาวิทยาลัยและพอร์ต 3017)
  const API_BASE_URL = 'http://119.59.102.161:3017/api';

  // 2. ฟังก์ชันดึงข้อมูลจาก Backend Database
  const fetchTrendingProducts = async () => {
    try {
      setIsLoading(true);
      
      // ดึงข้อมูลจากเซิร์ฟเวอร์มหาลัย
      const response = await fetch(`${API_BASE_URL}/products`);
      
      if (!response.ok) {
         throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // เอาแค่ 3 อันดับแรกมาโชว์ในหน้า Home จะได้ไม่ล้น
      setTrendingProducts(data.slice(0, 3));
    } catch (error) {
      console.error("Error fetching trending products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 3. สั่งให้ทำงานตอนเปิดหน้า Home
  useEffect(() => {
    fetchTrendingProducts();
  }, []);

  const handleNavigation = (path: string) => {
    setMenuVisible(false); 
    if (path === '/') router.replace(path); 
    else router.push(path as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      
      {/* Modal Menu */}
      <Modal visible={isMenuVisible} animationType="fade" transparent={false}>
        <SafeAreaView style={styles.modalBackground}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setMenuVisible(false)} style={styles.closeButton}>
              <Ionicons name="close" size={32} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Jett Dash</Text>
            <View style={{ width: 32 }} /> 
          </View>
          <View style={styles.modalItemsContainer}>
            {['/home', '/products', '/categories', '/stores', '/finances'].map((path, idx) => (
              <TouchableOpacity key={idx} onPress={() => handleNavigation(path)}>
                <Text style={styles.modalItemText}>{path.replace('/', '').charAt(0).toUpperCase() + path.slice(2)}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={() => handleNavigation('/')}>
            <Text style={styles.logoutText}>Log out</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>

      {/* Modern Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.menuBtn}>
            <Ionicons name="grid-outline" size={24} color="#0F172A" />
          </TouchableOpacity>
          <View>
            <Text style={styles.greetingText}>Good Morning,</Text>
            <Text style={styles.headerTitle}>Jett Dash</Text>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.profileBtn} 
          onPress={() => router.push('/settings')}
        >
          <View style={styles.profileAvatar}>
            <Text style={styles.profileInitials}>JD</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Modern Stats Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Overview</Text>
        </View>
        
        <View style={styles.statsRow}>
          <View style={[styles.statBox, { backgroundColor: '#EEF2FF' }]}>
            <View style={[styles.iconWrapper, { backgroundColor: '#C7D2FE' }]}>
              <Ionicons name="cube" size={20} color="#4F46E5" />
            </View>
            <Text style={styles.statNumber}>156</Text>
            <Text style={styles.statLabel}>Total Items</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: '#F0FDF4' }]}>
            <View style={[styles.iconWrapper, { backgroundColor: '#BBF7D0' }]}>
              <Ionicons name="cart" size={20} color="#16A34A" />
            </View>
            <Text style={styles.statNumber}>34</Text>
            <Text style={styles.statLabel}>New Orders</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: '#FEF2F2' }]}>
            <View style={[styles.iconWrapper, { backgroundColor: '#FECACA' }]}>
              <Ionicons name="warning" size={20} color="#DC2626" />
            </View>
            <Text style={styles.statNumber}>2</Text>
            <Text style={styles.statLabel}>Low Stock</Text>
          </View>
        </View>

        {/* Trending Monitors */}
        <View style={styles.sectionHeaderWithLink}>
          <Text style={styles.sectionTitle}>Trending Monitors</Text>
          <TouchableOpacity onPress={() => router.push('/products')}>
            <Text style={styles.seeAllText}>See all</Text>
          </TouchableOpacity>
        </View>

        {/* ดึงข้อมูลจาก API มหาลัยมาโชว์ตรงนี้ */}
        {isLoading ? (
          <View style={{ paddingVertical: 20, alignItems: 'center' }}>
            <ActivityIndicator size="small" color="#2563EB" />
          </View>
        ) : (
          trendingProducts.map((product) => (
            <TouchableOpacity key={product.id} style={styles.productCard} onPress={() => router.push('/products')}>
              {/* แก้ชื่อฟิลด์เป็น product.image ตามโครงสร้างตารางฐานข้อมูล */}
              <Image source={{ uri: product.image }} style={styles.productImage} />
              <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={1}>{product.name}</Text>
                <View style={styles.badgeContainer}>
                  {/* นำค่าตัวเลขจาก product.stock มาต่อข้อความเอง */}
                  <Text style={styles.productStock}>{product.stock} in stock</Text>
                </View>
              </View>
              {/* ถ้าใน Database ยังไม่มีฟิลด์ price ระบบจะแสดง $299 เป็นค่าเริ่มต้น */}
              <Text style={styles.productPrice}>{product.price || '$299'}</Text>
            </TouchableOpacity>
          ))
        )}

        {/* Chart Placeholder */}
        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Sales Performance</Text>
        <View style={styles.chartCard}>
          <View style={styles.chartMockup}>
            {[40, 70, 50, 90, 60].map((h, i) => (
              <View key={i} style={[styles.bar, { height: h }]} />
            ))}
          </View>
          <Text style={styles.chartText}>Weekly Analytics</Text>
        </View>
        
        <View style={{ height: 40 }} />
      </ScrollView>

      <BottomNav activeScreen="home" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC', paddingBottom: 70 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 24, paddingVertical: 20, backgroundColor: '#F8FAFC',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  menuBtn: {
    backgroundColor: '#FFFFFF', padding: 10, borderRadius: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  greetingText: { fontSize: 12, color: '#64748B', fontWeight: '600' },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#0F172A' },
  
  profileBtn: {
    shadowColor: '#2563EB', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2, shadowRadius: 8, elevation: 4,
  },
  profileAvatar: { 
    width: 44, height: 44, borderRadius: 22, 
    backgroundColor: '#2563EB', 
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: '#FFFFFF' 
  },
  profileInitials: {
    color: '#FFFFFF', fontSize: 16, fontWeight: 'bold'
  },
  
  content: { flex: 1, paddingHorizontal: 24 },
  sectionHeader: { marginBottom: 16 },
  sectionHeaderWithLink: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A' },
  seeAllText: { fontSize: 14, color: '#2563EB', fontWeight: '700' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  statBox: {
    flex: 1, paddingVertical: 16, paddingHorizontal: 12, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
  },
  iconWrapper: { padding: 10, borderRadius: 14, marginBottom: 12 },
  statNumber: { fontSize: 22, fontWeight: '800', color: '#0F172A' },
  statLabel: { fontSize: 11, fontWeight: '600', color: '#64748B', marginTop: 4 },
  productCard: {
    flexDirection: 'row', backgroundColor: '#FFFFFF', borderRadius: 20, padding: 12, marginBottom: 12,
    alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03, shadowRadius: 8, elevation: 2,
  },
  productImage: { width: 64, height: 64, borderRadius: 14 },
  productInfo: { flex: 1, marginLeft: 16, justifyContent: 'center' },
  productName: { fontSize: 15, fontWeight: '700', color: '#0F172A', marginBottom: 6 },
  badgeContainer: { backgroundColor: '#F1F5F9', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  productStock: { fontSize: 11, color: '#475569', fontWeight: '600' },
  productPrice: { fontSize: 18, fontWeight: '800', color: '#2563EB', paddingRight: 8 },
  chartCard: {
    backgroundColor: '#FFFFFF', borderRadius: 24, padding: 24, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.04, shadowRadius: 12, elevation: 3,
  },
  chartMockup: { flexDirection: 'row', alignItems: 'flex-end', gap: 12, height: 100, marginBottom: 16 },
  bar: { width: 30, backgroundColor: '#3B82F6', borderRadius: 6, opacity: 0.8 },
  chartText: { color: '#64748B', fontSize: 14, fontWeight: '600' },
  
  modalBackground: { flex: 1, backgroundColor: '#0F172A' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 24 },
  closeButton: { padding: 5 },
  modalTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: '800' },
  modalItemsContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 32 },
  modalItemText: { color: '#FFFFFF', fontSize: 28, fontWeight: '700', letterSpacing: 1 },
  logoutButton: { paddingBottom: 50, alignItems: 'center' },
  logoutText: { color: '#ef4444', fontSize: 18, fontWeight: '600' },
});