import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '../contexts/UserContext';
import { getOrderDetail } from '../reposi/Order';

export default function OrderScreen({ route, navigation }: any) {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);

  // If backend has an order list endpoint, you can replace this with GET /DonHang/LayTheoTaiKhoan/{id}
  // For now, when focusId is provided, we fetch that detail and display as a single card.
  const focusId = route?.params?.focusId;

  useEffect(() => {
    if (focusId) {
      loadSingle(focusId);
    }
  }, [focusId]);

  const loadSingle = async (donHangId: number) => {
    try {
      setLoading(true);
      const res = await getOrderDetail(donHangId);
      if (res.success && res.data) {
        setOrders([{ 
          id: res.data.id, 
          date: res.data.ngayDat, 
          total: res.data.tongTien, 
          status: res.data.trangThai 
        }]);
      }
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('OrderDetail', { donHangId: item.id })}>
      <Text style={styles.code}>Mã đơn: {item.id}</Text>
      <Text>Ngày đặt: {item.date || '-'}</Text>
      <Text>Tổng tiền: {Number(item.total || 0).toLocaleString()}đ</Text>
      <Text style={[styles.status, { color: '#d63384' }]}>{item.status || 'Đang xử lý'}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>📦 Đơn hàng của bạn</Text>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={orders}
          keyExtractor={item => String(item.id)}
          renderItem={renderItem}
          ListEmptyComponent={<Text style={{ textAlign: 'center', color: '#777' }}>Chưa có dữ liệu đơn hàng</Text>}
        />
      )}
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
