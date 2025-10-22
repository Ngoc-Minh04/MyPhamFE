import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getOrderDetail } from '../reposi/Order';
import { getPaymentHistory, performPayment } from '../reposi/Payment';

export default function OrderDetailScreen({ route }: any) {
  const donHangId: number = route?.params?.donHangId;
  const ngayDatFromList: string | undefined = route?.params?.ngayDat;
  const trangThaiFromList: string | undefined = route?.params?.trangThai;
  const hidePay: boolean = !!route?.params?.hidePay;
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<any>(null);
  const [payments, setPayments] = useState<any[]>([]);

  useEffect(() => {
    load();
  }, [donHangId]);

  const load = async () => {
    setLoading(true);
    try {
      const [d, p] = await Promise.all([
        getOrderDetail(donHangId),
        getPaymentHistory(donHangId),
      ]);
      if (d.success) setDetail(d.data);
      if (p.success) setPayments(p.data || []);
    } finally {
      setLoading(false);
    }
  };

  const onPay = async () => {
    try {
      const amount = Number(detail?.tongTien || 0);
      const res = await performPayment(donHangId, 'COD', amount);
      if (res.success) {
        Alert.alert('Thanh toán', res.message || 'Thành công');
        await load();
      } else {
        Alert.alert('Lỗi', res.message || 'Không thể thanh toán');
      }
    } catch (e: any) {
      Alert.alert('Lỗi', e.message || 'Không thể thanh toán');
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!detail) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.header}>Chi tiết đơn hàng</Text>
        <Text style={{ textAlign: 'center' }}>Không tìm thấy đơn hàng</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Đơn #{detail.id || ''}</Text>
      <Text style={styles.meta}>Ngày đặt: {detail.ngayDat || ngayDatFromList || '-'}</Text>
      <Text style={styles.meta}>Trạng thái: {detail.trangThai || trangThaiFromList || '-'}</Text>

      <Text style={styles.section}>Sản phẩm</Text>
      <FlatList
        data={detail.chiTietDonHangs || []}
        keyExtractor={(_, idx) => String(idx)}
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            <Text style={{ flex: 1 }}>{item.tenSanPham || `SP #${item.sanPhamId}`}</Text>
            <Text>{item.soLuong} x {Number(item.donGia || 0).toLocaleString()}đ</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={{ color: '#777' }}>Không có chi tiết sản phẩm</Text>}
      />

      <Text style={styles.total}>Tổng: {Number(detail.tongTien || 0).toLocaleString()}đ</Text>

      <Text style={styles.section}>Lịch sử thanh toán</Text>
      <FlatList
        data={payments}
        keyExtractor={(i) => String(i.id)}
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            <Text style={{ flex: 1 }}>{item.phuongThuc}</Text>
            <Text>{Number(item.soTien || 0).toLocaleString()}đ - {item.trangThai}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={{ color: '#777' }}>Chưa có thanh toán</Text>}
      />

      {!hidePay && (
        <TouchableOpacity style={styles.payBtn} onPress={onPay}>
          <Text style={{ color: '#fff', fontWeight: '700' }}>Thanh toán</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 12 },
  header: { fontSize: 22, fontWeight: 'bold', color: '#d63384', textAlign: 'center', marginBottom: 10 },
  meta: { color: '#333', marginBottom: 4 },
  section: { marginTop: 16, marginBottom: 8, color: '#d63384', fontWeight: '700' },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  total: { marginTop: 10, fontWeight: 'bold', color: '#d63384' },
  payBtn: { marginTop: 16, backgroundColor: '#d63384', paddingVertical: 12, alignItems: 'center', borderRadius: 8 },
});
