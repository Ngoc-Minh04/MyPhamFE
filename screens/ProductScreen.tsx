import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProductScreen({ route }: any) {
  const item = route?.params?.item;

  if (!item) {
    // mở tab Product trực tiếp vẫn không lỗi
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.muted}>Chưa chọn sản phẩm nào</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView contentContainerStyle={styles.detailWrap}>
        <Image source={{ uri: item.image }} style={styles.image} />
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>{item.price}</Text>
        <Text style={styles.desc}>
          Mô tả sản phẩm mẫu. Bạn có thể lấy dữ liệu thật từ API và hiển thị ở đây.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  muted: { color: '#777' },
  detailWrap: { alignItems: 'center', padding: 16 },
  image: { width: 260, height: 260, borderRadius: 16, resizeMode: 'cover', marginBottom: 16 },
  name: { fontSize: 18, fontWeight: '700', textAlign: 'center', color: '#333' },
  price: { fontSize: 16, fontWeight: 'bold', color: '#d63384', marginVertical: 8 },
  desc: { fontSize: 14, color: '#555', textAlign: 'center', marginTop: 6 },
});
