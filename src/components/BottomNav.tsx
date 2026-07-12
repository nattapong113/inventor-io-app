import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// กำหนดป้ายชื่อหน้าจอปัจจุบัน เพื่อทำไฮไลท์สีปุ่มที่เลือก
interface BottomNavProps {
  activeScreen: 'home' | 'add' | 'products' | 'categories';
}

export default function BottomNav({ activeScreen }: BottomNavProps) {
  const router = useRouter();

  // ฟังก์ชันช่วยเช็คสีไอคอนและข้อความ (ถ้าตรงกับหน้าปัจจุบันจะใช้สีน้ำเงินหลัก)
  const getTabStyle = (screenName: string) => {
    return activeScreen === screenName ? '#2563EB' : '#9CA3AF';
  };

  return (
    <View style={styles.bottomNav}>
      {/* ปุ่ม Home */}
      <TouchableOpacity 
        style={styles.navItem} 
        onPress={() => router.replace('/home')}
      >
        <Ionicons name={activeScreen === 'home' ? "home" : "home-outline"} size={24} color={getTabStyle('home')} />
        <Text style={[styles.navText, { color: getTabStyle('home'), fontWeight: activeScreen === 'home' ? '600' : '400' }]}>Home</Text>
      </TouchableOpacity>

      {/* ปุ่ม Add (ดีไซน์เป็นปุ่มวงกลมตรงกลางตามรูปต้นฉบับ) */}
      <TouchableOpacity 
        style={styles.navItem} 
        onPress={() => router.replace('/add')}
      >
        <View style={[styles.navItemFloating, { backgroundColor: activeScreen === 'add' ? '#2563EB' : '#8B5CF6' }]}>
          <Ionicons name="add" size={28} color="white" />
        </View>
      </TouchableOpacity>

      {/* ปุ่ม Products */}
      <TouchableOpacity 
        style={styles.navItem} 
        onPress={() => router.replace('/products')}
      >
        <Ionicons name={activeScreen === 'products' ? "cube" : "cube-outline"} size={24} color={getTabStyle('products')} />
        <Text style={[styles.navText, { color: getTabStyle('products'), fontWeight: activeScreen === 'products' ? '600' : '400' }]}>Products</Text>
      </TouchableOpacity>

      {/* ปุ่ม Categories */}
      <TouchableOpacity 
        style={styles.navItem} 
        onPress={() => router.replace('/categories')}
      >
        <Ionicons name={activeScreen === 'categories' ? "grid" : "grid-outline"} size={24} color={getTabStyle('categories')} />
        <Text style={[styles.navText, { color: getTabStyle('categories'), fontWeight: activeScreen === 'categories' ? '600' : '400' }]}>Categories</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 70,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    // เพิ่มเงาให้เมนูด้านล่างดูมีมิติลอยขึ้นมา
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 10,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 65,
    height: '100%',
  },
  navItemFloating: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20, // ดันปุ่มให้เยื้องขึ้นมาตรงกลาง
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  navText: {
    fontSize: 11,
    marginTop: 4,
  },
});