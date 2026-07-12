import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="home" />
      <Stack.Screen name="products" />
      <Stack.Screen name="add" />
      {/* เพิ่ม 3 หน้าใหม่ที่เราเพิ่งสร้างเข้าไป */}
      <Stack.Screen name="categories" />
      <Stack.Screen name="finances" />
      <Stack.Screen name="stores" />
    </Stack>
  );
}