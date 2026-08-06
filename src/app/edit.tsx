import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomNav from '../components/BottomNav';

export default function EditProductScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  // State สำหรับเก็บข้อมูลฟอร์ม
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [itemCode, setItemCode] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ค่าที่ไม่ได้แก้ในฟอร์มนี้ แต่ต้องส่งกลับไปเพื่อไม่ให้ข้อมูลเดิมหาย
  const [brand, setBrand] = useState('');
  const [orderName, setOrderName] = useState('');

  // URL ของ API เซิร์ฟเวอร์มหาลัย
  const API_BASE_URL = 'http://119.59.102.161:3017/api';

  // ดึงข้อมูลสินค้าเดิมมาแสดงในฟอร์ม
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/products/${id}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setName(data.name || '');
        setDescription(data.sizes || '');
        setCategory(data.category?.toString() || '');
        setPrice(data.price?.toString() || '');
        setStock(data.stock?.toString() || '');
        setItemCode(data.productCode || '');
        setImageUrl(data.image || '');
        setBrand(data.brand || '');
        setOrderName(data.orderName || '');
      } catch (error) {
        console.error('Error fetching product:', error);
        Alert.alert('เกิดข้อผิดพลาด', 'ไม่สามารถโหลดข้อมูลสินค้าได้');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  // ฟังก์ชันสำหรับส่งข้อมูลที่แก้ไขไปยัง Backend
  const handleUpdateProduct = async () => {
    if (!name || !category || !stock) {
      Alert.alert('แจ้งเตือน', 'กรุณากรอกข้อมูลที่มีเครื่องหมาย * ให้ครบถ้วน');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          stock: parseInt(stock),
          category: parseInt(category) || 1,
          image: imageUrl || 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&h=500&fit=crop',
          status: parseInt(stock) > 5 ? 'Active' : 'Low in stock',
          price: parseFloat(price) || 0,
          sizes: description,
          productCode: itemCode,
          brand: brand,
          orderName: orderName,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      Alert.alert('สำเร็จ', 'แก้ไขสินค้าเรียบร้อยแล้ว!');
      router.replace('/products');

    } catch (error: any) {
      console.error('Error updating product:', error);
      Alert.alert('เกิดข้อผิดพลาด', `บันทึกข้อมูลล้มเหลว: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/products')} style={styles.iconButton}>
          <Ionicons name="arrow-back" size={24} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Product</Text>
        <View style={{ width: 40 }} />
      </View>

      {isLoading ? (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      ) : (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
        >
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

            <View style={styles.formCard}>
              <Text style={styles.sectionTitle}>Product Details</Text>

              {/* Product Name */}
              <Text style={styles.label}>Product Name <Text style={styles.required}>*</Text></Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., ASUS ROG Strix XG27AQ"
                placeholderTextColor="#94A3B8"
                value={name}
                onChangeText={setName}
              />

              {/* Image URL */}
              <Text style={styles.label}>Image URL (Optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="https://example.com/image.jpg"
                placeholderTextColor="#94A3B8"
                value={imageUrl}
                onChangeText={setImageUrl}
                autoCapitalize="none"
              />

              {/* Description */}
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Enter product description..."
                placeholderTextColor="#94A3B8"
                multiline
                numberOfLines={4}
                value={description}
                onChangeText={setDescription}
                textAlignVertical="top"
              />

              {/* Category */}
              <Text style={styles.label}>Category <Text style={styles.required}>*</Text></Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.inputNoMargin}
                  placeholder="Select category (e.g., 1)"
                  placeholderTextColor="#94A3B8"
                  keyboardType="number-pad"
                  value={category}
                  onChangeText={setCategory}
                />
                <Ionicons name="chevron-down" size={20} color="#64748B" />
              </View>

              {/* Price & Stock Row */}
              <View style={styles.row}>
                <View style={styles.col}>
                  <Text style={styles.label}>Price ($)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="0.00"
                    placeholderTextColor="#94A3B8"
                    keyboardType="decimal-pad"
                    value={price}
                    onChangeText={setPrice}
                  />
                </View>
                <View style={styles.col}>
                  <Text style={styles.label}>Stock Level <Text style={styles.required}>*</Text></Text>
                  <TextInput
                    style={styles.input}
                    placeholder="0"
                    placeholderTextColor="#94A3B8"
                    keyboardType="number-pad"
                    value={stock}
                    onChangeText={setStock}
                  />
                </View>
              </View>

              {/* Item Code */}
              <Text style={styles.label}>Item Code</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., ASUS-XG27AQ"
                placeholderTextColor="#94A3B8"
                value={itemCode}
                onChangeText={setItemCode}
              />
            </View>

            {/* Save Button */}
            <TouchableOpacity
              style={[styles.saveButton, isSubmitting && { opacity: 0.7 }]}
              onPress={handleUpdateProduct}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons name="save-outline" size={20} color="#FFFFFF" />
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                </>
              )}
            </TouchableOpacity>

            <View style={{ height: 40 }} />
          </ScrollView>
        </KeyboardAvoidingView>
      )}

      {/* แถบเมนูด้านล่าง */}
      <BottomNav activeScreen="products" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingBottom: 70,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#F8FAFC',
  },
  iconButton: {
    padding: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  required: {
    color: '#EF4444',
  },
  input: {
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#0F172A',
    fontWeight: '500',
    marginBottom: 20,
  },
  textArea: {
    height: 100,
    paddingTop: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  inputNoMargin: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 15,
    color: '#0F172A',
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  col: {
    flex: 1,
  },
  saveButton: {
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
    gap: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
