import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    ScrollView,
    StatusBar,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomNav from '../components/BottomNav';

export default function SettingsScreen() {
  const router = useRouter();
  
  // States สำหรับ Toggle สวิตช์
  const [customerToggle, setCustomerToggle] = useState(true);
  const [productToggle, setProductToggle] = useState(true);
  const [userToggle, setUserToggle] = useState(false);

  // State สำหรับเลือก Role
  const [selectedRole, setSelectedRole] = useState('Manager');
  const roles = ['Manager', 'Editor', 'Supplier', 'Seller', 'Admin', 'Finance'];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      {/* Modern Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/home')} style={styles.iconButton}>
          <Ionicons name="arrow-back" size={24} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <TouchableOpacity style={styles.profileAvatar}>
          <Text style={styles.profileInitials}>JD</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Personal Settings Section */}
        <Text style={styles.sectionTitle}>Personal settings</Text>
        <View style={styles.cardTop}>
          <TouchableOpacity style={styles.editIcon}>
            <Ionicons name="pencil" size={18} color="#2563EB" />
          </TouchableOpacity>
          
          <View style={styles.infoGroup}>
            <Text style={styles.label}>Name*</Text>
            <Text style={styles.value}>Jett Dash Admin</Text>
          </View>
          <View style={styles.infoGroup}>
            <Text style={styles.label}>Company email*</Text>
            <Text style={styles.value}>admin@jettdash.io</Text>
          </View>
          <View style={styles.infoGroup}>
            <Text style={styles.label}>Account password*</Text>
            <Text style={styles.value}>••••••••••••</Text>
          </View>
          <View style={styles.infoGroup}>
            <Text style={styles.label}>Store</Text>
            <Text style={styles.value}>Chon Buri, TH</Text>
          </View>
          <View style={styles.infoGroup}>
            <Text style={styles.label}>Employee code</Text>
            <Text style={styles.value}>JD-A-001</Text>
          </View>
          <View style={[styles.infoGroup, { borderBottomWidth: 0, paddingBottom: 0 }]}>
            <Text style={styles.label}>Current role</Text>
            <Text style={styles.value}>Manager</Text>
          </View>
        </View>

        {/* Role Selection Section */}
        <Text style={styles.sectionTitle}>Role Assignment</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.editIcon}>
            <Ionicons name="pencil" size={18} color="#64748B" />
          </TouchableOpacity>
          
          {roles.map((role) => (
            <TouchableOpacity 
              key={role} 
              style={styles.radioRow}
              onPress={() => setSelectedRole(role)}
            >
              <Ionicons 
                name={selectedRole === role ? "radio-button-on" : "radio-button-off"} 
                size={22} 
                color={selectedRole === role ? "#2563EB" : "#CBD5E1"} 
              />
              <Text style={[styles.roleText, selectedRole === role && styles.roleTextActive]}>
                {role}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Permissions / Toggles Section */}
        <Text style={styles.sectionTitle}>Permissions</Text>
        <View style={styles.cardOutlined}>
          <TouchableOpacity style={styles.editIcon}>
            <Ionicons name="pencil" size={18} color="#64748B" />
          </TouchableOpacity>
          
          <View style={styles.toggleRow}>
            <View style={styles.toggleLeft}>
              <Text style={styles.toggleLabel}>Customer</Text>
              <Ionicons name="checkmark-outline" size={18} color="#10B981" />
            </View>
            <Switch 
              value={customerToggle} 
              onValueChange={setCustomerToggle}
              trackColor={{ false: '#E2E8F0', true: '#BFDBFE' }}
              thumbColor={customerToggle ? '#2563EB' : '#94A3B8'}
            />
          </View>
          
          <View style={styles.toggleRow}>
            <View style={styles.toggleLeft}>
              <Text style={styles.toggleLabel}>Product</Text>
              <Ionicons name="checkmark-outline" size={18} color="#10B981" />
            </View>
            <Switch 
              value={productToggle} 
              onValueChange={setProductToggle}
              trackColor={{ false: '#E2E8F0', true: '#BFDBFE' }}
              thumbColor={productToggle ? '#2563EB' : '#94A3B8'}
            />
          </View>
          
          <View style={[styles.toggleRow, { borderBottomWidth: 0 }]}>
            <View style={styles.toggleLeft}>
              <Text style={styles.toggleLabel}>User</Text>
              <Ionicons name="checkmark-outline" size={18} color="#10B981" />
            </View>
            <Switch 
              value={userToggle} 
              onValueChange={setUserToggle}
              trackColor={{ false: '#E2E8F0', true: '#BFDBFE' }}
              thumbColor={userToggle ? '#2563EB' : '#94A3B8'}
            />
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      <BottomNav activeScreen="settings" />
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
  
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A', marginBottom: 12, marginTop: 16 },
  
  cardTop: {
    backgroundColor: '#EEF2FF', // สีฟ้า/ม่วงอ่อนๆ ตามเรฟเฟอเรนซ์
    borderRadius: 24, padding: 24, position: 'relative', marginBottom: 16,
  },
  card: {
    backgroundColor: '#FFFFFF', borderRadius: 24, padding: 24, position: 'relative',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 2, marginBottom: 16,
  },
  cardOutlined: {
    backgroundColor: '#FFFFFF', borderRadius: 24, padding: 24, position: 'relative',
    borderWidth: 1.5, borderColor: '#E0E7FF', marginBottom: 24,
  },
  editIcon: { position: 'absolute', top: 20, right: 20, padding: 4 },
  
  infoGroup: { marginBottom: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(226, 232, 240, 0.5)' },
  label: { fontSize: 12, color: '#64748B', fontWeight: '700', marginBottom: 4 },
  value: { fontSize: 15, color: '#0F172A', fontWeight: '600' },
  
  radioRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  roleText: { marginLeft: 12, fontSize: 15, color: '#64748B', fontWeight: '500' },
  roleTextActive: { color: '#2563EB', fontWeight: '700' },
  
  toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  toggleLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  toggleLabel: { fontSize: 15, color: '#0F172A', fontWeight: '600', minWidth: 80 },
});