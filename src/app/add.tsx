import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
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

export default function AddProductScreen() {
  const router = useRouter();
  
  // State สำหรับเก็บข้อมูลฟอร์ม (เพิ่ม imageUrl เข้ามาด้วย)
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [itemCode, setItemCode] = useState('');
  const [stock, setStock] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // URL ของ API เซิร์ฟเวอร์มหาลัย
  const API_BASE_URL = 'http://119.59.102.161:3017/api';

  // ฟังก์ชันสำหรับส่งข้อมูลไปยัง Backend
  const handleSaveProduct = async () => {
    // เช็คค่าว่าง
    if (!name || !category || !price || !stock || !itemCode) {
      Alert.alert('แจ้งเตือน', 'กรุณากรอกข้อมูลที่มีเครื่องหมาย * ให้ครบถ้วน');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          stock: parseInt(stock),
          category: parseInt(category) || 1, 
          location: 'Main Warehouse',
          // ถ้าใส่ลิงก์รูปมาจะใช้ลิงก์นั้น ถ้าไม่ใส่จะใช้รูปเริ่มต้น
          image: imageUrl || 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&h=500&fit=crop', 
          status: parseInt(stock) > 5 ? 'Active' : 'Low in stock', 
          brand: 'Generic', 
          sizes: description, 
          productCode: itemCode,
          orderName: `Order-${itemCode}`
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      Alert.alert('สำเร็จ', 'เพิ่มสินค้าใหม่เรียบร้อยแล้ว!');
      router.replace('/products');

    } catch (error: any) {
      console.error("Error adding product:", error);
      Alert.alert('เกิดข้อผิดพลาด', `บันทึกข้อมูลล้มเหลว: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      {/* Modern Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/home')} style={styles.iconButton}>
          <Ionicons name="arrow-back" size={24} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Product</Text>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="person-circle-outline" size={28} color="#2563EB" />
        </TouchableOpacity>
      </View>

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

            {/* Image URL (ช่องใหม่สำหรับใส่ลิงก์รูปภาพ) */}
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
                <Text style={styles.label}>Price ($) <Text style={styles.required}>*</Text></Text>
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
            <Text style={styles.label}>Item Code <Text style={styles.required}>*</Text></Text>
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
            onPress={handleSaveProduct}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Ionicons name="save-outline" size={20} color="#FFFFFF" />
                <Text style={styles.saveButtonText}>Save Product</Text>
              </>
            )}
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* แถบเมนูด้านล่าง */}
      <BottomNav activeScreen="add" />
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
});