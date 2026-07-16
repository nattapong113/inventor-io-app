import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput, TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomNav from '../components/BottomNav';

export default function ProductsScreen() {
  const router = useRouter();
  
  // สร้าง State สำหรับเก็บข้อมูลที่ดึงมา และสถานะการโหลด
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // ฟังก์ชันสำหรับดึงข้อมูล JSON
  const fetchProducts = async () => {
    try {
      const url = 'https://raw.githubusercontent.com/nattapong113/inventor-io-app/refs/heads/main/products.json';
      
      const response = await fetch(url);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
      // ถ้าดึงไม่สำเร็จ หรือลิงก์ยังไม่พร้อม จะโชว์ข้อมูลสำรองไปก่อน
      alert('ยังไม่ได้ใส่ลิงก์ GitHub หรือดึงข้อมูลล้มเหลวครับ');
    } finally {
      setIsLoading(false); // ปิดตัวหมุนโหลดเมื่อทำงานเสร็จ (ไม่ว่าจะสำเร็จหรือพัง)
    }
  };

  // สั่งให้ดึงข้อมูลทันทีที่เปิดหน้านี้ขึ้นมา
  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      {/* Modern Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/home')} style={styles.iconButton}>
          <Ionicons name="arrow-back" size={24} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Products</Text>
        <TouchableOpacity style={styles.profileAvatar}>
          <Text style={styles.profileInitials}>JD</Text>
        </TouchableOpacity>
      </View>

      {/* Action Bar: Search & Add */}
      <View style={styles.actionBar}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#94A3B8" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            placeholderTextColor="#94A3B8"
          />
        </View>
        
        <Link href="/add" asChild>
          <TouchableOpacity style={styles.addButton}>
            <Ionicons name="add" size={20} color="#FFF" />
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </Link>
      </View>

      {/* Product List */}
      <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
        
        {/* แสดงตัวหมุนโหลดข้อมูลระหว่างที่กำลังดึงข้อมูลจากอินเทอร์เน็ต */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2563EB" />
            <Text style={styles.loadingText}>Loading products from GitHub...</Text>
          </View>
        ) : (
          /* ดึงข้อมูลจาก State มาแสดงผล */
          products.map((product) => (
            <TouchableOpacity key={product.id} style={styles.productCard}>
              {/* ใช้คีย์ image_url ตาม JSON */}
              <Image source={{ uri: product.image_url }} style={styles.productImage} />
              
              <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={1}>{product.name}</Text>
                
                <View style={styles.detailRow}>
                  <Ionicons name="cube-outline" size={14} color="#64748B" />
                  {/* ใช้คีย์ stock_text ตาม JSON */}
                  <Text style={styles.detailText}>{product.stock_text}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Ionicons name="pricetag-outline" size={14} color="#64748B" />
                  <Text style={styles.detailText}>{product.category}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Ionicons name="location-outline" size={14} color="#64748B" />
                  {/* ใช้คีย์ location_text ตาม JSON */}
                  <Text style={styles.detailText}>{product.location_text}</Text>
                </View>

                {/* เปลี่ยนสี Badge ตามสถานะ badge_status */}
                <View style={[
                  styles.statusBadge,
                  product.badge_status === 'Active' ? styles.statusActive : styles.statusLowStock
                ]}>
                  <Text style={[
                    styles.statusText,
                    product.badge_status === 'Active' ? styles.statusActiveText : styles.statusLowStockText
                  ]}>
                    {product.badge_status}
                  </Text>
                </View>
              </View>

              <TouchableOpacity style={styles.moreButton}>
                <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))
        )}
        
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* แถบเมนูด้านล่าง */}
      <BottomNav activeScreen="products" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC', paddingBottom: 70 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 16, backgroundColor: '#F8FAFC',
  },
  iconButton: {
    padding: 8, backgroundColor: '#FFFFFF', borderRadius: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A' },
  profileAvatar: { 
    width: 36, height: 36, borderRadius: 18, backgroundColor: '#2563EB', 
    justifyContent: 'center', alignItems: 'center',
  },
  profileInitials: { color: '#FFFFFF', fontSize: 14, fontWeight: 'bold' },
  
  actionBar: { flexDirection: 'row', paddingHorizontal: 24, paddingBottom: 16, alignItems: 'center', gap: 12 },
  searchContainer: {
    flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF',
    borderRadius: 16, paddingHorizontal: 16, height: 48,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 4, elevation: 1,
  },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 14, color: '#0F172A', fontWeight: '500' },
  addButton: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#2563EB',
    paddingHorizontal: 16, height: 48, borderRadius: 16,
    shadowColor: '#2563EB', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  addButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700', marginLeft: 4 },
  
  listContainer: { flex: 1, paddingHorizontal: 24 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100 },
  loadingText: { marginTop: 12, color: '#64748B', fontWeight: '600' },
  
  productCard: {
    flexDirection: 'row', backgroundColor: '#FFFFFF', borderRadius: 20, padding: 16, marginBottom: 16,
    alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04, shadowRadius: 10, elevation: 3,
  },
  productImage: { width: 84, height: 84, borderRadius: 16, backgroundColor: '#F1F5F9' },
  productInfo: { flex: 1, marginLeft: 16, justifyContent: 'center' },
  productName: { fontSize: 16, fontWeight: '800', color: '#0F172A', marginBottom: 8 },
  detailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  detailText: { fontSize: 12, color: '#64748B', marginLeft: 6, fontWeight: '500' },
  
  statusBadge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, marginTop: 8 },
  statusActive: { backgroundColor: '#D1FAE5' },
  statusActiveText: { color: '#059669', fontSize: 11, fontWeight: '700' },
  statusLowStock: { backgroundColor: '#FCE7F3' }, // สีชมพูอมม่วงแบบในรูปโจทย์
  statusLowStockText: { color: '#DB2777', fontSize: 11, fontWeight: '700' },
  
  moreButton: { padding: 8 },
});