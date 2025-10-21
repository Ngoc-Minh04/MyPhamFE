import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OrderScreen() {
  const orders = [
    { id: 'DH001', date: '10/10/2025', total: 3250000, status: 'Đã giao' },
    { id: 'DH002', date: '15/10/2025', total: 950000, status: 'Đang giao' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>📦 Đơn hàng của bạn</Text>
      <FlatList
        data={orders}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.code}>Mã đơn: {item.id}</Text>
            <Text>Ngày đặt: {item.date}</Text>
            <Text>Tổng tiền: {item.total.toLocaleString()}đ</Text>
            <Text style={[styles.status,
              item.status === 'Đã giao'
                ? { color: 'green' }
                : { color: '#d63384' },
            ]}>
              {item.status}
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 10 },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#d63384',
    textAlign: 'center',
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#fdf2f8',
    borderRadius: 10,
    padding: 12,
    marginVertical: 6,
  },
  code: { fontWeight: '600', color: '#333' },
  status: { fontWeight: 'bold', marginTop: 5 },
});
