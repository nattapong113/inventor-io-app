import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const STORES = [
  { id: '1', name: 'Manchester, UK', img: 'https://via.placeholder.com/100/E3F2FD/1E3A8A?text=Store' },
  { id: '2', name: 'Yorkshire, UK', img: 'https://via.placeholder.com/100/F3F4F6/9CA3AF?text=Store' },
  { id: '3', name: 'Hull, UK', img: 'https://via.placeholder.com/100/FEE2E2/EF4444?text=Store' },
];

export default function StoresScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color="#1E3A8A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Stores</Text>
        <TouchableOpacity>
          <Ionicons name="person-circle-outline" size={30} color="#8B5CF6" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
        <View style={{ height: 20 }} />
        {STORES.map((store) => (
          <TouchableOpacity key={store.id} style={styles.card}>
            <Image source={{ uri: store.img }} style={styles.image} />
            <Text style={styles.storeName}>{store.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F6F8' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 15, backgroundColor: '#FFFFFF',
    borderBottomWidth: 1, borderBottomColor: '#F3F4F6',
  },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#1E3A8A' },
  listContainer: { paddingHorizontal: 20 },
  card: {
    backgroundColor: '#FFFFFF', borderRadius: 12, marginBottom: 16, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 4, elevation: 3,
  },
  image: { width: '100%', height: 120, backgroundColor: '#E5E7EB' },
  storeName: { padding: 16, fontSize: 16, fontWeight: '700', color: '#1F2937' },
});